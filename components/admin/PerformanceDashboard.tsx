'use client';

import { useState, useEffect } from 'react';
import { Activity, AlertTriangle, TrendingUp, TrendingDown, Clock, Zap } from 'lucide-react';

interface PerformanceData {
  aggregated: {
    avgFCP: number;
    avgLCP: number;
    avgFID: number;
    avgCLS: number;
    avgTTFB: number;
    avgPageLoadTime: number;
    p50LCP: number;
    p75LCP: number;
    p95LCP: number;
    passingVitals: number;
  };
  metrics: any[];
  count: number;
}

interface Alert {
  type: 'warning' | 'error';
  message: string;
  page: string;
  metric: string;
  value: number;
  threshold: number;
  severity: 'low' | 'medium' | 'high';
}

export default function PerformanceDashboard() {
  const [timeRange, setTimeRange] = useState('7d');
  const [data, setData] = useState<PerformanceData | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPage, setSelectedPage] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
    fetchAlerts();
  }, [timeRange]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/performance/metrics?timeRange=${timeRange}`);
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('Error fetching performance data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAlerts = async () => {
    try {
      const response = await fetch('/api/admin/performance/alerts?timeRange=24h');
      const result = await response.json();
      setAlerts(result.alerts || []);
    } catch (error) {
      console.error('Error fetching alerts:', error);
    }
  };

  if (loading || !data) {
    return <div className="text-center py-12">Loading performance data...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          {['24h', '7d', '30d', '90d'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                timeRange === range
                  ? 'bg-purple-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
              }`}
            >
              {range === '24h' ? 'Last 24 Hours' : 
               range === '7d' ? 'Last 7 Days' :
               range === '30d' ? 'Last 30 Days' : 'Last 90 Days'}
            </button>
          ))}
        </div>
        <div className="text-sm text-gray-600">
          {data.count} samples collected
        </div>
      </div>

      {/* Alerts Section */}
      {alerts.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <h3 className="font-semibold text-red-900">
              Performance Alerts ({alerts.length})
            </h3>
          </div>
          <div className="space-y-2">
            {alerts.slice(0, 5).map((alert, index) => (
              <div
                key={index}
                className={`p-3 rounded ${
                  alert.type === 'error' ? 'bg-red-100' : 'bg-yellow-100'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-900">{alert.message}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      {alert.metric.toUpperCase()}: {Math.round(alert.value)}
                      {alert.metric === 'cls' ? '' : 'ms'} (threshold: {alert.threshold}
                      {alert.metric === 'cls' ? '' : 'ms'})
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      alert.severity === 'high'
                        ? 'bg-red-200 text-red-800'
                        : alert.severity === 'medium'
                        ? 'bg-yellow-200 text-yellow-800'
                        : 'bg-blue-200 text-blue-800'
                    }`}
                  >
                    {alert.severity}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Overview Cards */}
      <PerformanceOverview aggregated={data.aggregated} />

      {/* Core Web Vitals Chart */}
      <CoreWebVitalsChart aggregated={data.aggregated} />

      {/* Page Performance Table */}
      <PagePerformanceTable
        metrics={data.metrics}
        onPageSelect={setSelectedPage}
      />
    </div>
  );
}

function PerformanceOverview({ aggregated }: { aggregated: any }) {
  const metrics = [
    {
      name: 'LCP',
      value: aggregated.avgLCP,
      unit: 'ms',
      threshold: 2500,
      icon: Clock,
      description: 'Largest Contentful Paint',
    },
    {
      name: 'FID',
      value: aggregated.avgFID,
      unit: 'ms',
      threshold: 100,
      icon: Zap,
      description: 'First Input Delay',
    },
    {
      name: 'CLS',
      value: aggregated.avgCLS,
      unit: '',
      threshold: 0.1,
      icon: Activity,
      description: 'Cumulative Layout Shift',
    },
    {
      name: 'Passing',
      value: aggregated.passingVitals,
      unit: '%',
      threshold: 75,
      icon: TrendingUp,
      description: 'Core Web Vitals Pass Rate',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric) => {
        const Icon = metric.icon;
        const isPassing = metric.value <= metric.threshold;
        const isPercentage = metric.unit === '%';

        return (
          <div key={metric.name} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Icon className="w-5 h-5 text-gray-600" />
                <h3 className="font-semibold text-gray-900">{metric.name}</h3>
              </div>
              {isPassing ? (
                <TrendingUp className="w-5 h-5 text-green-600" />
              ) : (
                <TrendingDown className="w-5 h-5 text-red-600" />
              )}
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {isPercentage ? metric.value : Math.round(metric.value)}
              <span className="text-lg text-gray-600 ml-1">{metric.unit}</span>
            </p>
            <p className="text-sm text-gray-600 mt-1">{metric.description}</p>
            <div className="mt-3 flex items-center gap-2">
              <div
                className={`h-2 flex-1 rounded-full ${
                  isPassing ? 'bg-green-200' : 'bg-red-200'
                }`}
              >
                <div
                  className={`h-2 rounded-full ${
                    isPassing ? 'bg-green-600' : 'bg-red-600'
                  }`}
                  style={{
                    width: `${Math.min(
                      100,
                      (metric.value / metric.threshold) * 100
                    )}%`,
                  }}
                />
              </div>
              <span className="text-xs text-gray-600">
                {metric.threshold}{metric.unit}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function CoreWebVitalsChart({ aggregated }: { aggregated: any }) {
  const vitals = [
    { name: 'FCP', value: aggregated.avgFCP, threshold: 1800, color: 'bg-blue-500' },
    { name: 'LCP', value: aggregated.avgLCP, threshold: 2500, color: 'bg-purple-500' },
    { name: 'FID', value: aggregated.avgFID, threshold: 100, color: 'bg-green-500' },
    { name: 'TTFB', value: aggregated.avgTTFB, threshold: 800, color: 'bg-yellow-500' },
  ];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Core Web Vitals Overview
      </h3>
      <div className="space-y-4">
        {vitals.map((vital) => (
          <div key={vital.name}>
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium text-gray-700">{vital.name}</span>
              <span className="text-sm text-gray-600">
                {Math.round(vital.value)}ms / {vital.threshold}ms
              </span>
            </div>
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-3 ${vital.color} transition-all duration-500`}
                style={{
                  width: `${Math.min(100, (vital.value / vital.threshold) * 100)}%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-2">LCP Percentiles</h4>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-600">P50</p>
            <p className="text-lg font-semibold text-gray-900">
              {Math.round(aggregated.p50LCP)}ms
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">P75</p>
            <p className="text-lg font-semibold text-gray-900">
              {Math.round(aggregated.p75LCP)}ms
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">P95</p>
            <p className="text-lg font-semibold text-gray-900">
              {Math.round(aggregated.p95LCP)}ms
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function PagePerformanceTable({
  metrics,
  onPageSelect,
}: {
  metrics: any[];
  onPageSelect: (page: string) => void;
}) {
  // Group metrics by page
  const pageStats = new Map<string, any[]>();
  for (const metric of metrics) {
    if (!pageStats.has(metric.pageName)) {
      pageStats.set(metric.pageName, []);
    }
    pageStats.get(metric.pageName)!.push(metric);
  }

  // Calculate stats for each page
  const pages = Array.from(pageStats.entries()).map(([pageName, pageMetrics]) => {
    const avg = (arr: number[]) =>
      arr.length > 0 ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;

    const lcpValues = pageMetrics.filter((m) => m.lcp !== null).map((m) => m.lcp);
    const fcpValues = pageMetrics.filter((m) => m.fcp !== null).map((m) => m.fcp);
    const clsValues = pageMetrics.filter((m) => m.cls !== null).map((m) => m.cls);

    const avgLCP = avg(lcpValues);
    const avgFCP = avg(fcpValues);
    const avgCLS = avg(clsValues);

    const passing =
      avgLCP <= 2500 && avgFCP <= 1800 && avgCLS <= 0.1;

    return {
      pageName,
      avgLCP: Math.round(avgLCP),
      avgFCP: Math.round(avgFCP),
      avgCLS: parseFloat(avgCLS.toFixed(3)),
      sampleSize: pageMetrics.length,
      passing,
    };
  });

  // Sort by LCP (worst first)
  pages.sort((a, b) => b.avgLCP - a.avgLCP);

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">
          Page Performance Breakdown
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Page
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                LCP
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                FCP
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                CLS
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Samples
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {pages.map((page) => (
              <tr
                key={page.pageName}
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => onPageSelect(page.pageName)}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    /{page.pageName}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{page.avgLCP}ms</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{page.avgFCP}ms</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{page.avgCLS}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-600">{page.sampleSize}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      page.passing
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {page.passing ? 'Passing' : 'Needs Work'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
