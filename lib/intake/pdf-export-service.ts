/**
 * PDF Export Service
 * 
 * Generates professional PDF documents from packet content
 * with proper formatting, branding, and styling.
 */

import PDFDocument from 'pdfkit';
import { PopulatedContent } from '@/types/intake';
import { promises as fs } from 'fs';
import path from 'path';

export interface PDFExportOptions {
  title?: string;
  author?: string;
  subject?: string;
  keywords?: string[];
  includeHeader?: boolean;
  includeFooter?: boolean;
  brandColor?: string;
}

export class PDFExportService {
  private static readonly DEFAULT_OPTIONS: PDFExportOptions = {
    includeHeader: true,
    includeFooter: true,
    brandColor: '#14b8a6', // Turquoise brand color
  };

  private static readonly STORAGE_PATH = process.env.PDF_STORAGE_PATH || './public/packets';

  /**
   * Generate PDF from packet content
   */
  static async generatePDF(
    packetId: string,
    content: PopulatedContent,
    clientName: string,
    packetType: string,
    options: PDFExportOptions = {}
  ): Promise<string> {
    const mergedOptions = { ...this.DEFAULT_OPTIONS, ...options };

    // Ensure storage directory exists
    await this.ensureStorageDirectory();

    // Create PDF document
    const doc = new PDFDocument({
      size: 'LETTER',
      margins: {
        top: 72,
        bottom: 72,
        left: 72,
        right: 72,
      },
      info: {
        Title: mergedOptions.title || `${packetType} Packet - ${clientName}`,
        Author: mergedOptions.author || 'Afya Performance',
        Subject: mergedOptions.subject || `Personalized ${packetType} Plan`,
        Keywords: mergedOptions.keywords?.join(', ') || packetType,
        Creator: 'Afya Performance System',
        Producer: 'Afya Performance System',
      },
    });

    // Generate filename
    const filename = `packet-${packetId}-${Date.now()}.pdf`;
    const filepath = path.join(this.STORAGE_PATH, filename);

    // Create write stream
    const stream = require('fs').createWriteStream(filepath);
    doc.pipe(stream);

    // Add content to PDF
    await this.addCoverPage(doc, clientName, packetType, mergedOptions);
    await this.addTableOfContents(doc, content, mergedOptions);
    await this.addPacketContent(doc, content, mergedOptions);

    // Finalize PDF
    doc.end();

    // Wait for stream to finish
    await new Promise((resolve, reject) => {
      stream.on('finish', resolve);
      stream.on('error', reject);
    });

    // Return relative URL path
    return `/packets/${filename}`;
  }

  /**
   * Ensure storage directory exists
   */
  private static async ensureStorageDirectory(): Promise<void> {
    try {
      await fs.mkdir(this.STORAGE_PATH, { recursive: true });
    } catch (error) {
      console.error('Error creating storage directory:', error);
      throw new Error('Failed to create PDF storage directory');
    }
  }

  /**
   * Add cover page
   */
  private static async addCoverPage(
    doc: PDFKit.PDFDocument,
    clientName: string,
    packetType: string,
    options: PDFExportOptions
  ): Promise<void> {
    const brandColor = options.brandColor || '#14b8a6';

    // Add brand color header bar
    doc
      .rect(0, 0, doc.page.width, 120)
      .fill(brandColor);

    // Add title
    doc
      .fillColor('#ffffff')
      .fontSize(32)
      .font('Helvetica-Bold')
      .text('Afya Performance', 72, 40, { align: 'center' });

    // Add packet type
    doc
      .fontSize(24)
      .font('Helvetica')
      .text(`${this.formatPacketType(packetType)} Plan`, 72, 80, { align: 'center' });

    // Add client name
    doc
      .fillColor('#000000')
      .fontSize(20)
      .font('Helvetica-Bold')
      .text(`Prepared for: ${clientName}`, 72, 200, { align: 'center' });

    // Add date
    const date = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    doc
      .fontSize(14)
      .font('Helvetica')
      .fillColor('#666666')
      .text(date, 72, 240, { align: 'center' });

    // Add welcome message
    doc
      .fontSize(12)
      .fillColor('#333333')
      .text(
        'This personalized plan has been created specifically for you based on your goals, preferences, and current fitness level.',
        72,
        320,
        {
          align: 'center',
          width: doc.page.width - 144,
        }
      );

    // Add disclaimer
    doc
      .fontSize(10)
      .fillColor('#999999')
      .text(
        'Please consult with a healthcare provider before starting any new exercise or nutrition program.',
        72,
        doc.page.height - 120,
        {
          align: 'center',
          width: doc.page.width - 144,
        }
      );

    // Add new page for content
    doc.addPage();
  }

  /**
   * Add table of contents
   */
  private static async addTableOfContents(
    doc: PDFKit.PDFDocument,
    content: PopulatedContent,
    options: PDFExportOptions
  ): Promise<void> {
    // Add header
    this.addSectionHeader(doc, 'Table of Contents', options);

    doc.moveDown(1);

    // Extract sections from content
    const sections = this.extractSections(content);

    let yPosition = doc.y;
    sections.forEach((section, index) => {
      if (yPosition > doc.page.height - 100) {
        doc.addPage();
        yPosition = 72;
      }

      doc
        .fontSize(12)
        .fillColor('#333333')
        .text(`${index + 1}. ${section}`, 72, yPosition);

      yPosition += 20;
      doc.y = yPosition;
    });

    doc.addPage();
  }

  /**
   * Add packet content
   */
  private static async addPacketContent(
    doc: PDFKit.PDFDocument,
    content: PopulatedContent,
    options: PDFExportOptions
  ): Promise<void> {
    // Add each section of content
    for (const [key, value] of Object.entries(content)) {
      if (key === 'metadata') continue; // Skip metadata

      // Add section
      await this.addSection(doc, key, value, options);
    }
  }

  /**
   * Add a section to the PDF
   */
  private static async addSection(
    doc: PDFKit.PDFDocument,
    sectionKey: string,
    sectionData: any,
    options: PDFExportOptions
  ): Promise<void> {
    // Check if we need a new page
    if (doc.y > doc.page.height - 150) {
      doc.addPage();
    }

    // Add section header
    const sectionTitle = this.formatSectionTitle(sectionKey);
    this.addSectionHeader(doc, sectionTitle, options);

    doc.moveDown(0.5);

    // Render section content based on type
    if (Array.isArray(sectionData)) {
      this.renderArray(doc, sectionData);
    } else if (typeof sectionData === 'object' && sectionData !== null) {
      this.renderObject(doc, sectionData);
    } else {
      this.renderText(doc, String(sectionData));
    }

    doc.moveDown(1.5);
  }

  /**
   * Add section header with styling
   */
  private static addSectionHeader(
    doc: PDFKit.PDFDocument,
    title: string,
    options: PDFExportOptions
  ): void {
    const brandColor = options.brandColor || '#14b8a6';

    doc
      .fontSize(18)
      .font('Helvetica-Bold')
      .fillColor(brandColor)
      .text(title, 72, doc.y);

    // Add underline
    const textWidth = doc.widthOfString(title);
    doc
      .moveTo(72, doc.y + 2)
      .lineTo(72 + textWidth, doc.y + 2)
      .strokeColor(brandColor)
      .lineWidth(2)
      .stroke();

    doc.moveDown(1);
  }

  /**
   * Render array content
   */
  private static renderArray(doc: PDFKit.PDFDocument, data: any[]): void {
    data.forEach((item, index) => {
      if (doc.y > doc.page.height - 100) {
        doc.addPage();
      }

      if (typeof item === 'object' && item !== null) {
        // Render object as a card
        this.renderCard(doc, item, index + 1);
      } else {
        // Render as bullet point
        doc
          .fontSize(11)
          .fillColor('#333333')
          .text(`• ${String(item)}`, 90, doc.y, {
            width: doc.page.width - 162,
            align: 'left',
          });
        doc.moveDown(0.3);
      }
    });
  }

  /**
   * Render object content
   */
  private static renderObject(doc: PDFKit.PDFDocument, data: any): void {
    for (const [key, value] of Object.entries(data)) {
      if (doc.y > doc.page.height - 100) {
        doc.addPage();
      }

      // Format key as label
      const label = this.formatLabel(key);

      if (Array.isArray(value)) {
        // Render nested array
        doc
          .fontSize(12)
          .font('Helvetica-Bold')
          .fillColor('#555555')
          .text(label, 72, doc.y);
        doc.moveDown(0.3);
        this.renderArray(doc, value);
      } else if (typeof value === 'object' && value !== null) {
        // Render nested object
        doc
          .fontSize(12)
          .font('Helvetica-Bold')
          .fillColor('#555555')
          .text(label, 72, doc.y);
        doc.moveDown(0.3);
        this.renderObject(doc, value);
      } else {
        // Render key-value pair
        doc
          .fontSize(11)
          .font('Helvetica-Bold')
          .fillColor('#555555')
          .text(`${label}: `, 72, doc.y, { continued: true })
          .font('Helvetica')
          .fillColor('#333333')
          .text(String(value), {
            width: doc.page.width - 144,
          });
        doc.moveDown(0.5);
      }
    }
  }

  /**
   * Render text content
   */
  private static renderText(doc: PDFKit.PDFDocument, text: string): void {
    doc
      .fontSize(11)
      .font('Helvetica')
      .fillColor('#333333')
      .text(text, 72, doc.y, {
        width: doc.page.width - 144,
        align: 'left',
      });
  }

  /**
   * Render a card (for exercises, meals, etc.)
   */
  private static renderCard(doc: PDFKit.PDFDocument, data: any, index?: number): void {
    const startY = doc.y;

    // Add card background
    doc
      .rect(72, startY, doc.page.width - 144, 0) // Height will be calculated
      .fillOpacity(0.05)
      .fill('#14b8a6')
      .fillOpacity(1);

    // Add card content
    const cardX = 82;
    let cardY = startY + 10;

    // Add index if provided
    if (index !== undefined) {
      doc
        .fontSize(10)
        .font('Helvetica-Bold')
        .fillColor('#14b8a6')
        .text(`#${index}`, cardX, cardY);
      cardY += 15;
    }

    // Render card fields
    for (const [key, value] of Object.entries(data)) {
      if (cardY > doc.page.height - 100) {
        // Calculate card height and draw border
        const cardHeight = cardY - startY;
        doc
          .rect(72, startY, doc.page.width - 144, cardHeight)
          .strokeColor('#14b8a6')
          .lineWidth(1)
          .stroke();

        doc.addPage();
        cardY = 72;
      }

      const label = this.formatLabel(key);

      if (Array.isArray(value)) {
        doc
          .fontSize(10)
          .font('Helvetica-Bold')
          .fillColor('#555555')
          .text(`${label}:`, cardX, cardY);
        cardY += 15;

        value.forEach((item) => {
          doc
            .fontSize(9)
            .font('Helvetica')
            .fillColor('#666666')
            .text(`  • ${String(item)}`, cardX, cardY, {
              width: doc.page.width - 164,
            });
          cardY += 12;
        });
      } else {
        doc
          .fontSize(10)
          .font('Helvetica-Bold')
          .fillColor('#555555')
          .text(`${label}: `, cardX, cardY, { continued: true })
          .font('Helvetica')
          .fillColor('#666666')
          .text(String(value), {
            width: doc.page.width - 164,
          });
        cardY += 15;
      }
    }

    // Calculate final card height and draw border
    const cardHeight = cardY - startY + 10;
    doc
      .rect(72, startY, doc.page.width - 144, cardHeight)
      .strokeColor('#14b8a6')
      .lineWidth(1)
      .stroke();

    doc.y = cardY + 15;
    doc.moveDown(0.5);
  }

  /**
   * Extract sections from content for table of contents
   */
  private static extractSections(content: PopulatedContent): string[] {
    const sections: string[] = [];

    for (const key of Object.keys(content)) {
      if (key === 'metadata') continue;
      sections.push(this.formatSectionTitle(key));
    }

    return sections;
  }

  /**
   * Format packet type for display
   */
  private static formatPacketType(type: string): string {
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

  /**
   * Format section title for display
   */
  private static formatSectionTitle(key: string): string {
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase())
      .trim();
  }

  /**
   * Format label for display
   */
  private static formatLabel(key: string): string {
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase())
      .replace(/_/g, ' ')
      .trim();
  }

  /**
   * Delete PDF file
   */
  static async deletePDF(pdfUrl: string): Promise<void> {
    try {
      const filename = path.basename(pdfUrl);
      const filepath = path.join(this.STORAGE_PATH, filename);
      await fs.unlink(filepath);
    } catch (error) {
      console.error('Error deleting PDF:', error);
      // Don't throw - file might already be deleted
    }
  }
}
