#!/bin/bash

# Tapstead Test Runner
# Runs all tests for the Tapstead platform

set -e

echo "🧪 Running Tapstead Test Suite..."
echo "=================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run from project root."
    exit 1
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Run unit tests
echo ""
echo "🔬 Running Unit Tests..."
echo "------------------------"
npm run test:unit

# Run integration tests
echo ""
echo "🔗 Running Integration Tests..."
echo "-------------------------------"
npm run test:integration

# Run API tests
echo ""
echo "🌐 Running API Tests..."
echo "----------------------"
npm run test:api

# Run booking flow tests
echo ""
echo "🏠 Running Booking Flow Tests..."
echo "--------------------------------"
npm run test:booking

# Run performance tests
echo ""
echo "⚡ Running Performance Tests..."
echo "------------------------------"
npm run test:performance

# Generate coverage report
echo ""
echo "📊 Generating Coverage Report..."
echo "--------------------------------"
npm run test:coverage

echo ""
echo "✅ All tests completed successfully!"
echo "📈 Coverage report available at: coverage/index.html"
echo ""
echo "Next steps:"
echo "1. Review test coverage report"
echo "2. Fix any failing tests"
echo "3. Deploy to staging environment"
