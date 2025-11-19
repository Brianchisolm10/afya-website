# Task 15: Error Handling and Retry Logic - Implementation Summary

## Overview
Implemented comprehensive error handling and retry logic for the packet generation system with automatic retries, exponential backoff, and admin notifications for failures.

## Implementation Details

### 15.1 Packet Generation Error Handling ✅

**Created: `lib/intake/packet-error-handler.ts`**

Features:
- **Error Classification**: Automatically classifies errors into types:
  - `TEMPLATE_ERROR`: Template not found or invalid (non-retryable)
  - `DATA_ERROR`: Client data missing or invalid (non-retryable)
  - `AI_ERROR`: AI service failures (retryable)
  - `EXPORT_ERROR`: PDF export failures (retryable)
  - `DATABASE_ERROR`: Database connection issues (retryable)
  - `UNKNOWN_ERROR`: Unclassified errors (retryable by default)

- **Automatic Status Updates**: Updates packet status to FAILED and increments retry count
- **Error Logging**: Logs all errors to audit log with full context
- **Error Statistics**: Provides methods to query error statistics and trends

Key Methods:
```typescript
PacketErrorHandler.handleGenerationError(error, packetId, clientId, packetType)
PacketErrorHandler.getErrorStats(timeRangeHours)
PacketErrorHandler.getFailedPacketsNeedingAttention()
```

**Updated: `lib/intake/packet-generation-service.ts`**
- Integrated error handler into both `generateAndSavePacket` and `orchestratePacketGeneration` methods
- Replaced inline error handling with centralized error handler calls

### 15.2 Automatic Retry Logic ✅

**Created: `lib/intake/packet-retry-service.ts`**

Features:
- **Retry Eligibility Check**: Determines if a packet should be retried based on:
  - Retry count (default max: 3)
  - Error type (non-retryable errors are skipped)
  - Current status

- **Exponential Backoff**: Calculates retry delays using formula:
  ```
  delay = baseDelay * (exponentialBase ^ retryCount)
  ```
  - Default base delay: 5 seconds
  - Default exponential base: 2
  - Max delay cap: 5 minutes
  - Example delays: 5s, 10s, 20s

- **Manual Retry**: Allows admins to manually retry failed packets with optional retry count reset

- **Retry Statistics**: Provides comprehensive retry statistics including:
  - Total failed packets
  - Retryable vs non-retryable counts
  - Packets exceeding max retries
  - Average retry count

Configuration:
```typescript
{
  maxRetries: 3,
  baseDelayMs: 5000,
  maxDelayMs: 300000,
  exponentialBase: 2
}
```

**Updated: `lib/intake/job-queue.ts`**
- Integrated retry service into job processing
- Replaced inline retry logic with retry service calls
- Automatic scheduling of retries with exponential backoff

**Updated: `lib/intake/packet-worker.ts`**
- Added retry service exports
- Exposed retry statistics and manual retry functions

### 15.3 Admin Notification for Failures ✅

**Created: `lib/intake/packet-notification-service.ts`**

Features:
- **Automatic Notifications**: Sends email notifications to all active admins when packets fail after max retries
- **Batch Processing**: Can process multiple failed packets in one operation
- **Notification Tracking**: Tracks which packets have been notified to avoid duplicates
- **Test Notifications**: Allows sending test notifications to verify email configuration

Notification Content:
- Packet ID and type
- Client name and email
- Error message
- Retry count
- Direct link to admin panel for intervention

Key Methods:
```typescript
PacketNotificationService.notifyAdminsOfFailure(packetId, maxRetries)
PacketNotificationService.processPendingNotifications()
PacketNotificationService.sendTestNotification()
```

**Updated: `lib/email.ts`**
- Added `sendPacketFailureNotification()` function
- Professional HTML email template with:
  - Clear failure details
  - Action items for admins
  - Direct link to admin panel
  - Branded styling

**Updated: `lib/intake/job-queue.ts`**
- Integrated notification service
- Automatically notifies admins when packets exceed max retries

**Created: `app/api/admin/packets/errors/route.ts`**

Admin API endpoints:
- `GET /api/admin/packets/errors`: Get error statistics and failed packets
  - Query param: `timeRange` (hours, default: 24)
  - Returns: error stats, retry stats, failed packets, notification count

- `POST /api/admin/packets/errors/notify`: Manually trigger notifications
  - Body: `{ test: true }` - Send test notification
  - Body: `{ packetId: "..." }` - Notify for specific packet
  - Body: `{}` - Process all pending notifications

## Integration Points

### Error Flow
```
Packet Generation Error
  ↓
PacketErrorHandler.handleGenerationError()
  ↓
- Classify error type
- Log to audit log
- Update packet status to FAILED
- Increment retry count
  ↓
PacketRetryService.shouldRetry()
  ↓
If retryable:
  - Calculate exponential backoff delay
  - Schedule retry (reset to PENDING)
If not retryable or max retries exceeded:
  - PacketNotificationService.notifyAdminsOfFailure()
  - Send email to all active admins
```

### Retry Schedule Example
```
Attempt 1: Immediate
Attempt 2: After 5 seconds
Attempt 3: After 10 seconds
Attempt 4: After 20 seconds (if max retries = 4)
```

### Notification Triggers
1. **Automatic**: When packet fails after max retries in job queue
2. **Manual**: Admin calls POST /api/admin/packets/errors/notify
3. **Batch**: Periodic processing of pending notifications

## Configuration

### Environment Variables Required
```env
EMAIL_SERVER_HOST=smtp.example.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=user@example.com
EMAIL_SERVER_PASSWORD=password
EMAIL_FROM=noreply@afya.com
NEXTAUTH_URL=https://your-domain.com
```

### Default Settings
- Max retries: 3
- Base retry delay: 5 seconds
- Max retry delay: 5 minutes
- Exponential base: 2
- Job processing interval: 10 seconds

## Testing

### Manual Testing Steps

1. **Test Error Handling**:
   ```typescript
   // Trigger an error by using invalid client ID
   await PacketGenerationService.orchestratePacketGeneration(
     'invalid-client-id',
     'packet-id',
     'NUTRITION'
   );
   // Check: Packet status should be FAILED
   // Check: Error should be logged in audit log
   ```

2. **Test Retry Logic**:
   ```typescript
   // Check retry eligibility
   const shouldRetry = await retryService.shouldRetry('packet-id');
   
   // Schedule retry
   await retryService.scheduleRetry('packet-id');
   
   // Check: Packet should reset to PENDING after delay
   ```

3. **Test Admin Notification**:
   ```bash
   # Send test notification
   curl -X POST http://localhost:3000/api/admin/packets/errors/notify \
     -H "Content-Type: application/json" \
     -d '{"test": true}'
   
   # Check: All active admins should receive email
   ```

4. **Test Error Statistics**:
   ```bash
   # Get error stats
   curl http://localhost:3000/api/admin/packets/errors?timeRange=24
   
   # Should return:
   # - Error counts by type
   # - Retry statistics
   # - Failed packets list
   ```

### Verification Checklist

- [x] Errors are caught and logged properly
- [x] Packet status updates to FAILED on error
- [x] Retry count increments correctly
- [x] Non-retryable errors are not retried
- [x] Exponential backoff delays are calculated correctly
- [x] Retries are scheduled automatically
- [x] Admin notifications are sent after max retries
- [x] Notification emails contain all required information
- [x] API endpoints require admin authentication
- [x] Error statistics are accurate

## Files Created

1. `lib/intake/packet-error-handler.ts` - Error classification and handling
2. `lib/intake/packet-retry-service.ts` - Retry logic with exponential backoff
3. `lib/intake/packet-notification-service.ts` - Admin notification system
4. `app/api/admin/packets/errors/route.ts` - Admin API for error management

## Files Modified

1. `lib/intake/packet-generation-service.ts` - Integrated error handler
2. `lib/intake/job-queue.ts` - Integrated retry and notification services
3. `lib/intake/packet-worker.ts` - Added retry and notification exports
4. `lib/intake/index.ts` - Exported new services
5. `lib/email.ts` - Added packet failure notification email

## Usage Examples

### For Developers

```typescript
// Handle errors in packet generation
try {
  await PacketGenerationService.orchestratePacketGeneration(
    clientId,
    packetId,
    packetType
  );
} catch (error) {
  // Error is automatically handled by PacketErrorHandler
  // Retry is automatically scheduled if eligible
  // Admins are automatically notified if max retries exceeded
}

// Get error statistics
const stats = await PacketErrorHandler.getErrorStats(24);
console.log(`Total errors in last 24h: ${stats.totalErrors}`);

// Manually retry a packet
await retryPacketGeneration(packetId, true); // true = reset retry count
```

### For Admins

```typescript
// View failed packets
GET /api/admin/packets/errors

// Send test notification
POST /api/admin/packets/errors/notify
{ "test": true }

// Manually trigger notification for specific packet
POST /api/admin/packets/errors/notify
{ "packetId": "packet-123" }

// Process all pending notifications
POST /api/admin/packets/errors/notify
{}
```

## Benefits

1. **Reliability**: Automatic retries handle transient failures
2. **Visibility**: Comprehensive error logging and statistics
3. **Proactive**: Admins are notified of persistent failures
4. **Scalability**: Exponential backoff prevents system overload
5. **Maintainability**: Centralized error handling logic
6. **Debugging**: Detailed error classification and tracking

## Future Enhancements

1. Add error rate alerting (e.g., Slack/Discord integration)
2. Implement error pattern detection for proactive fixes
3. Add retry queue prioritization
4. Create admin dashboard for error visualization
5. Add error recovery suggestions based on error type
6. Implement circuit breaker pattern for external services
7. Add error trend analysis and reporting

## Requirements Satisfied

- ✅ 13.5: Catch and log generation errors
- ✅ 14.5: Update packet status to FAILED
- ✅ 15.5: Store error message in lastError field
- ✅ 16.5: Increment retryCount
- ✅ 17.5: Error handling for all packet types
- ✅ 25.2: Automatic retry with exponential backoff
- ✅ Admin notification for failures after max retries
