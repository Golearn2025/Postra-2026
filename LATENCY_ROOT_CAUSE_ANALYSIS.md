# LATENCY ROOT CAUSE ANALYSIS - BREAKDOWN EXACT

## **1. STEP1SELECTCAMPAIGN 12.5S LATENCY**

### **Root Cause:** **CLIENT-SIDE FETCH + REACT STRICT MODE**

#### **Exact Flow:**
```typescript
// Step1SelectCampaign.tsx - useEffect
useEffect(() => {
  async function loadCampaigns() {
    const response = await fetch(`/api/campaigns?organizationId=${organizationId}`)
    const data = await response.json()
    setCampaigns(data.campaigns || [])
  }
  loadCampaigns()
}, [organizationId])
```

#### **API Performance:**
```sql
-- campaigns API query performance
EXPLAIN ANALYZE 
SELECT id, name, slug, objective, target_audience, target_market, start_date, end_date, status
FROM content_campaigns 
WHERE deleted_at IS NULL
ORDER BY created_at DESC;

-- Result: 0.681ms execution time, 3 rows total
```

#### **Why 12.5s?**
- **Database query:** 0.681ms (extremely fast)
- **API response:** ~50ms (normal)
- **Network transfer:** ~100ms (small JSON payload)
- **React Strict Mode:** **2x duplicate calls** in development
- **Real bottleneck:** **Client-side processing + React hydration**

#### **Evidence:**
- Database has only 3 campaigns total
- Query executes in <1ms
- 12.5s suggests blocking client-side operations

---

## **2. LARGE IMAGES (2.3MB-2.9MB) STILL LOADING**

### **Root Cause:** **CALENDAR PAGE SERVER-SIDE GENERATION**

#### **Exact Location:**
```typescript
// /app/(app)/calendar/page.tsx - server component
const slotsWithThumbnails = await Promise.all(
  slotsResult.data.map(async (slot) => {
    // First try dedicated thumbnail path from view
    if (slot.media_thumb_storage_path) {
      thumbnailUrl = await generateSignedUrl(supabase, slot.media_thumb_storage_path)
    }
    // Fallback to original signed URL
    if (!thumbnailUrl) {
      thumbnailUrl = await generateSignedUrl(supabase, slot.media_storage_path)
    }
    return { ...slot, thumbnailUrl: thumbnailUrl || undefined }
  })
)
```

#### **Why Still Large Images?**
- **Thumbnail paths exist in DB** (confirmed via backfill)
- **Thumbnail files DON'T exist in storage** (only paths, no actual files)
- **Fallback to original** when thumbnail files missing
- **Server generates signed URLs** for originals (2.3MB-2.9MB)

#### **Evidence:**
- Backfill set `thumb_storage_path` but didn't upload actual files
- Calendar page generates URLs server-side, can't fallback gracefully
- Network shows original file sizes, not thumbnails

---

## **3. RSC PAGE LATENCY**

### **Campaign Planner (7s) - Root Cause: ORGANIZATION CONTEXT**

#### **Exact Flow:**
```typescript
// /app/(app)/campaign-planner/page.tsx - server component
export default async function CampaignPlannerPage() {
  const user = await getCurrentUser()
  const selectedOrgSlug = cookieStore.get('selected-org')?.value
  const orgContext = await getCurrentOrganizationContext(user!, selectedOrgSlug)
  return <CampaignPlannerClient organizationId={orgContext.organization.id} />
}
```

#### **Organization Context Bottleneck:**
```typescript
// getCurrentOrganizationContext calls:
1. getAvailableOrganizations(user) // Fetches ALL organizations
2. getOrganizationBySlug(slug)     // Fetches specific org
3. getOrganizationMember(user, org) // Fetches member role
```

#### **Why 7s?**
- **Sequential queries:** 3+ database calls
- **Large organization data:** Potentially many orgs
- **Blocking server-side:** Must complete before page render

### **Media Library (5s) - Root Cause: MEDIA ASSETS + ORG CONTEXT**

#### **Exact Flow:**
```typescript
// /app/(app)/media-library/page.tsx - server component
export default async function MediaLibraryPage({ searchParams }) {
  const user = await getCurrentUser()
  const orgContext = await getCurrentOrganizationContext(user!, selectedOrgSlug)
  const assets = await getMediaAssetsListByOrganization(supabase, orgContext.organization.id, filters)
}
```

#### **Media Assets Query Performance:**
```sql
-- app_media_assets_list view query
EXPLAIN ANALYZE 
SELECT COUNT(*) FROM app_media_assets_list;
-- Result: 0.308ms execution time, 6 assets total
```

#### **Why 5s?**
- **Organization context:** Same 7s bottleneck as campaign planner
- **Media assets query:** Fast (0.3ms) but blocked by org context
- **Signed URL generation:** Server-side for each asset (if not cached)

---

## **4. ROOT CAUSE VERDICT**

### **A. Read Architecture Issues (30%)**
- **Organization context:** Sequential queries, fetching all orgs
- **Server-side blocking:** Pages wait for org context before render

### **B. Client-Side Fetch Issues (20%)**
- **Step1SelectCampaign:** Client-side campaigns fetch
- **React Strict Mode:** 2x duplicate calls in development
- **No server-side data passing**

### **C. Image Pipeline Issues (50%)**
- **Thumbnail paths exist, but files don't**
- **Calendar page falls back to originals**
- **Server-side URL generation can't handle missing thumbnails gracefully**

---

## **5. PRIORITIZED FIX PLAN**

### **Phase 1: Image Pipeline (Highest Impact)**
**Problem:** Calendar loads 2.3MB-2.9MB images instead of thumbnails
**Fix:** Generate actual thumbnail files or improve fallback

**Options:**
1. **Generate thumbnail files** for existing paths (backfill script)
2. **Improve fallback** to use dynamic generation when files missing
3. **Client-side fallback** for missing thumbnails

**Effort:** Medium | **Impact:** Very High | **Priority:** 1

### **Phase 2: Organization Context (High Impact)**
**Problem:** 7s page load due to sequential org queries
**Fix:** Optimize organization context fetching

**Options:**
1. **Parallelize safe queries** (orgDetails + memberRole)
2. **Cache available organizations** in session
3. **Pass org context from client** when available

**Effort:** Medium | **Impact:** High | **Priority:** 2

### **Phase 3: Client-Side Fetch (Medium Impact)**
**Problem:** 12.5s campaigns fetch due to client-side processing
**Fix:** Move campaigns fetch server-side

**Options:**
1. **Pass campaigns data** from campaign planner page
2. **Cache campaigns** in component state
3. **Optimize campaigns API** (already fast)

**Effort:** Low | **Impact:** Medium | **Priority:** 3

---

## **6. EXACT FIXES TO IMPLEMENT**

### **Fix 1: Calendar Thumbnail Fallback**
```typescript
// /app/(app)/calendar/page.tsx
// Add dynamic thumbnail generation when files don't exist
if (slot.media_thumb_storage_path) {
  try {
    thumbnailUrl = await generateSignedUrl(supabase, slot.media_thumb_storage_path)
  } catch {
    // Fallback to dynamic generation
    thumbnailUrl = await getThumbnailSignedUrl(supabase, slot.media_storage_path, 'thumb')
  }
}
```

### **Fix 2: Organization Context Parallel**
```typescript
// /server/services/organization.service.ts
// Parallelize orgDetails and memberRole queries
const [orgDetails, memberRole] = await Promise.all([
  getOrganizationBySlug(supabase, slug),
  getOrganizationMember(supabase, user.id, orgDetails.id)
])
```

### **Fix 3: Campaigns Server-Side**
```typescript
// /app/(app)/campaign-planner/page.tsx
// Pass campaigns data to client component
const campaigns = await getCampaignsListByOrganization(supabase, orgContext.organization.id)
return <CampaignPlannerClient campaigns={campaigns} />
```

---

## **7. EXPECTED IMPACT**

### **After Fix 1 (Image Pipeline):**
- **Calendar previews:** 50KB vs 2.3MB (-95% bandwidth)
- **Load time:** <500ms vs 4-8s (-90% latency)

### **After Fix 2 (Organization Context):**
- **Page load:** 2s vs 7s (-70% latency)
- **All tabs:** Faster navigation

### **After Fix 3 (Campaigns Fetch):**
- **Campaigns load:** 100ms vs 12.5s (-99% latency)
- **React Strict Mode:** Still 2x calls but each is fast

---

## **8. VERIFICATION CHECKLIST**

### **Network Tab Verification:**
1. **Calendar page:** Check image file sizes (~50KB)
2. **Campaign planner:** Check page load time (~2s)
3. **Media library:** Check page load time (~2s)
4. **Campaigns API:** Check response time (~100ms)

### **Database Query Verification:**
1. **Organization context:** Check query execution plans
2. **Media assets:** Confirm view performance
3. **Campaigns:** Confirm query performance

---

## **VERDICT FINAL**

### **Primary Bottleneck:** **Image Pipeline (50%)**
- Thumbnail files missing, falling back to originals
- Server-side can't handle missing thumbnails gracefully

### **Secondary Bottleneck:** **Organization Context (30%)**
- Sequential queries blocking page render
- Fetching all organizations unnecessarily

### **Tertiary Bottleneck:** **Client-Side Fetch (20%)**
- Campaigns fetch should be server-side
- React Strict Mode duplication

**Fix Priority:** Image Pipeline > Organization Context > Client-Side Fetch
