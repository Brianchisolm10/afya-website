'use client';

import { useState, useEffect } from 'react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Spinner from '@/components/ui/Spinner';

interface PacketTemplate {
  id: string;
  name: string;
  packetType: string;
  clientType: string | null;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

interface TemplateManagerProps {
  onEdit: (templateId: string) => void;
  onPreview: (templateId: string) => void;
  onCreate: () => void;
}

export default function TemplateManager({ onEdit, onPreview, onCreate }: TemplateManagerProps) {
  const [templates, setTemplates] = useState<PacketTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterPacketType, setFilterPacketType] = useState<string>('');
  const [filterClientType, setFilterClientType] = useState<string>('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    fetchTemplates();
  }, [filterPacketType, filterClientType]);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams();
      if (filterPacketType) params.append('packetType', filterPacketType);
      if (filterClientType) params.append('clientType', filterClientType);
      
      const response = await fetch(`/api/admin/templates?${params.toString()}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch templates');
      }
      
      setTemplates(data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (templateId: string) => {
    try {
      const response = await fetch(`/api/admin/templates/${templateId}`, {
        method: 'DELETE'
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete template');
      }
      
      // Refresh templates list
      fetchTemplates();
      setDeleteConfirm(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete template');
    }
  };

  const getPacketTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      INTRO: 'Introduction',
      NUTRITION: 'Nutrition',
      WORKOUT: 'Workout',
      PERFORMANCE: 'Performance',
      YOUTH: 'Youth',
      RECOVERY: 'Recovery',
      WELLNESS: 'Wellness'
    };
    return labels[type] || type;
  };

  const getClientTypeLabel = (type: string | null) => {
    if (!type) return 'All';
    const labels: Record<string, string> = {
      NUTRITION_ONLY: 'Nutrition Only',
      WORKOUT_ONLY: 'Workout Only',
      FULL_PROGRAM: 'Full Program',
      ATHLETE_PERFORMANCE: 'Athlete Performance',
      YOUTH: 'Youth',
      GENERAL_WELLNESS: 'General Wellness',
      SPECIAL_SITUATION: 'Movement Needs'
    };
    return labels[type] || type;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Packet Templates</h2>
          <p className="text-gray-600 mt-1">Manage templates for packet generation</p>
        </div>
        <Button onClick={onCreate}>
          Create New Template
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Packet Type
            </label>
            <select
              value={filterPacketType}
              onChange={(e) => setFilterPacketType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="">All Types</option>
              <option value="INTRO">Introduction</option>
              <option value="NUTRITION">Nutrition</option>
              <option value="WORKOUT">Workout</option>
              <option value="PERFORMANCE">Performance</option>
              <option value="YOUTH">Youth</option>
              <option value="RECOVERY">Recovery</option>
              <option value="WELLNESS">Wellness</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Client Type
            </label>
            <select
              value={filterClientType}
              onChange={(e) => setFilterClientType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="">All Client Types</option>
              <option value="NUTRITION_ONLY">Nutrition Only</option>
              <option value="WORKOUT_ONLY">Workout Only</option>
              <option value="FULL_PROGRAM">Full Program</option>
              <option value="ATHLETE_PERFORMANCE">Athlete Performance</option>
              <option value="YOUTH">Youth</option>
              <option value="GENERAL_WELLNESS">General Wellness</option>
              <option value="SPECIAL_SITUATION">Movement Needs</option>
            </select>
          </div>
          
          <div className="flex items-end">
            <Button
              variant="secondary"
              onClick={() => {
                setFilterPacketType('');
                setFilterClientType('');
              }}
              className="w-full"
            >
              Clear Filters
            </Button>
          </div>
        </div>
      </Card>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      {/* Templates List */}
      {templates.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No templates found</p>
            <p className="text-gray-400 mt-2">Create a new template to get started</p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {templates.map((template) => (
            <Card key={template.id} className="hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {template.name}
                    </h3>
                    {template.isDefault && (
                      <Badge variant="success">Default</Badge>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    <Badge variant="info">
                      {getPacketTypeLabel(template.packetType)}
                    </Badge>
                    <Badge variant="default">
                      {getClientTypeLabel(template.clientType)}
                    </Badge>
                  </div>
                  
                  <div className="text-sm text-gray-500">
                    <p>Created: {new Date(template.createdAt).toLocaleDateString()}</p>
                    <p>Updated: {new Date(template.updatedAt).toLocaleDateString()}</p>
                  </div>
                </div>
                
                <div className="flex gap-2 ml-4">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => onPreview(template.id)}
                  >
                    Preview
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => onEdit(template.id)}
                  >
                    Edit
                  </Button>
                  {deleteConfirm === template.id ? (
                    <div className="flex gap-2">
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(template.id)}
                      >
                        Confirm
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setDeleteConfirm(null)}
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => setDeleteConfirm(template.id)}
                    >
                      Delete
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
