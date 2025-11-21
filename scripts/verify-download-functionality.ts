/**
 * Comprehensive verification of packet download functionality
 */

import { promises as fs } from 'fs';
import path from 'path';

async function main() {
  console.log('🔍 Verifying Packet Download Functionality\n');

  const checks = {
    downloadEndpoint: false,
    packetViewer: false,
    downloadButton: false,
    pdfHeaders: false,
    storageDirectory: false,
    allPacketTypes: false
  };

  // 1. Verify download endpoint exists
  console.log('1️⃣  Checking download endpoint...');
  try {
    const endpointPath = 'app/api/packets/[id]/download/route.ts';
    const endpointCode = await fs.readFile(endpointPath, 'utf-8');
    
    // Check for required functionality
    const hasAuth = endpointCode.includes('requireAuth') || endpointCode.includes('getServerSession');
    const hasAuthorization = endpointCode.includes('canAccessPacket');
    const hasPdfRead = endpointCode.includes('fs.readFile');
    const hasContentType = endpointCode.includes('application/pdf');
    const hasContentDisposition = endpointCode.includes('Content-Disposition');
    
    console.log(`   ✓ Endpoint exists at: ${endpointPath}`);
    console.log(`   ${hasAuth ? '✓' : '✗'} Authentication check`);
    console.log(`   ${hasAuthorization ? '✓' : '✗'} Authorization check`);
    console.log(`   ${hasPdfRead ? '✓' : '✗'} PDF file reading`);
    console.log(`   ${hasContentType ? '✓' : '✗'} Content-Type header (application/pdf)`);
    console.log(`   ${hasContentDisposition ? '✓' : '✗'} Content-Disposition header (attachment)`);
    
    checks.downloadEndpoint = hasAuth && hasAuthorization && hasPdfRead;
    checks.pdfHeaders = hasContentType && hasContentDisposition;
  } catch (error) {
    console.log('   ✗ Download endpoint not found or error reading file');
  }

  // 2. Verify PacketViewer component
  console.log('\n2️⃣  Checking PacketViewer component...');
  try {
    const viewerPath = 'components/dashboard/PacketViewer.tsx';
    const viewerCode = await fs.readFile(viewerPath, 'utf-8');
    
    const hasDownloadHandler = viewerCode.includes('handleDownload');
    const hasDownloadEndpoint = viewerCode.includes('/api/packets/${packetId}/download') || 
                                viewerCode.includes('/api/packets/') && viewerCode.includes('/download');
    const hasDownloadButton = viewerCode.includes('Download PDF') || viewerCode.includes('download');
    const hasPdfCheck = viewerCode.includes('pdfUrl');
    
    console.log(`   ✓ Component exists at: ${viewerPath}`);
    console.log(`   ${hasDownloadHandler ? '✓' : '✗'} Download handler function`);
    console.log(`   ${hasDownloadEndpoint ? '✓' : '✗'} Download endpoint integration`);
    console.log(`   ${hasDownloadButton ? '✓' : '✗'} Download button UI`);
    console.log(`   ${hasPdfCheck ? '✓' : '✗'} PDF availability check`);
    
    checks.packetViewer = hasDownloadHandler && hasDownloadEndpoint;
    checks.downloadButton = hasDownloadButton && hasPdfCheck;
  } catch (error) {
    console.log('   ✗ PacketViewer component not found or error reading file');
  }

  // 3. Verify storage directory
  console.log('\n3️⃣  Checking PDF storage directory...');
  const storagePath = process.env.PDF_STORAGE_PATH || './public/packets';
  try {
    await fs.access(storagePath);
    const files = await fs.readdir(storagePath);
    const pdfFiles = files.filter(f => f.endsWith('.pdf'));
    
    console.log(`   ✓ Storage directory exists: ${storagePath}`);
    console.log(`   ✓ PDF files found: ${pdfFiles.length}`);
    
    if (pdfFiles.length > 0) {
      console.log(`   Sample files:`);
      pdfFiles.slice(0, 3).forEach(file => {
        console.log(`     - ${file}`);
      });
    }
    
    checks.storageDirectory = true;
  } catch (error) {
    console.log(`   ✗ Storage directory not accessible: ${storagePath}`);
  }

  // 4. Verify all packet types are supported
  console.log('\n4️⃣  Checking packet type support...');
  try {
    const endpointCode = await fs.readFile('app/api/packets/[id]/download/route.ts', 'utf-8');
    
    const packetTypes = [
      'NUTRITION',
      'WORKOUT', 
      'PERFORMANCE',
      'YOUTH',
      'RECOVERY',
      'WELLNESS',
      'INTRO'
    ];
    
    // Check if formatPacketType function handles all types
    const hasFormatFunction = endpointCode.includes('formatPacketType');
    
    console.log(`   ${hasFormatFunction ? '✓' : '✗'} Packet type formatting function`);
    
    packetTypes.forEach(type => {
      const hasType = endpointCode.includes(type);
      console.log(`   ${hasType ? '✓' : '⚠️ '} ${type} packet type`);
    });
    
    checks.allPacketTypes = hasFormatFunction;
  } catch (error) {
    console.log('   ✗ Error checking packet types');
  }

  // 5. Summary
  console.log('\n📊 Verification Summary:');
  console.log('   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`   Download Endpoint:        ${checks.downloadEndpoint ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`   PDF Headers:              ${checks.pdfHeaders ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`   PacketViewer Component:   ${checks.packetViewer ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`   Download Button:          ${checks.downloadButton ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`   Storage Directory:        ${checks.storageDirectory ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`   All Packet Types:         ${checks.allPacketTypes ? '✅ PASS' : '❌ FAIL'}`);
  console.log('   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  const allPassed = Object.values(checks).every(v => v === true);
  
  if (allPassed) {
    console.log('\n✅ All download functionality checks PASSED!');
  } else {
    console.log('\n⚠️  Some checks failed. Review the details above.');
  }

  // 6. Testing instructions
  console.log('\n📝 Manual Testing Checklist:');
  console.log('   [ ] 1. Complete an intake form to generate a packet');
  console.log('   [ ] 2. Navigate to dashboard and view the packet');
  console.log('   [ ] 3. Verify "Download PDF" button is visible');
  console.log('   [ ] 4. Click download button');
  console.log('   [ ] 5. Verify PDF downloads with correct filename format');
  console.log('   [ ] 6. Open PDF and verify content renders correctly');
  console.log('   [ ] 7. Test with different packet types (Nutrition, Workout, etc.)');
  console.log('   [ ] 8. Verify unauthorized users cannot download packets');
  
  console.log('\n💡 To generate test packets, run:');
  console.log('   npm run test-pdf');
}

main()
  .catch((e) => {
    console.error('❌ Error during verification:', e);
    process.exit(1);
  });
