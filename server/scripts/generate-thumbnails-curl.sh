#!/bin/bash

# Manual thumbnail generation using curl and Supabase transformations
# This script generates thumbnails for vantage-lane-launch-campaign-5-days assets

SUPABASE_URL="https://wjvuowstthlwgnndcmvq.supabase.co"
SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndqdnVvd3N0dGhsd2dubmRjbXZxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTU2MTMzNiwiZXhwIjoyMDkxMTM3MzM2fQ.LOQK7WzZpGnYhTqWfW2kQ8QhLqX9wR8sYqRkW8wR7sY"

# Assets to process - using arrays instead of associative arrays to avoid dot issues
FILENAMES=("business-travel-04.png" "airport-transfer-01.png" "event-transport-03.png" "hotel-arrival-02.png" "luxury-experience-05.png")
STORAGE_PATHS=(
  "4412d10a-b1a0-42f1-9f8a-4fee94f4af6b/campaigns/vantage-lane-launch-campaign-5-days/1775762477313-8af04ba4-c2a3-43aa-a9bb-b57c06b4cfe1.png"
  "4412d10a-b1a0-42f1-9f8a-4fee94f4af6b/campaigns/vantage-lane-launch-campaign-5-days/1775762475209-728230da-04c5-4099-8d0e-7846f1612f43.png"
  "4412d10a-b1a0-42f1-9f8a-4fee94f4af6b/campaigns/vantage-lane-launch-campaign-5-days/1775762478651-6e081e71-7d05-467d-9e7c-d2563b77ea50.png"
  "4412d10a-b1a0-42f1-9f8a-4fee94f4af6b/campaigns/vantage-lane-launch-campaign-5-days/1775762479968-966d9042-f0b3-4790-948b-5af2a6f39c81.png"
  "4412d10a-b1a0-42f1-9f8a-4fee94f4af6b/campaigns/vantage-lane-launch-campaign-5-days/1775762481260-76ba74ec-7b6d-4ce0-a4a0-4ea69647621f.png"
)

echo "Starting thumbnail generation for vantage-lane-launch-campaign-5-days assets..."
echo

SUCCESS_COUNT=0
FAILED_COUNT=0

for i in "${!FILENAMES[@]}"; do
  filename="${FILENAMES[$i]}"
  storage_path="${STORAGE_PATHS[$i]}"
  echo "Processing: $filename"
  
  # Extract base filename without extension
  base_name=$(basename "$filename" .png)
  
  # Generate paths
  thumb_path="4412d10a-b1a0-42f1-9f8a-4fee94f4af6b/campaigns/vantage-lane-launch-campaign-5-days/thumbnails/${base_name}_thumb.png"
  small_path="4412d10a-b1a0-42f1-9f8a-4fee94f4af6b/campaigns/vantage-lane-launch-campaign-5-days/thumbnails/${base_name}_small.png"
  
  # Generate thumb (150x150)
  echo "  Generating thumb (150x150)..."
  thumb_url="${SUPABASE_URL}/rest/v1/storage/v1/render/image/public/media-assets/${storage_path}?width=150&height=150&quality=85&format=png"
  
  if curl -s "$thumb_url" -o "/tmp/${base_name}_thumb.png"; then
    # Upload thumb
    upload_response=$(curl -s -X POST "${SUPABASE_URL}/rest/v1/storage/v1/object/media-assets/${thumb_path}" \
      -H "Authorization: Bearer ${SERVICE_ROLE_KEY}" \
      -H "apikey: ${SERVICE_ROLE_KEY}" \
      -F "file=@/tmp/${base_name}_thumb.png")
    
    if [[ $? -eq 0 ]]; then
      echo "  â\u009c Thumb uploaded successfully"
    else
      echo "  â\u009d Failed to upload thumb: $upload_response"
      ((FAILED_COUNT++))
      continue
    fi
  else
    echo "  â\u009d Failed to generate thumb"
    ((FAILED_COUNT++))
    continue
  fi
  
  # Generate small (300x300)
  echo "  Generating small (300x300)..."
  small_url="${SUPABASE_URL}/rest/v1/storage/v1/render/image/public/media-assets/${storage_path}?width=300&height=300&quality=85&format=png"
  
  if curl -s "$small_url" -o "/tmp/${base_name}_small.png"; then
    # Upload small
    upload_response=$(curl -s -X POST "${SUPABASE_URL}/rest/v1/storage/v1/object/media-assets/${small_path}" \
      -H "Authorization: Bearer ${SERVICE_ROLE_KEY}" \
      -H "apikey: ${SERVICE_ROLE_KEY}" \
      -F "file=@/tmp/${base_name}_small.png")
    
    if [[ $? -eq 0 ]]; then
      echo "  â\u009c Small uploaded successfully"
      ((SUCCESS_COUNT++))
    else
      echo "  â\u009d Failed to upload small: $upload_response"
      ((FAILED_COUNT++))
    fi
  else
    echo "  â\u009d Failed to generate small"
    ((FAILED_COUNT++))
  fi
  
  # Cleanup temp files
  rm -f "/tmp/${base_name}_thumb.png" "/tmp/${base_name}_small.png"
  echo
done

echo "=== THUMBNAIL GENERATION SUMMARY ==="
echo "Successful: $SUCCESS_COUNT"
echo "Failed: $FAILED_COUNT"
echo "Total processed: $((SUCCESS_COUNT + FAILED_COUNT))"

if (( SUCCESS_COUNT > 0 )); then
  SUCCESS_RATE=$(echo "scale=1; $SUCCESS_COUNT * 100 / ($SUCCESS_COUNT + $FAILED_COUNT)" | bc)
  echo "Success rate: ${SUCCESS_RATE}%"
fi
