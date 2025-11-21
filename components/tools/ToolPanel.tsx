"use client";

import { useEffect, useRef } from "react";
import { X, ArrowLeft } from "lucide-react";

interface ToolPanelProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  illustration?: React.ComponentType<{ className?: string }>;
}

export default function ToolPanel({
  isOpen,
  onClose,
  children,
  title,
  illustration: Illustration,
}: ToolPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Handle ESC key to close
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";
      
      // Focus the close button when panel opens
      setTimeout(() => {
        closeButtonRef.current?.focus();
      }, 100);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  // Focus trap
  useEffect(() => {
    if (!isOpen || !panelRef.current) return;

    const panel = panelRef.current;
    const focusableElements = panel.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[
      focusableElements.length - 1
    ] as HTMLElement;

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    panel.addEventListener("keydown", handleTab as any);
    return () => panel.removeEventListener("keydown", handleTab as any);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 animate-fadeIn will-change-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel - Full screen on mobile, modal on desktop */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "tool-panel-title" : undefined}
        className="fixed inset-0 z-50 overflow-y-auto animate-slideUp tool-panel-optimized"
      >
        {/* Mobile: Full screen, Desktop: Centered modal */}
        <div className="min-h-screen md:px-4 md:py-8 flex items-stretch md:items-center justify-center">
          <div className="bg-white md:rounded-2xl shadow-2xl w-full max-w-4xl h-full md:h-auto md:max-h-[90vh] overflow-y-auto flex flex-col">
            {/* Header - Sticky on mobile for better UX */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between z-10 md:rounded-t-2xl flex-shrink-0">
              <button
                onClick={onClose}
                className="flex items-center gap-2 text-gray-600 hover:text-afya-primary transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-afya-primary rounded-lg px-2 sm:px-3 py-2 min-h-[44px] touch-target tap-highlight-none"
                aria-label="Back to tools"
              >
                <ArrowLeft className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
                <span className="font-medium text-sm sm:text-base">Back to Tools</span>
              </button>

              <button
                ref={closeButtonRef}
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-afya-primary min-h-[44px] min-w-[44px] flex items-center justify-center touch-target tap-highlight-none"
                aria-label="Close tool panel"
              >
                <X className="w-6 h-6" aria-hidden="true" />
              </button>
            </div>

            {/* Title (if provided) */}
            {title && (
              <div className="px-4 sm:px-6 pt-4 sm:pt-6 pb-3 sm:pb-4 border-b border-gray-100 flex-shrink-0">
                <div className="flex items-center gap-4">
                  {Illustration && (
                    <div className="hidden sm:block flex-shrink-0">
                      <Illustration className="w-16 h-16" />
                    </div>
                  )}
                  <h2
                    id="tool-panel-title"
                    className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900"
                  >
                    {title}
                  </h2>
                </div>
              </div>
            )}

            {/* Content - Scrollable area */}
            <div className="px-4 sm:px-6 py-4 sm:py-6 flex-1 overflow-y-auto">
              {children}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
