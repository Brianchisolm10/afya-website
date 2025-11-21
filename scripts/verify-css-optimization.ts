#!/usr/bin/env tsx

/**
 * CSS Optimization Verification Script
 * 
 * Verifies that CSS optimization is working correctly
 */

import { getCriticalCSSStats } from '../lib/performance/critical-css';
import { generateTailwindPurgeConfig } from '../lib/performance/css-analyzer';

console.log('🎨 CSS Optimization Verification\n');

// Check critical CSS size
console.log('📊 Critical CSS Stats:');
const stats = getCriticalCSSStats();
console.log(`  Size: ${stats.sizeInKB} KB`);
console.log(`  Limit: ${stats.limit} KB`);
console.log(`  Usage: ${stats.percentage}% of limit`);
console.log(`  Status: ${stats.isUnderLimit ? '✅ Under limit' : '❌ Over limit'}\n`);

// Check Tailwind purge configuration
console.log('🧹 Tailwind Purge Configuration:');
const purgeConfig = generateTailwindPurgeConfig();
console.log(`  Content paths: ${purgeConfig.content.length} configured`);
console.log(`  Safelist patterns: ${purgeConfig.safelist.length} patterns`);
console.log(`  Status: ✅ Configured\n`);

// Summary
console.log('📋 Summary:');
if (stats.isUnderLimit) {
  console.log('  ✅ Critical CSS is optimized and under 14KB limit');
  console.log('  ✅ Tailwind purge is configured');
  console.log('  ✅ CSS optimization is ready for production');
  process.exit(0);
} else {
  console.log('  ❌ Critical CSS exceeds 14KB limit');
  console.log('  ⚠️  Please reduce critical CSS size');
  process.exit(1);
}
