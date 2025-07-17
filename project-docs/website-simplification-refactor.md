
# Website Simplification Refactor Plan

## Overview
Transform the current Captains of Commerce website from a complex multi-feature platform into a simple, SEO-optimized home page with streamlined event management. This refactor focuses on core functionality while removing unnecessary complexity.

## Goals
1. Create an SEO-optimized home page
2. Implement simple event list and detail pages (no modals)
3. Remove donation functionality
4. Remove photo gallery and dashboard features
5. Eliminate admin UI (events managed via SQL)
6. Maintain responsive design and accessibility

## Tasks to Complete

### Phase 1: Homepage Simplification

#### Task 1.1: Simplify Homepage Layout
**File:** `src/app/page.tsx`
- Remove `<DonationCTA />` component import and usage
- Remove `<PhotoGallery />` component import and usage
- Keep `<FeaturedEvents />` but simplify to show only upcoming events
- Update hero section to focus on organization mission without donation CTA
- Ensure proper SEO meta tags and structured data

#### Task 1.2: Update Homepage Hero Section
**File:** `src/app/page.tsx`
- Remove "Make a Donation" button from hero section
- Keep "View Events" button as primary CTA
- Optimize hero text for SEO keywords
- Ensure proper heading hierarchy (H1, H2, etc.)

#### Task 1.3: Simplify Featured Events Component
**File:** `src/components/FeaturedEvents.tsx`
- Remove any donation-related links or buttons
- Ensure event cards link directly to event detail pages (not modals)
- Limit to 4-6 upcoming events maximum
- Add proper schema markup for events

### Phase 2: Event Management Simplification

#### Task 2.1: Remove Event Modal Component
**Files to modify:**
- `src/app/events/page.tsx` - Remove modal imports and state
- `src/components/EventModal.tsx` - Delete this file entirely

#### Task 2.2: Simplify Events Page
**File:** `src/app/events/page.tsx`
- Remove calendar view (keep only list view)
- Remove view toggle buttons
- Remove event modal logic and state
- Remove filtering functionality (keep it simple)
- Update event cards to link directly to detail pages
- Remove "Register for Event" buttons (events are informational only)

#### Task 2.3: Update Event List Component
**File:** `src/components/EventList.tsx`
- Remove modal trigger functionality
- Ensure all event cards link to `/events/[id]` pages
- Remove registration-related UI elements
- Simplify event type display
- Optimize for mobile responsiveness

#### Task 2.4: Enhance Event Detail Pages
**File:** `src/app/events/[id]/page.tsx`
- Remove registration functionality completely
- Focus on event information display
- Add proper SEO meta tags for each event
- Implement structured data for better search visibility
- Add social sharing meta tags
- Remove "Add to Calendar" functionality (simplify)

### Phase 3: Component and Feature Removal

#### Task 3.1: Remove Donation-Related Components
**Files to delete:**
- `src/components/DonationCTA.tsx`
- Any donation-related API routes (if they exist)

#### Task 3.2: Remove Photo Gallery Components
**Files to delete:**
- `src/components/PhotoGallery.tsx`
- `src/app/api/photos/route.ts`
- Any gallery-related pages

#### Task 3.3: Remove Registration System
**Files to delete/modify:**
- `src/components/EventRegistrationForm.tsx` - Delete
- `src/app/api/events/[id]/register/route.ts` - Delete
- `src/app/api/admin/registrations/` - Delete entire directory
- `src/app/api/user/registrations/route.ts` - Delete

#### Task 3.4: Remove Event Filters
**Files to delete:**
- `src/components/EventFilters.tsx`

#### Task 3.5: Remove Calendar Component
**Files to delete:**
- `src/components/Calendar.tsx`
- `src/lib/calendar.ts` (calendar integration utilities)

### Phase 4: Database Schema Cleanup

#### Task 4.1: Update Prisma Schema
**File:** `prisma/schema.prisma`
- Remove EventRegistration model
- Remove registration-related fields from Event model (capacity, etc.)
- Remove User model if not needed for other purposes
- Keep only essential Event fields: id, title, description, startDateTime, endDateTime, location, eventType, isPublished, createdAt, updatedAt

#### Task 4.2: Create Migration for Schema Changes
- Generate new Prisma migration to remove unused tables/fields
- Update seed file to remove registration-related data

### Phase 5: API Simplification

#### Task 5.1: Simplify Events API
**File:** `src/app/api/events/route.ts`
- Keep only GET endpoint for retrieving events
- Remove POST, PUT, DELETE endpoints
- Simplify filtering to basic published events only
- Remove authentication checks

#### Task 5.2: Simplify Individual Event API
**File:** `src/app/api/events/[id]/route.ts`
- Keep only GET endpoint
- Remove PUT, DELETE endpoints
- Remove authentication checks

#### Task 5.3: Remove Unused API Routes
**Directories/files to delete:**
- `src/app/api/admin/` - Delete entire directory
- `src/app/api/user/` - Delete entire directory
- `src/app/api/photos/route.ts` - Delete

### Phase 6: SEO and Performance Optimization

#### Task 6.1: Enhance Homepage SEO
**File:** `src/app/page.tsx`
- Add comprehensive meta tags (title, description, keywords)
- Implement Open Graph tags for social sharing
- Add JSON-LD structured data for organization
- Optimize images with proper alt tags
- Ensure proper heading hierarchy

#### Task 6.2: Enhance Event Pages SEO
**File:** `src/app/events/[id]/page.tsx`
- Add dynamic meta tags based on event data
- Implement event-specific Open Graph tags
- Add JSON-LD structured data for events
- Create proper canonical URLs

#### Task 6.3: Create Sitemap
**File:** `src/app/sitemap.ts`
- Generate dynamic sitemap including all published events
- Include proper lastModified dates
- Submit to search engines

#### Task 6.4: Add Robots.txt
**File:** `src/app/robots.ts`
- Configure proper crawling rules
- Link to sitemap

### Phase 7: Navigation and Layout Updates

#### Task 7.1: Simplify Header Navigation
**File:** `src/components/layout/Header.tsx`
- Remove user authentication elements
- Remove admin/dashboard links
- Keep simple navigation: Home, Events
- Remove donation button

#### Task 7.2: Update Footer
**File:** `src/components/layout/Footer.tsx`
- Remove donation links
- Remove gallery links
- Keep essential organization information
- Add proper contact information for SEO

### Phase 8: Package and Dependency Cleanup

#### Task 8.1: Remove Unused Dependencies
**File:** `package.json`
- Remove auth0-related packages
- Remove calendar integration packages
- Remove photo gallery packages (yet-another-react-lightbox)
- Remove any payment processing packages
- Keep only essential dependencies

#### Task 8.2: Update TypeScript Types
**Files:** Various type definition files
- Remove registration-related types
- Remove donation-related types
- Remove gallery-related types
- Keep only Event and basic organization types

### Phase 9: Testing and Validation

#### Task 9.1: Test Core Functionality
- Verify homepage loads correctly with SEO optimization
- Test event list page functionality
- Test event detail page navigation
- Verify responsive design across devices

#### Task 9.2: SEO Validation
- Test with Google PageSpeed Insights
- Validate structured data with Google's Rich Results Test
- Check meta tags and Open Graph tags
- Verify sitemap accessibility

#### Task 9.3: Performance Optimization
- Remove unused CSS and JavaScript
- Optimize remaining images
- Implement proper caching headers
- Minimize bundle size

## Expected Outcomes

After this refactor, the website will have:

1. **Simple Homepage**: Clean, SEO-optimized landing page with organization information and featured events
2. **Event List Page**: Simple list of upcoming events with direct links to detail pages
3. **Event Detail Pages**: Individual pages for each event with full information and SEO optimization
4. **Improved Performance**: Faster loading times due to removed complexity
5. **Better SEO**: Proper meta tags, structured data, and sitemap for better search visibility
6. **Maintainability**: Simplified codebase that's easier to maintain and update

## Manual Event Management

Events will be managed through direct SQL inserts into the database. A simple SQL template will be provided:

```sql
INSERT INTO "Event" (
  "id", "title", "description", "startDateTime", "endDateTime", 
  "location", "eventType", "isPublished", "createdAt", "updatedAt"
) VALUES (
  'event-id', 'Event Title', 'Event Description', 
  '2024-02-01T18:00:00Z', '2024-02-01T20:00:00Z',
  'Event Location', 'FUNDRAISER', true, NOW(), NOW()
);
```

This approach eliminates the need for admin interfaces while maintaining full control over event content.
