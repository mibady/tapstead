# Manual Button Testing Checklist

Use this checklist to manually verify that all buttons in the Tapstead application are working correctly and directing to the proper pages.

## Home Page Buttons

- [ ] "Book Service Now" button links to `/book-now`
- [ ] "View Pricing" button links to `/pricing`
- [ ] "Book Now" buttons on service cards link to `/book-now?service=[service-name]`
- [ ] "Become a Pro" button links to `/become-pro`
- [ ] "Sign In" button links to `/login`

## Emergency Services Section

- [ ] "Emergency Call" buttons link to `/book-now?service=[service-name]&emergency=true`
- [ ] "Schedule Service" buttons link to `/book-now?service=[service-name]`

## Service Detail Pages

- [ ] "Book Now" button links to `/book-now?service=[service-id]`
- [ ] "Request Emergency Service" button links to `/book-now?service=[service-id]&emergency=true`
- [ ] "Contact Us" button links to `/contact`

## Booking Flow

- [ ] Service selection: "Continue" button advances to booking details
- [ ] Booking details: "Continue" button advances to customer info
- [ ] Customer info: "Continue to Payment" button advances to payment info
- [ ] "Back" buttons return to previous steps

## Header Navigation

- [ ] Logo links to home page
- [ ] "Book Now" button links to `/book-now`
- [ ] "Become a Pro" button links to `/become-pro`
- [ ] "Sign In" button links to `/login`

## Footer Navigation

- [ ] All footer links direct to correct pages

## Testing Instructions

1. Start the development server: `npm run dev`
2. Open your browser to `http://localhost:3000`
3. Click each button and verify it directs to the expected page
4. For booking flow buttons, complete each step to verify the entire flow works
5. Check that all buttons are visible and have readable text in both light and dark modes
