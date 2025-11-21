// Test script to verify admin session
// Run with: npx tsx scripts/test-admin-session.ts

async function testAdminSession() {
  const baseUrl = 'http://localhost:3000';
  
  console.log('Testing admin login and session...\n');
  
  // Step 1: Get CSRF token
  console.log('1. Getting CSRF token...');
  const csrfRes = await fetch(`${baseUrl}/api/auth/csrf`);
  const { csrfToken } = await csrfRes.json();
  console.log('✓ CSRF token obtained');
  
  // Step 2: Login
  console.log('\n2. Logging in...');
  const loginRes = await fetch(`${baseUrl}/api/auth/callback/credentials`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      csrfToken,
      email: 'afya@theafya.org',
      password: 'Mememe23!',
      json: 'true',
    }),
  });
  
  const cookies = loginRes.headers.getSetCookie();
  console.log('Login response status:', loginRes.status);
  console.log('Cookies set:', cookies.length);
  
  // Extract session token
  const sessionCookie = cookies.find(c => c.startsWith('next-auth.session-token') || c.startsWith('__Secure-next-auth.session-token'));
  
  if (!sessionCookie) {
    console.error('✗ No session cookie found!');
    return;
  }
  
  console.log('✓ Session cookie set');
  
  // Step 3: Check session
  console.log('\n3. Checking session...');
  const sessionRes = await fetch(`${baseUrl}/api/auth/session`, {
    headers: {
      Cookie: sessionCookie,
    },
  });
  
  const session = await sessionRes.json();
  console.log('Session:', JSON.stringify(session, null, 2));
  
  if (session?.user?.role === 'ADMIN') {
    console.log('\n✓ SUCCESS: Admin session is working!');
  } else {
    console.log('\n✗ FAIL: Session does not have ADMIN role');
  }
}

testAdminSession().catch(console.error);
