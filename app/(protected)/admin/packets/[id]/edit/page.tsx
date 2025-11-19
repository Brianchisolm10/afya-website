/**
 * Packet Editor Page
 * 
 * Allows admins and coaches to edit packet content before sending to clients
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui';

interface PacketEditorProps {
  params: {
    id: string;
  };
}

export default function PacketEditorPage({ params }: PacketEditorProps) {
  const router = useRouter();
  const [packet, setPacket] = useState<any>(null);
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  useEffect(() => {
    fetchPacket();
  }, [params.id]);

  const fetchPacket = async () => {
    try {
      const response = await fetch(`/api/packets/${params.id}`);
      if (!response.ok) throw new Error('Failed to fetch packet');
      
      const data = await response.json();
      setPacket(data);
      setContent(data.content || {});
    } catch (error) {
      console.error('Error fetching packet:', error);
      alert('Failed to load packet');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (status: 'DRAFT' | 'APPROVED') => {
    setSaving(true);
    try {
      const response = await fetch(`/api/packets/${params.id}/edit`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          status,
        }),
      });

      if (!response.ok) throw new Error('Failed to save packet');

      alert(status === 'DRAFT' ? 'Draft saved!' : 'Packet approved!');
      
      if (status === 'APPROVED') {
        router.push(`/admin/packets/${params.id}`);
      }
    } catch (error) {
      console.error('Error saving packet:', error);
      alert('Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  const handleSendToClient = async () => {
    if (!confirm('Send this packet to the client? They will be notified via email.')) {
      return;
    }

    setSaving(true);
    try {
      const response = await fetch(`/api/packets/${params.id}/send`, {
        method: 'POST',
      });

      if (!response.ok) throw new Error('Failed to send packet');

      alert('Packet sent to client!');
      router.push(`/admin/packets/${params.id}`);
    } catch (error) {
      console.error('Error sending packet:', error);
      alert('Failed to send packet');
    } finally {
      setSaving(false);
    }
  };

  const updateSection = (sectionKey: string, value: any) => {
    setContent({
      ...content,
      [sectionKey]: value,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-afya-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading packet...</p>
        </div>
      </div>
    );
  }

  if (!packet) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Packet not found</p>
          <Button onClick={() => router.back()} className="mt-4">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const sections = Object.keys(content).filter(key => key !== 'metadata');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Edit Packet
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                {packet.type} • {packet.client?.fullName || 'Unknown Client'}
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                variant="secondary"
                onClick={() => router.back()}
                disabled={saving}
              >
                Cancel
              </Button>
              
              <Button
                variant="secondary"
                onClick={() => handleSave('DRAFT')}
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save Draft'}
              </Button>
              
              <Button
                variant="primary"
                onClick={() => handleSave('APPROVED')}
                disabled={saving}
              >
                Approve
              </Button>
              
              <Button
                className="bg-green-600 hover:bg-green-700 text-white"
                onClick={handleSendToClient}
                disabled={saving || packet.status !== 'APPROVED'}
              >
                Send to Client
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar - Section Navigation */}
          <div className="col-span-3">
            <div className="bg-white rounded-lg shadow-sm p-4 sticky top-24">
              <h3 className="font-semibold text-gray-900 mb-3">Sections</h3>
              <nav className="space-y-1">
                {sections.map((section) => (
                  <button
                    key={section}
                    onClick={() => setActiveSection(section)}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                      activeSection === section
                        ? 'bg-afya-primary text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {formatSectionName(section)}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Editor Area */}
          <div className="col-span-9">
            <div className="bg-white rounded-lg shadow-sm p-6">
              {activeSection ? (
                <SectionEditor
                  sectionKey={activeSection}
                  sectionData={content[activeSection]}
                  onUpdate={(value) => updateSection(activeSection, value)}
                />
              ) : (
                <div className="text-center py-12 text-gray-500">
                  Select a section from the sidebar to start editing
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Section Editor Component
 */
function SectionEditor({
  sectionKey,
  sectionData,
  onUpdate,
}: {
  sectionKey: string;
  sectionData: any;
  onUpdate: (value: any) => void;
}) {
  const [editedData, setEditedData] = useState(JSON.stringify(sectionData, null, 2));

  const handleSave = () => {
    try {
      const parsed = JSON.parse(editedData);
      onUpdate(parsed);
      alert('Section updated!');
    } catch (error) {
      alert('Invalid JSON format. Please check your syntax.');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">
          {formatSectionName(sectionKey)}
        </h2>
        <Button onClick={handleSave} size="sm">
          Update Section
        </Button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Section Content (JSON)
          </label>
          <textarea
            value={editedData}
            onChange={(e) => setEditedData(e.target.value)}
            className="w-full h-96 px-3 py-2 border border-gray-300 rounded-md font-mono text-sm"
            placeholder="Edit section content..."
          />
          <p className="mt-2 text-sm text-gray-500">
            Edit the JSON content above. Make sure to maintain valid JSON format.
          </p>
        </div>

        {/* Preview */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Preview</h3>
          <div className="bg-gray-50 rounded-md p-4 border border-gray-200">
            <pre className="text-sm text-gray-700 whitespace-pre-wrap">
              {JSON.stringify(sectionData, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Format section name for display
 */
function formatSectionName(key: string): string {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
}
