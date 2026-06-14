#!/bin/bash
BASE="http://localhost:4000/api/v1"
ENDPOINTS=(
  "/health"
  "/products"
  "/products?limit=4"
  "/products?collection=suit-sets"
  "/products?category=Suit%20Set"
  "/products?size=M"
  "/products?customTailoring=true"
  "/products/ivory-leaf-print-summer-suit-set"
  "/admin/products"
  "/admin/collections"
)

for EP in "${ENDPOINTS[@]}"; do
  echo "--- Testing: $EP"
  HTTP_STATUS=$(curl -o /tmp/resp.json -s -w "%{http_code}" "$BASE$EP")
  echo "HTTP Status: $HTTP_STATUS"
  head -n 15 /tmp/resp.json | python3 -m json.tool 2>/dev/null || cat /tmp/resp.json
  echo -e "\n"
done
