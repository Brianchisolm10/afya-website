/**
 * Alert Manager
 * 
 * Manages system alerts and notifications for critical issues.
 */

import { logger } from './logger';

export enum AlertSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

interface Alert {
  title: string;
  message: string;
  severity: AlertSeverity;
  metadata?: Record<string, any>;
}

export class AlertManager {
  /**
   * Send an alert
   */
  async sendAlert(alert: Alert): Promise<void> {
    // Log the alert
    const logLevel = this.getLogLevel(alert.severity);
    logger[logLevel](`[ALERT] ${alert.title}`, {
      message: alert.message,
      severity: alert.severity,
      ...alert.metadata,
    });

    // Send to external services based on severity
    if (alert.severity === AlertSeverity.CRITICAL || alert.severity === AlertSeverity.HIGH) {
      await this.sendExternalAlert(alert);
    }
  }

  /**
   * Send alert to external services (Slack, email, etc.)
   */
  private async sendExternalAlert(alert: Alert): Promise<void> {
    const promises: Promise<void>[] = [];

    // Send to Slack if configured
    if (process.env.SLACK_WEBHOOK_URL) {
      promises.push(this.sendSlackAlert(alert));
    }

    // Send to Discord if configured
    if (process.env.DISCORD_WEBHOOK_URL) {
      promises.push(this.sendDiscordAlert(alert));
    }

    // Send email for critical alerts
    if (alert.severity === AlertSeverity.CRITICAL && process.env.ALERT_EMAIL) {
      promises.push(this.sendEmailAlert(alert));
    }

    // Wait for all notifications to complete
    await Promise.allSettled(promises);
  }

  /**
   * Send alert to Slack
   */
  private async sendSlackAlert(alert: Alert): Promise<void> {
    try {
      const color = this.getSlackColor(alert.severity);
      
      await fetch(process.env.SLACK_WEBHOOK_URL!, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          attachments: [{
            color,
            title: `🚨 ${alert.title}`,
            text: alert.message,
            fields: Object.entries(alert.metadata || {}).map(([key, value]) => ({
              title: key,
              value: String(value),
              short: true,
            })),
            footer: 'Afya Monitoring System',
            ts: Math.floor(Date.now() / 1000),
          }],
        }),
      });
    } catch (error) {
      logger.error('Failed to send Slack alert', error);
    }
  }

  /**
   * Send alert to Discord
   */
  private async sendDiscordAlert(alert: Alert): Promise<void> {
    try {
      const color = this.getDiscordColor(alert.severity);
      
      await fetch(process.env.DISCORD_WEBHOOK_URL!, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          embeds: [{
            title: `🚨 ${alert.title}`,
            description: alert.message,
            color,
            fields: Object.entries(alert.metadata || {}).map(([key, value]) => ({
              name: key,
              value: String(value),
              inline: true,
            })),
            footer: {
              text: 'Afya Monitoring System',
            },
            timestamp: new Date().toISOString(),
          }],
        }),
      });
    } catch (error) {
      logger.error('Failed to send Discord alert', error);
    }
  }

  /**
   * Send alert via email
   */
  private async sendEmailAlert(alert: Alert): Promise<void> {
    try {
      const { sendEmail } = await import('@/lib/email');
      
      await sendEmail({
        to: process.env.ALERT_EMAIL!,
        subject: `🚨 ${alert.title}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background-color: #ef4444; color: white; padding: 20px; border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0;">🚨 ${alert.title}</h1>
            </div>
            <div style="padding: 20px; background-color: #f9fafb; border: 1px solid #e5e7eb;">
              <p style="font-size: 16px; color: #374151;">${alert.message}</p>
              ${alert.metadata ? `
                <div style="margin-top: 20px; padding: 15px; background-color: white; border-radius: 4px;">
                  <h3 style="margin-top: 0; color: #111827;">Details:</h3>
                  ${Object.entries(alert.metadata).map(([key, value]) => `
                    <p style="margin: 8px 0; color: #6b7280;">
                      <strong>${key}:</strong> ${value}
                    </p>
                  `).join('')}
                </div>
              ` : ''}
              <p style="margin-top: 20px; color: #6b7280; font-size: 14px;">
                Severity: <strong style="color: ${
                  alert.severity === AlertSeverity.CRITICAL ? '#dc2626' :
                  alert.severity === AlertSeverity.HIGH ? '#ea580c' :
                  alert.severity === AlertSeverity.MEDIUM ? '#ca8a04' : '#16a34a'
                }">${alert.severity.toUpperCase()}</strong>
              </p>
            </div>
            <div style="padding: 15px; text-align: center; font-size: 12px; color: #9ca3af;">
              <p>AFYA Monitoring System - ${new Date().toLocaleString()}</p>
            </div>
          </div>
        `,
      });
    } catch (error) {
      logger.error('Failed to send email alert', error);
    }
  }

  /**
   * Get log level for alert severity
   */
  private getLogLevel(severity: AlertSeverity): 'info' | 'warn' | 'error' {
    switch (severity) {
      case AlertSeverity.CRITICAL:
      case AlertSeverity.HIGH:
        return 'error';
      case AlertSeverity.MEDIUM:
        return 'warn';
      default:
        return 'info';
    }
  }

  /**
   * Get Slack color for alert severity
   */
  private getSlackColor(severity: AlertSeverity): string {
    switch (severity) {
      case AlertSeverity.CRITICAL:
        return '#8b0000'; // Dark red
      case AlertSeverity.HIGH:
        return '#ff0000'; // Red
      case AlertSeverity.MEDIUM:
        return '#ff9900'; // Orange
      default:
        return '#36a64f'; // Green
    }
  }

  /**
   * Get Discord color for alert severity (decimal format)
   */
  private getDiscordColor(severity: AlertSeverity): number {
    switch (severity) {
      case AlertSeverity.CRITICAL:
        return 0x8b0000; // Dark red
      case AlertSeverity.HIGH:
        return 0xff0000; // Red
      case AlertSeverity.MEDIUM:
        return 0xff9900; // Orange
      default:
        return 0x36a64f; // Green
    }
  }
}

// Export singleton instance
export const alertManager = new AlertManager();

// Convenience functions for common alerts
export async function alertDatabaseError(error: Error, metadata?: Record<string, any>) {
  await alertManager.sendAlert({
    title: 'Database Error',
    message: `Database operation failed: ${error.message}`,
    severity: AlertSeverity.HIGH,
    metadata: {
      error: error.message,
      stack: error.stack,
      ...metadata,
    },
  });
}

export async function alertQueueBackup(pendingJobs: number, metadata?: Record<string, any>) {
  await alertManager.sendAlert({
    title: 'Job Queue Backed Up',
    message: `Job queue has ${pendingJobs} pending jobs`,
    severity: pendingJobs > 100 ? AlertSeverity.HIGH : AlertSeverity.MEDIUM,
    metadata: {
      pendingJobs,
      ...metadata,
    },
  });
}

export async function alertHighFailureRate(failureRate: number, metadata?: Record<string, any>) {
  await alertManager.sendAlert({
    title: 'High Failure Rate Detected',
    message: `System failure rate is ${failureRate.toFixed(2)}%`,
    severity: failureRate > 20 ? AlertSeverity.CRITICAL : AlertSeverity.HIGH,
    metadata: {
      failureRate: `${failureRate.toFixed(2)}%`,
      ...metadata,
    },
  });
}

export async function alertSlowOperation(operation: string, duration: number, metadata?: Record<string, any>) {
  await alertManager.sendAlert({
    title: 'Slow Operation Detected',
    message: `Operation "${operation}" took ${duration}ms to complete`,
    severity: duration > 30000 ? AlertSeverity.HIGH : AlertSeverity.MEDIUM,
    metadata: {
      operation,
      duration: `${duration}ms`,
      ...metadata,
    },
  });
}

/**
 * Performance-specific alert functions
 */

export async function alertPerformanceDegradation(
  page: string,
  metric: string,
  value: number,
  threshold: number,
  metadata?: Record<string, any>
) {
  const severity = value > threshold * 1.5 ? AlertSeverity.HIGH : AlertSeverity.MEDIUM;
  
  await alertManager.sendAlert({
    title: 'Performance Degradation Detected',
    message: `${metric.toUpperCase()} on page "${page}" is ${Math.round(value)}${metric === 'cls' ? '' : 'ms'} (threshold: ${threshold}${metric === 'cls' ? '' : 'ms'})`,
    severity,
    metadata: {
      page,
      metric,
      value: `${Math.round(value)}${metric === 'cls' ? '' : 'ms'}`,
      threshold: `${threshold}${metric === 'cls' ? '' : 'ms'}`,
      ...metadata,
    },
  });
}

export async function alertCriticalWebVitals(
  page: string,
  failingMetrics: string[],
  metadata?: Record<string, any>
) {
  await alertManager.sendAlert({
    title: 'Critical Web Vitals Failure',
    message: `Page "${page}" is failing Core Web Vitals: ${failingMetrics.join(', ')}`,
    severity: AlertSeverity.HIGH,
    metadata: {
      page,
      failingMetrics: failingMetrics.join(', '),
      ...metadata,
    },
  });
}

export async function alertHighPageLoadTime(
  page: string,
  loadTime: number,
  metadata?: Record<string, any>
) {
  await alertManager.sendAlert({
    title: 'High Page Load Time',
    message: `Page "${page}" load time is ${Math.round(loadTime)}ms`,
    severity: loadTime > 5000 ? AlertSeverity.HIGH : AlertSeverity.MEDIUM,
    metadata: {
      page,
      loadTime: `${Math.round(loadTime)}ms`,
      ...metadata,
    },
  });
}
