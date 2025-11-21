"use client";

import { useState, useEffect, Suspense } from "react";
import dynamic from "next/dynamic";
import ToolCard from "@/components/tools/ToolCard";
import ToolPanel from "@/components/tools/ToolPanel";
import { getActiveTools } from "@/lib/tools/tool-config";
import { ToolSkeleton } from "@/components/performance/LoadingStates";

// Code-split each tool component for optimal loading
// Each tool is loaded only when opened, reducing initial bundle size
const EnergyProteinCalculator = dynamic(
  () => import("@/components/tools/EnergyProteinCalculator").then(mod => ({ default: mod.EnergyProteinCalculator })),
  { 
    loading: () => <ToolSkeleton />,
    ssr: false // Tools are interactive, no need for SSR
  }
);

const PlateBuilder = dynamic(
  () => import("@/components/tools/PlateBuilder").then(mod => ({ default: mod.PlateBuilder })),
  { 
    loading: () => <ToolSkeleton />,
    ssr: false
  }
);

const HydrationSleepSnapshot = dynamic(
  () => import("@/components/tools/HydrationSleepSnapshot").then(mod => ({ default: mod.HydrationSleepSnapshot })),
  { 
    loading: () => <ToolSkeleton />,
    ssr: false
  }
);

const HeartRateZones = dynamic(
  () => import("@/components/tools/HeartRateZones").then(mod => ({ default: mod.HeartRateZones })),
  { 
    loading: () => <ToolSkeleton />,
    ssr: false
  }
);

const RecoveryCheckIn = dynamic(
  () => import("@/components/tools/RecoveryCheckIn").then(mod => ({ default: mod.RecoveryCheckIn })),
  { 
    loading: () => <ToolSkeleton />,
    ssr: false
  }
);

const YouthCorner = dynamic(
  () => import("@/components/tools/YouthCorner").then(mod => ({ default: mod.YouthCorner })),
  { 
    loading: () => <ToolSkeleton />,
    ssr: false
  }
);

// Map tool IDs to their dynamic components
const toolComponents: Record<string, React.ComponentType> = {
  'energy-protein': EnergyProteinCalculator,
  'plate-builder': PlateBuilder,
  'hydration-sleep': HydrationSleepSnapshot,
  'heart-rate-zones': HeartRateZones,
  'recovery-checkin': RecoveryCheckIn,
  'youth-corner': YouthCorner,
};

export default function ToolsPage() {
  const [activeToolId, setActiveToolId] = useState<string | null>(null);
  const [prefetchedTools, setPrefetchedTools] = useState<Set<string>>(new Set());
  const tools = getActiveTools();

  const handleOpenTool = (toolId: string) => {
    setActiveToolId(toolId);
  };

  const handleCloseTool = () => {
    setActiveToolId(null);
  };

  // Prefetch tool on hover for instant loading
  const handleToolHover = (toolId: string) => {
    if (!prefetchedTools.has(toolId)) {
      // Preload the component
      const component = toolComponents[toolId];
      if (component && 'preload' in component) {
        (component as any).preload();
        setPrefetchedTools(prev => new Set(prev).add(toolId));
      }
    }
  };

  // Prefetch visible tools when page loads (after idle)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const prefetchVisibleTools = () => {
      // Prefetch first 3 tools (likely visible on most screens)
      const toolsToPrefetch = tools.slice(0, 3);
      
      toolsToPrefetch.forEach((tool) => {
        if (!prefetchedTools.has(tool.id)) {
          const component = toolComponents[tool.id];
          if (component && 'preload' in component) {
            (component as any).preload();
            setPrefetchedTools(prev => new Set(prev).add(tool.id));
          }
        }
      });
    };

    // Use requestIdleCallback to prefetch during idle time
    if ('requestIdleCallback' in window) {
      const idleCallback = window.requestIdleCallback(prefetchVisibleTools, { timeout: 2000 });
      return () => window.cancelIdleCallback(idleCallback);
    } else {
      // Fallback for browsers without requestIdleCallback
      const timeout = setTimeout(prefetchVisibleTools, 1000);
      return () => clearTimeout(timeout);
    }
  }, [tools, prefetchedTools]);

  const activeTool = tools.find((tool) => tool.id === activeToolId);
  const ActiveToolComponent = activeToolId ? toolComponents[activeToolId] : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-afya-primary/10 via-afya-secondary/10 to-white py-12 sm:py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 leading-tight">
              Health Tools
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 leading-relaxed px-2">
              Simple tools to understand your health better. No judgment, just
              education.
            </p>
          </div>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="py-8 sm:py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {tools.map((tool) => (
              <ToolCard
                key={tool.id}
                id={tool.id}
                title={tool.title}
                description={tool.description}
                icon={tool.icon}
                gradient={tool.gradient}
                onOpen={() => handleOpenTool(tool.id)}
                onHover={() => handleToolHover(tool.id)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Educational Note */}
      <section className="py-8 sm:py-12 bg-gradient-to-br from-afya-secondary/5 to-afya-primary/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-700 text-base sm:text-lg mb-6 leading-relaxed">
            These tools provide general guidance based on common formulas and
            recommendations. They're meant to educate and inspire, not replace
            personalized coaching.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-md sm:max-w-none mx-auto">
            <a
              href="/programs"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg font-medium text-white bg-gradient-to-r from-afya-primary to-afya-secondary hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-afya-primary min-h-[44px] touch-target tap-highlight-none text-sm sm:text-base"
            >
              Explore Programs
            </a>
            <a
              href="/get-started"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg font-medium text-afya-primary bg-white border-2 border-afya-primary hover:bg-afya-primary hover:text-white active:scale-95 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-afya-primary min-h-[44px] touch-target tap-highlight-none text-sm sm:text-base"
            >
              Get Started
            </a>
          </div>
        </div>
      </section>

      {/* Additional Resources */}
      <section className="py-8 sm:py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 text-center">
            Explore More Resources
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            <a
              href="/about"
              className="group p-6 rounded-lg border-2 border-gray-200 hover:border-afya-primary hover:shadow-md transition-all duration-200"
            >
              <div className="text-3xl mb-3" role="img" aria-label="Information">ℹ️</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-afya-primary transition-colors">
                About AFYA
              </h3>
              <p className="text-sm text-gray-600">
                Learn about our mission and approach to health and wellness
              </p>
            </a>
            <a
              href="/success-stories"
              className="group p-6 rounded-lg border-2 border-gray-200 hover:border-afya-primary hover:shadow-md transition-all duration-200"
            >
              <div className="text-3xl mb-3" role="img" aria-label="Star">⭐</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-afya-primary transition-colors">
                Success Stories
              </h3>
              <p className="text-sm text-gray-600">
                Read inspiring stories from our community members
              </p>
            </a>
            <a
              href="/faq"
              className="group p-6 rounded-lg border-2 border-gray-200 hover:border-afya-primary hover:shadow-md transition-all duration-200"
            >
              <div className="text-3xl mb-3" role="img" aria-label="Question mark">❓</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-afya-primary transition-colors">
                FAQ
              </h3>
              <p className="text-sm text-gray-600">
                Find answers to common questions about our programs
              </p>
            </a>
          </div>
        </div>
      </section>

      {/* Tool Panel Modal */}
      <ToolPanel
        isOpen={!!activeToolId}
        onClose={handleCloseTool}
        title={activeTool?.title}
      >
        {activeTool && ActiveToolComponent && (
          <Suspense fallback={<ToolSkeleton />}>
            <ActiveToolComponent />
          </Suspense>
        )}
      </ToolPanel>
    </div>
  );
}
