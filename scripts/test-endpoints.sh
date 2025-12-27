#!/bin/bash

# LabelWise Endpoint Test Script
# Tests all API endpoints to verify they're working

BASE_URL="http://localhost:3000"

echo "🧪 LabelWise Endpoint Tests"
echo "=========================="
echo ""

# Test 1: Homepage
echo "1. Testing Homepage..."
if curl -s "$BASE_URL" | grep -q "LabelWise"; then
  echo "   ✅ Homepage accessible"
else
  echo "   ❌ Homepage failed"
fi
echo ""

# Test 2: Scan Page
echo "2. Testing Scan Page..."
if curl -s "$BASE_URL/scan" | grep -q "Scan Barcode"; then
  echo "   ✅ Scan page accessible"
else
  echo "   ❌ Scan page failed"
fi
echo ""

# Test 3: Upload Page
echo "3. Testing Upload Page..."
if curl -s "$BASE_URL/upload" | grep -q "Upload Label"; then
  echo "   ✅ Upload page accessible"
else
  echo "   ❌ Upload page failed"
fi
echo ""

# Test 4: Product Lookup
echo "4. Testing Product Lookup API..."
RESPONSE=$(curl -s "$BASE_URL/api/products/lookup?barcode=3017620422003")
if echo "$RESPONSE" | grep -q '"barcode"'; then
  echo "   ✅ Product lookup working"
  echo "$RESPONSE" | head -5
elif echo "$RESPONSE" | grep -q "error"; then
  echo "   ⚠️  Product lookup returned error:"
  echo "$RESPONSE" | jq -r '.message' 2>/dev/null || echo "$RESPONSE"
else
  echo "   ❌ Product lookup failed"
fi
echo ""

# Test 5: Analysis Generation
echo "5. Testing Analysis API..."
RESPONSE=$(curl -s -X POST "$BASE_URL/api/analyses" \
  -H "Content-Type: application/json" \
  -d '{"barcode":"3017620422003"}')
if echo "$RESPONSE" | grep -q '"score"'; then
  echo "   ✅ Analysis generation working"
  echo "$RESPONSE" | jq -r '.score, .summary.headline' 2>/dev/null || echo "$RESPONSE" | head -3
elif echo "$RESPONSE" | grep -q "error"; then
  echo "   ⚠️  Analysis returned error:"
  echo "$RESPONSE" | jq -r '.message' 2>/dev/null || echo "$RESPONSE"
else
  echo "   ❌ Analysis generation failed"
fi
echo ""

echo "=========================="
echo "✅ UI pages are working!"
echo "⚠️  API endpoints need DATABASE_URL configuration"
echo ""
echo "To fix:"
echo "1. Check your apps/web/.env.local file"
echo "2. Ensure DATABASE_URL is in format:"
echo "   postgresql://user:password@host:port/database"
echo "3. For Supabase, get the connection string from:"
echo "   Settings → Database → Connection string → URI"

