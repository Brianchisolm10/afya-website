/**
 * CSS Analyzer
 * 
 * Utilities for analyzing CSS usage and identifying unused styles
 * Helps optimize production bundle by removing unused CSS
 */

/**
 * CSS Usage Statistics
 */
export interface CSSUsageStats {
  totalRules: number;
  usedRules: number;
  unusedRules: number;
  usagePercentage: number;
  totalSize: number;
  usedSize: number;
  unusedSize: number;
  potentialSavings: string;
}

/**
 * Analyze CSS usage in the document
 * Note: This should only run in development/testing
 */
export async function analyzeCSSUsage(): Promise<CSSUsageStats> {
  if (typeof window === 'undefined') {
    throw new Error('CSS analysis can only run in browser');
  }
  
  const styleSheets = Array.from(document.styleSheets);
  let totalRules = 0;
  let usedRules = 0;
  let totalSize = 0;
  let usedSize = 0;
  
  for (const sheet of styleSheets) {
    try {
      const rules = Array.from(sheet.cssRules || []);
      
      for (const rule of rules) {
        if (rule instanceof CSSStyleRule) {
          totalRules++;
          const ruleText = rule.cssText;
          totalSize += ruleText.length;
          
          // Check if selector is used in the document
          try {
            const elements = document.querySelectorAll(rule.selectorText);
            if (elements.length > 0) {
              usedRules++;
              usedSize += ruleText.length;
            }
          } catch (e) {
            // Invalid selector or pseudo-selector, count as used to be safe
            usedRules++;
            usedSize += ruleText.length;
          }
        }
      }
    } catch (e) {
      // Cross-origin stylesheet, skip
      console.warn('Cannot access stylesheet:', e);
    }
  }
  
  const unusedRules = totalRules - usedRules;
  const unusedSize = totalSize - usedSize;
  const usagePercentage = totalRules > 0 ? (usedRules / totalRules) * 100 : 0;
  const potentialSavings = `${(unusedSize / 1024).toFixed(2)} KB`;
  
  return {
    totalRules,
    usedRules,
    unusedRules,
    usagePercentage: Math.round(usagePercentage * 100) / 100,
    totalSize,
    usedSize,
    unusedSize,
    potentialSavings,
  };
}

/**
 * Get CSS bundle size information
 */
export function getCSSBundleInfo(): {
  stylesheets: Array<{
    href: string;
    size: number;
    rules: number;
  }>;
  totalSize: number;
  totalRules: number;
} {
  if (typeof window === 'undefined') {
    return { stylesheets: [], totalSize: 0, totalRules: 0 };
  }
  
  const styleSheets = Array.from(document.styleSheets);
  const stylesheets: Array<{ href: string; size: number; rules: number }> = [];
  let totalSize = 0;
  let totalRules = 0;
  
  for (const sheet of styleSheets) {
    try {
      const rules = Array.from(sheet.cssRules || []);
      const size = rules.reduce((acc, rule) => acc + rule.cssText.length, 0);
      
      stylesheets.push({
        href: sheet.href || 'inline',
        size,
        rules: rules.length,
      });
      
      totalSize += size;
      totalRules += rules.length;
    } catch (e) {
      // Cross-origin stylesheet
      stylesheets.push({
        href: sheet.href || 'inline',
        size: 0,
        rules: 0,
      });
    }
  }
  
  return {
    stylesheets,
    totalSize,
    totalRules,
  };
}

/**
 * Report CSS optimization opportunities
 */
export async function reportCSSOptimizations(): Promise<{
  usage: CSSUsageStats;
  bundleInfo: ReturnType<typeof getCSSBundleInfo>;
  recommendations: string[];
}> {
  const usage = await analyzeCSSUsage();
  const bundleInfo = getCSSBundleInfo();
  const recommendations: string[] = [];
  
  // Generate recommendations
  if (usage.usagePercentage < 50) {
    recommendations.push(
      `Only ${usage.usagePercentage.toFixed(1)}% of CSS rules are used. Consider code splitting or removing unused styles.`
    );
  }
  
  if (bundleInfo.totalSize > 50000) {
    recommendations.push(
      `Total CSS size is ${(bundleInfo.totalSize / 1024).toFixed(2)} KB. Consider splitting into route-specific bundles.`
    );
  }
  
  if (usage.unusedSize > 10000) {
    recommendations.push(
      `${usage.potentialSavings} of unused CSS detected. Run PurgeCSS or enable Tailwind's purge in production.`
    );
  }
  
  const largeStylesheets = bundleInfo.stylesheets.filter(s => s.size > 20000);
  if (largeStylesheets.length > 0) {
    recommendations.push(
      `${largeStylesheets.length} stylesheet(s) exceed 20KB. Consider splitting or lazy loading.`
    );
  }
  
  return {
    usage,
    bundleInfo,
    recommendations,
  };
}

/**
 * Log CSS optimization report to console
 * For development/debugging only
 */
export async function logCSSOptimizationReport(): Promise<void> {
  if (process.env.NODE_ENV === 'production') {
    console.warn('CSS optimization report should only run in development');
    return;
  }
  
  const report = await reportCSSOptimizations();
  
  console.group('📊 CSS Optimization Report');
  
  console.group('Usage Statistics');
  console.log(`Total Rules: ${report.usage.totalRules}`);
  console.log(`Used Rules: ${report.usage.usedRules}`);
  console.log(`Unused Rules: ${report.usage.unusedRules}`);
  console.log(`Usage: ${report.usage.usagePercentage.toFixed(1)}%`);
  console.log(`Potential Savings: ${report.usage.potentialSavings}`);
  console.groupEnd();
  
  console.group('Bundle Information');
  console.log(`Total Size: ${(report.bundleInfo.totalSize / 1024).toFixed(2)} KB`);
  console.log(`Total Rules: ${report.bundleInfo.totalRules}`);
  console.log('Stylesheets:');
  report.bundleInfo.stylesheets.forEach(sheet => {
    console.log(`  - ${sheet.href}: ${(sheet.size / 1024).toFixed(2)} KB (${sheet.rules} rules)`);
  });
  console.groupEnd();
  
  if (report.recommendations.length > 0) {
    console.group('💡 Recommendations');
    report.recommendations.forEach(rec => console.log(`• ${rec}`));
    console.groupEnd();
  }
  
  console.groupEnd();
}

/**
 * Tailwind CSS Purge Configuration Helper
 * Generates optimal purge configuration based on project structure
 */
export function generateTailwindPurgeConfig() {
  return {
    content: [
      './pages/**/*.{js,ts,jsx,tsx,mdx}',
      './components/**/*.{js,ts,jsx,tsx,mdx}',
      './app/**/*.{js,ts,jsx,tsx,mdx}',
      './lib/**/*.{js,ts,jsx,tsx}',
    ],
    // Safelist patterns for dynamically generated classes
    safelist: [
      // Gradient patterns
      /^from-/,
      /^to-/,
      /^bg-gradient-/,
      // Dynamic color classes
      /^bg-afya-/,
      /^text-afya-/,
      /^border-afya-/,
    ],
    // Blocklist - classes to always remove
    blocklist: [
      'container', // If using custom container
    ],
  };
}
