'use client';

import { useEffect, useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';

interface AnalyticsData {
  overview: {
    totalIntakes: number;
    completedIntakes: number;
    abandonedIntakes: number;
    overallCompletionRate: number;
  };
  completionRates: Record<string, { total: number; completed: number; rate: number }>;
  avgCompletionTimes: Record<string, number>;
  highAbandonmentSteps: Array<{ step: number; count: number }>;
  distributions: {
    clientType: Record<string, number>;
    goal: Record<string, number>;
    gender: Record<string, number>;
    activityLevel: Record<string, number>;
    experience: Record<string, number>;
  };
}

export function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/analytics');
      
      if (!response.ok) {
        throw new Error('Failed to fetch analytics');
      }
      
      const result = await response.json();
      setData(result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      setExporting(true);
      const response = await fetch('/api/admin/analytics/export');
      
      if (!response.ok) {
        throw new Error('Failed to export analytics');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `intake-analytics-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err: any) {
      alert('Failed to export analytics: ' + err.message);
    } finally {
      setExporting(false);
    }
  };

  const formatTime = (seconds: number): string => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const formatClientType = (type: string): string => {
    return type.split('_').map(word => 
      word.charAt(0) + word.slice(1).toLowerCase()
    ).join(' ');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">Error loading analytics: {error}</p>
        <Button onClick={fetchAnalytics}>Retry</Button>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No analytics data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Intake Analytics</h2>
        <Button
          onClick={handleExport}
          disabled={exporting}
          variant="outline"
        >
          {exporting ? 'Exporting...' : 'Export CSV'}
        </Button>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="text-sm text-gray-600 mb-1">Total Intakes</div>
          <div className="text-3xl font-bold text-gray-900">
            {data.overview.totalIntakes}
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="text-sm text-gray-600 mb-1">Completed</div>
          <div className="text-3xl font-bold text-green-600">
            {data.overview.completedIntakes}
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="text-sm text-gray-600 mb-1">Abandoned</div>
          <div className="text-3xl font-bold text-red-600">
            {data.overview.abandonedIntakes}
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="text-sm text-gray-600 mb-1">Completion Rate</div>
          <div className="text-3xl font-bold text-blue-600">
            {data.overview.overallCompletionRate.toFixed(1)}%
          </div>
        </Card>
      </div>

      {/* Completion Rates by Client Type */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Completion Rates by Client Type
        </h3>
        <div className="space-y-4">
          {Object.entries(data.completionRates).map(([type, stats]) => (
            <div key={type}>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">
                  {formatClientType(type)}
                </span>
                <span className="text-sm text-gray-600">
                  {stats.completed} / {stats.total} ({stats.rate.toFixed(1)}%)
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{ width: `${stats.rate}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Average Completion Times */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Average Completion Times
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(data.avgCompletionTimes).map(([type, time]) => (
            <div key={type} className="border border-gray-200 rounded-lg p-4">
              <div className="text-sm text-gray-600 mb-1">
                {formatClientType(type)}
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {time > 0 ? formatTime(time) : 'N/A'}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* High Abandonment Steps */}
      {data.highAbandonmentSteps.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            High Abandonment Steps
          </h3>
          <div className="space-y-3">
            {data.highAbandonmentSteps.map(({ step, count }) => (
              <div key={step} className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">
                  Step {step}
                </span>
                <span className="text-sm text-red-600 font-semibold">
                  {count} abandonments
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Demographic Distributions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Client Type Distribution */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Client Type Distribution
          </h3>
          <div className="space-y-3">
            {Object.entries(data.distributions.clientType)
              .sort(([, a], [, b]) => b - a)
              .map(([type, count]) => (
                <div key={type} className="flex justify-between items-center">
                  <span className="text-sm text-gray-700">
                    {formatClientType(type)}
                  </span>
                  <span className="text-sm font-semibold text-gray-900">
                    {count}
                  </span>
                </div>
              ))}
          </div>
        </Card>

        {/* Goal Distribution */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Goal Distribution
          </h3>
          <div className="space-y-3">
            {Object.entries(data.distributions.goal)
              .sort(([, a], [, b]) => b - a)
              .slice(0, 10)
              .map(([goal, count]) => (
                <div key={goal} className="flex justify-between items-center">
                  <span className="text-sm text-gray-700 truncate max-w-[200px]">
                    {goal}
                  </span>
                  <span className="text-sm font-semibold text-gray-900">
                    {count}
                  </span>
                </div>
              ))}
          </div>
        </Card>

        {/* Gender Distribution */}
        {Object.keys(data.distributions.gender).length > 0 && (
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Gender Distribution
            </h3>
            <div className="space-y-3">
              {Object.entries(data.distributions.gender)
                .sort(([, a], [, b]) => b - a)
                .map(([gender, count]) => (
                  <div key={gender} className="flex justify-between items-center">
                    <span className="text-sm text-gray-700 capitalize">
                      {gender}
                    </span>
                    <span className="text-sm font-semibold text-gray-900">
                      {count}
                    </span>
                  </div>
                ))}
            </div>
          </Card>
        )}

        {/* Activity Level Distribution */}
        {Object.keys(data.distributions.activityLevel).length > 0 && (
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Activity Level Distribution
            </h3>
            <div className="space-y-3">
              {Object.entries(data.distributions.activityLevel)
                .sort(([, a], [, b]) => b - a)
                .map(([level, count]) => (
                  <div key={level} className="flex justify-between items-center">
                    <span className="text-sm text-gray-700 capitalize">
                      {level}
                    </span>
                    <span className="text-sm font-semibold text-gray-900">
                      {count}
                    </span>
                  </div>
                ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
