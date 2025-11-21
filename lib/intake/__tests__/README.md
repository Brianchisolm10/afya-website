# Intake System Tests

This directory contains comprehensive tests for the Dynamic Intake and Packet Generation System.

## Test Files

### Unit Tests
- **`branching-logic.test.ts`**: Tests conditional logic evaluation
- **`packet-routing.test.ts`**: Tests packet type determination
- **`validation.test.ts`**: Tests question validation rules
- **`template-engine.test.ts`**: Tests template rendering and placeholders

### Integration Tests
- **`integration.test.ts`**: Tests complete workflows from intake to packet generation

## Running Tests

### Run All Tests
```bash
npm run test
```

### Run in Watch Mode
```bash
npm run test:watch
```

### Run with UI
```bash
npm run test:ui
```

### Run Specific Test File
```bash
npm run test -- lib/intake/__tests__/branching-logic.test.ts
npm run test -- lib/intake/__tests__/integration.test.ts
```

### Run Tests Matching Pattern
```bash
npm run test -- --grep "nutrition"
npm run test -- --grep "packet generation"
```

## Test Structure

### Unit Tests
Unit tests focus on individual functions and components:
- Fast execution
- No database dependencies
- Isolated logic testing
- Pure function validation

### Integration Tests
Integration tests validate complete workflows:
- Database interactions
- Service orchestration
- End-to-end scenarios
- Multi-component integration

## Test Coverage

### Branching Logic (Unit)
- ✅ Equals conditions
- ✅ Contains conditions
- ✅ Greater than / Less than
- ✅ AND / OR / NOT logic
- ✅ Complex nested conditions

### Packet Routing (Unit)
- ✅ All client types
- ✅ Conditional packet inclusion
- ✅ Multiple packet scenarios
- ✅ Edge cases

### Validation (Unit)
- ✅ Required fields
- ✅ Min/max length
- ✅ Min/max values
- ✅ Email format
- ✅ Pattern matching
- ✅ Multiple validation rules

### Template Engine (Unit)
- ✅ Placeholder replacement
- ✅ Calculated values
- ✅ Missing value handling
- ✅ Nutrition calculations
- ✅ Workout calculations

### Integration Flows
- ✅ Complete intake submission
- ✅ Packet generation pipeline
- ✅ Progress tracking
- ✅ End-to-end user journeys
- ✅ Error handling
- ✅ Data integrity

## Writing New Tests

### Unit Test Example
```typescript
import { describe, test, expect } from 'vitest';

describe('MyFeature', () => {
  test('does something correctly', () => {
    const result = myFunction(input);
    expect(result).toBe(expected);
  });
});
```

### Integration Test Example
```typescript
import { describe, test, expect, beforeAll, afterAll } from 'vitest';
import { prisma } from '@/lib/db';

describe('MyIntegration', () => {
  beforeAll(async () => {
    // Setup test data
  });

  afterAll(async () => {
    // Cleanup test data
    await prisma.$disconnect();
  });

  test('complete workflow', async () => {
    // Test implementation
  });
});
```

## Best Practices

### 1. Test Isolation
- Each test should be independent
- Clean up test data after tests
- Don't rely on test execution order

### 2. Clear Assertions
- Use specific expectations
- Test one thing per test
- Provide meaningful test names

### 3. Realistic Data
- Use realistic test data
- Cover edge cases
- Test error conditions

### 4. Database Management
- Always clean up test data
- Handle foreign key constraints
- Use transactions when appropriate

## Debugging Tests

### View Test Output
```bash
npm run test -- --reporter=verbose
```

### Run Single Test
```bash
npm run test -- --grep "specific test name"
```

### Debug Mode
```bash
npm run test -- --inspect-brk
```

## Continuous Integration

Tests should be run:
- Before committing code
- In CI/CD pipeline
- Before deploying to production

## Troubleshooting

### Database Connection Issues
- Ensure DATABASE_URL is set
- Check database is accessible
- Verify Prisma schema is up to date

### Test Failures
- Check test data cleanup
- Verify database state
- Review error messages
- Check for race conditions

### Performance Issues
- Use test database
- Limit test data size
- Run tests in parallel when possible

## Additional Resources

- [Vitest Documentation](https://vitest.dev/)
- [Prisma Testing Guide](https://www.prisma.io/docs/guides/testing)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
