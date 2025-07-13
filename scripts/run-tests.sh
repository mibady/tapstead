#!/bin/bash

echo "🧪 Running Tapstead Integration Tests..."
echo "======================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Set test environment
export NODE_ENV=test

# Function to run test and check result
run_test() {
    local test_name=$1
    local test_command=$2
    
    echo -e "${BLUE}📋 Running $test_name...${NC}"
    
    if eval $test_command; then
        echo -e "${GREEN}✅ $test_name passed${NC}"
        return 0
    else
        echo -e "${RED}❌ $test_name failed${NC}"
        return 1
    fi
}

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📦 Installing dependencies...${NC}"
    npm install
fi

# Run type checking first
echo -e "${BLUE}🔍 Running TypeScript checks...${NC}"
if npm run typecheck; then
    echo -e "${GREEN}✅ TypeScript checks passed${NC}"
else
    echo -e "${RED}❌ TypeScript checks failed${NC}"
    exit 1
fi

# Initialize test results
total_tests=0
passed_tests=0

# Run unit tests (integrations and AI)
if run_test "Unit Tests (Integrations & AI)" "npm run test:unit"; then
    ((passed_tests++))
fi
((total_tests++))

# Run API tests
if run_test "API Tests" "npm run test:api"; then
    ((passed_tests++))
fi
((total_tests++))

# Run component tests
if run_test "Component Tests" "npm run test:components"; then
    ((passed_tests++))
fi
((total_tests++))

# Generate coverage report
echo -e "${BLUE}📊 Generating Coverage Report...${NC}"
if npm run test:coverage; then
    echo -e "${GREEN}✅ Coverage report generated${NC}"
    ((passed_tests++))
else
    echo -e "${YELLOW}⚠️  Coverage report generation had issues${NC}"
fi
((total_tests++))

# Summary
echo ""
echo "======================================"
echo -e "${BLUE}📈 Test Summary${NC}"
echo "======================================"
echo -e "Total test suites: $total_tests"
echo -e "Passed: ${GREEN}$passed_tests${NC}"
echo -e "Failed: ${RED}$((total_tests - passed_tests))${NC}"

if [ $passed_tests -eq $total_tests ]; then
    echo -e "${GREEN}🎉 All tests completed successfully!${NC}"
    echo -e "${BLUE}📊 Check coverage report at: coverage/index.html${NC}"
    exit 0
else
    echo -e "${RED}💥 Some tests failed. Please check the output above.${NC}"
    exit 1
fi
