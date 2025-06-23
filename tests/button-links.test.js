/**
 * Button Links Test
 * 
 * This script tests that all buttons in the application direct to the correct pages.
 * It uses Playwright to navigate through the app and verify link destinations.
 */

const { test, expect } = require('@playwright/test');

test.describe('Button Link Tests', () => {
  test('Home page buttons link to correct destinations', async ({ page }) => {
    // Navigate to the home page
    await page.goto('/');
    
    // Test main CTA button
    const bookServiceButton = page.locator('a:has-text("Book Service Now")');
    await expect(bookServiceButton).toHaveAttribute('href', '/book-now');
    
    // Test "View Pricing" button
    const viewPricingButton = page.locator('a:has-text("View Pricing")');
    await expect(viewPricingButton).toHaveAttribute('href', '/pricing');
    
    // Test "Book Now" buttons in service cards
    const bookNowButtons = page.locator('.card a:has-text("Book Now")');
    const count = await bookNowButtons.count();
    
    for (let i = 0; i < count; i++) {
      const button = bookNowButtons.nth(i);
      const href = await button.getAttribute('href');
      expect(href).toContain('/book-now?service=');
    }
    
    // Test "Become a Pro" button
    const becomeProButton = page.locator('a:has-text("Become a Pro")');
    await expect(becomeProButton).toHaveAttribute('href', '/become-pro');
  });
  
  test('Emergency services buttons link correctly', async ({ page }) => {
    // Navigate to the emergency services section
    await page.goto('/#emergency-services');
    
    // Test emergency call buttons
    const emergencyCallButtons = page.locator('a:has-text("Emergency Call")');
    const count = await emergencyCallButtons.count();
    
    for (let i = 0; i < count; i++) {
      const button = emergencyCallButtons.nth(i);
      const href = await button.getAttribute('href');
      expect(href).toContain('/book-now?service=');
      expect(href).toContain('&emergency=true');
    }
    
    // Test schedule service buttons
    const scheduleButtons = page.locator('a:has-text("Schedule Service")');
    const scheduleCount = await scheduleButtons.count();
    
    for (let i = 0; i < count; i++) {
      const button = scheduleButtons.nth(i);
      const href = await button.getAttribute('href');
      expect(href).toContain('/book-now?service=');
    }
  });
  
  test('Booking flow buttons work correctly', async ({ page }) => {
    // Start the booking flow
    await page.goto('/book-now');
    
    // Select a service
    await page.locator('.card').first().click();
    
    // Test continue button
    const continueButton = page.locator('button:has-text("Continue")');
    await continueButton.click();
    
    // Verify we moved to the next step
    await expect(page.locator('h2:has-text("Booking Details")')).toBeVisible();
    
    // Fill out required fields
    // ... (add code to fill out form fields)
    
    // Test next continue button
    const nextContinueButton = page.locator('button:has-text("Continue")');
    await nextContinueButton.click();
    
    // Verify we moved to customer info
    await expect(page.locator('h2:has-text("Customer Information")')).toBeVisible();
  });
});
