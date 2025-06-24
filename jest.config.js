/** @type {import('jest').Config} */
const config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: 'tsconfig.json',
    }],
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  // Only run .ts test files
  testMatch: [
    '**/__tests__/**/*.ts',
    '**/?(*.)+(spec|test).ts'
  ],
  // Explicitly ignore these patterns
  testPathIgnorePatterns: [
    '/node_modules/',
    '\\.js$',
    '\\.tsx$',
    '\\.d\\.ts$',
    '\\.bak$'
  ],
  // Clear any caches between tests
  clearMocks: true,
  // Indicates whether the coverage information should be collected
  collectCoverage: false,
  // The directory where Jest should output its coverage files
  coverageDirectory: 'coverage',
  // Verbose output for better debugging
  verbose: true,
};

module.exports = config;
