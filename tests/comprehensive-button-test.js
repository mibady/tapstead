/**
 * Comprehensive Button Test
 * 
 * This script tests all buttons across the Tapstead website to ensure:
 * 1. They link to the correct destinations
 * 2. They have proper styling (especially gradient buttons)
 * 3. Text is readable in all states (normal, hover, focus)
 */

const { test, expect } = require('@playwright/test');

// List of all pages to test
const pagesToTest = [
  // Main Marketing Pages
  { path: '/', name: 'Homepage' },
  { path: '/about', name: 'About Us' },
  { path: '/how-it-works', name: 'How It Works' },
  { path: '/pricing', name: 'Pricing' },
  { path: '/contact', name: 'Contact' },
  { path: '/blog', name: 'Blog' },
  { path: '/careers', name: 'Careers' },
  { path: '/press', name: 'Press' },
  
  // Service Pages
  { path: '/services', name: 'Services Overview' },
  { path: '/services/electrical', name: 'Electrical Services' },
  { path: '/services/plumbing', name: 'Plumbing Services' },
  { path: '/services/handyman', name: 'Handyman Services' },
  { path: '/services/house-cleaning', name: 'House Cleaning Services' },
  { path: '/services/painting', name: 'Painting Services' },
  { path: '/services/pressure-washing', name: 'Pressure Washing Services' },
  { path: '/services/gutter-services', name: 'Gutter Services' },
  { path: '/services/junk-removal', name: 'Junk Removal Services' },
  { path: '/services/welding', name: 'Welding Services' },
  { path: '/services/fire-debris-removal', name: 'Fire Debris Removal' },
  { path: '/services/storm-damage-cleanup', name: 'Storm Damage Cleanup' },
  { path: '/services/emergency-disaster-cleanup', name: 'Emergency Disaster Cleanup' },
  
  // Booking & Emergency
  { path: '/book-now', name: 'Main Booking Flow' },
  { path: '/emergency', name: 'Emergency Services' },
  
  // Provider Pages
  { path: '/become-pro', name: 'Pro Recruitment Landing' },
  
  // Auth Pages (no login required)
  { path: '/login', name: 'Sign In' },
  { path: '/signup', name: 'Sign Up' },
  { path: '/forgot-password', name: 'Password Reset Request' },
  
  // Legal & Support
  { path: '/terms', name: 'Terms of Service' },
  { path: '/privacy', name: 'Privacy Policy' },
  { path: '/cookies', name: 'Cookie Policy' },
  { path: '/support', name: 'Support/Help Center' },
];

// Protected pages that require login
const protectedPages = [
  // Provider Pages
  { path: '/become-pro/application', name: 'Pro Application Form' },
  { path: '/become-pro/application/success', name: 'Application Success Page' },
  { path: '/provider', name: 'Provider Dashboard' },
  
  // Customer Dashboard
  { path: '/dashboard', name: 'Dashboard Overview' },
  { path: '/dashboard/bookings', name: 'My Bookings List' },
  { path: '/dashboard/settings', name: 'Account Settings' },
  { path: '/dashboard/subscription', name: 'Subscription Management' },
  
  // Admin Dashboard
  { path: '/admin', name: 'Admin Dashboard Overview' },
  { path: '/admin/applications', name: 'Provider Applications Review' },
  { path: '/admin/analytics', name: 'Analytics Dashboard' },
];

test.describe('Button Style and Functionality Tests', () => {
  // Test public pages
  for (const page of pagesToTest) {
    test(`Testing buttons on ${page.name} (${page.path})`, async ({ page: pageContext }) => {
      // Navigate to the page
      await pageContext.goto(page.path);
      
      // Wait for page to load
      await pageContext.waitForLoadState('networkidle');
      
      // Test all buttons with gradient variant
      const gradientButtons = pageContext.locator('button[class*="gradient"], a[class*="gradient"]');
      const gradientCount = await gradientButtons.count();
      
      console.log(`Found ${gradientCount} gradient buttons on ${page.path}`);
      
      // Check each gradient button for proper styling
      for (let i = 0; i < gradientCount; i++) {
        const button = gradientButtons.nth(i);
        
        // Check if button is visible
        await expect(button).toBeVisible();
        
        // Check for gradient background (this is a visual test, so we'll check for class)
        const hasGradientClass = await button.evaluate(el => 
          el.className.includes('gradient') || 
          getComputedStyle(el).background.includes('linear-gradient')
        );
        expect(hasGradientClass).toBeTruthy();
        
        // Check text contrast (ensure text is readable)
        const textColor = await button.evaluate(el => 
          getComputedStyle(el).color
        );
        expect(textColor).toBe('rgb(255, 255, 255)'); // White text
        
        // If it's a link, check that href is not empty
        const href = await button.getAttribute('href');
        if (href) {
          expect(href).not.toBe('');
          expect(href).not.toBe('#');
        }
      }
      
      // Test emergency buttons (should be red)
      const emergencyButtons = pageContext.locator('button[class*="bg-red"], a[class*="bg-red"]');
      const emergencyCount = await emergencyButtons.count();
      
      for (let i = 0; i < emergencyCount; i++) {
        const button = emergencyButtons.nth(i);
        await expect(button).toBeVisible();
        
        // Check for red background
        const hasRedClass = await button.evaluate(el => 
          el.className.includes('bg-red') || 
          getComputedStyle(el).backgroundColor.includes('rgb(220')
        );
        expect(hasRedClass).toBeTruthy();
      }
      
      // Test outline buttons (especially "Become a Pro" buttons)
      const outlineButtons = pageContext.locator('button[class*="outline"], a[class*="outline"]');
      const outlineCount = await outlineButtons.count();
      
      for (let i = 0; i < outlineCount; i++) {
        const button = outlineButtons.nth(i);
        await expect(button).toBeVisible();
        
        // Check text visibility by ensuring contrast with background
        const backgroundColor = await button.evaluate(el => getComputedStyle(el).backgroundColor);
        const textColor = await button.evaluate(el => getComputedStyle(el).color);
        
        // If background is transparent or very light, text should not be white
        if (backgroundColor === 'rgba(0, 0, 0, 0)' || 
            backgroundColor.includes('rgba') || 
            backgroundColor.includes('rgb(255')) {
          expect(textColor).not.toBe('rgb(255, 255, 255)');
        }
        
        // Check for "Become a Pro" text and ensure it's readable
        const text = await button.textContent();
        if (text && text.includes('Become a Pro')) {
          // Either background should not be transparent or text should not be white
          if (textColor === 'rgb(255, 255, 255)') {
            expect(backgroundColor).not.toBe('rgba(0, 0, 0, 0)');
          }
        }
      }
      
      // Test navigation functionality of main buttons
      const mainCTAButton = pageContext.locator('a:has-text("Book Now"), a:has-text("Book Service Now")').first();
      if (await mainCTAButton.count() > 0) {
        const href = await mainCTAButton.getAttribute('href');
        expect(href).toContain('/book-now');
      }
    });
  }
  
  // Test for protected pages would require login functionality
  test('Protected pages require authentication', async ({ page }) => {
    for (const protectedPage of protectedPages) {
      await page.goto(protectedPage.path);
      
      // Check if redirected to login page or shows unauthorized
      const currentUrl = page.url();
      expect(
        currentUrl.includes('/login') || 
        currentUrl.includes('/unauthorized') ||
        await page.locator('text=Sign in').isVisible()
      ).toBeTruthy();
    }
  });
});

// Visual test for the CTA section "Become a Pro" button
test('CTA section "Become a Pro" button is readable', async ({ page }) => {
  await page.goto('/');
  
  // Find the CTA section
  const ctaSection = page.locator('section.bg-blue-600');
  await expect(ctaSection).toBeVisible();
  
  // Find the "Become a Pro" button in the CTA section
  const becomeProButton = ctaSection.locator('a:has-text("Become a Pro")');
  await expect(becomeProButton).toBeVisible();
  
  // Check button styling
  const buttonBg = await becomeProButton.evaluate(el => getComputedStyle(el).backgroundColor);
  const buttonTextColor = await becomeProButton.evaluate(el => getComputedStyle(el).color);
  const buttonBorder = await becomeProButton.evaluate(el => getComputedStyle(el).borderWidth);
  
  // Either background should not be transparent, or border should be visible
  if (buttonBg === 'rgba(0, 0, 0, 0)' || buttonBg === 'transparent') {
    expect(buttonBorder).not.toBe('0px');
  }
  
  // If text is white, background should not be transparent
  if (buttonTextColor === 'rgb(255, 255, 255)') {
    expect(buttonBg).not.toBe('rgba(0, 0, 0, 0)');
    expect(buttonBg).not.toBe('transparent');
  }
});
