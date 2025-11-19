/**
 * Seed script for packet templates
 * 
 * This script populates the database with default packet templates
 * for all packet types.
 * 
 * Run with: npx tsx prisma/seed-packet-templates.ts
 */

import { PrismaClient } from '@prisma/client';
import { defaultTemplates } from '../lib/intake/packet-templates';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting packet template seeding...');
  
  // Clear existing templates (optional - comment out if you want to keep existing)
  // await prisma.packetTemplate.deleteMany({});
  // console.log('Cleared existing packet templates');
  
  // Seed each template
  for (const template of defaultTemplates) {
    console.log(`Seeding template: ${template.name} (${template.packetType})`);
    
    try {
      await prisma.packetTemplate.upsert({
        where: { id: template.id },
        update: {
          name: template.name,
          packetType: template.packetType,
          clientType: template.clientType || null,
          sections: template.sections as any,
          contentBlocks: template.contentBlocks as any,
          isDefault: template.isDefault,
          updatedAt: new Date()
        },
        create: {
          id: template.id,
          name: template.name,
          packetType: template.packetType,
          clientType: template.clientType || null,
          sections: template.sections as any,
          contentBlocks: template.contentBlocks as any,
          isDefault: template.isDefault
        }
      });
      
      console.log(`✓ Successfully seeded: ${template.name}`);
    } catch (error) {
      console.error(`✗ Error seeding ${template.name}:`, error);
    }
  }
  
  console.log('\nPacket template seeding completed!');
  console.log(`Total templates seeded: ${defaultTemplates.length}`);
  
  // Display summary
  const templateCount = await prisma.packetTemplate.count();
  console.log(`\nTotal templates in database: ${templateCount}`);
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
