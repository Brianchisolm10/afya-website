'use client';

import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';

type Lead = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  primaryGoal: string;
  goalDescription: string | null;
  startTimeframe: string;
  referralSource: string | null;
  status: string;
  createdAt: Date;
  notes: Array<{
    id: string;
    content: string;
    createdAt: Date;
  }>;
};

type Props = {
  leads: Lead[];
};

const statusColors = {
  PENDING_CALL: 'bg-yellow-100 text-yellow-800',
  CALL_SCHEDULED: 'bg-blue-100 text-blue-800',
  CALL_COMPLETED: 'bg-purple-100 text-purple-800',
  CONVERTED: 'bg-green-100 text-green-800',
  NOT_INTERESTED: 'bg-gray-100 text-gray-800',
  FOLLOW_UP: 'bg-orange-100 text-orange-800',
};

const goalLabels: Record<string, string> = {
  nutrition: 'Nutrition',
  training: 'Training',
  youth: 'Youth Program',
  general: 'General Wellness',
  other: 'Other',
};

const timeframeLabels: Record<string, string> = {
  asap: 'ASAP',
  within_month: 'Within a month',
  '1_3_months': '1-3 months',
  exploring: 'Just exploring',
};

export default function LeadsTable({ leads }: Props) {
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  return (
    <>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Goal
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Timeframe
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Submitted
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {leads.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                  No leads yet
                </td>
              </tr>
            ) : (
              leads.map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {lead.fullName}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{lead.email}</div>
                    <div className="text-sm text-gray-500">{lead.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {goalLabels[lead.primaryGoal] || lead.primaryGoal}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {timeframeLabels[lead.startTimeframe] || lead.startTimeframe}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        statusColors[lead.status as keyof typeof statusColors] ||
                        'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {lead.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDistanceToNow(new Date(lead.createdAt), {
                      addSuffix: true,
                    })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => setSelectedLead(lead)}
                      className="text-turquoise-600 hover:text-turquoise-900"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Lead Detail Modal */}
      {selectedLead && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedLead.fullName}
                </h2>
                <button
                  onClick={() => setSelectedLead(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Contact Information</h3>
                  <div className="mt-2 space-y-1">
                    <p className="text-sm text-gray-900">
                      <span className="font-medium">Email:</span> {selectedLead.email}
                    </p>
                    <p className="text-sm text-gray-900">
                      <span className="font-medium">Phone:</span> {selectedLead.phone}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Goals & Timeline</h3>
                  <div className="mt-2 space-y-1">
                    <p className="text-sm text-gray-900">
                      <span className="font-medium">Primary Goal:</span>{' '}
                      {goalLabels[selectedLead.primaryGoal] || selectedLead.primaryGoal}
                    </p>
                    {selectedLead.goalDescription && (
                      <p className="text-sm text-gray-900">
                        <span className="font-medium">Description:</span>{' '}
                        {selectedLead.goalDescription}
                      </p>
                    )}
                    <p className="text-sm text-gray-900">
                      <span className="font-medium">Start Timeframe:</span>{' '}
                      {timeframeLabels[selectedLead.startTimeframe] ||
                        selectedLead.startTimeframe}
                    </p>
                  </div>
                </div>

                {selectedLead.referralSource && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Referral Source</h3>
                    <p className="mt-2 text-sm text-gray-900">
                      {selectedLead.referralSource}
                    </p>
                  </div>
                )}

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Status</h3>
                  <p className="mt-2">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        statusColors[selectedLead.status as keyof typeof statusColors] ||
                        'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {selectedLead.status.replace(/_/g, ' ')}
                    </span>
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Submitted</h3>
                  <p className="mt-2 text-sm text-gray-900">
                    {new Date(selectedLead.createdAt).toLocaleString()}
                  </p>
                </div>

                {selectedLead.notes.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Latest Note</h3>
                    <div className="mt-2 bg-gray-50 rounded p-3">
                      <p className="text-sm text-gray-900">
                        {selectedLead.notes[0].content}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatDistanceToNow(new Date(selectedLead.notes[0].createdAt), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setSelectedLead(null)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
