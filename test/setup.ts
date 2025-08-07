// Global test setup
global.console = {
  ...console,
  // Mock console methods during tests to avoid noise
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
  debug: jest.fn(),
};

// Mock environment variables for testing
process.env.NODE_ENV = 'test';
