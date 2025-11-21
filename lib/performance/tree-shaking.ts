/**
 * Tree-Shaking Configuration and Analysis
 * 
 * Utilities for optimizing bundle size through tree-shaking
 * and identifying unused code
 */

/**
 * Package import optimization recommendations
 * 
 * These are specific import patterns that enable better tree-shaking
 */
export const optimizedImports: Record<string, {
  package: string;
  badPattern: string;
  goodPattern: string;
  reason: string;
}> = {
  'lucide-react': {
    package: 'lucide-react',
    badPattern: "import { Icon1, Icon2 } from 'lucide-react'",
    goodPattern: "import Icon1 from 'lucide-react/dist/esm/icons/icon-1'",
    reason: 'Named imports from lucide-react bundle all icons. Use direct imports for better tree-shaking.',
  },
  'date-fns': {
    package: 'date-fns',
    badPattern: "import { format, parse } from 'date-fns'",
    goodPattern: "import format from 'date-fns/format'\nimport parse from 'date-fns/parse'",
    reason: 'Import specific functions directly to enable tree-shaking.',
  },
  'lodash': {
    package: 'lodash',
    badPattern: "import _ from 'lodash'",
    goodPattern: "import debounce from 'lodash/debounce'",
    reason: 'Import specific lodash functions to avoid bundling entire library.',
  },
};

/**
 * Packages that should be marked as external or optimized
 */
export const externalPackages = [
  '@prisma/client',
  'bcryptjs',
  'nodemailer',
  'pdfkit',
];

/**
 * Packages that have good tree-shaking support
 */
export const treeShakablePackages = [
  'react',
  'react-dom',
  'next',
  'zod',
];

/**
 * Side-effect free packages (can be safely tree-shaken)
 */
export const sideEffectFreePackages = [
  'date-fns',
  'lodash',
  'ramda',
];

/**
 * Check if a package has side effects
 */
export function hasSideEffects(packageName: string): boolean {
  return !sideEffectFreePackages.includes(packageName);
}

/**
 * Get tree-shaking recommendations for a package
 */
export function getTreeShakingRecommendation(packageName: string): string | null {
  const recommendation = optimizedImports[packageName];
  return recommendation ? recommendation.goodPattern : null;
}

/**
 * Analyze imports for tree-shaking opportunities
 */
export interface ImportAnalysis {
  file: string;
  imports: {
    package: string;
    pattern: string;
    canOptimize: boolean;
    recommendation?: string;
  }[];
}

/**
 * Bundle analysis configuration
 */
export interface BundleAnalysisConfig {
  enabled: boolean;
  openAnalyzer: boolean;
  generateStatsFile: boolean;
  defaultSizes: 'parsed' | 'stat' | 'gzip';
}

/**
 * Default bundle analysis configuration
 */
export const defaultBundleAnalysisConfig: BundleAnalysisConfig = {
  enabled: process.env.ANALYZE === 'true',
  openAnalyzer: true,
  generateStatsFile: true,
  defaultSizes: 'gzip',
};

/**
 * Webpack tree-shaking configuration
 */
export const treeShakingConfig = {
  // Enable tree-shaking
  usedExports: true,
  
  // Mark side-effect free packages
  sideEffects: false,
  
  // Optimization settings
  optimization: {
    usedExports: true,
    sideEffects: true,
    providedExports: true,
    innerGraph: true,
    
    // Minimize in production
    minimize: process.env.NODE_ENV === 'production',
    
    // Concatenate modules when possible
    concatenateModules: true,
    
    // Remove empty chunks
    removeEmptyChunks: true,
    
    // Merge duplicate chunks
    mergeDuplicateChunks: true,
    
    // Flag included chunks
    flagIncludedChunks: true,
  },
};

/**
 * Package.json sideEffects configuration
 * 
 * This should be added to package.json to enable tree-shaking
 */
export const packageJsonSideEffects = {
  sideEffects: [
    '*.css',
    '*.scss',
    '*.sass',
    '*.less',
    // Add any files with side effects
  ],
};

/**
 * Identify unused exports in a module
 */
export interface UnusedExport {
  file: string;
  export: string;
  type: 'function' | 'class' | 'const' | 'type';
}

/**
 * Common patterns of unused code
 */
export const unusedCodePatterns = [
  {
    pattern: 'Unused utility functions',
    description: 'Functions that are exported but never imported',
    impact: 'Medium',
  },
  {
    pattern: 'Duplicate implementations',
    description: 'Multiple implementations of the same functionality',
    impact: 'High',
  },
  {
    pattern: 'Dead code branches',
    description: 'Code paths that are never executed',
    impact: 'Low',
  },
  {
    pattern: 'Unused dependencies',
    description: 'Packages in package.json that are never imported',
    impact: 'High',
  },
  {
    pattern: 'Unused CSS',
    description: 'CSS classes that are never used',
    impact: 'Medium',
  },
];

/**
 * Tree-shaking best practices
 */
export const treeShakingBestPractices = [
  {
    practice: 'Use ES6 modules',
    description: 'Always use import/export instead of require/module.exports',
    example: "import { func } from './module' // Good\nconst { func } = require('./module') // Bad",
  },
  {
    practice: 'Avoid default exports for utilities',
    description: 'Named exports enable better tree-shaking',
    example: "export const func = () => {} // Good\nexport default func // Less optimal",
  },
  {
    practice: 'Import only what you need',
    description: 'Avoid importing entire modules',
    example: "import { specific } from 'package' // Good\nimport * as all from 'package' // Bad",
  },
  {
    practice: 'Mark side-effect free code',
    description: 'Use sideEffects: false in package.json',
    example: '{ "sideEffects": false }',
  },
  {
    practice: 'Avoid dynamic imports in static code',
    description: 'Dynamic imports prevent tree-shaking',
    example: "import { func } from './module' // Good\nconst module = await import('./module') // Use only when needed",
  },
];

/**
 * Calculate potential savings from tree-shaking
 */
export interface TreeShakingSavings {
  currentSize: number;
  potentialSize: number;
  savings: number;
  savingsPercentage: number;
  recommendations: string[];
}

/**
 * Estimate tree-shaking savings
 */
export function estimateTreeShakingSavings(
  currentBundleSize: number,
  unusedExports: number,
  avgExportSize: number = 1000
): TreeShakingSavings {
  const potentialSavings = unusedExports * avgExportSize;
  const potentialSize = currentBundleSize - potentialSavings;
  const savingsPercentage = (potentialSavings / currentBundleSize) * 100;

  const recommendations: string[] = [];

  if (savingsPercentage > 20) {
    recommendations.push('High potential for optimization - review unused exports');
  }
  if (savingsPercentage > 10) {
    recommendations.push('Consider using more specific imports');
  }
  if (savingsPercentage > 5) {
    recommendations.push('Enable sideEffects: false in package.json');
  }

  return {
    currentSize: currentBundleSize,
    potentialSize,
    savings: potentialSavings,
    savingsPercentage,
    recommendations,
  };
}

/**
 * Webpack configuration for optimal tree-shaking
 */
export function getTreeShakingWebpackConfig() {
  return {
    optimization: {
      usedExports: true,
      sideEffects: true,
      providedExports: true,
      innerGraph: true,
      concatenateModules: true,
      
      // Minimize configuration
      minimize: process.env.NODE_ENV === 'production',
      minimizer: [
        // TerserPlugin configuration for better tree-shaking
        {
          terserOptions: {
            compress: {
              // Remove console.log in production
              drop_console: process.env.NODE_ENV === 'production',
              // Remove debugger statements
              drop_debugger: true,
              // Remove unused code
              unused: true,
              // Remove dead code
              dead_code: true,
              // Evaluate constant expressions
              evaluate: true,
              // Inline functions
              inline: 2,
            },
            mangle: {
              // Mangle variable names
              safari10: true,
            },
            output: {
              // Remove comments
              comments: false,
              // ASCII only
              ascii_only: true,
            },
          },
        },
      ],
    },
    
    // Module configuration
    module: {
      rules: [
        {
          // Mark packages as side-effect free
          test: /\.js$/,
          sideEffects: false,
          include: sideEffectFreePackages.map(pkg => 
            new RegExp(`node_modules/${pkg}`)
          ),
        },
      ],
    },
  };
}

/**
 * Analyze bundle for tree-shaking opportunities
 */
export interface BundleAnalysis {
  totalSize: number;
  treeShakableSize: number;
  nonTreeShakableSize: number;
  packages: {
    name: string;
    size: number;
    treeShakable: boolean;
    recommendation?: string;
  }[];
}

/**
 * Get tree-shaking report
 */
export function getTreeShakingReport(): {
  bestPractices: typeof treeShakingBestPractices;
  optimizedImports: typeof optimizedImports;
  unusedPatterns: typeof unusedCodePatterns;
} {
  return {
    bestPractices: treeShakingBestPractices,
    optimizedImports,
    unusedPatterns: unusedCodePatterns,
  };
}

/**
 * Validate import patterns
 */
export function validateImportPattern(
  packageName: string,
  importStatement: string
): {
  valid: boolean;
  recommendation?: string;
} {
  const optimization = optimizedImports[packageName];
  
  if (!optimization) {
    return { valid: true };
  }

  // Check if using bad pattern
  if (importStatement.includes(optimization.badPattern)) {
    return {
      valid: false,
      recommendation: optimization.goodPattern,
    };
  }

  return { valid: true };
}
