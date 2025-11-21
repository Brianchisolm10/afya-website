/**
 * Performance Components
 * 
 * Central export for all performance-related components
 */

// Prefetch Components
export { PrefetchLink } from './PrefetchLink';
export {
  TransitionLink,
  PrefetchRoutes,
  PrefetchOnInteraction,
} from './TransitionLink';

// Loading States
export {
  Spinner,
  SkeletonText,
  SkeletonCard,
  SkeletonGrid,
  SkeletonList,
  PageLoader,
  SectionLoader,
  InlineLoader,
  ToolSkeleton,
  ProductSkeleton,
  ProgramSkeleton,
  FadeIn,
} from './LoadingStates';

// Suspense Boundaries
export {
  SuspenseBoundary,
  PageSuspenseBoundary,
  SectionSuspenseBoundary,
  InlineSuspenseBoundary,
  ParallelSuspenseBoundaries,
} from './SuspenseBoundary';

// Lazy Loading
export { LazyLoadOnScroll, LazyImage } from './LazyLoadOnScroll';

// Page Transitions
export {
  PageTransitionIndicator,
  TransitionSpinner,
} from './PageTransitionIndicator';

// Navigation Feedback
export {
  NavigationFeedback,
  OptimisticNavigationOverlay,
  LinkFeedback,
} from './NavigationFeedback';

// Page Transition Provider
export {
  PageTransitionProvider,
  usePageTransitions,
} from './PageTransitionProvider';

// CSS Loading
export {
  DeferredCSS,
  CSSPreloader,
  ComponentCSSLoader,
} from './DeferredCSS';

// Font Loading
export {
  FontLoader,
  FontLoadingIndicator,
  useFontsLoaded,
} from './FontLoader';
