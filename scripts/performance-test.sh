#!/bin/bash

# Tapstead Performance Test Runner
# Tests the performance of critical booking endpoints

set -e

echo "⚡ Running Tapstead Performance Tests..."
echo "======================================="

# Configuration
BASE_URL="http://localhost:3000"
CONCURRENT_USERS=10
TEST_DURATION=30
BOOKING_ENDPOINT="/api/bookings"
PRICING_ENDPOINT="/api/stripe/prices"

# Check if server is running
echo "🔍 Checking if server is running..."
if ! curl -s "$BASE_URL/api/health" > /dev/null; then
    echo "❌ Server not running. Please start with: npm run dev"
    exit 1
fi

echo "✅ Server is running"

# Test 1: Pricing Calculator Performance
echo ""
echo "💰 Testing Pricing Calculator Performance..."
echo "--------------------------------------------"

# Create test payload
PRICING_PAYLOAD='{
  "size": "medium",
  "frequency": "weekly",
  "addons": {
    "deepClean": true
  }
}'

echo "Testing pricing endpoint with $CONCURRENT_USERS concurrent requests..."

# Use Apache Bench if available, otherwise use curl
if command -v ab &> /dev/null; then
    ab -n 100 -c $CONCURRENT_USERS -p <(echo "$PRICING_PAYLOAD") -T application/json "$BASE_URL$PRICING_ENDPOINT"
else
    echo "Running sequential requests (install apache2-utils for concurrent testing)..."
    for i in {1..10}; do
        start_time=$(date +%s%N)
        curl -s -X POST \
             -H "Content-Type: application/json" \
             -d "$PRICING_PAYLOAD" \
             "$BASE_URL$PRICING_ENDPOINT" > /dev/null
        end_time=$(date +%s%N)
        duration=$(( (end_time - start_time) / 1000000 ))
        echo "Request $i: ${duration}ms"
    done
fi

# Test 2: Booking Creation Performance
echo ""
echo "📅 Testing Booking Creation Performance..."
echo "-----------------------------------------"

BOOKING_PAYLOAD='{
  "size": "small",
  "frequency": "one-time",
  "addons": {},
  "scheduledDate": "2024-02-15T10:00:00Z",
  "address": {
    "street": "123 Test St",
    "city": "Test City",
    "state": "CA",
    "zipCode": "12345"
  },
  "customerInfo": {
    "firstName": "Test",
    "lastName": "User",
    "email": "test@example.com",
    "phone": "555-0123"
  }
}'

echo "Testing booking endpoint..."

for i in {1..5}; do
    start_time=$(date +%s%N)
    response=$(curl -s -X POST \
                    -H "Content-Type: application/json" \
                    -d "$BOOKING_PAYLOAD" \
                    "$BASE_URL$BOOKING_ENDPOINT")
    end_time=$(date +%s%N)
    duration=$(( (end_time - start_time) / 1000000 ))
    
    if echo "$response" | grep -q '"success":true'; then
        echo "✅ Booking $i: ${duration}ms"
    else
        echo "❌ Booking $i failed: ${duration}ms"
    fi
done

# Test 3: Cache Performance
echo ""
echo "🚀 Testing Redis Cache Performance..."
echo "------------------------------------"

echo "Testing cache hit performance..."
for i in {1..5}; do
    start_time=$(date +%s%N)
    curl -s -X POST \
         -H "Content-Type: application/json" \
         -d "$PRICING_PAYLOAD" \
         "$BASE_URL$PRICING_ENDPOINT" > /dev/null
    end_time=$(date +%s%N)
    duration=$(( (end_time - start_time) / 1000000 ))
    echo "Cache request $i: ${duration}ms"
done

# Test 4: Rate Limiting
echo ""
echo "🛡️ Testing Rate Limiting..."
echo "---------------------------"

echo "Sending rapid requests to test rate limiting..."
for i in {1..15}; do
    response=$(curl -s -w "%{http_code}" -X POST \
                    -H "Content-Type: application/json" \
                    -d "$PRICING_PAYLOAD" \
                    "$BASE_URL$PRICING_ENDPOINT")
    
    http_code="${response: -3}"
    if [ "$http_code" = "429" ]; then
        echo "✅ Rate limiting triggered at request $i"
        break
    elif [ "$i" = "15" ]; then
        echo "⚠️ Rate limiting not triggered after 15 requests"
    fi
done

echo ""
echo "🎉 Performance tests completed!"
echo ""
echo "Performance Summary:"
echo "- Pricing calculations should be < 100ms (cached)"
echo "- Booking creation should be < 500ms"
echo "- Rate limiting should trigger after 10 requests/hour"
echo ""
echo "💡 Tips for optimization:"
echo "- Monitor Redis cache hit rates"
echo "- Optimize database queries"
echo "- Consider CDN for static assets"
