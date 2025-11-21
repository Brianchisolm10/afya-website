'use client';

import { useState, useEffect } from 'react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Badge from '@/components/ui/Badge';
import Spinner from '@/components/ui/Spinner';
import { PacketTemplate, PacketSection, ContentBlock } from '@/types/intake';

interface TemplateEditorProps {
  templateId?: string;
  onSave: () => void;
  onCancel: () => void;
}

export default function TemplateEditor({ templateId, onSave, onCancel }: TemplateEditorProps) {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  
  // Template data
  const [name, setName] = useState('');
  const [packetType, setPacketType] = useState('NUTRITION');
  const [clientType, setClientType] = useState<string>('');
  const [isDefault, setIsDefault] = useState(false);
  const [sections, setSections] = useState<PacketSection[]>([]);
  const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>([]);
  
  // UI state
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [activeBlock, setActiveBlock] = useState<string | null>(null);

  useEffect(() => {
    if (templateId) {
      fetchTemplate();
    }
  }, [templateId]);

  const fetchTemplate = async () => {
    if (!templateId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/admin/templates/${templateId}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch template');
      }
      
      const template = data.data;
      setName(template.name);
      setPacketType(template.packetType);
      setClientType(template.clientType || '');
      setIsDefault(template.isDefault);
      setSections(template.sections);
      setContentBlocks(template.contentBlocks);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      
      const templateData = {
        name,
        packetType,
        clientType: clientType || null,
        isDefault,
        sections,
        contentBlocks
      };
      
      const url = templateId 
        ? `/api/admin/templates/${templateId}`
        : '/api/admin/templates';
      
      const response = await fetch(url, {
        method: templateId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(templateData)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to save template');
      }
      
      onSave();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save template');
    } finally {
      setSaving(false);
    }
  };

  const addSection = () => {
    const newSection: PacketSection = {
      id: `section-${Date.now()}`,
      title: 'New Section',
      description: '',
      order: sections.length + 1,
      contentBlockIds: []
    };
    setSections([...sections, newSection]);
    setActiveSection(newSection.id);
  };

  const updateSection = (sectionId: string, updates: Partial<PacketSection>) => {
    setSections(sections.map(s => 
      s.id === sectionId ? { ...s, ...updates } : s
    ));
  };

  const deleteSection = (sectionId: string) => {
    setSections(sections.filter(s => s.id !== sectionId));
    if (activeSection === sectionId) {
      setActiveSection(null);
    }
  };

  const addContentBlock = () => {
    const newBlock: ContentBlock = {
      id: `block-${Date.now()}`,
      type: 'text',
      content: '',
      order: contentBlocks.length + 1
    };
    setContentBlocks([...contentBlocks, newBlock]);
    setActiveBlock(newBlock.id);
  };

  const updateContentBlock = (blockId: string, updates: Partial<ContentBlock>) => {
    setContentBlocks(contentBlocks.map(b => 
      b.id === blockId ? { ...b, ...updates } : b
    ));
  };

  const deleteContentBlock = (blockId: string) => {
    setContentBlocks(contentBlocks.filter(b => b.id !== blockId));
    // Remove from sections
    setSections(sections.map(s => ({
      ...s,
      contentBlockIds: s.contentBlockIds.filter(id => id !== blockId)
    })));
    if (activeBlock === blockId) {
      setActiveBlock(null);
    }
  };

  const addBlockToSection = (sectionId: string, blockId: string) => {
    setSections(sections.map(s => 
      s.id === sectionId 
        ? { ...s, contentBlockIds: [...s.contentBlockIds, blockId] }
        : s
    ));
  };

  const removeBlockFromSection = (sectionId: string, blockId: string) => {
    setSections(sections.map(s => 
      s.id === sectionId 
        ? { ...s, contentBlockIds: s.contentBlockIds.filter(id => id !== blockId) }
        : s
    ));
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
          <h2 className="text-2xl font-bold text-gray-900">
            {templateId ? 'Edit Template' : 'Create Template'}
          </h2>
          <p className="text-gray-600 mt-1">
            {templateId ? 'Modify template settings and content' : 'Create a new packet template'}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => setShowPreview(!showPreview)}>
            {showPreview ? 'Hide Preview' : 'Show Preview'}
          </Button>
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save Template'}
          </Button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Template Settings */}
        <div className="lg:col-span-1">
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Template Settings</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Template Name *
                </label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Default Nutrition Template"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Packet Type *
                </label>
                <select
                  value={packetType}
                  onChange={(e) => setPacketType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
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
                  Client Type (Optional)
                </label>
                <select
                  value={clientType}
                  onChange={(e) => setClientType(e.target.value)}
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
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isDefault"
                  checked={isDefault}
                  onChange={(e) => setIsDefault(e.target.checked)}
                  className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                />
                <label htmlFor="isDefault" className="ml-2 block text-sm text-gray-700">
                  Set as default template
                </label>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Placeholder Syntax</h4>
              <div className="text-xs text-gray-600 space-y-1">
                <p><code className="bg-gray-100 px-1 rounded">{'{{client.fullName}}'}</code> - Client name</p>
                <p><code className="bg-gray-100 px-1 rounded">{'{{client.goal}}'}</code> - Client goal</p>
                <p><code className="bg-gray-100 px-1 rounded">{'{{calculated.dailyCalories}}'}</code> - Calculated values</p>
                <p className="mt-2 text-gray-500">Use these in content blocks</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Sections and Content Blocks */}
        <div className="lg:col-span-2 space-y-6">
          {/* Sections */}
          <Card>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Sections</h3>
              <Button size="sm" onClick={addSection}>
                Add Section
              </Button>
            </div>
            
            {sections.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No sections yet. Add a section to get started.</p>
            ) : (
              <div className="space-y-3">
                {sections.sort((a, b) => a.order - b.order).map((section) => (
                  <div
                    key={section.id}
                    className={`border rounded-lg p-4 ${
                      activeSection === section.id ? 'border-teal-500 bg-teal-50' : 'border-gray-200'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <Input
                          value={section.title}
                          onChange={(e) => updateSection(section.id, { title: e.target.value })}
                          placeholder="Section title"
                          className="font-semibold mb-2"
                        />
                        <Input
                          value={section.description || ''}
                          onChange={(e) => updateSection(section.id, { description: e.target.value })}
                          placeholder="Section description (optional)"
                        />
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => setActiveSection(activeSection === section.id ? null : section.id)}
                        >
                          {activeSection === section.id ? 'Collapse' : 'Expand'}
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => deleteSection(section.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                    
                    {activeSection === section.id && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <p className="text-sm font-medium text-gray-700 mb-2">Content Blocks:</p>
                        {section.contentBlockIds.length === 0 ? (
                          <p className="text-sm text-gray-500">No content blocks assigned</p>
                        ) : (
                          <div className="space-y-2">
                            {section.contentBlockIds.map(blockId => {
                              const block = contentBlocks.find(b => b.id === blockId);
                              return block ? (
                                <div key={blockId} className="flex items-center justify-between bg-white p-2 rounded border border-gray-200">
                                  <span className="text-sm">{block.id} ({block.type})</span>
                                  <Button
                                    size="sm"
                                    variant="danger"
                                    onClick={() => removeBlockFromSection(section.id, blockId)}
                                  >
                                    Remove
                                  </Button>
                                </div>
                              ) : null;
                            })}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Content Blocks */}
          <Card>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Content Blocks</h3>
              <Button size="sm" onClick={addContentBlock}>
                Add Content Block
              </Button>
            </div>
            
            {contentBlocks.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No content blocks yet. Add a block to get started.</p>
            ) : (
              <div className="space-y-3">
                {contentBlocks.sort((a, b) => a.order - b.order).map((block) => (
                  <div
                    key={block.id}
                    className={`border rounded-lg p-4 ${
                      activeBlock === block.id ? 'border-teal-500 bg-teal-50' : 'border-gray-200'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-2">
                        <Badge variant="info">{block.id}</Badge>
                        <select
                          value={block.type}
                          onChange={(e) => updateContentBlock(block.id, { type: e.target.value as any })}
                          className="px-2 py-1 border border-gray-300 rounded text-sm"
                        >
                          <option value="text">Text</option>
                          <option value="table">Table</option>
                          <option value="list">List</option>
                          <option value="chart">Chart</option>
                          <option value="image">Image</option>
                          <option value="heading">Heading</option>
                          <option value="divider">Divider</option>
                        </select>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => setActiveBlock(activeBlock === block.id ? null : block.id)}
                        >
                          {activeBlock === block.id ? 'Collapse' : 'Expand'}
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => deleteContentBlock(block.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                    
                    {activeBlock === block.id && (
                      <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Content
                          </label>
                          <textarea
                            value={block.content}
                            onChange={(e) => updateContentBlock(block.id, { content: e.target.value })}
                            placeholder="Enter content (use {{placeholders}} for dynamic data)"
                            rows={6}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 font-mono text-sm"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Data Source (Optional)
                          </label>
                          <Input
                            value={block.dataSource || ''}
                            onChange={(e) => updateContentBlock(block.id, { dataSource: e.target.value })}
                            placeholder="e.g., calculated.macros"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Add to Section
                          </label>
                          <select
                            onChange={(e) => {
                              if (e.target.value) {
                                addBlockToSection(e.target.value, block.id);
                                e.target.value = '';
                              }
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                          >
                            <option value="">Select a section...</option>
                            {sections.map(section => (
                              <option key={section.id} value={section.id}>
                                {section.title}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Preview */}
      {showPreview && (
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Template Preview</h3>
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="prose max-w-none">
              <h1 className="text-2xl font-bold mb-4">{name || 'Untitled Template'}</h1>
              {sections.sort((a, b) => a.order - b.order).map(section => (
                <div key={section.id} className="mb-6">
                  <h2 className="text-xl font-semibold mb-2">{section.title}</h2>
                  {section.description && (
                    <p className="text-gray-600 mb-3">{section.description}</p>
                  )}
                  {section.contentBlockIds.map(blockId => {
                    const block = contentBlocks.find(b => b.id === blockId);
                    return block ? (
                      <div key={blockId} className="mb-4">
                        <div className="bg-white p-4 rounded border border-gray-200">
                          <Badge variant="info" size="sm">{block.type}</Badge>
                          <pre className="mt-2 text-sm whitespace-pre-wrap font-sans">
                            {block.content || '(No content)'}
                          </pre>
                        </div>
                      </div>
                    ) : null;
                  })}
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
