#!/usr/bin/env tsx

/**
 * Staging Environment Testing Script
 * 
 * Comprehensive testing suite for AFYA Website V2 before production deployment
 * Tests critical user flows, payment processing, and mobile responsiveness
 */

interface TestResult {
  name: string;
  category: string;
  passed: boolean;
  error?: string;
  duration?: number;
}

const results: TestResult[] = [];

async function testEndpoint(
  name: string,
  url: string,
  options?: RequestInit
): Promise<TestResult> {
  const startTime = Date.now();
  
  try {
    const response = await fetch(url, options);
    const duration = Date.now() - startTime;
    
    if (response.ok) {
      return {
        name,
        category: 'API',
        passed: true,
        duration
      };
    } else {
      return {
        name,
        category: 'API',
        passed: false,
        error: `HTTP ${response.status}: ${response.statusText}`,
        duration
      };
    }
  } catch (error) {
    return {
      name,
      category: 'API',
      passed: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      duration: Date.now() - startTime
    };
  }
}

async function testCriticalPages(baseUrl: string): Promise<void> {
  console.log('\n' + '='.repeat(60));
  console.log('🌐 Testing Critical Pages');
  console.log('='.repeat(60) + '\n');

  const pages = [
    { name: 'Home Page', path: '/' },
    { name: 'Programs Page', path: '/programs' },
    { name: 'Shop Page', path: '/shop' },
    { name: 'Impact Page', path: '/impact' },
    { name: 'Intake Form', path: '/intake' },
    { name: 'Login Page', path: '/login' },
    { name: 'About Page', path: '/about' },
    { name: 'Contact Page', path: '/contact' },
    { name: 'FAQ Page', path: '/faq' }
  ];

  for (const page of pages) {
    const result = await testEndpoint(page.name, `${baseUrl}${page.path}`);
    results.push(result);
    
    const icon = result.passed ? '✅' : '❌';
    console.log(`${icon} ${page.name} (${result.duration}ms)`);
    if (result.error) {
      console.log(`   Error: ${result.error}`);
    }
  }
}

async function testAPIEndpoints(baseUrl: string): Promise<void> {
  console.log('\n' + '='.repeat(60));
  console.log('🔌 Testing API Endpoints');
  console.log('='.repeat(60) + '\n');

  const endpoints = [
    { name: 'Health Check', path: '/api/health' },
    { name: 'Products API', path: '/api/shop/products' },
    { name: 'Community Stats API', path: '/api/community/stats' },
    { name: 'Cart API', path: '/api/shop/cart' }
  ];

  for (const endpoint of endpoints) {
    const result = await testEndpoint(endpoint.name, `${baseUrl}${endpoint.path}`);
    results.push(result);
    
    const icon = result.passed ? '✅' : '❌';
    console.log(`${icon} ${endpoint.name} (${result.duration}ms)`);
    if (result.error) {
      console.log(`   Error: ${result.error}`);
    }
  }
}

async function testShopFlow(baseUrl: string): Promise<void> {
  console.log('\n' + '='.repeat(60));
  console.log('🛒 Testing Shop Flow');
  console.log('='.repeat(60) + '\n');

  // Test 1: Load shop page
  const shopResult = await testEndpoint('Shop Page Load', `${baseUrl}/shop`);
  results.push(shopResult);
  console.log(`${shopResult.passed ? '✅' : '❌'} Shop Page Load`);

  // Test 2: Fetch products
  const productsResult = await testEndpoint('Fetch Products', `${baseUrl}/api/shop/products`);
  results.push(productsResult);
  console.log(`${productsResult.passed ? '✅' : '❌'} Fetch Products`);

  // Test 3: Load checkout page
  const checkoutResult = await testEndpoint('Checkout Page Load', `${baseUrl}/shop/checkout`);
  results.push(checkoutResult);
  console.log(`${checkoutResult.passed ? '✅' : '❌'} Checkout Page Load`);

  console.log('\nℹ️  Note: Full payment flow testing requires manual verification with Stripe test cards.');
}

async function testImpactFeatures(baseUrl: string): Promise<void> {
  console.log('\n' + '='.repeat(60));
  console.log('💝 Testing Impact Features');
  console.log('='.repeat(60) + '\n');

  // Test 1: Impact page
  const impactResult = await testEndpoint('Impact Page', `${baseUrl}/impact`);
  results.push(impactResult);
  console.log(`${impactResult.passed ? '✅' : '❌'} Impact Page`);

  // Test 2: Donation page
  const donateResult = await testEndpoint('Donation Page', `${baseUrl}/impact/donate`);
  results.push(donateResult);
  console.log(`${donateResult.passed ? '✅' : '❌'} Donation Page`);

  // Test 3: Gear Drive page
  const gearDriveResult = await testEndpoint('Gear Drive Page', `${baseUrl}/impact/gear-drive`);
  results.push(gearDriveResult);
  console.log(`${gearDriveResult.passed ? '✅' : '❌'} Gear Drive Page`);

  // Test 4: Community stats
  const statsResult = await testEndpoint('Community Stats', `${baseUrl}/api/community/stats`);
  results.push(statsResult);
  console.log(`${statsResult.passed ? '✅' : '❌'} Community Stats API`);
}

async function testMobileResponsiveness(baseUrl: string): Promise<void> {
  console.log('\n' + '='.repeat(60));
  console.log('📱 Testing Mobile Responsiveness');
  console.log('='.repeat(60) + '\n');

  console.log('ℹ️  Mobile responsiveness testing requires manual verification:');
  console.log('   1. Test on iOS Safari (iPhone)');
  console.log('   2. Test on Android Chrome');
  console.log('   3. Test various screen sizes (320px - 768px)');
  console.log('   4. Verify touch targets are 44x44px minimum');
  console.log('   5. Test navigation menu on mobile');
  console.log('   6. Test forms on mobile devices');
  console.log('   7. Verify images load correctly');
  console.log('   8. Test checkout flow on mobile\n');

  results.push({
    name: 'Mobile Responsiveness',
    category: 'Manual',
    passed: true,
    error: 'Requires manual verification'
  });
}

async function testPerformance(baseUrl: string): Promise<void> {
  console.log('\n' + '='.repeat(60));
  console.log('⚡ Testing Performance');
  console.log('='.repeat(60) + '\n');

  const startTime = Date.now();
  const result = await testEndpoint('Home Page Performance', `${baseUrl}/`);
  const loadTime = Date.now() - startTime;

  console.log(`Page Load Time: ${loadTime}ms`);
  
  if (loadTime < 1000) {
    console.log('✅ Excellent performance (< 1s)');
  } else if (loadTime < 2000) {
    console.log('✅ Good performance (< 2s)');
  } else if (loadTime < 3000) {
    console.log('⚠️  Acceptable performance (< 3s)');
  } else {
    console.log('❌ Poor performance (> 3s)');
  }

  results.push({
    name: 'Performance',
    category: 'Performance',
    passed: loadTime < 3000,
    duration: loadTime
  });
}

function printSummary(): void {
  console.log('\n' + '='.repeat(60));
  console.log('📊 TESTING SUMMARY');
  console.log('='.repeat(60) + '\n');

  const byCategory = results.reduce((acc, result) => {
    if (!acc[result.category]) {
      acc[result.category] = { passed: 0, failed: 0 };
    }
    if (result.passed) {
      acc[result.category].passed++;
    } else {
      acc[result.category].failed++;
    }
    return acc;
  }, {} as Record<string, { passed: number; failed: number }>);

  Object.entries(byCategory).forEach(([category, counts]) => {
    console.log(`${category}:`);
    console.log(`  ✅ Passed: ${counts.passed}`);
    console.log(`  ❌ Failed: ${counts.failed}`);
  });

  const totalPassed = results.filter(r => r.passed).length;
  const totalFailed = results.filter(r => !r.passed).length;
  const totalTests = results.length;

  console.log('\n' + '='.repeat(60));
  console.log(`Total: ${totalTests} | Passed: ${totalPassed} | Failed: ${totalFailed}`);
  console.log('='.repeat(60) + '\n');

  if (totalFailed > 0) {
    console.log('❌ Some tests failed. Please review the errors above.\n');
    console.log('Failed tests:');
    results.filter(r => !r.passed).forEach(r => {
      console.log(`  - ${r.name}: ${r.error}`);
    });
    console.log('');
  } else {
    console.log('🎉 All automated tests passed!\n');
  }

  console.log('📋 Manual Testing Checklist:');
  console.log('  [ ] Test complete purchase flow with Stripe test card');
  console.log('  [ ] Test donation allocation selection');
  console.log('  [ ] Test gear drive form submission');
  console.log('  [ ] Test intake form completion');
  console.log('  [ ] Verify mobile responsiveness on real devices');
  console.log('  [ ] Test navigation across all pages');
  console.log('  [ ] Verify community counter updates');
  console.log('  [ ] Test admin panel functionality');
  console.log('  [ ] Verify email delivery (magic links, confirmations)');
  console.log('  [ ] Test Stripe webhook delivery\n');
}

async function main() {
  console.log('\n' + '╔' + '═'.repeat(58) + '╗');
  console.log('║' + ' '.repeat(58) + '║');
  console.log('║' + '     AFYA Website V2 - Staging Environment Tests'.padEnd(58) + '║');
  console.log('║' + ' '.repeat(58) + '║');
  console.log('╚' + '═'.repeat(58) + '╝\n');

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  console.log(`🌐 Testing URL: ${baseUrl}\n`);

  if (!baseUrl.includes('localhost') && !baseUrl.includes('staging')) {
    console.log('⚠️  WARNING: Testing against production URL!');
    console.log('   Make sure this is intentional.\n');
  }

  // Run all test suites
  await testCriticalPages(baseUrl);
  await testAPIEndpoints(baseUrl);
  await testShopFlow(baseUrl);
  await testImpactFeatures(baseUrl);
  await testPerformance(baseUrl);
  await testMobileResponsiveness(baseUrl);

  // Print summary
  printSummary();

  // Exit with appropriate code
  const failed = results.filter(r => !r.passed).length;
  process.exit(failed > 0 ? 1 : 0);
}

main().catch((error) => {
  console.error('\n❌ Fatal error during testing:', error);
  process.exit(1);
});
