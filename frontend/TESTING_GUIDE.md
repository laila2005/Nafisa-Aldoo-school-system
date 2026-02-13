# Testing Infrastructure

## Overview

This project uses a comprehensive testing approach with Jest and React Testing Library to ensure code quality and reliability across all components and pages.

## Testing Stack

- **Jest**: Test runner and assertion library
- **React Testing Library**: Component testing utilities
- **MSW (Mock Service Worker)**: API mocking for integration tests
- **@testing-library/jest-dom**: Custom matchers for DOM testing
- **@testing-library/user-event**: User interaction simulation

## Test Structure

```
frontend/src/
├── test-utils.tsx              # Custom render with providers
├── setupTests.ts               # Global test configuration
├── mocks/
│   ├── handlers.ts            # MSW API handlers
│   └── server.ts              # MSW server setup
├── components/
│   └── common/
│       └── __tests__/         # Component tests
│           ├── Button.test.tsx
│           ├── Input.test.tsx
│           ├── Card.test.tsx
│           ├── Modal.test.tsx
│           ├── Table.test.tsx
│           ├── Pagination.test.tsx
│           └── SearchBar.test.tsx
└── pages/
    └── __tests__/             # Integration tests
        └── StudentsPage.test.tsx
```

## Running Tests

### Run all tests
```bash
npm test
```

### Run tests in watch mode
```bash
npm run test:watch
```

### Generate coverage report
```bash
npm run test:coverage
```

### Run specific test file
```bash
npm test Button.test.tsx
```

### Run tests matching pattern
```bash
npm test -- --testNamePattern="renders"
```

## Test Coverage

Current coverage thresholds:
- **Lines**: 80%
- **Statements**: 80%
- **Functions**: 70%
- **Branches**: 70%

Coverage reports are generated in:
- `coverage/lcov-report/index.html` - HTML report
- `coverage/lcov.info` - LCOV format
- Console output during test runs

## Writing Tests

### Component Tests

Component tests focus on individual UI components in isolation:

```typescript
import { render, screen, fireEvent } from '../../test-utils';
import { Button } from '../Button';

describe('Button Component', () => {
  it('renders with children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### Integration Tests

Integration tests verify that multiple components work together:

```typescript
import { render, screen, fireEvent, waitFor } from '../../test-utils';
import { StudentsPage } from '../StudentsPage';

describe('StudentsPage Integration Tests', () => {
  it('loads and displays students', async () => {
    render(<StudentsPage />);
    
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
  });
});
```

### Testing with Providers

Use the custom `render` function from `test-utils.tsx` to automatically wrap components with necessary providers:

```typescript
import { render } from '../../test-utils';

// Automatically wraps with BrowserRouter, LanguageProvider, SchoolProvider
render(<YourComponent />);
```

### Mock Data

Use mock data generators from `test-utils.tsx`:

```typescript
import { mockStudent, mockTeacher, mockCourse } from '../../test-utils';

const student = mockStudent();
const teacher = mockTeacher({ firstName: 'Jane' });
const course = mockCourse({ teacherId: teacher.id });
```

### API Mocking with MSW

MSW handlers in `mocks/handlers.ts` automatically mock API calls:

```typescript
// MSW will intercept this request and return mock data
const response = await fetch('/api/students');
const data = await response.json();
```

To override handlers for specific tests:

```typescript
import { rest } from 'msw';
import { server } from '../../mocks/server';

test('handles API error', async () => {
  server.use(
    rest.get('/api/students', (req, res, ctx) => {
      return res(ctx.status(500), ctx.json({ error: 'Server error' }));
    })
  );
  
  render(<StudentsPage />);
  
  await waitFor(() => {
    expect(screen.getByText(/error/i)).toBeInTheDocument();
  });
});
```

## Test Categories

### 1. Component Tests

**Location**: `components/common/__tests__/`

Test individual components in isolation:
- Rendering with different props
- User interactions (click, type, hover)
- State changes
- Accessibility (ARIA attributes, keyboard navigation)
- Styling variants
- Edge cases

**Coverage**:
- ✅ Button (12 test suites)
- ✅ Input (10 test suites)
- ✅ Card (6 test suites)
- ✅ Modal (5 test suites)
- ✅ Table (7 test suites)
- ✅ Pagination (7 test suites)
- ✅ SearchBar (9 test suites)

### 2. Integration Tests

**Location**: `pages/__tests__/`

Test complete page functionality with multiple components:
- Data fetching and display
- Search and filtering
- Pagination
- Sorting
- CRUD operations
- User workflows

**Coverage**:
- ✅ StudentsPage (12 test suites)
- 🔄 TeachersPage (planned)
- 🔄 CoursesPage (planned)
- 🔄 GradesPage (planned)

### 3. API Mocking

**Location**: `mocks/`

Mock API endpoints for consistent testing:
- ✅ Students CRUD operations
- ✅ Teachers CRUD operations
- ✅ Courses CRUD operations
- ✅ Grades operations
- ✅ Authentication

## Best Practices

### 1. Use Semantic Queries

Prefer queries that resemble how users interact:

```typescript
// Good ✅
screen.getByRole('button', { name: /submit/i });
screen.getByLabelText('Email');
screen.getByText('Welcome');

// Avoid ❌
screen.getByTestId('submit-button');
screen.getByClassName('email-input');
```

### 2. Test Behavior, Not Implementation

```typescript
// Good ✅
it('displays success message after form submission', async () => {
  render(<LoginForm />);
  
  fireEvent.change(screen.getByLabelText('Email'), {
    target: { value: 'user@example.com' }
  });
  fireEvent.click(screen.getByRole('button', { name: /login/i }));
  
  await waitFor(() => {
    expect(screen.getByText(/success/i)).toBeInTheDocument();
  });
});

// Avoid ❌
it('sets loading state to true on submit', () => {
  // Testing internal state instead of user-visible behavior
});
```

### 3. Use waitFor for Async Operations

```typescript
// Good ✅
await waitFor(() => {
  expect(screen.getByText('Loaded')).toBeInTheDocument();
});

// Avoid ❌
setTimeout(() => {
  expect(screen.getByText('Loaded')).toBeInTheDocument();
}, 1000);
```

### 4. Clean Up After Tests

```typescript
describe('MyComponent', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  
  // Tests...
});
```

### 5. Test Accessibility

```typescript
it('is accessible', () => {
  render(<Button>Click me</Button>);
  
  const button = screen.getByRole('button');
  expect(button).toHaveAttribute('type', 'button');
  expect(button).not.toHaveAttribute('aria-disabled', 'true');
});
```

## Accessibility Testing

All component tests include accessibility checks:

- **ARIA attributes**: Proper role, aria-label, aria-describedby
- **Keyboard navigation**: Tab, Enter, Escape key handling
- **Screen reader support**: Meaningful labels and descriptions
- **Focus management**: Focus trap in modals, focus restoration
- **RTL support**: Right-to-left language support

Example:
```typescript
it('supports keyboard navigation', () => {
  render(<Modal isOpen={true} onClose={handleClose}>Content</Modal>);
  
  fireEvent.keyDown(document, { key: 'Escape' });
  
  expect(handleClose).toHaveBeenCalled();
});
```

## Common Patterns

### Testing Forms

```typescript
it('validates form input', async () => {
  render(<StudentForm onSubmit={handleSubmit} />);
  
  const nameInput = screen.getByLabelText('Name');
  const submitButton = screen.getByRole('button', { name: /submit/i });
  
  // Submit empty form
  fireEvent.click(submitButton);
  
  // Check validation message
  expect(await screen.findByText(/name is required/i)).toBeInTheDocument();
  
  // Fill and submit
  fireEvent.change(nameInput, { target: { value: 'John Doe' } });
  fireEvent.click(submitButton);
  
  await waitFor(() => {
    expect(handleSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'John Doe' })
    );
  });
});
```

### Testing Lists and Tables

```typescript
it('displays list of items', async () => {
  render(<StudentsList />);
  
  await waitFor(() => {
    const items = screen.getAllByRole('row');
    expect(items).toHaveLength(3); // Header + 2 data rows
  });
});
```

### Testing Modals

```typescript
it('opens and closes modal', () => {
  const { rerender } = render(
    <Modal isOpen={false} onClose={handleClose}>Content</Modal>
  );
  
  expect(screen.queryByText('Content')).not.toBeInTheDocument();
  
  rerender(
    <Modal isOpen={true} onClose={handleClose}>Content</Modal>
  );
  
  expect(screen.getByText('Content')).toBeInTheDocument();
});
```

### Testing Search and Filter

```typescript
it('filters results based on search', async () => {
  render(<StudentsPage />);
  
  await waitFor(() => {
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });
  
  const searchInput = screen.getByPlaceholderText(/search/i);
  fireEvent.change(searchInput, { target: { value: 'Jane' } });
  
  await waitFor(() => {
    expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
  });
});
```

## Debugging Tests

### View DOM Output

```typescript
import { render, screen } from '@testing-library/react';

const { debug } = render(<Component />);
debug(); // Prints current DOM
screen.debug(); // Prints current screen state
```

### Check Available Queries

```typescript
screen.logTestingPlaygroundURL(); // Opens interactive query builder
```

### Run Single Test

```bash
npm test -- --testNamePattern="renders button"
```

### Verbose Output

```bash
npm test -- --verbose
```

## Continuous Integration

Tests run automatically on:
- Every commit (pre-commit hook)
- Pull requests (CI/CD pipeline)
- Before deployment

CI/CD will fail if:
- Any test fails
- Coverage drops below thresholds
- Linting errors

## Next Steps

1. **Expand Coverage**: Add more integration tests for remaining pages
2. **E2E Tests**: Consider Cypress or Playwright for end-to-end testing
3. **Visual Regression**: Add screenshot comparison testing
4. **Performance**: Add performance benchmarks
5. **Mutation Testing**: Use Stryker for mutation testing

## Resources

- [Jest Documentation](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)
- [MSW Documentation](https://mswjs.io/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [Accessibility Testing](https://testing-library.com/docs/queries/about/#priority)

## Troubleshooting

### Tests Timing Out

Increase timeout in specific tests:
```typescript
jest.setTimeout(10000); // 10 seconds
```

### Act Warnings

Wrap state updates in `waitFor`:
```typescript
await waitFor(() => {
  expect(screen.getByText('Updated')).toBeInTheDocument();
});
```

### MSW Not Working

Check that MSW server is properly set up in `setupTests.ts`:
```typescript
import { server } from './mocks/server';
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

### Coverage Not Accurate

Clear cache and regenerate:
```bash
npm test -- --clearCache
npm run test:coverage
```

---

**Last Updated**: Phase 3 Testing Infrastructure Implementation
**Test Count**: 60+ individual test cases across 8 test files
**Coverage**: Component library (100%), Integration tests (started)
