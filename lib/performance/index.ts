/**
 * Performance Optimization Utilities
 * 
 * Central export for all performance-related utilities
 */

// Prefetching
export {
  getPrefetcher,
  prefetchRoute,
  prefetchImage,
  prefetchData,
  onLinkHover,
  onLinkVisible,
  default as ResourcePrefetcher,
} from './prefetch';

export {
  usePrefetch,
  usePrefetchOnHover,
  usePrefetchOnVisible,
  usePrefetchOnInteraction,
  usePrefetchWithDelay,
} from './usePrefetch';

// Cache Management
export {
  getCacheManager,
  cachedFetchSWR,
  CACHE_TTL,
  default as PerformanceCacheManager,
} from './cache-manager';

// Code Splitting
export {
  dynamicImport,
  clientOnlyImport,
  lazyImport,
  preloadComponent,
  createRouteBundle,
  loadChunk,
  loadWhenIdle,
  loadOnInteraction,
  loadOnVisible,
  batchLoadChunks,
  ChunkPriority,
  type DynamicImportOptions,
  type RouteComponents,
} from './code-splitting';

// Image Optimization
export {
  generateBlurDataURL,
  generateGradientBlurDataURL,
  getResponsiveSizes,
  RESPONSIVE_SIZES,
  IMAGE_QUALITY,
  isFormatSupported,
  getOptimalFormat,
  preloadImage,
  preloadImages,
  getImageDimensions,
} from './image-utils';

// Performance Monitoring
export {
  trackPageLoad,
  trackMetric,
  reportWebVitals,
  getPerformanceMetrics,
} from './performance';

// Optimized Calculations and Interactions
export {
  useDebounce,
  useThrottle,
  useAnimationFrame,
  useOptimizedInput,
  useMemoizedCalculation,
  useBatchedUpdates,
  useOptimizedScroll,
  useOptimizedResize,
} from './useOptimizedCalculation';

// Page Transitions
export {
  transitionManager,
  PageTransitionManager,
  type TransitionOptions,
  type TransitionState,
} from './transitions';

export {
  usePageTransition,
  useTransitionRouter,
} from './usePageTransition';

// Navigation Management
export {
  getNavigationManager,
  NavigationManager,
  type ScrollPosition,
  type NavigationState,
} from './navigation-manager';

export {
  useScrollRestoration,
  useInstantFeedback,
  useOptimisticNavigation,
  useScrollToElement,
  useBackNavigation,
  useNavigationHistory,
} from './useNavigation';

// Route-Based Code Splitting
export {
  routeConfigs,
  getRouteConfig,
  HomePageComponents,
  ProgramsPageComponents,
  ToolsPageComponents,
  ShopPageComponents,
  ImpactPageComponents,
  AdminPageComponents,
  createRouteComponents,
  preloadRouteComponents,
  getRouteBundleSize,
  isRouteBundleOptimal,
  getChunkName,
  type RouteConfig,
} from './route-splitting';

// Lazy Loading Strategy
export {
  lazyLoadableComponents,
  getComponentsByPriority,
  getComponentsByStrategy,
  calculateTotalSize,
  getLazyLoadingRecommendations,
  shouldLazyLoad,
  getLoadingStrategy,
  calculateLazyLoadingStats,
  LoadingPriority,
  type ComponentCategory,
  type LazyLoadingStats,
} from './lazy-loading-strategy';

// Third-Party Scripts
export {
  thirdPartyScripts,
  loadScript,
  loadScriptWhenIdle,
  loadScriptOnInteraction,
  loadScriptWhenVisible,
  preconnectToDomain,
  dnsPrefetch,
  initializeThirdPartyScripts,
  removeUnusedScripts,
  monitorScriptPerformance,
  getScriptOptimizationRecommendations,
  ThirdPartyFacade,
  ScriptStrategy,
  ScriptPriority,
  type ThirdPartyScript,
  type ScriptPerformance,
} from './third-party-scripts';

// Tree-Shaking
export {
  optimizedImports,
  externalPackages,
  treeShakablePackages,
  sideEffectFreePackages,
  hasSideEffects,
  getTreeShakingRecommendation,
  treeShakingConfig,
  packageJsonSideEffects,
  unusedCodePatterns,
  treeShakingBestPractices,
  estimateTreeShakingSavings,
  getTreeShakingWebpackConfig,
  getTreeShakingReport,
  validateImportPattern,
  type ImportAnalysis,
  type BundleAnalysisConfig,
  type UnusedExport,
  type TreeShakingSavings,
  type BundleAnalysis,
} from './tree-shaking';

// Critical CSS
export {
  getCriticalCSS,
  getCriticalCSSSize,
  isCriticalCSSUnderLimit,
  getCriticalCSSStats,
} from './critical-css';

// CSS Loading
export {
  loadCSSAsync,
  preloadCSS,
  loadCSSWithPriority,
  cssModuleLoader,
  routeCSSModules,
  loadRouteCSS,
  preloadRouteCSS,
  loadComponentCSS,
  deferNonCriticalCSS,
  getCSSLoadingStrategy,
  CSSModuleLoader,
  type CSSLoadingStrategy,
} from './css-loading';

// CSS Analysis
export {
  analyzeCSSUsage,
  getCSSBundleInfo,
  reportCSSOptimizations,
  logCSSOptimizationReport,
  generateTailwindPurgeConfig,
  type CSSUsageStats,
} from './css-analyzer';

// Font Optimization
export {
  fontConfigs,
  generateFontFaceCSS,
  generateAllFontFaceCSS,
  getPreloadFontLinks,
  systemFontStack,
  getFontFamilyWithFallback,
  fontLoader,
  fontMetrics,
  generateFallbackFontCSS,
  getOptimizedFontCSS,
  FontLoader,
  type FontConfig,
} from './font-optimization';
