# PDF Export - Quick Start Guide

## Overview

The PDF Export Service automatically generates professional PDFs for all packets. This guide covers the essentials.

## Automatic Generation

PDFs are automatically created when packets are generated. No action needed!

```typescript
// Happens automatically in the packet generation flow
// PDF URL is stored in packet.pdfUrl
```

## Manual Operations

### Test PDF Generation

```bash
npm run test-pdf
```

This creates a sample PDF to verify the system is working.

### Regenerate All PDFs

```bash
npm run regenerate-pdfs
```

Useful after:
- Updating PDF templates
- Fixing formatting issues
- Recovering from storage issues

### Regenerate Specific Packet

```bash
npm run regenerate-pdfs <packet-id>
```

### Download PDF via API

```bash
curl -X GET http://localhost:3000/api/packets/[id]/download \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -o packet.pdf
```

### Regenerate PDF via API

```bash
curl -X POST http://localhost:3000/api/packets/[id]/regenerate-pdf \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Configuration

### Environment Variables

```env
# Optional: Custom storage path (default: ./public/packets)
PDF_STORAGE_PATH=./public/packets
```

### Customization

Edit `lib/intake/pdf-export-service.ts` to customize:
- Brand colors
- Fonts and typography
- Layout and spacing
- Header/footer content

## Troubleshooting

### PDF Not Generated

1. Check packet status:
   ```sql
   SELECT * FROM Packet WHERE id = 'packet-id';
   ```

2. Check logs for errors

3. Try manual regeneration:
   ```bash
   npm run regenerate-pdfs <packet-id>
   ```

### PDF Download Fails

1. Verify file exists:
   ```bash
   ls public/packets/
   ```

2. Check authentication token

3. Verify user has access to packet

### Storage Issues

1. Check directory exists:
   ```bash
   ls -la public/packets/
   ```

2. Check permissions:
   ```bash
   chmod 755 public/packets/
   ```

3. Check disk space:
   ```bash
   df -h
   ```

## Common Tasks

### View Generated PDFs

1. Start dev server: `npm run dev`
2. Navigate to: `http://localhost:3000/packets/[filename].pdf`

### Clean Up Old PDFs

```bash
# Remove PDFs older than 30 days
find public/packets/ -name "*.pdf" -mtime +30 -delete
```

### Check PDF Generation Stats

```sql
-- Total packets with PDFs
SELECT COUNT(*) FROM Packet WHERE pdfUrl IS NOT NULL;

-- Packets missing PDFs
SELECT COUNT(*) FROM Packet WHERE status = 'READY' AND pdfUrl IS NULL;

-- Recent PDF generations
SELECT id, type, pdfUrl, updatedAt 
FROM Packet 
WHERE pdfUrl IS NOT NULL 
ORDER BY updatedAt DESC 
LIMIT 10;
```

## File Structure

```
public/
  packets/
    packet-[id]-[timestamp].pdf
    packet-[id]-[timestamp].pdf
    ...
```

## Security Notes

- PDFs only accessible to packet owner or admins
- Authentication required for all operations
- Files served through API (not direct access)
- Authorization checked on every request

## Support

For detailed documentation, see:
- `lib/intake/PDF_EXPORT.md` - Full documentation
- `lib/intake/pdf-export-service.ts` - Source code
- `.kiro/specs/dynamic-intake-and-packet-system/TASK_11_PDF_EXPORT_SUMMARY.md` - Implementation summary
