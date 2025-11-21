'use client';

import { useState, useEffect } from 'react';
import Button from '@/components/ui/Button';
import { ProgramEditor } from './ProgramEditor';
import { ImpactSectionEditor } from './ImpactSectionEditor';
import { Badge } from '@/components/ui/Badge';

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

export function ContentManagementPage() {
  const [activeTab, setActiveTab] = useState<'programs' | 'impact'>('programs');
  const [programs, setPrograms] = useState<Program[]>([]);
  const [impactSections, setImpactSections] = useState<ImpactSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);
  const [editingImpact, setEditingImpact] = useState<ImpactSection | null>(null);
  const [showProgramEditor, setShowProgramEditor] = useState(false);
  const [showImpactEditor, setShowImpactEditor] = useState(false);

  useEffect(() => {
    loadContent();
  }, []);

  async function loadContent() {
    try {
      setLoading(true);
      const [programsRes, impactRes] = await Promise.all([
        fetch('/api/admin/content/programs'),
        fetch('/api/admin/content/impact')
      ]);

      if (programsRes.ok) {
        const data = await programsRes.json();
        setPrograms(data.programs || []);
      }

      if (impactRes.ok) {
        const data = await impactRes.json();
        setImpactSections(data.sections || []);
      }
    } catch (err) {
      console.error('Error loading content:', err);
    } finally {
      setLoading(false);
    }
  }

  function handleCreateProgram() {
    setEditingProgram(null);
    setShowProgramEditor(true);
  }

  function handleEditProgram(program: Program) {
    setEditingProgram(program);
    setShowProgramEditor(true);
  }

  function handleCreateImpact() {
    setEditingImpact(null);
    setShowImpactEditor(true);
  }

  function handleEditImpact(section: ImpactSection) {
    setEditingImpact(section);
    setShowImpactEditor(true);
  }

  async function handleDeleteProgram(id: string) {
    if (!confirm('Are you sure you want to delete this program?')) return;

    try {
      const response = await fetch(`/api/admin/content/programs/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        await loadContent();
      }
    } catch (err) {
      alert('Failed to delete program');
    }
  }

  async function handleDeleteImpact(id: string) {
    if (!confirm('Are you sure you want to delete this impact section?')) return;

    try {
      const response = await fetch(`/api/admin/content/impact/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        await loadContent();
      }
    } catch (err) {
      alert('Failed to delete impact section');
    }
  }

  function handleEditorClose() {
    setShowProgramEditor(false);
    setShowImpactEditor(false);
    setEditingProgram(null);
    setEditingImpact(null);
    loadContent();
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-afya-turquoise mx-auto mb-4"></div>
          <p className="text-gray-600">Loading content...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Content Management</h1>
        <p className="text-gray-600 mt-2">
          Manage programs, impact sections, and website content
        </p>
        
        {/* Navigation back to admin */}
        <div className="mt-4">
          <a
            href="/admin"
            className="text-afya-turquoise hover:text-afya-turquoise-dark"
          >
            ← Back to Admin Panel
          </a>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex gap-8">
          <button
            onClick={() => setActiveTab('programs')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'programs'
                ? 'border-afya-turquoise text-afya-turquoise'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Programs ({programs.length})
          </button>
          <button
            onClick={() => setActiveTab('impact')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'impact'
                ? 'border-afya-turquoise text-afya-turquoise'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Impact Sections ({impactSections.length})
          </button>
        </nav>
      </div>

      {/* Programs Tab */}
      {activeTab === 'programs' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Programs</h2>
            <Button onClick={handleCreateProgram} variant="primary">
              + Add Program
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {programs.map((program) => (
              <div
                key={program.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="text-4xl">{program.icon}</div>
                  <div className="flex gap-2">
                    {program.isActive ? (
                      <Badge variant="success">Active</Badge>
                    ) : (
                      <Badge variant="secondary">Inactive</Badge>
                    )}
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {program.title}
                </h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                  {program.description}
                </p>
                <div className="text-xs text-gray-500 mb-4">
                  Client Type: {program.clientType}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditProgram(program)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteProgram(program.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {programs.length === 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <p className="text-gray-600">No programs yet. Add your first program to get started.</p>
            </div>
          )}
        </div>
      )}

      {/* Impact Tab */}
      {activeTab === 'impact' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Impact Sections</h2>
            <Button onClick={handleCreateImpact} variant="primary">
              + Add Impact Section
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {impactSections.map((section) => (
              <div
                key={section.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="text-4xl">{section.icon}</div>
                  <div className="flex gap-2">
                    {section.isActive ? (
                      <Badge variant="success">Active</Badge>
                    ) : (
                      <Badge variant="secondary">Inactive</Badge>
                    )}
                    {section.comingSoon && (
                      <Badge variant="secondary">Coming Soon</Badge>
                    )}
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {section.title}
                </h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                  {section.description}
                </p>
                {section.ctaLabel && (
                  <div className="text-xs text-gray-500 mb-4">
                    CTA: {section.ctaLabel} → {section.ctaHref}
                  </div>
                )}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditImpact(section)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteImpact(section.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {impactSections.length === 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <p className="text-gray-600">No impact sections yet. Add your first section to get started.</p>
            </div>
          )}
        </div>
      )}

      {/* Editors */}
      {showProgramEditor && (
        <ProgramEditor
          program={editingProgram}
          onClose={handleEditorClose}
        />
      )}

      {showImpactEditor && (
        <ImpactSectionEditor
          section={editingImpact}
          onClose={handleEditorClose}
        />
      )}
    </div>
  );
}
