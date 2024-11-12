// setupTests.ts
import "@testing-library/jest-dom";
import { expect, vi, beforeAll, afterAll, afterEach } from "vitest";
import { cleanup } from "@testing-library/react";
import * as matchers from "@testing-library/jest-dom/matchers";

// Extend Vitest's expect with React Testing Library matchers
expect.extend(matchers);

// Mock ResizeObserver to prevent errors during testing
beforeAll(() => {
  global.ResizeObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }));
});

// Clean up the DOM after each test run to prevent memory leaks
afterEach(() => {
  cleanup();
});

// Clear all mocks after all tests are complete
afterAll(() => {
  vi.clearAllMocks();
});

// Mock matchMedia for testing responsive components
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false, // Adjust to true for testing specific responsive behavior
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});
