'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Link from 'next/link';

function BookCallContent() {
  const searchParams = useSearchParams();
  const leadId = searchParams.get('lead');

  return (
    <div className="min-h-screen bg-gradient-to-br from-turquoise-50 via-white to-lavender-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-turquoise-100 rounded-full mb-4">
              <svg
                className="w-8 h-8 text-turquoise-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Thank You!
            </h1>
            <p className="text-lg text-gray-600">
              We've received your information and are excited to connect with you.
            </p>
          </div>

          <div className="bg-turquoise-50 rounded-xl p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              What's Next?
            </h2>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <svg
                  className="w-6 h-6 text-turquoise-600 mr-3 flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>
                  Check your email for a confirmation message with next steps
                </span>
              </li>
              <li className="flex items-start">
                <svg
                  className="w-6 h-6 text-turquoise-600 mr-3 flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>
                  A member of our team will reach out within 24 hours to schedule your discovery call
                </span>
              </li>
              <li className="flex items-start">
                <svg
                  className="w-6 h-6 text-turquoise-600 mr-3 flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>
                  In the meantime, feel free to explore our programs and resources
                </span>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <Link
              href="/programs"
              className="block w-full bg-turquoise-600 hover:bg-turquoise-700 text-white font-semibold py-3 px-6 rounded-lg text-center transition-colors"
            >
              Explore Our Programs
            </Link>
            <Link
              href="/tools"
              className="block w-full bg-white hover:bg-gray-50 text-turquoise-600 font-semibold py-3 px-6 rounded-lg text-center border-2 border-turquoise-600 transition-colors"
            >
              Try Our Free Health Tools
            </Link>
            <Link
              href="/"
              className="block w-full text-center text-gray-600 hover:text-gray-900 py-2 transition-colors"
            >
              Return to Home
            </Link>
          </div>

          {leadId && (
            <p className="text-xs text-gray-400 text-center mt-8">
              Reference ID: {leadId}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function BookCallPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-gray-600">Loading...</div>
        </div>
      }
    >
      <BookCallContent />
    </Suspense>
  );
}
