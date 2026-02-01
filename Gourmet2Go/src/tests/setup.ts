import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';
import '@testing-library/jest-dom';

expect.extend(matchers);

// This is like @AfterEach in JUnit, it runs after each test and performs cleanup
afterEach(() => {
  cleanup();
});