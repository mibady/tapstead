# Tapstead Site-Wide Button Testing Checklist

Use this checklist to manually verify that all buttons across the Tapstead website are properly styled and functional.

## Button Style Guidelines

- **Gradient Buttons**: Should use teal to blue gradient (`from-[hsl(173,58%,39%)] to-[hsl(197,37%,24%)]`) with white text
- **Emergency Buttons**: Should remain red (`bg-red-600`) with white text
- **Outline Buttons**: Should have visible text (not white text on transparent background)

## Testing Instructions

1. Start the development server: `npm run dev`
2. Open your browser to `http://localhost:3000`
3. For each page listed below:
   - Check all buttons for proper styling
   - Verify text is readable on all buttons
   - Click each button to confirm it links to the correct destination
   - Note any issues in the "Issues Found" column

## Main Marketing Pages

| Page | Primary Buttons | Gradient Buttons Present | Emergency Buttons Present | "Become a Pro" Button Readable | Issues Found |
|------|----------------|--------------------------|---------------------------|--------------------------------|-------------|
| `/` (Homepage) | Book Service Now, View Pricing | Yes | No | Yes | |
| `/about` | | | | | |
| `/how-it-works` | | | | | |
| `/pricing` | | | | | |
| `/contact` | | | | | |
| `/blog` | | | | | |
| `/careers` | | | | | |
| `/press` | | | | | |

## Service Pages

| Page | Primary Buttons | Gradient Buttons Present | Emergency Buttons Present | "Become a Pro" Button Readable | Issues Found |
|------|----------------|--------------------------|---------------------------|--------------------------------|-------------|
| `/services` | Book Now (on service cards) | Yes | No | Yes | |
| `/services/electrical` | Book Now | Yes | No | Yes | |
| `/services/plumbing` | Book Now | Yes | No | Yes | |
| `/services/handyman` | Book Now | Yes | No | Yes | |
| `/services/house-cleaning` | Book Now | Yes | No | Yes | |
| `/services/painting` | Book Now | Yes | No | Yes | |
| `/services/pressure-washing` | Book Now | Yes | No | Yes | |
| `/services/gutter-services` | Book Now | Yes | No | Yes | |
| `/services/junk-removal` | Book Now | Yes | No | Yes | |
| `/services/welding` | Book Now | Yes | No | Yes | |
| `/services/fire-debris-removal` | Emergency Call | No | Yes | Yes | |
| `/services/storm-damage-cleanup` | Emergency Call | No | Yes | Yes | |
| `/services/emergency-disaster-cleanup` | Emergency Call | No | Yes | Yes | |

## Booking & Emergency

| Page | Primary Buttons | Gradient Buttons Present | Emergency Buttons Present | "Become a Pro" Button Readable | Issues Found |
|------|----------------|--------------------------|---------------------------|--------------------------------|-------------|
| `/book-now` | Continue | Yes | No | N/A | |
| `/emergency` | Emergency Call | No | Yes | N/A | |

## Provider/Professional Pages

| Page | Primary Buttons | Gradient Buttons Present | Emergency Buttons Present | "Become a Pro" Button Readable | Issues Found |
|------|----------------|--------------------------|---------------------------|--------------------------------|-------------|
| `/become-pro` | Apply Now | Yes | No | N/A | |

## Authentication Pages

| Page | Primary Buttons | Gradient Buttons Present | Emergency Buttons Present | "Become a Pro" Button Readable | Issues Found |
|------|----------------|--------------------------|---------------------------|--------------------------------|-------------|
| `/login` | Sign In | Yes | No | N/A | |
| `/signup` | Sign Up | Yes | No | N/A | |
| `/forgot-password` | Reset Password | Yes | No | N/A | |

## Legal & Support

| Page | Primary Buttons | Gradient Buttons Present | Emergency Buttons Present | "Become a Pro" Button Readable | Issues Found |
|------|----------------|--------------------------|---------------------------|--------------------------------|-------------|
| `/terms` | N/A | No | No | N/A | |
| `/privacy` | N/A | No | No | N/A | |
| `/cookies` | N/A | No | No | N/A | |
| `/support` | Contact Support | Yes | No | N/A | |

## Protected Pages (Require Login)

These pages require authentication and should redirect to login if accessed directly:

- `/become-pro/application` - Pro Application Form
- `/become-pro/application/success` - Application Success Page
- `/provider` - Provider Dashboard
- `/dashboard` - Dashboard Overview
- `/dashboard/bookings` - My Bookings List
- `/dashboard/settings` - Account Settings
- `/dashboard/subscription` - Subscription Management
- `/admin` - Admin Dashboard Overview
- `/admin/applications` - Provider Applications Review
- `/admin/analytics` - Analytics Dashboard

## Special Sections to Check

1. **Header Navigation**:
   - "Book Now" button should use gradient style
   - "Become a Pro" button should be readable

2. **Footer Navigation**:
   - All links should have proper styling and be readable

3. **CTA Section** (blue background):
   - "Book Your Service" button should use gradient or secondary style
   - "Become a Pro" button should have readable text (fixed with darker background)

4. **Emergency Services Section**:
   - "Emergency Call" buttons should remain red
   - "Schedule Service" buttons should use outline style

## Notes

- Remember that emergency buttons should remain red for visibility and urgency
- The gradient should transition from teal (`hsl(173,58%,39%)`) to blue (`hsl(197,37%,24%)`)
- White text should only be used on buttons with sufficient background color contrast
