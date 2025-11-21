'use client';

import { useState, useEffect } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

interface Program {
  id: string;
  title: string;
  description: string;
  icon: string;
  gradient: string;
  clientType: string;
  isActive: boolean;
  order: number;
}

interface ProgramEditorProps {
  program: Program | null;
  onClose: () => void;
}

const CLIENT_TYPES = [
  'NUTRITION_ONLY',
  'WORKOUT_ONLY',
  'FULL_PROGRAM',
  'ATHLETE_PERFORMANCE',
  'YOUTH',
  'GENERAL_WELLNESS',
  'SPECIAL_SITUATION'
];

export function ProgramEditor({ program, onClose }: ProgramEditorProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    icon: '🏃',
    gradient: 'from-blue-500 to-purple-500',
    clientType: 'GENERAL_WELLNESS',
    isActive: true,
    order: 0
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (program) {
      setFormData({
        title: program.title,
        description: program.description,
        icon: program.icon,
        gradient: program.gradient,
        clientType: program.clientType,
        isActive: program.isActive,
        order: program.order
      });
    }
  }, [program]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);

    try {
      const url = program
        ? `/api/admin/content/programs/${program.id}`
        : '/api/admin/content/programs';
      
      const method = program ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to save program');
      }

      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save program');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">
            {program ? 'Edit Program' : 'Add New Program'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Program Title *
              </label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Nutrition Program"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the program (2-3 sentences max)"
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-afya-turquoise focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Icon (Emoji) *
              </label>
              <Input
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                placeholder="🏃"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gradient Classes *
              </label>
              <Input
                value={formData.gradient}
                onChange={(e) => setFormData({ ...formData, gradient: e.target.value })}
                placeholder="from-blue-500 to-purple-500"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Tailwind gradient classes (e.g., from-blue-500 to-purple-500)
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Client Type *
              </label>
              <select
                value={formData.clientType}
                onChange={(e) => setFormData({ ...formData, clientType: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-afya-turquoise focus:border-transparent"
                required
              >
                {CLIENT_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Display Order
              </label>
              <Input
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                placeholder="0"
              />
            </div>

            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="rounded border-gray-300 text-afya-turquoise focus:ring-afya-turquoise"
                />
                <span className="ml-2 text-sm text-gray-700">
                  Program is active and visible
                </span>
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
            <Button type="button" variant="outline" onClick={onClose} disabled={saving}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={saving}>
              {saving ? 'Saving...' : program ? 'Update Program' : 'Create Program'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
