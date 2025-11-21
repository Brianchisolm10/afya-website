"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import { BackButton } from "@/components/ui";
import { reportWebVitals } from "@/lib/monitoring/performance";
import { DeferredCSS } from "@/components/performance/DeferredCSS";
import { FontLoader } from "@/components/performance/FontLoader";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  // Track Web Vitals on all public pages
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Dynamically import web-vitals to avoid SSR issues
      import('web-vitals').then(({ onCLS, onFID, onFCP, onLCP, onTTFB }) => {
        onCLS((metric) => reportWebVitals('cls', metric.value, pathname || '/'));
        onFID((metric) => reportWebVitals('fid', metric.value, pathname || '/'));
        onFCP((metric) => reportWebVitals('fcp', metric.value, pathname || '/'));
        onLCP((metric) => reportWebVitals('lcp', metric.value, pathname || '/'));
        onTTFB((metric) => reportWebVitals('ttfb', metric.value, pathname || '/'));
      }).catch((error) => {
        console.error('Failed to load web-vitals:', error);
      });
    }
  }, [pathname]);
  
  // Only show back button on intake-related pages
  const showBackButton = pathname?.startsWith('/intake') || pathname?.startsWith('/get-started');

  return (
    <div className="min-h-screen flex flex-col">
      {/* Deferred CSS Loading */}
      <DeferredCSS />
      
      {/* Font Loading */}
      <FontLoader />
      
      {/* Navigation */}
      <Navigation />

      {/* Back Button - Shows only on intake and get-started pages */}
      {showBackButton && (
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <BackButton />
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-grow">{children}</main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
