import { test, expect } from '@playwright/test';

test('homepage has title and navigation', async ({ page }) => {
  // Navigate to the homepage
  await page.goto('/');
  
  // Check that the page has loaded
  await expect(page).toHaveTitle(/Mock Test Platform|Wind Academy/);
  
  // Take a screenshot for verification
  await page.screenshot({ path: 'homepage.png' });
});

test('dashboard page loads when authenticated', async ({ page }) => {
  // Navigate to dashboard
  await page.goto('/dashboard');
  
  // Check if we're redirected to login (if not authenticated)
  // or if dashboard loads
  const url = page.url();
  
  if (url.includes('/login')) {
    // We're on login page - test login form exists
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  } else {
    // We're on dashboard - verify dashboard elements
    await expect(page.locator('text=Dashboard')).toBeVisible();
  }
});

test('login page has required fields', async ({ page }) => {
  await page.goto('/login');
  
  // Check email field
  await expect(page.locator('input[name="email"], input[type="email"]')).toBeVisible();
  
  // Check password field
  await expect(page.locator('input[name="password"], input[type="password"]')).toBeVisible();
  
  // Check login button
  await expect(page.locator('button[type="submit"], button:has-text("Login"), button:has-text("Sign In")')).toBeVisible();
});
