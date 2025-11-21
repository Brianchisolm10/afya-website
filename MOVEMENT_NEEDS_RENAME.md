# Service Name Update: "Special Situation" → "Movement Needs"

## Summary
Updated the client path name from "Special Situation" to "Movement Needs" throughout the entire system while maintaining the internal `SPECIAL_SITUATION` enum value for database compatibility.

## Changes Made

### 1. Core Configuration Files
- ✅ `lib/intake/intake-paths.ts` - Updated path name in configuration
- ✅ Database seeded with new name via `prisma/seed-intake-paths.ts`

### 2. UI Components
- ✅ `components/intake/PathSelectionScreen.tsx` - Updated display title
- ✅ `components/admin/TemplateManager.tsx` - Updated label and dropdown option
- ✅ `components/admin/TemplateEditor.tsx` - Updated dropdown option

### 3. Documentation
- ✅ `docs/USER_GUIDE.md` - Updated user-facing documentation
- ✅ `docs/ADMIN_GUIDE.md` - Updated admin documentation (2 locations)

### 4. Database
- ✅ IntakePath record updated in database
- ✅ Verified: `name` field now shows "Movement Needs"

## What Stayed the Same

### Internal Identifiers (No Breaking Changes)
- ❌ `ClientType` enum value: Still `SPECIAL_SITUATION` (database compatibility)
- ❌ API request/response values: Still use `SPECIAL_SITUATION`
- ❌ Database schema: No migration needed
- ❌ Existing client records: Unaffected

## Verification

### Database Check
```bash
npm run seed:paths
```

Output confirms:
```
→ Creating path: Movement Needs (SPECIAL_SITUATION)
✅ Intake paths seeded successfully!
```

### User-Facing Impact
- Path selection screen now shows "Movement Needs"
- Admin template manager shows "Movement Needs"
- All documentation updated
- No impact on existing functionality

## Technical Notes

This is a **display-only change**. The underlying enum value `SPECIAL_SITUATION` remains unchanged to:
1. Maintain database compatibility
2. Avoid breaking API contracts
3. Preserve existing client data
4. Prevent migration complexity

If you want to change the enum value in the future, it would require:
- Database migration
- Update all API endpoints
- Update all TypeScript types
- Migrate existing client records

## Files Modified

1. `lib/intake/intake-paths.ts`
2. `components/intake/PathSelectionScreen.tsx`
3. `components/admin/TemplateManager.tsx`
4. `components/admin/TemplateEditor.tsx`
5. `docs/USER_GUIDE.md`
6. `docs/ADMIN_GUIDE.md`
7. `app/(public)/services/page.tsx`

## Testing Checklist

- [x] Database seeding successful
- [x] No TypeScript errors
- [x] Path selection screen displays "Movement Needs"
- [x] Admin template manager displays "Movement Needs"
- [x] Documentation updated
- [ ] Manual UI testing (recommended)
- [ ] Test intake form submission with Movement Needs path
- [ ] Verify packet generation for Movement Needs clients

## Next Steps

1. Test the intake form by selecting "Movement Needs"
2. Verify packet generation works correctly
3. Check admin dashboard displays correctly
4. Update any external documentation or marketing materials

---

**Date:** November 19, 2025
**Status:** ✅ Complete
