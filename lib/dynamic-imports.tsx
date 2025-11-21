/**
 * Dynamic import utilities for code splitting
 * 
 * This module provides helpers for lazy loading components
 * to improve initial page load performance.
 */

import dynamic from 'next/dynamic';
import { ComponentType } from 'react';

/**
 * Loading component displayed while dynamic component loads
 */
export const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#40E0D0]"></div>
  </div>
);

/**
 * Loading component for modal/dialog components
 */
export const ModalLoadingPlaceholder = () => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white rounded-2xl shadow-2xl p-8">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#40E0D0] mx-auto"></div>
    </div>
  </div>
);

/**
 * Create a dynamically imported component with custom loading state
 * 
 * @param importFn - Function that returns the dynamic import
 * @param options - Dynamic import options
 * @returns Dynamically loaded component
 */
export function createDynamicComponent<P = {}>(
  importFn: () => Promise<{ default: ComponentType<P> }>,
  options: {
    loading?: ComponentType;
    ssr?: boolean;
  } = {}
) {
  return dynamic(importFn, {
    loading: options.loading || LoadingSpinner,
    ssr: options.ssr ?? true,
  });
}

/**
 * Dynamically imported modal components
 * These are loaded only when needed to reduce initial bundle size
 */

// Donation Allocation Modal
export const DynamicDonationAllocationModal = createDynamicComponent(
  () => import('@/components/shop/DonationAllocationModal'),
  {
    loading: ModalLoadingPlaceholder,
    ssr: false, // Modals don't need SSR
  }
);

// Create User Modal
export const DynamicCreateUserModal = createDynamicComponent(
  () => import('@/components/admin/CreateUserModal'),
  {
    loading: ModalLoadingPlaceholder,
    ssr: false,
  }
);

// Role Change Dialog
export const DynamicRoleChangeDialog = createDynamicComponent(
  () => import('@/components/admin/RoleChangeDialog'),
  {
    loading: ModalLoadingPlaceholder,
    ssr: false,
  }
);

// Status Change Dialog
export const DynamicStatusChangeDialog = createDynamicComponent(
  () => import('@/components/admin/StatusChangeDialog'),
  {
    loading: ModalLoadingPlaceholder,
    ssr: false,
  }
);

/**
 * Dynamically imported heavy components
 * These components are loaded lazily to improve initial page load
 */

// Testimonial Carousel
export const DynamicTestimonialCarousel = createDynamicComponent(
  () => import('@/components/testimonials/TestimonialCarousel').then(mod => ({ default: mod.TestimonialCarousel })),
  {
    loading: LoadingSpinner,
    ssr: false, // Lazy load below fold
  }
);

// Home Page - Impact Stats Section (lazy loaded)
export const DynamicImpactStatsSection = createDynamicComponent(
  () => import('@/components/home/ImpactStatsSection').then(mod => ({ default: mod.ImpactStatsSection })),
  {
    loading: LoadingSpinner,
    ssr: false, // Lazy load below fold
  }
);

// Analytics Dashboard
export const DynamicAnalyticsDashboard = createDynamicComponent(
  () => import('@/components/admin/AnalyticsDashboard'),
  {
    loading: LoadingSpinner,
    ssr: false, // Admin components don't need SSR
  }
);

// Product Editor
export const DynamicProductEditor = createDynamicComponent(
  () => import('@/components/admin/ProductEditor'),
  {
    loading: LoadingSpinner,
    ssr: false,
  }
);

// Template Editor
export const DynamicTemplateEditor = createDynamicComponent(
  () => import('@/components/admin/TemplateEditor'),
  {
    loading: LoadingSpinner,
    ssr: false,
  }
);

// Packet Viewer
export const DynamicPacketViewer = createDynamicComponent(
  () => import('@/components/dashboard/PacketViewer'),
  {
    loading: LoadingSpinner,
    ssr: false,
  }
);

/**
 * Preload a dynamic component
 * Useful for preloading components that will likely be needed soon
 * 
 * @param component - Dynamic component to preload
 */
export function preloadComponent(component: any): void {
  if (component && typeof component.preload === 'function') {
    component.preload();
  }
}

/**
 * Preload multiple components
 * 
 * @param components - Array of dynamic components to preload
 */
export function preloadComponents(components: any[]): void {
  components.forEach(preloadComponent);
}

/**
 * Additional lazy-loaded components for performance optimization
 */

// Shop components
export const DynamicProductGrid = createDynamicComponent(
  () => import('@/components/shop/ProductGrid'),
  {
    loading: LoadingSpinner,
    ssr: true,
  }
);

export const DynamicCheckoutForm = createDynamicComponent(
  () => import('@/components/shop/CheckoutForm'),
  {
    loading: LoadingSpinner,
    ssr: false,
  }
);

// Impact components
export const DynamicDonationForm = createDynamicComponent(
  () => import('@/components/impact/DonationForm'),
  {
    loading: LoadingSpinner,
    ssr: false,
  }
);

export const DynamicGearDriveForm = createDynamicComponent(
  () => import('@/components/impact/GearDriveForm'),
  {
    loading: LoadingSpinner,
    ssr: false,
  }
);

export const DynamicFoundationCard = createDynamicComponent(
  () => import('@/components/impact/FoundationCard'),
  {
    loading: LoadingSpinner,
    ssr: true,
  }
);

// Admin components
export const DynamicClientTable = createDynamicComponent(
  () => import('@/components/admin/ClientTable'),
  {
    loading: LoadingSpinner,
    ssr: false,
  }
);

export const DynamicLeadsTable = createDynamicComponent(
  () => import('@/components/admin/LeadsTable'),
  {
    loading: LoadingSpinner,
    ssr: false,
  }
);

export const DynamicUserManagementTable = createDynamicComponent(
  () => import('@/components/admin/UserManagementTable'),
  {
    loading: LoadingSpinner,
    ssr: false,
  }
);

export const DynamicPerformanceDashboard = createDynamicComponent(
  () => import('@/components/admin/PerformanceDashboard'),
  {
    loading: LoadingSpinner,
    ssr: false,
  }
);

export const DynamicContentManagementPage = createDynamicComponent(
  () => import('@/components/admin/ContentManagementPage'),
  {
    loading: LoadingSpinner,
    ssr: false,
  }
);

export const DynamicProductManagementPage = createDynamicComponent(
  () => import('@/components/admin/ProductManagementPage'),
  {
    loading: LoadingSpinner,
    ssr: false,
  }
);

export const DynamicTemplateManager = createDynamicComponent(
  () => import('@/components/admin/TemplateManager'),
  {
    loading: LoadingSpinner,
    ssr: false,
  }
);

export const DynamicAdminPacketManager = createDynamicComponent(
  () => import('@/components/admin/AdminPacketManager'),
  {
    loading: LoadingSpinner,
    ssr: false,
  }
);

// Dashboard components
export const DynamicPacketList = createDynamicComponent(
  () => import('@/components/dashboard/PacketList'),
  {
    loading: LoadingSpinner,
    ssr: false,
  }
);

// Settings components
export const DynamicProfileSettingsForm = createDynamicComponent(
  () => import('@/components/settings/ProfileSettingsForm'),
  {
    loading: LoadingSpinner,
    ssr: false,
  }
);

export const DynamicNotificationPreferences = createDynamicComponent(
  () => import('@/components/settings/NotificationPreferences'),
  {
    loading: LoadingSpinner,
    ssr: false,
  }
);

// Intake components
export const DynamicIntakeForm = createDynamicComponent(
  () => import('@/components/forms/IntakeForm'),
  {
    loading: LoadingSpinner,
    ssr: false,
  }
);

export const DynamicDynamicIntakeForm = createDynamicComponent(
  () => import('@/components/intake/DynamicIntakeForm'),
  {
    loading: LoadingSpinner,
    ssr: false,
  }
);

export const DynamicPathSelectionScreen = createDynamicComponent(
  () => import('@/components/intake/PathSelectionScreen'),
  {
    loading: LoadingSpinner,
    ssr: false,
  }
);

// Discovery components
export const DynamicDiscoveryForm = createDynamicComponent(
  () => import('@/components/discovery/DiscoveryForm'),
  {
    loading: LoadingSpinner,
    ssr: false,
  }
);

// Layout components (lazy loaded)
export const DynamicFooter = createDynamicComponent(
  () => import('@/components/layout/Footer'),
  {
    loading: () => <div className="h-64" />, // Placeholder to prevent layout shift
    ssr: true,
  }
);

// Notification components
export const DynamicNotificationBell = createDynamicComponent(
  () => import('@/components/notifications/NotificationBell'),
  {
    loading: () => <div className="w-10 h-10" />,
    ssr: false,
  }
);
