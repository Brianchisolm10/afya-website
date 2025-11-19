# PDF Export Service

The PDF Export Service generates professional, branded PDF documents from packet content with proper formatting and styling.

## Features

- **Automatic PDF Generation**: PDFs are automatically generated when packets are created
- **Professional Formatting**: Clean, readable layout with proper typography
- **Branding**: Includes Afya Performance branding with customizable colors
- **Structured Content**: Organized sections with table of contents
- **Download Support**: API endpoints for downloading PDFs
- **Regeneration**: Ability to regenerate PDFs for existing packets

## Architecture

### Components

1. **PDFExportService** (`lib/intake/pdf-export-service.ts`)
   - Core service for generating PDFs from packet content
   - Uses PDFKit library for PDF generation
   - Handles formatting, styling, and layout

2. **API Endpoints**
   - `POST /api/packets/[id]/regenerate-pdf` - Regenerate PDF for existing packet
   - `GET /api/packets/[id]/download` - Download packet PDF

3. **Integration**
   - Integrated into `PacketGenerationService`
   - PDFs generated automatically during packet creation
   - Stored in `public/packets/` directory

## Usage

### Automatic Generation

PDFs are automatically generated when packets are created through the intake submission flow:

```typescript
// In PacketGenerationService.orchestratePacketGeneration()
const pdfUrl = await PDFExportService.generatePDF(
  packetId,
  finalContent,
  client.fullName,
  packetType,
  {
    title: `${packetType} Plan - ${client.fullName}`,
    author: 'Afya Performance',
    subject: `Personalized ${packetType} Plan`,
    keywords: [packetType, 'fitness', 'nutrition', 'training'],
  }
);
```

### Manual Regeneration

#### Via API

```bash
# Regenerate PDF for a specific packet
curl -X POST http://localhost:3000/api/packets/[packet-id]/regenerate-pdf \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### Via Script

```bash
# Regenerate all PDFs
npm run regenerate-pdfs

# Regenerate specific packet
npm run regenerate-pdfs <packet-id>
```

### Download PDF

```bash
# Download PDF
curl -X GET http://localhost:3000/api/packets/[packet-id]/download \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -o packet.pdf
```

## PDF Structure

### Cover Page
- Brand header with Afya Performance logo/name
- Packet type (Nutrition, Workout, etc.)
- Client name
- Generation date
- Welcome message
- Disclaimer

### Table of Contents
- Lists all sections in the packet
- Helps clients navigate the document

### Content Sections
Each section includes:
- Section header with brand color
- Formatted content (text, lists, tables)
- Proper spacing and typography
- Page breaks as needed

### Content Formatting

The service handles different content types:

- **Text**: Rendered with proper line wrapping
- **Arrays**: Rendered as bullet lists or numbered items
- **Objects**: Rendered as key-value pairs or cards
- **Nested Data**: Properly indented and organized

## Configuration

### Environment Variables

```env
# PDF storage path (default: ./public/packets)
PDF_STORAGE_PATH=./public/packets
```

### Customization Options

```typescript
interface PDFExportOptions {
  title?: string;           // PDF document title
  author?: string;          // PDF author
  subject?: string;         // PDF subject
  keywords?: string[];      // PDF keywords
  includeHeader?: boolean;  // Include header on pages
  includeFooter?: boolean;  // Include footer on pages
  brandColor?: string;      // Brand color (hex)
}
```

## Storage

PDFs are stored in the `public/packets/` directory:

```
public/
  packets/
    packet-[id]-[timestamp].pdf
    packet-[id]-[timestamp].pdf
    ...
```

Files are named with:
- Packet ID
- Timestamp (for versioning)
- `.pdf` extension

## Security

### Access Control

- PDFs can only be accessed by:
  - The client who owns the packet
  - Admins
- Authentication required for all PDF operations
- Authorization checks on every request

### File Storage

- PDFs stored in `public/packets/` directory
- Direct URL access prevented by authentication layer
- Files served through API endpoints with auth checks

## Performance

### Optimization

- PDFs generated asynchronously during packet creation
- Generation doesn't block intake submission
- Failed PDF generation doesn't fail packet creation
- Retry logic for failed generations

### Caching

- PDFs are generated once and cached
- Regeneration only when explicitly requested
- Old PDFs deleted when regenerating

## Error Handling

### Generation Errors

If PDF generation fails:
1. Error is logged
2. Packet status remains READY (content still available)
3. `pdfUrl` field remains null
4. Can be regenerated later via API or script

### Download Errors

If PDF file is missing:
1. Returns 404 error
2. Client can request regeneration
3. Admin notified of missing files

## Maintenance

### Cleanup Old PDFs

```typescript
// Delete old PDF files (manual cleanup)
import { PDFExportService } from '@/lib/intake/pdf-export-service';

await PDFExportService.deletePDF(pdfUrl);
```

### Monitoring

Check PDF generation status:

```sql
-- Packets without PDFs
SELECT id, type, status, createdAt 
FROM Packet 
WHERE status = 'READY' AND pdfUrl IS NULL;

-- Failed PDF generations
SELECT id, type, lastError 
FROM Packet 
WHERE status = 'FAILED' AND lastError LIKE '%PDF%';
```

## Troubleshooting

### PDF Not Generated

1. Check packet status: `SELECT * FROM Packet WHERE id = 'packet-id'`
2. Check for errors in logs
3. Try manual regeneration: `npm run regenerate-pdfs <packet-id>`
4. Verify storage directory exists and is writable

### PDF Download Fails

1. Verify PDF file exists in storage directory
2. Check file permissions
3. Verify authentication token is valid
4. Check authorization (user owns packet or is admin)

### PDF Formatting Issues

1. Check packet content structure
2. Verify all required fields are present
3. Test with sample data
4. Check PDFKit version compatibility

## Future Enhancements

### Planned Features

- [ ] Custom templates per packet type
- [ ] Client branding options (white-label)
- [ ] Multiple export formats (Word, HTML)
- [ ] Email delivery of PDFs
- [ ] PDF compression for smaller file sizes
- [ ] Watermarking for draft versions
- [ ] Interactive PDFs with form fields
- [ ] Multi-language support

### Performance Improvements

- [ ] PDF generation queue optimization
- [ ] Parallel PDF generation
- [ ] CDN integration for PDF delivery
- [ ] PDF thumbnail generation
- [ ] Incremental PDF updates

## Dependencies

- **pdfkit**: PDF generation library
- **@types/pdfkit**: TypeScript types for PDFKit
- **fs/promises**: File system operations
- **path**: File path utilities

## Related Files

- `lib/intake/pdf-export-service.ts` - Core PDF service
- `lib/intake/packet-generation-service.ts` - Packet generation with PDF integration
- `app/api/packets/[id]/regenerate-pdf/route.ts` - PDF regeneration endpoint
- `app/api/packets/[id]/download/route.ts` - PDF download endpoint
- `scripts/regenerate-pdfs.ts` - Bulk PDF regeneration script

## Support

For issues or questions about PDF export:
1. Check logs for error messages
2. Verify configuration and environment variables
3. Test with sample data
4. Contact development team
