/**
 * Route-Based Code Splitting Configuration
 * 
 * Defines code splitting strategies for each route to optimize
 * bundle sizes and improve page load performance
 */

import { ComponentType } from 'react';
import { dynamicImport, clientOnlyImport } from './code-splitting';

/**
 * Route configuration for code splitting
 */
export interface RouteConfig {
  path: string;
  criticalComponents: string[];
  lazyComponents: string[];
  preloadRoutes?: string[];
  maxChunkSize?: number;
}

/**
 * Route configurations for the application
 */
export const routeConfigs: RouteConfig[] = [
  {
    path: '/',
    criticalComponents: ['HeroSection', 'Navigation'],
    lazyComponents: ['TestimonialCarousel', 'ImpactStatsSection', 'Footer'],
    preloadRoutes: ['/programs', '/tools', '/shop'],
    maxChunkSize: 150000, // 150KB
  },
  {
    path: '/programs',
    criticalComponents: ['ProgramCard', 'Navigation'],
    lazyComponents: ['ProgramDetails', 'Footer'],
    preloadRoutes: ['/tools', '/shop'],
    maxChunkSize: 120000, // 120KB
  },
  {
    path: '/tools',
    criticalComponents: ['ToolCard', 'Navigation'],
    lazyComponents: [
      'EnergyProteinCalculator',
      'HeartRateZones',
      'HydrationSleepSnapshot',
      'PlateBuilder',
      'RecoveryCheckIn',
      'YouthCorner',
    ],
    preloadRoutes: ['/programs'],
    maxChunkSize: 100000, // 100KB per tool
  },
  {
    path: '/shop',
    criticalComponents: ['ProductCard', 'ProductGrid', 'Navigation'],
    lazyComponents: ['CheckoutForm', 'DonationAllocationModal', 'Footer'],
    preloadRoutes: ['/shop/checkout'],
    maxChunkSize: 150000, // 150KB
  },
  {
    path: '/impact',
    criticalComponents: ['ImpactSectionCard', 'Navigation'],
    lazyComponents: ['DonationForm', 'GearDriveForm', 'FoundationCard', 'Footer'],
    preloadRoutes: ['/impact/donate', '/impact/gear-drive'],
    maxChunkSize: 120000, // 120KB
  },
  {
    path: '/login',
    criticalComponents: ['LoginForm'],
    lazyComponents: [],
    preloadRoutes: ['/dashboard'],
    maxChunkSize: 50000, // 50KB - minimal bundle
  },
  {
    path: '/admin',
    criticalComponents: ['AdminNav'],
    lazyComponents: [
      'AnalyticsDashboard',
      'ProductEditor',
      'TemplateEditor',
      'UserManagementTable',
      'PerformanceDashboard',
    ],
    preloadRoutes: [],
    maxChunkSize: 200000, // 200KB - admin can be larger
  },
];

/**
 * Get route configuration by path
 */
export function getRouteConfig(path: string): RouteConfig | undefined {
  return routeConfigs.find((config) => {
    if (config.path === path) return true;
    if (path.startsWith(config.path + '/')) return true;
    return false;
  });
}

/**
 * Dynamically imported page components
 * These are split by route for optimal loading
 */

// Home page components
export const HomePageComponents = {
  HeroSection: () => import('@/components/home/HeroSection').then(m => ({ default: m.HeroSection })),
  ImpactStatsSection: () => import('@/components/home/ImpactStatsSection').then(m => ({ default: m.ImpactStatsSection })),
  PrefetchLinks: () => import('@/components/home/PrefetchLinks'),
};

// Programs page components
export const ProgramsPageComponents = {
  ProgramCard: () => import('@/components/programs/ProgramCard'),
  ProgramsPageClient: () => import('@/components/programs/ProgramsPageClient'),
};

// Tools page components
export const ToolsPageComponents = {
  ToolCard: () => import('@/components/tools/ToolCard'),
  ToolPanel: () => import('@/components/tools/ToolPanel'),
  EnergyProteinCalculator: () => import('@/components/tools/EnergyProteinCalculator'),
  HeartRateZones: () => import('@/components/tools/HeartRateZones'),
  HydrationSleepSnapshot: () => import('@/components/tools/HydrationSleepSnapshot'),
  PlateBuilder: () => import('@/components/tools/PlateBuilder'),
  RecoveryCheckIn: () => import('@/components/tools/RecoveryCheckIn'),
  YouthCorner: () => import('@/components/tools/YouthCorner'),
};

// Shop page components
export const ShopPageComponents = {
  ProductCard: () => import('@/components/shop/ProductCard'),
  ProductGrid: () => import('@/components/shop/ProductGrid'),
  ShopPageClient: () => import('@/components/shop/ShopPageClient'),
  CheckoutForm: () => import('@/components/shop/CheckoutForm'),
  DonationAllocationModal: () => import('@/components/shop/DonationAllocationModal'),
};

// Impact page components
export const ImpactPageComponents = {
  ImpactSectionCard: () => import('@/components/impact/ImpactSectionCard'),
  DonationForm: () => import('@/components/impact/DonationForm'),
  GearDriveForm: () => import('@/components/impact/GearDriveForm'),
  FoundationCard: () => import('@/components/impact/FoundationCard'),
};

// Admin page components
export const AdminPageComponents = {
  AdminNav: () => import('@/components/admin/AdminNav'),
  AnalyticsDashboard: () => import('@/components/admin/AnalyticsDashboard'),
  ProductEditor: () => import('@/components/admin/ProductEditor'),
  TemplateEditor: () => import('@/components/admin/TemplateEditor'),
  UserManagementTable: () => import('@/components/admin/UserManagementTable'),
  PerformanceDashboard: () => import('@/components/admin/PerformanceDashboard'),
  ClientTable: () => import('@/components/admin/ClientTable'),
  LeadsTable: () => import('@/components/admin/LeadsTable'),
};

/**
 * Create route-specific dynamic components
 */
export function createRouteComponents<T extends Record<string, () => Promise<any>>>(
  components: T,
  options?: {
    ssr?: boolean;
    loading?: ComponentType<any>;
  }
): Record<keyof T, ReturnType<typeof dynamicImport>> {
  const result: any = {};

  for (const [key, loader] of Object.entries(components)) {
    result[key] = options?.ssr === false
      ? clientOnlyImport(loader as any, { loading: options?.loading })
      : dynamicImport(loader as any, { loading: options?.loading, ssr: options?.ssr });
  }

  return result;
}

/**
 * Preload components for a specific route
 */
export async function preloadRouteComponents(path: string): Promise<void> {
  const config = getRouteConfig(path);
  if (!config) return;

  // Get the appropriate component set
  let components: Record<string, () => Promise<any>> | undefined;

  if (path === '/') {
    components = HomePageComponents;
  } else if (path.startsWith('/programs')) {
    components = ProgramsPageComponents;
  } else if (path.startsWith('/tools')) {
    components = ToolsPageComponents;
  } else if (path.startsWith('/shop')) {
    components = ShopPageComponents;
  } else if (path.startsWith('/impact')) {
    components = ImpactPageComponents;
  } else if (path.startsWith('/admin')) {
    components = AdminPageComponents;
  }

  if (!components) return;

  // Preload critical components
  const criticalLoaders = config.criticalComponents
    .map((name) => components![name])
    .filter(Boolean);

  await Promise.all(criticalLoaders.map((loader) => loader()));
}

/**
 * Get bundle size estimate for a route
 */
export function getRouteBundleSize(path: string): number {
  const config = getRouteConfig(path);
  return config?.maxChunkSize || 150000; // Default 150KB
}

/**
 * Check if route exceeds bundle size limit
 */
export function isRouteBundleOptimal(path: string, actualSize: number): boolean {
  const maxSize = getRouteBundleSize(path);
  return actualSize <= maxSize;
}

/**
 * Route-based chunk naming strategy
 */
export function getChunkName(path: string, componentName: string): string {
  const routeName = path.replace(/^\//, '').replace(/\//g, '-') || 'home';
  return `${routeName}-${componentName}`;
}
