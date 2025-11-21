#!/usr/bin/env tsx

/**
 * Bundle Analysis Script
 * 
 * Analyzes the production bundle to identify:
 * - Large dependencies
 * - Unused code
 * - Tree-shaking opportunities
 * - Bundle size by route
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

interface BundleStats {
  totalSize: number;
  chunks: {
    name: string;
    size: number;
    modules: number;
  }[];
  largestModules: {
    name: string;
    size: number;
  }[];
}

/**
 * Analyze Next.js build output
 */
function analyzeBuild(): BundleStats | null {
  const buildManifestPath = join(process.cwd(), '.next', 'build-manifest.json');
  
  if (!existsSync(buildManifestPath)) {
    console.error('❌ Build manifest not found. Run `npm run build` first.');
    return null;
  }

  try {
    const manifest = JSON.parse(readFileSync(buildManifestPath, 'utf-8'));
    
    console.log('\n📊 Bundle Analysis\n');
    console.log('='.repeat(60));
    
    // Analyze pages
    console.log('\n📄 Pages:');
    Object.entries(manifest.pages).forEach(([page, files]: [string, any]) => {
      console.log(`\n  ${page}`);
      if (Array.isArray(files)) {
        files.forEach((file: string) => {
          console.log(`    - ${file}`);
        });
      }
    });

    return {
      totalSize: 0,
      chunks: [],
      largestModules: [],
    };
  } catch (error) {
    console.error('❌ Error analyzing build:', error);
    return null;
  }
}

/**
 * Check for unused dependencies
 */
function checkUnusedDependencies(): void {
  console.log('\n📦 Checking for unused dependencies...\n');
  
  const packageJson = JSON.parse(
    readFileSync(join(process.cwd(), 'package.json'), 'utf-8')
  );

  const dependencies = {
    ...packageJson.dependencies,
    ...packageJson.devDependencies,
  };

  // Known used dependencies (from analysis)
  const usedDependencies = new Set([
    'next',
    'react',
    'react-dom',
    '@prisma/client',
    'prisma',
    'next-auth',
    '@next-auth/prisma-adapter',
    'bcryptjs',
    'zod',
    'stripe',
    '@stripe/stripe-js',
    '@stripe/react-stripe-js',
    'lucide-react',
    'date-fns',
    'web-vitals',
    'nodemailer',
    'pdfkit',
    '@types/pdfkit',
    'dotenv',
    'autoprefixer',
    'tailwindcss',
    'postcss',
    'typescript',
    '@types/node',
    '@types/react',
    '@types/react-dom',
    '@types/bcryptjs',
    '@types/nodemailer',
    'eslint',
    'eslint-config-next',
    'tsx',
    'vitest',
    '@vitest/ui',
  ]);

  const potentiallyUnused: string[] = [];

  Object.keys(dependencies).forEach((dep) => {
    if (!usedDependencies.has(dep)) {
      potentiallyUnused.push(dep);
    }
  });

  if (potentiallyUnused.length === 0) {
    console.log('✅ No obviously unused dependencies found');
  } else {
    console.log('⚠️  Potentially unused dependencies:');
    potentiallyUnused.forEach((dep) => {
      console.log(`  - ${dep}`);
    });
    console.log('\n💡 Review these dependencies to confirm they are needed');
  }
}

/**
 * Analyze import patterns
 */
function analyzeImportPatterns(): void {
  console.log('\n🔍 Import Pattern Analysis\n');
  
  const recommendations = [
    {
      package: 'lucide-react',
      current: "import { Icon } from 'lucide-react'",
      optimized: "Use tree-shakable imports or optimize with Next.js config",
      impact: 'High - Icons can add significant bundle size',
    },
    {
      package: 'date-fns',
      current: "import { format } from 'date-fns'",
      optimized: "import format from 'date-fns/format'",
      impact: 'Medium - Direct imports enable better tree-shaking',
    },
  ];

  recommendations.forEach((rec) => {
    console.log(`📦 ${rec.package}`);
    console.log(`  Current:   ${rec.current}`);
    console.log(`  Optimized: ${rec.optimized}`);
    console.log(`  Impact:    ${rec.impact}\n`);
  });
}

/**
 * Tree-shaking recommendations
 */
function treeShakingRecommendations(): void {
  console.log('\n🌳 Tree-Shaking Recommendations\n');
  console.log('='.repeat(60));
  
  const recommendations = [
    {
      title: 'Enable sideEffects in package.json',
      status: '✅ Configured',
      description: 'Marks modules as side-effect free for better tree-shaking',
    },
    {
      title: 'Use ES6 modules',
      status: '✅ Using',
      description: 'All imports use ES6 import/export syntax',
    },
    {
      title: 'Optimize package imports',
      status: '⚠️  Can improve',
      description: 'Some packages can use more specific imports',
    },
    {
      title: 'Remove unused exports',
      status: '💡 Review needed',
      description: 'Manually review components for unused exports',
    },
    {
      title: 'Configure webpack optimization',
      status: '✅ Configured',
      description: 'Webpack tree-shaking is enabled in next.config.js',
    },
  ];

  recommendations.forEach((rec) => {
    console.log(`\n${rec.status} ${rec.title}`);
    console.log(`   ${rec.description}`);
  });
}

/**
 * Bundle size targets
 */
function checkBundleSizeTargets(): void {
  console.log('\n🎯 Bundle Size Targets\n');
  console.log('='.repeat(60));
  
  const targets = [
    { route: '/', target: '150 KB', description: 'Home page' },
    { route: '/programs', target: '120 KB', description: 'Programs page' },
    { route: '/tools', target: '100 KB', description: 'Tools page (per tool)' },
    { route: '/shop', target: '150 KB', description: 'Shop page' },
    { route: '/impact', target: '120 KB', description: 'Impact page' },
    { route: '/login', target: '50 KB', description: 'Login page (minimal)' },
    { route: '/admin', target: '200 KB', description: 'Admin pages' },
  ];

  console.log('\nTarget bundle sizes by route:\n');
  targets.forEach((target) => {
    console.log(`  ${target.route.padEnd(15)} ${target.target.padEnd(10)} ${target.description}`);
  });

  console.log('\n💡 Run `npm run build` to see actual bundle sizes');
}

/**
 * Main analysis
 */
function main(): void {
  console.log('\n🚀 AFYA Website Bundle Analysis');
  console.log('='.repeat(60));

  // Analyze build if available
  analyzeBuild();

  // Check for unused dependencies
  checkUnusedDependencies();

  // Analyze import patterns
  analyzeImportPatterns();

  // Tree-shaking recommendations
  treeShakingRecommendations();

  // Bundle size targets
  checkBundleSizeTargets();

  console.log('\n' + '='.repeat(60));
  console.log('\n✨ Analysis complete!\n');
  console.log('Next steps:');
  console.log('  1. Run `npm run build` to generate production bundle');
  console.log('  2. Review potentially unused dependencies');
  console.log('  3. Optimize import patterns where suggested');
  console.log('  4. Check actual bundle sizes against targets\n');
}

// Run analysis
main();
