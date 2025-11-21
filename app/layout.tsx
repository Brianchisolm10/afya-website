import type { Metadata } from "next";
import "./globals.css";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { ToastProvider } from "@/components/Toast";
import { getCriticalCSS } from "@/lib/performance/critical-css";
import { getPreloadFontLinks, getOptimizedFontCSS } from "@/lib/performance/font-optimization";

export const metadata: Metadata = {
  title: "AFYA - Movement for Everyone",
  description: "Personalized health and fitness guidance",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Inline critical CSS for faster FCP/LCP
  const criticalCSS = getCriticalCSS();
  
  // Get optimized font CSS
  const fontCSS = getOptimizedFontCSS();
  
  // Get preload links for critical fonts
  const preloadFonts = getPreloadFontLinks();
  
  return (
    <html lang="en">
      <head>
        {/* Preload critical fonts */}
        {preloadFonts.map((font, index) => (
          <link
            key={index}
            rel="preload"
            href={font.href}
            as={font.as}
            type={font.type}
            crossOrigin={font.crossOrigin}
          />
        ))}
        
        {/* Inline critical CSS for above-the-fold content */}
        <style
          dangerouslySetInnerHTML={{ __html: criticalCSS }}
          data-critical-css="true"
        />
        
        {/* Inline optimized font CSS with font-display: swap */}
        <style
          dangerouslySetInnerHTML={{ __html: fontCSS }}
          data-font-css="true"
        />
      </head>
      <body>
        <ErrorBoundary>
          <ToastProvider>
            {children}
          </ToastProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
