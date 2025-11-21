'use client';

import { useState, useEffect } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

interface ImpactSection {
  id: string;
  title: string;
  description: string;
  icon: string;
  stats?: any;
  ctaLabel?: string;
  ctaHref?: string;
  isActive: boolean;
  comingSoon: boolean;
  order: number;
}

interface ImpactSectionEditorProps {
  section: ImpactSection | null;
  onClose: () => void;
}

export function ImpactSectionEditor({ section, onClose }: ImpactSectionEditorProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    icon: '❤️',
    stats: '',
    ctaLabel: '',
    ctaHref: '',
    isActive: true,
    comingSoon: false,
    order: 0
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (section) {
      setFormData({
        title: section.title,
        description: section.description,
        icon: section.icon,
        stats: section.stats ? JSON.stringify(section.stats, null, 2) : '',
        ctaLabel: section.ctaLabel || '',
        ctaHref: section.ctaHref || '',
        isActive: section.isActive,
        comingSoon: section.comingSoon,
        order: section.order
      });
    }
  }, [section]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);

    try {
      const payload = {
        ...formData,
        stats: formData.stats ? JSON.parse(formData.stats) : null
      };

      const url = section
        ? `/api/admin/content/impact/${section.id}`
        : '/api/admin/content/impact';
      
      const method = section ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to save impact section');
      }

      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save impact section');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">
            {section ? 'Edit Impact Section' : 'Add New Impact Section'}
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
                Section Title *
              </label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Donations"
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
                placeholder="Describe the impact initiative..."
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
                placeholder="❤️"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stats (JSON format, optional)
              </label>
              <textarea
                value={formData.stats}
                onChange={(e) => setFormData({ ...formData, stats: e.target.value })}
                placeholder='[{"label": "Total Raised", "value": "$50,000"}]'
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-afya-turquoise focus:border-transparent font-mono text-sm"
              />
              <p className="text-xs text-gray-500 mt-1">
                JSON array of stat objects with label and value
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CTA Button Label
              </label>
              <Input
                value={formData.ctaLabel}
                onChange={(e) => setFormData({ ...formData, ctaLabel: e.target.value })}
                placeholder="e.g., Donate Now"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CTA Button Link
              </label>
              <Input
                value={formData.ctaHref}
                onChange={(e) => setFormData({ ...formData, ctaHref: e.target.value })}
                placeholder="/donate"
              />
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

            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="rounded border-gray-300 text-afya-turquoise focus:ring-afya-turquoise"
                />
                <span className="ml-2 text-sm text-gray-700">
                  Section is active and visible
                </span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.comingSoon}
                  onChange={(e) => setFormData({ ...formData, comingSoon: e.target.checked })}
                  className="rounded border-gray-300 text-afya-turquoise focus:ring-afya-turquoise"
                />
                <span className="ml-2 text-sm text-gray-700">
                  Mark as "Coming Soon"
                </span>
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
            <Button type="button" variant="outline" onClick={onClose} disabled={saving}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={saving}>
              {saving ? 'Saving...' : section ? 'Update Section' : 'Create Section'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
