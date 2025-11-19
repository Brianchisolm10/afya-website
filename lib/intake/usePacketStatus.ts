/**
 * usePacketStatus Hook
 * 
 * React hook for polling packet generation status
 * Provides real-time updates on packet generation progress
 */

import { useState, useEffect, useCallback } from 'react';

export interface PacketStatus {
  id: string;
  type: string;
  status: 'PENDING' | 'GENERATING' | 'READY' | 'FAILED';
  retryCount: number;
  hasError: boolean;
  errorMessage?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PacketStatusSummary {
  total: number;
  completed: number;
  failed: number;
  generating: number;
  pending: number;
  progress: number;
}

export interface PacketStatusResponse {
  packets: PacketStatus[];
  summary: PacketStatusSummary;
}

export interface UsePacketStatusOptions {
  /** Polling interval in milliseconds (default: 5000) */
  pollInterval?: number;
  /** Whether to start polling immediately (default: true) */
  enabled?: boolean;
  /** Callback when all packets are complete */
  onAllComplete?: () => void;
  /** Callback when any packet fails */
  onPacketFailed?: (packet: PacketStatus) => void;
}

export interface UsePacketStatusReturn {
  packets: PacketStatus[];
  summary: PacketStatusSummary | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  startPolling: () => void;
  stopPolling: () => void;
}

/**
 * Hook to fetch and poll packet generation status
 */
export function usePacketStatus(options: UsePacketStatusOptions = {}): UsePacketStatusReturn {
  const {
    pollInterval = 5000,
    enabled = true,
    onAllComplete,
    onPacketFailed
  } = options;

  const [packets, setPackets] = useState<PacketStatus[]>([]);
  const [summary, setSummary] = useState<PacketStatusSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPolling, setIsPolling] = useState(enabled);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

  /**
   * Fetch packet status from API
   */
  const fetchStatus = useCallback(async () => {
    try {
      const response = await fetch('/api/packets/status');
      
      if (!response.ok) {
        throw new Error('Failed to fetch packet status');
      }

      const data: PacketStatusResponse = await response.json();
      
      // Check for newly failed packets
      if (onPacketFailed) {
        const previousFailedIds = new Set(
          packets.filter(p => p.status === 'FAILED').map(p => p.id)
        );
        
        data.packets.forEach(packet => {
          if (packet.status === 'FAILED' && !previousFailedIds.has(packet.id)) {
            onPacketFailed(packet);
          }
        });
      }

      setPackets(data.packets);
      setSummary(data.summary);
      setError(null);

      // Check if all packets are complete
      if (onAllComplete && data.summary.total > 0) {
        const allComplete = data.summary.completed + data.summary.failed === data.summary.total;
        if (allComplete) {
          onAllComplete();
          // Stop polling when all complete
          setIsPolling(false);
        }
      }

    } catch (err) {
      console.error('Error fetching packet status:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  }, [packets, onPacketFailed, onAllComplete]);

  /**
   * Start polling
   */
  const startPolling = useCallback(() => {
    setIsPolling(true);
  }, []);

  /**
   * Stop polling
   */
  const stopPolling = useCallback(() => {
    setIsPolling(false);
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
  }, [intervalId]);

  /**
   * Manual refetch
   */
  const refetch = useCallback(async () => {
    setIsLoading(true);
    await fetchStatus();
  }, [fetchStatus]);

  /**
   * Set up polling effect
   */
  useEffect(() => {
    if (!isPolling) {
      if (intervalId) {
        clearInterval(intervalId);
        setIntervalId(null);
      }
      return;
    }

    // Fetch immediately
    fetchStatus();

    // Set up interval
    const id = setInterval(fetchStatus, pollInterval);
    setIntervalId(id);

    // Cleanup
    return () => {
      clearInterval(id);
    };
  }, [isPolling, pollInterval, fetchStatus]);

  /**
   * Cleanup on unmount
   */
  useEffect(() => {
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [intervalId]);

  return {
    packets,
    summary,
    isLoading,
    error,
    refetch,
    startPolling,
    stopPolling
  };
}

/**
 * Hook to check if any packets are still generating
 */
export function useIsGenerating(): boolean {
  const { summary } = usePacketStatus({ pollInterval: 10000 });
  
  if (!summary) return false;
  
  return summary.generating > 0 || summary.pending > 0;
}

/**
 * Hook to get generation progress percentage
 */
export function useGenerationProgress(): number {
  const { summary } = usePacketStatus({ pollInterval: 10000 });
  
  return summary?.progress || 0;
}
