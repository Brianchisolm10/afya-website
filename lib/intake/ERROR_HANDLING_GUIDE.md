# Packet Generation Error Handling Guide

## Quick Start

The packet generation system now includes comprehensive error handling with automatic retries and admin notifications. Most error handling happens automatically, but this guide explains how to interact with the system.

## Automatic Features

### 1. Error Detection and Logging
All errors during packet generation are automatically:
- Caught and classified by type
- Logged to the audit log with full context
- Stored in the packet's `lastError` field
- Tracked with retry count

### 2. Automatic Retries
Failed packets are automatically retried with exponential backoff:
- **Attempt 1**: Immediate
- **Attempt 2**: After 5 seconds
- **Attempt 3**: After 10 seconds
- **Attempt 4**: After 20 seconds (if configured)

Non-retryable errors (template/data issues) are skipped.

### 3. Admin Notifications
When a packet fails after max retries (default: 3), all active admins receive an email notification with:
- Packet and client details
- Error message
- Direct link to admin panel

## Manual Operations

### View Error Statistics

```typescript
import { PacketErrorHandler } from '@/lib/intake';

// Get errors from last 24 hours
const stats = await PacketErrorHandler.getErrorStats(24);

console.log(stats);
// {
//   totalErrors: 15,
//   errorsByType: {
//     TEMPLATE_ERROR: 2,
//     AI_ERROR: 10,
//     EXPORT_ERROR: 3
//   },
//   errorsByPacketType: {
//     NUTRITION: 8,
//     WORKOUT: 7
//   },
//   recentErrors: [...]
// }
```

### Get Failed Packets

```typescript
import { PacketErrorHandler } from '@/lib/intake';

// Get packets that have exceeded max retries
const failedPackets = await PacketErrorHandler.getFailedPacketsNeedingAttention();

for (const packet of failedPackets) {
  console.log(`Packet ${packet.id} failed for ${packet.client.fullName}`);
  console.log(`Error: ${packet.lastError}`);
  console.log(`Retries: ${packet.retryCount}`);
}
```

### Manually Retry a Packet

```typescript
import { retryPacketGeneration } from '@/lib/intake';

// Retry with current retry count
await retryPacketGeneration('packet-id');

// Retry and reset retry count to 0
await retryPacketGeneration('packet-id', true);
```

### Get Retry Statistics

```typescript
import { getRetryStats } from '@/lib/intake';

const stats = await getRetryStats();

console.log(stats);
// {
//   totalFailed: 20,
//   retryable: 15,
//   nonRetryable: 3,
//   exceededMaxRetries: 2,
//   averageRetryCount: 1.8
// }
```

### Send Admin Notifications

```typescript
import { PacketNotificationService } from '@/lib/intake';

// Send notification for specific packet
await PacketNotificationService.notifyAdminsOfFailure('packet-id');

// Process all pending notifications
await PacketNotificationService.processPendingNotifications();

// Send test notification
await PacketNotificationService.sendTestNotification();
```

## API Endpoints

### GET /api/admin/packets/errors

Get error statistics and failed packets.

**Query Parameters:**
- `timeRange` (optional): Hours to look back (default: 24)

**Response:**
```json
{
  "success": true,
  "data": {
    "errorStats": {
      "totalErrors": 15,
      "errorsByType": {...},
      "errorsByPacketType": {...},
      "recentErrors": [...]
    },
    "retryStats": {
      "totalFailed": 20,
      "retryable": 15,
      "nonRetryable": 3,
      "exceededMaxRetries": 2,
      "averageRetryCount": 1.8
    },
    "failedPackets": [...],
    "packetsNeedingNotification": 2,
    "timeRangeHours": 24
  }
}
```

### POST /api/admin/packets/errors/notify

Manually trigger admin notifications.

**Request Body:**
```json
// Send test notification
{ "test": true }

// Notify for specific packet
{ "packetId": "packet-123" }

// Process all pending notifications
{}
```

**Response:**
```json
{
  "success": true,
  "message": "Notification sent"
}
```

## Error Types

### TEMPLATE_ERROR (Non-retryable)
- Template not found
- Invalid template structure
- Missing required template fields

**Action**: Fix template configuration in admin panel

### DATA_ERROR (Non-retryable)
- Client not found
- Missing required client data
- Invalid data format

**Action**: Review client intake data and complete missing fields

### AI_ERROR (Retryable)
- AI service timeout
- API rate limit
- Temporary service unavailability

**Action**: Wait for automatic retry or check AI service status

### EXPORT_ERROR (Retryable)
- PDF generation failure
- File system issues
- Temporary storage unavailability

**Action**: Wait for automatic retry or check storage configuration

### DATABASE_ERROR (Retryable)
- Connection timeout
- Query failure
- Temporary database unavailability

**Action**: Wait for automatic retry or check database status

### UNKNOWN_ERROR (Retryable)
- Unclassified errors
- Unexpected exceptions

**Action**: Review error logs and investigate root cause

## Configuration

### Environment Variables

```env
# Email configuration (required for notifications)
EMAIL_SERVER_HOST=smtp.example.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=user@example.com
EMAIL_SERVER_PASSWORD=password
EMAIL_FROM=noreply@afya.com

# Application URL (for admin panel links)
NEXTAUTH_URL=https://your-domain.com
```

### Retry Configuration

Default settings in `lib/intake/packet-retry-service.ts`:

```typescript
{
  maxRetries: 3,           // Maximum retry attempts
  baseDelayMs: 5000,       // Base delay (5 seconds)
  maxDelayMs: 300000,      // Max delay (5 minutes)
  exponentialBase: 2       // Exponential multiplier
}
```

To customize:

```typescript
import { getRetryService } from '@/lib/intake';

const retryService = getRetryService({
  maxRetries: 5,
  baseDelayMs: 10000,
  exponentialBase: 3
});
```

## Monitoring

### Check System Health

```typescript
import { getWorkerStats, getRetryStats } from '@/lib/intake';
import { PacketErrorHandler } from '@/lib/intake';

// Job queue stats
const queueStats = await getWorkerStats();
console.log(`Pending: ${queueStats.pending}`);
console.log(`Processing: ${queueStats.processing}`);
console.log(`Failed: ${queueStats.failed}`);

// Retry stats
const retryStats = await getRetryStats();
console.log(`Retryable: ${retryStats.retryable}`);
console.log(`Exceeded max: ${retryStats.exceededMaxRetries}`);

// Error stats
const errorStats = await PacketErrorHandler.getErrorStats(24);
console.log(`Errors (24h): ${errorStats.totalErrors}`);
```

### Audit Log Queries

All errors are logged to the audit log:

```typescript
import { prisma } from '@/lib/db';

// Get recent packet generation errors
const errorLogs = await prisma.auditLog.findMany({
  where: {
    action: 'PACKET_GENERATION_ERROR',
    createdAt: {
      gte: new Date(Date.now() - 24 * 60 * 60 * 1000)
    }
  },
  orderBy: { createdAt: 'desc' },
  take: 50
});

// Get admin notifications sent
const notifications = await prisma.auditLog.findMany({
  where: {
    action: 'ADMIN_NOTIFICATION_SENT',
    createdAt: {
      gte: new Date(Date.now() - 24 * 60 * 60 * 1000)
    }
  }
});
```

## Troubleshooting

### Packets Not Retrying

1. Check if error is non-retryable (template/data errors)
2. Verify retry count hasn't exceeded max retries
3. Check job queue is running: `getWorkerStats()`
4. Review error logs for retry scheduling

### Admins Not Receiving Notifications

1. Verify email configuration in environment variables
2. Check admin users are marked as ACTIVE
3. Review audit log for notification attempts
4. Test email system: `sendTestNotification()`

### High Error Rate

1. Check error statistics: `getErrorStats(24)`
2. Identify error patterns by type and packet type
3. Review recent errors for common issues
4. Check external service status (AI, database, storage)

### Retry Loop

If packets are retrying indefinitely:
1. Check max retries configuration
2. Verify error classification is correct
3. Review retry eligibility logic
4. Manually reset packet: `retryPacketGeneration(id, true)`

## Best Practices

1. **Monitor Regularly**: Check error stats daily
2. **Act on Notifications**: Respond to admin emails promptly
3. **Fix Root Causes**: Don't just retry - fix underlying issues
4. **Test Email**: Verify notification system works
5. **Review Logs**: Check audit logs for patterns
6. **Update Templates**: Keep templates valid and complete
7. **Validate Data**: Ensure client data is complete before generation

## Support

For issues or questions:
1. Check error logs in audit log
2. Review error statistics via API
3. Test notification system
4. Contact system administrator
