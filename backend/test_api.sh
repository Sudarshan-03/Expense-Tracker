#!/bin/bash

BASE_URL="http://localhost:3000"
IDEMPOTENCY_KEY="test-key-$(date +%s)"

echo "1. Testing POST /expenses (First Attempt)..."
curl -s -X POST "$BASE_URL/expenses" \
  -H "Content-Type: application/json" \
  -H "Idempotency-Key: $IDEMPOTENCY_KEY" \
  -d '{
    "amount": 1000,
    "category": "Food",
    "description": "Lunch",
    "date": "2023-10-27T12:00:00Z"
  }' | json_pp

echo -e "\n\n2. Testing POST /expenses (Idempotency Retry)..."
curl -s -X POST "$BASE_URL/expenses" \
  -H "Content-Type: application/json" \
  -H "Idempotency-Key: $IDEMPOTENCY_KEY" \
  -d '{
    "amount": 5000,
    "category": "Tech",
    "description": "This should be ignored",
    "date": "2023-10-28T12:00:00Z"
  }' | json_pp

echo -e "\n\n3. Testing Validation (Negative Amount)..."
curl -s -X POST "$BASE_URL/expenses" \
  -H "Content-Type: application/json" \
  -H "Idempotency-Key: invalid-test-$(date +%s)" \
  -d '{
    "amount": -100,
    "category": "Invalid",
    "description": "Should fail",
    "date": "2023-10-27T12:00:00Z"
  }' | json_pp

echo -e "\n\n4. Testing GET /expenses..."
curl -s "$BASE_URL/expenses" | json_pp

echo -e "\n\n5. Testing GET /expenses?category=Food..."
curl -s "$BASE_URL/expenses?category=Food" | json_pp
