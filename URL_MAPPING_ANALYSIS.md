# URL MAPPING ANALYSIS - EXACT FUNCTIONS IDENTIFIED

## **A. EXACT FUNCTIONS THAT DECIDE FINAL URL**

### **1. CalendarUpcomingPanel**
**Component:** `/components/premium/CalendarUpcomingPanel.tsx`
**Line:** 117
```typescript
<img 
  src={slot.thumbnailUrl || slot.signedUrl}
  alt={slot.post_title || 'Post thumbnail'}
  className="w-full h-full object-cover"
/>
```
**Logic:** `thumbnailUrl` prioritized over `signedUrl`

### **2. Media Library (3 locations)**
**Component 1:** `/features/media-library/components/MediaCard.tsx`
**Line:** 56
```typescript
<img
  src={asset.signedUrl}
  alt={asset.alt_text || displayName}
  className="h-full w-full object-cover"
/>
```

**Component 2:** `/features/media-library/components/MediaLibraryTable.tsx`
**Line:** 103
```typescript
<img
  src={assetWithUrl.signedUrl}
  alt={asset.alt_text || asset.title || asset.original_filename || 'Media'}
  className="w-full h-full object-cover"
/>
```

**Component 3:** `/calendar/components/CalendarPostCard/CalendarPostMediaPreview.tsx`
**Line:** 37
```typescript
<img 
  src={slot.thumbnailUrl || slot.signedUrl}
  alt={slot.post_title || 'Post thumbnail'}
  className="w-full h-full object-cover"
/>
```

### **3. Campaign Planner**
**Component:** `/features/campaign-planner/components/steps/Step2ChooseMedia.tsx`
**Line:** 244
```typescript
<img
  src={asset.file_url}
  alt={asset.title || 'Media asset'}
  className="w-full h-full object-cover"
/>
```
**Logic:** Uses `file_url` (NOT signedUrl/thumbnailUrl)

---

## **B. URL GENERATION FUNCTIONS**

### **Calendar Page (generates thumbnailUrl):**
**File:** `/app/(app)/calendar/page.tsx`
**Lines:** 73-106
```typescript
// Prioritize small_storage_path (300x300px)
if (slot.media_small_storage_path) {
  thumbnailUrl = await generateSignedUrl(supabase, slot.media_small_storage_path)
}
// Fallback to thumb_storage_path (150x150px)
if (!thumbnailUrl && slot.media_thumb_storage_path) {
  thumbnailUrl = await generateSignedUrl(supabase, slot.media_thumb_storage_path)
}
// Final fallback to original signed URL
if (!thumbnailUrl) {
  thumbnailUrl = await generateSignedUrl(supabase, slot.media_storage_path)
}
```

### **Media Library (generates signedUrl):**
**File:** `/server/repositories/media-assets.repository.ts`
**Line:** 49
```typescript
return getMediaAssetsWithThumbnailUrls(supabase, data as AppMediaAssetsListItem[], 'small')
```

**File:** `/server/services/media-assets.service.ts`
**Lines:** 139-167
```typescript
// First try small_storage_path
if (thumbnailPath) {
  thumbnailUrl = await generateSignedUrl(supabase, thumbnailPath, expiresIn)
}
// Fallback to dynamic thumbnail generation
if (!thumbnailUrl) {
  thumbnailUrl = await getThumbnailSignedUrl(supabase, asset.storage_path, thumbnailSize, expiresIn)
}
```

### **Campaign Planner (uses file_url):**
**Problem:** Uses `asset.file_url` which is NOT signed URL generation

---

## **C. TRUTH TRACE FOR CONCRETE ASSETS**

### **Asset 1: 06ac43de-90d2-4aff-bc05-49ab7ad3de10**
**Paths:**
- `storage_path`: `.../1775762477313-8af04ba4-c2a3-43aa-a9bb-b57c06b4cfe1.png`
- `thumb_storage_path`: `.../thumbnails/..._thumb.png`
- `small_storage_path`: `.../thumbnails/..._small.png`

### **Asset 2: f288bf9b-0e2c-4eb0-9775-163da927eb16**
**Paths:**
- `storage_path`: `.../1775762475209-728230da-04c5-4099-8d0e-7846f1612f43.png`
- `thumb_storage_path`: `.../thumbnails/..._thumb.png`
- `small_storage_path`: `.../thumbnails/..._small.png`

---

## **D. WHY 2-3MB FILES STILL APPEAR**

### **Root Cause Analysis:**

1. **Calendar:** **SHOULD WORK** - has proper thumbnailUrl generation with prioritization
2. **Media Library:** **SHOULD WORK** - uses getMediaAssetsWithThumbnailUrls with small prioritization
3. **Campaign Planner:** **DEFINITELY BROKEN** - uses `file_url` instead of signed URLs

### **Most Likely Issues:**
1. **Thumbnails don't exist in storage** - causing fallback to original
2. **Signed URL generation failing** - causing fallback to original
3. **Campaign Planner using wrong URL** - using file_url instead of signedUrl

---

## **E. EXACT FIXES NEEDED**

### **Fix 1: Campaign Planner URL Mapping**
**Problem:** Uses `asset.file_url` instead of signed URLs
**Solution:** Replace `file_url` with proper signed URL generation

### **Fix 2: Verify thumbnail existence in storage**
**Problem:** Thumbnails may not exist despite generation script
**Solution:** Check actual storage and regenerate if needed

### **Fix 3: Debug signed URL generation**
**Problem:** Signed URLs may be failing silently
**Solution:** Add logging to see actual URLs being generated
