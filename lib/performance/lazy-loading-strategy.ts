/**
 * Lazy Loading Strategy
 * 
 * Identifies and categorizes components for lazy loading
 * to optimize initial bundle size and improve page load performance
 */

/**
 * Component loading priority
 */
export enum LoadingPriority {
  CRITICAL = 'critical',      // Load immediately (above fold, essential)
  HIGH = 'high',              // Load on page load (visible soon)
  MEDIUM = 'medium',          // Load on interaction or scroll
  LOW = 'low',                // Load when idle
  DEFERRED = 'deferred',      // Load only when explicitly needed
}

/**
 * Component category for lazy loading
 */
export interface ComponentCategory {
  name: string;
  priority: LoadingPriority;
  loadStrategy: 'immediate' | 'interaction' | 'visible' | 'idle';
  estimatedSize: number; // in bytes
  dependencies?: string[];
}

/**
 * Non-critical components that should be lazy loaded
 */
export const lazyLoadableComponents: Record<string, ComponentCategory> = {
  // Modals and Dialogs (load on interaction)
  'DonationAllocationModal': {
    name: 'DonationAllocationModal',
    priority: LoadingPriority.DEFERRED,
    loadStrategy: 'interaction',
    estimatedSize: 15000,
  },
  'CreateUserModal': {
    name: 'CreateUserModal',
    priority: LoadingPriority.DEFERRED,
    loadStrategy: 'interaction',
    estimatedSize: 12000,
  },
  'RoleChangeDialog': {
    name: 'RoleChangeDialog',
    priority: LoadingPriority.DEFERRED,
    loadStrategy: 'interaction',
    estimatedSize: 8000,
  },
  'StatusChangeDialog': {
    name: 'StatusChangeDialog',
    priority: LoadingPriority.DEFERRED,
    loadStrategy: 'interaction',
    estimatedSize: 8000,
  },

  // Below-fold content (load when visible)
  'TestimonialCarousel': {
    name: 'TestimonialCarousel',
    priority: LoadingPriority.MEDIUM,
    loadStrategy: 'visible',
    estimatedSize: 20000,
  },
  'ImpactStatsSection': {
    name: 'ImpactStatsSection',
    priority: LoadingPriority.MEDIUM,
    loadStrategy: 'visible',
    estimatedSize: 18000,
  },
  'Footer': {
    name: 'Footer',
    priority: LoadingPriority.LOW,
    loadStrategy: 'visible',
    estimatedSize: 15000,
  },

  // Admin components (load when needed)
  'AnalyticsDashboard': {
    name: 'AnalyticsDashboard',
    priority: LoadingPriority.HIGH,
    loadStrategy: 'immediate',
    estimatedSize: 35000,
    dependencies: ['chart-library'],
  },
  'ProductEditor': {
    name: 'ProductEditor',
    priority: LoadingPriority.DEFERRED,
    loadStrategy: 'interaction',
    estimatedSize: 25000,
  },
  'TemplateEditor': {
    name: 'TemplateEditor',
    priority: LoadingPriority.DEFERRED,
    loadStrategy: 'interaction',
    estimatedSize: 30000,
  },
  'UserManagementTable': {
    name: 'UserManagementTable',
    priority: LoadingPriority.HIGH,
    loadStrategy: 'immediate',
    estimatedSize: 22000,
  },
  'PerformanceDashboard': {
    name: 'PerformanceDashboard',
    priority: LoadingPriority.HIGH,
    loadStrategy: 'immediate',
    estimatedSize: 28000,
  },
  'ClientTable': {
    name: 'ClientTable',
    priority: LoadingPriority.HIGH,
    loadStrategy: 'immediate',
    estimatedSize: 20000,
  },
  'LeadsTable': {
    name: 'LeadsTable',
    priority: LoadingPriority.HIGH,
    loadStrategy: 'immediate',
    estimatedSize: 18000,
  },
  'ContentManagementPage': {
    name: 'ContentManagementPage',
    priority: LoadingPriority.HIGH,
    loadStrategy: 'immediate',
    estimatedSize: 32000,
  },
  'ProductManagementPage': {
    name: 'ProductManagementPage',
    priority: LoadingPriority.HIGH,
    loadStrategy: 'immediate',
    estimatedSize: 30000,
  },
  'TemplateManager': {
    name: 'TemplateManager',
    priority: LoadingPriority.HIGH,
    loadStrategy: 'immediate',
    estimatedSize: 28000,
  },
  'AdminPacketManager': {
    name: 'AdminPacketManager',
    priority: LoadingPriority.HIGH,
    loadStrategy: 'immediate',
    estimatedSize: 35000,
  },

  // Tools (load on demand)
  'EnergyProteinCalculator': {
    name: 'EnergyProteinCalculator',
    priority: LoadingPriority.DEFERRED,
    loadStrategy: 'interaction',
    estimatedSize: 25000,
  },
  'HeartRateZones': {
    name: 'HeartRateZones',
    priority: LoadingPriority.DEFERRED,
    loadStrategy: 'interaction',
    estimatedSize: 22000,
  },
  'HydrationSleepSnapshot': {
    name: 'HydrationSleepSnapshot',
    priority: LoadingPriority.DEFERRED,
    loadStrategy: 'interaction',
    estimatedSize: 20000,
  },
  'PlateBuilder': {
    name: 'PlateBuilder',
    priority: LoadingPriority.DEFERRED,
    loadStrategy: 'interaction',
    estimatedSize: 28000,
  },
  'RecoveryCheckIn': {
    name: 'RecoveryCheckIn',
    priority: LoadingPriority.DEFERRED,
    loadStrategy: 'interaction',
    estimatedSize: 24000,
  },
  'YouthCorner': {
    name: 'YouthCorner',
    priority: LoadingPriority.DEFERRED,
    loadStrategy: 'interaction',
    estimatedSize: 26000,
  },

  // Forms (load when needed)
  'CheckoutForm': {
    name: 'CheckoutForm',
    priority: LoadingPriority.HIGH,
    loadStrategy: 'immediate',
    estimatedSize: 30000,
    dependencies: ['stripe'],
  },
  'DonationForm': {
    name: 'DonationForm',
    priority: LoadingPriority.HIGH,
    loadStrategy: 'immediate',
    estimatedSize: 28000,
    dependencies: ['stripe'],
  },
  'GearDriveForm': {
    name: 'GearDriveForm',
    priority: LoadingPriority.HIGH,
    loadStrategy: 'immediate',
    estimatedSize: 22000,
  },
  'IntakeForm': {
    name: 'IntakeForm',
    priority: LoadingPriority.HIGH,
    loadStrategy: 'immediate',
    estimatedSize: 35000,
  },
  'DynamicIntakeForm': {
    name: 'DynamicIntakeForm',
    priority: LoadingPriority.HIGH,
    loadStrategy: 'immediate',
    estimatedSize: 40000,
  },
  'DiscoveryForm': {
    name: 'DiscoveryForm',
    priority: LoadingPriority.HIGH,
    loadStrategy: 'immediate',
    estimatedSize: 25000,
  },

  // Dashboard components
  'PacketViewer': {
    name: 'PacketViewer',
    priority: LoadingPriority.HIGH,
    loadStrategy: 'immediate',
    estimatedSize: 32000,
  },
  'PacketList': {
    name: 'PacketList',
    priority: LoadingPriority.HIGH,
    loadStrategy: 'immediate',
    estimatedSize: 20000,
  },

  // Settings components
  'ProfileSettingsForm': {
    name: 'ProfileSettingsForm',
    priority: LoadingPriority.HIGH,
    loadStrategy: 'immediate',
    estimatedSize: 18000,
  },
  'NotificationPreferences': {
    name: 'NotificationPreferences',
    priority: LoadingPriority.MEDIUM,
    loadStrategy: 'interaction',
    estimatedSize: 15000,
  },

  // Notification components
  'NotificationBell': {
    name: 'NotificationBell',
    priority: LoadingPriority.LOW,
    loadStrategy: 'idle',
    estimatedSize: 12000,
  },
};

/**
 * Get components by loading priority
 */
export function getComponentsByPriority(priority: LoadingPriority): ComponentCategory[] {
  return Object.values(lazyLoadableComponents).filter(
    (component) => component.priority === priority
  );
}

/**
 * Get components by load strategy
 */
export function getComponentsByStrategy(
  strategy: 'immediate' | 'interaction' | 'visible' | 'idle'
): ComponentCategory[] {
  return Object.values(lazyLoadableComponents).filter(
    (component) => component.loadStrategy === strategy
  );
}

/**
 * Calculate total size of components
 */
export function calculateTotalSize(components: ComponentCategory[]): number {
  return components.reduce((total, component) => total + component.estimatedSize, 0);
}

/**
 * Get lazy loading recommendations for a route
 */
export function getLazyLoadingRecommendations(route: string): {
  immediate: string[];
  lazy: string[];
  estimatedSavings: number;
} {
  const recommendations = {
    immediate: [] as string[],
    lazy: [] as string[],
    estimatedSavings: 0,
  };

  // Route-specific recommendations
  const routeComponents: Record<string, string[]> = {
    '/': [
      'TestimonialCarousel',
      'ImpactStatsSection',
      'Footer',
    ],
    '/programs': [
      'Footer',
    ],
    '/tools': [
      'EnergyProteinCalculator',
      'HeartRateZones',
      'HydrationSleepSnapshot',
      'PlateBuilder',
      'RecoveryCheckIn',
      'YouthCorner',
      'Footer',
    ],
    '/shop': [
      'CheckoutForm',
      'DonationAllocationModal',
      'Footer',
    ],
    '/impact': [
      'DonationForm',
      'GearDriveForm',
      'Footer',
    ],
    '/admin': [
      'AnalyticsDashboard',
      'ProductEditor',
      'TemplateEditor',
      'UserManagementTable',
      'PerformanceDashboard',
      'ClientTable',
      'LeadsTable',
      'ContentManagementPage',
      'ProductManagementPage',
      'TemplateManager',
      'AdminPacketManager',
    ],
  };

  const componentsForRoute = routeComponents[route] || [];

  componentsForRoute.forEach((componentName) => {
    const component = lazyLoadableComponents[componentName];
    if (component) {
      if (component.loadStrategy === 'immediate') {
        recommendations.immediate.push(componentName);
      } else {
        recommendations.lazy.push(componentName);
        recommendations.estimatedSavings += component.estimatedSize;
      }
    }
  });

  return recommendations;
}

/**
 * Check if component should be lazy loaded
 */
export function shouldLazyLoad(componentName: string): boolean {
  const component = lazyLoadableComponents[componentName];
  if (!component) return false;

  return component.priority !== LoadingPriority.CRITICAL &&
         component.loadStrategy !== 'immediate';
}

/**
 * Get loading strategy for component
 */
export function getLoadingStrategy(
  componentName: string
): 'immediate' | 'interaction' | 'visible' | 'idle' | null {
  const component = lazyLoadableComponents[componentName];
  return component?.loadStrategy || null;
}

/**
 * Lazy loading statistics
 */
export interface LazyLoadingStats {
  totalComponents: number;
  lazyLoadedComponents: number;
  totalSize: number;
  lazyLoadedSize: number;
  potentialSavings: number;
  savingsPercentage: number;
}

/**
 * Calculate lazy loading statistics
 */
export function calculateLazyLoadingStats(): LazyLoadingStats {
  const allComponents = Object.values(lazyLoadableComponents);
  const lazyComponents = allComponents.filter(
    (c) => c.loadStrategy !== 'immediate'
  );

  const totalSize = calculateTotalSize(allComponents);
  const lazySize = calculateTotalSize(lazyComponents);

  return {
    totalComponents: allComponents.length,
    lazyLoadedComponents: lazyComponents.length,
    totalSize,
    lazyLoadedSize: lazySize,
    potentialSavings: lazySize,
    savingsPercentage: (lazySize / totalSize) * 100,
  };
}
