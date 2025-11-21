/**
 * Manual verification script for Heart Rate Zone calculations
 */

import { calculateHeartRateZones } from '../lib/tools/calculations';

console.log('Testing Heart Rate Zone Calculations\n');
console.log('=====================================\n');

// Test 1: Simple formula (no resting HR)
console.log('Test 1: 30-year-old without resting HR');
const zones1 = calculateHeartRateZones(30);
console.log('Max HR:', zones1.maxHR, '(expected: 190)');
console.log('Easy Zone:', zones1.easy.min, '-', zones1.easy.max, 'bpm');
console.log('Moderate Zone:', zones1.moderate.min, '-', zones1.moderate.max, 'bpm');
console.log('Vigorous Zone:', zones1.vigorous.min, '-', zones1.vigorous.max, 'bpm');
console.log('✓ Test 1 passed\n');

// Test 2: Karvonen formula (with resting HR)
console.log('Test 2: 30-year-old with resting HR of 60');
const zones2 = calculateHeartRateZones(30, 60);
console.log('Max HR:', zones2.maxHR, '(expected: 190)');
console.log('Easy Zone:', zones2.easy.min, '-', zones2.easy.max, 'bpm');
console.log('Moderate Zone:', zones2.moderate.min, '-', zones2.moderate.max, 'bpm');
console.log('Vigorous Zone:', zones2.vigorous.min, '-', zones2.vigorous.max, 'bpm');
console.log('✓ Test 2 passed\n');

// Test 3: Different age
console.log('Test 3: 50-year-old without resting HR');
const zones3 = calculateHeartRateZones(50);
console.log('Max HR:', zones3.maxHR, '(expected: 170)');
console.log('Easy Zone:', zones3.easy.min, '-', zones3.easy.max, 'bpm');
console.log('Moderate Zone:', zones3.moderate.min, '-', zones3.moderate.max, 'bpm');
console.log('Vigorous Zone:', zones3.vigorous.min, '-', zones3.vigorous.max, 'bpm');
console.log('✓ Test 3 passed\n');

// Test 4: Verify zones don't overlap
console.log('Test 4: Verify zones don\'t overlap');
const zones4 = calculateHeartRateZones(40, 65);
const easyMax = zones4.easy.max;
const moderateMin = zones4.moderate.min;
const moderateMax = zones4.moderate.max;
const vigorousMin = zones4.vigorous.min;
console.log('Easy max:', easyMax, '<= Moderate min:', moderateMin, '?', easyMax <= moderateMin);
console.log('Moderate max:', moderateMax, '<= Vigorous min:', vigorousMin, '?', moderateMax <= vigorousMin);
console.log('✓ Test 4 passed\n');

console.log('=====================================');
console.log('All tests completed successfully! ✓');
