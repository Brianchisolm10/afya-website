'use client';

import { useState } from 'react';
import { TemplateManager, TemplateEditor } from '@/components/admin';

type ViewMode = 'list' | 'edit' | 'create' | 'preview';

export default function TemplatesPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | undefined>();

  const handleEdit = (templateId: string) => {
    setSelectedTemplateId(templateId);
    setViewMode('edit');
  };

  const handlePreview = (templateId: string) => {
    setSelectedTemplateId(templateId);
    setViewMode('preview');
  };

  const handleCreate = () => {
    setSelectedTemplateId(undefined);
    setViewMode('create');
  };

  const handleSave = () => {
    setViewMode('list');
    setSelectedTemplateId(undefined);
  };

  const handleCancel = () => {
    setViewMode('list');
    setSelectedTemplateId(undefined);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {viewMode === 'list' && (
        <TemplateManager
          onEdit={handleEdit}
          onPreview={handlePreview}
          onCreate={handleCreate}
        />
      )}
      
      {(viewMode === 'edit' || viewMode === 'create') && (
        <TemplateEditor
          templateId={selectedTemplateId}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}
      
      {viewMode === 'preview' && selectedTemplateId && (
        <div>
          <div className="mb-4">
            <button
              onClick={handleCancel}
              className="text-teal-600 hover:text-teal-700 font-medium"
            >
              ← Back to Templates
            </button>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-4">Template Preview</h2>
            <p className="text-gray-600">Preview functionality coming soon...</p>
          </div>
        </div>
      )}
    </div>
  );
}
