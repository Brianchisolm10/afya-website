/**
 * Script to regenerate PDFs for existing packets
 * 
 * Usage:
 *   npm run regenerate-pdfs           # Regenerate all packets
 *   npm run regenerate-pdfs <id>      # Regenerate specific packet
 */

import { PrismaClient } from '@prisma/client';
import { PDFExportService } from '../lib/intake/pdf-export-service';
import { PopulatedContent } from '../types/intake';

const prisma = new PrismaClient();

async function regeneratePDFs(packetId?: string) {
  try {
    console.log('Starting PDF regeneration...\n');

    // Fetch packets to regenerate
    const packets = await prisma.packet.findMany({
      where: packetId ? { id: packetId } : {
        status: 'READY',
        content: { not: null }
      },
      include: {
        client: {
          select: {
            fullName: true
          }
        }
      }
    });

    if (packets.length === 0) {
      console.log('No packets found to regenerate.');
      return;
    }

    console.log(`Found ${packets.length} packet(s) to regenerate.\n`);

    let successCount = 0;
    let failCount = 0;

    for (const packet of packets) {
      try {
        console.log(`Regenerating PDF for packet ${packet.id} (${packet.type})...`);

        // Delete old PDF if exists
        if (packet.pdfUrl) {
          try {
            await PDFExportService.deletePDF(packet.pdfUrl);
            console.log('  - Deleted old PDF');
          } catch (error) {
            console.log('  - Old PDF not found or already deleted');
          }
        }

        // Generate new PDF
        const pdfUrl = await PDFExportService.generatePDF(
          packet.id,
          packet.content as PopulatedContent,
          packet.client.fullName,
          packet.type,
          {
            title: `${formatPacketType(packet.type)} Plan - ${packet.client.fullName}`,
            author: 'Afya Performance',
            subject: `Personalized ${formatPacketType(packet.type)} Plan`,
            keywords: [packet.type, 'fitness', 'nutrition', 'training'],
          }
        );

        // Update packet with new PDF URL
        await prisma.packet.update({
          where: { id: packet.id },
          data: {
            pdfUrl: pdfUrl,
            updatedAt: new Date(),
          }
        });

        console.log(`  ✓ PDF generated: ${pdfUrl}\n`);
        successCount++;

      } catch (error) {
        console.error(`  ✗ Error regenerating PDF for packet ${packet.id}:`, error);
        failCount++;
      }
    }

    console.log('\n=== Summary ===');
    console.log(`Total packets: ${packets.length}`);
    console.log(`Successful: ${successCount}`);
    console.log(`Failed: ${failCount}`);

  } catch (error) {
    console.error('Error in PDF regeneration script:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * Format packet type for display
 */
function formatPacketType(type: string): string {
  const typeMap: Record<string, string> = {
    NUTRITION: 'Nutrition',
    WORKOUT: 'Workout',
    PERFORMANCE: 'Performance',
    YOUTH: 'Youth Training',
    RECOVERY: 'Recovery',
    WELLNESS: 'Wellness',
    INTRO: 'Introduction',
  };

  return typeMap[type] || type;
}

// Run script
const packetId = process.argv[2];
regeneratePDFs(packetId);
