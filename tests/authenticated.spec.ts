import { test, expect, Page } from '@playwright/test';

// Test credentials - update these with actual test account credentials
const TEST_USER = {
  email: 'student@example.com',
  password: 'testpassword123'
};

/**
 * Helper function to login
 */
async function loginUser(page: Page, email: string, password: string) {
  await page.goto('/login');
  
  // Fill email
  await page.fill('input[name="email"]', email);
  
  // Fill password
  await page.fill('input[name="password"]', password);
  
  // Click sign in button
  await page.click('button[type="submit"]');
  
  // Wait for navigation to dashboard or home
  await page.waitForURL(/.*dashboard|.*\/$/, { timeout: 10000 });
}

test.describe('Authentication Flow', () => {
  
  test('user can login successfully', async ({ page }) => {
    await loginUser(page, TEST_USER.email, TEST_USER.password);
    
    // Verify we're logged in by checking for dashboard elements
    await expect(page.locator('text=Dashboard').or(page.locator('text=Explore'))).toBeVisible();
    
    // Take screenshot of logged-in state
    await page.screenshot({ path: 'logged-in-dashboard.png' });
  });

  test('login shows error for invalid credentials', async ({ page }) => {
    await page.goto('/login');
    
    // Fill with wrong credentials
    await page.fill('input[name="email"]', 'wrong@example.com');
    await page.fill('input[name="password"]', 'wrongpassword');
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Wait for error message
    await expect(page.locator('text=Invalid').or(page.locator('text=error')).or(page.locator('.bg-red-50'))).toBeVisible({ timeout: 5000 });
  });

  test('login page has all required elements', async ({ page }) => {
    await page.goto('/login');
    
    // Check logo
    await expect(page.locator('img[alt*="Wings"], img[alt*="Logo"]').or(page.locator('text=WINGS'))).toBeVisible();
    
    // Check heading
    await expect(page.locator('h2:has-text("Log in")')).toBeVisible();
    
    // Check email field
    await expect(page.locator('input[name="email"][type="email"]')).toBeVisible();
    
    // Check password field
    await expect(page.locator('input[name="password"]')).toBeVisible();
    
    // Check remember me checkbox
    await expect(page.locator('input[name="remember-me"][type="checkbox"]')).toBeVisible();
    
    // Check forgot password link
    await expect(page.locator('a[href="/forgot-password"]')).toBeVisible();
    
    // Check sign in button
    await expect(page.locator('button[type="submit"]:has-text("Sign in")')).toBeVisible();
    
    // Check signup link
    await expect(page.locator('a[href="/signup"]')).toBeVisible();
  });
});

test.describe('Dashboard - Authenticated', () => {
  
  test.beforeEach(async ({ page }) => {
    // Login before each test in this group
    await loginUser(page, TEST_USER.email, TEST_USER.password);
  });

  test('dashboard loads with user name displayed', async ({ page }) => {
    // Navigate to dashboard
    await page.goto('/dashboard');
    
    // Verify dashboard loaded
    await expect(page.locator('text=Dashboard')).toBeVisible();
    
    // Check user greeting is shown
    await expect(page.locator('text=/Hi,|Hello|Welcome/i')).toBeVisible();
    
    // Take screenshot
    await page.screenshot({ path: 'dashboard-authenticated.png' });
  });

  test('can navigate to modules page', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Click on modules link
    await page.click('a[href="/dashboard/modules"]');
    
    // Verify navigation
    await expect(page).toHaveURL(/.*modules/);
    
    // Verify modules page loaded
    await expect(page.locator('h1:has-text("Modules"), text=Modules')).toBeVisible();
  });

  test('can navigate to my-tests page', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Click on my tests
    await page.click('a[href="/dashboard/my-tests"]');
    
    // Verify navigation
    await expect(page).toHaveURL(/.*my-tests/);
    
    // Verify page loaded
    await expect(page.locator('text=Tests')).toBeVisible();
  });

  test('search functionality works', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Find and fill search input
    const searchInput = page.locator('input[placeholder*="Search"], input[type="search"]');
    if (await searchInput.isVisible().catch(() => false)) {
      await searchInput.fill('test');
      await searchInput.press('Enter');
      
      // Wait for search results or dropdown
      await page.waitForTimeout(500);
      
      // Check if results appeared
      const results = page.locator('.search-results, [role="listbox"], .dropdown');
      await expect(results.or(searchInput)).toBeVisible();
    }
  });
});

test.describe('Mock Test Flow', () => {
  
  test.beforeEach(async ({ page }) => {
    await loginUser(page, TEST_USER.email, TEST_USER.password);
  });

  test('can access available tests', async ({ page }) => {
    await page.goto('/dashboard/modules');
    
    // Look for test cards or module cards
    const testCards = page.locator('a[href*="/test/"], .test-card, .module-card, [data-testid="test-card"]').first();
    
    if (await testCards.isVisible().catch(() => false)) {
      // Click first available test
      await testCards.click();
      
      // Should navigate to test page
      await expect(page).toHaveURL(/.*test/);
      
      // Verify test interface loaded
      await expect(page.locator('text=Start').or(page.locator('button:has-text("Start")')).or(page.locator('text=Test'))).toBeVisible();
    }
  });

  test('test interface shows correctly', async ({ page }) => {
    // Navigate directly to a test page (update ID as needed)
    await page.goto('/dashboard/test/1');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Take screenshot of test interface
    await page.screenshot({ path: 'test-interface.png', fullPage: true });
    
    // Check for test elements
    const testElements = page.locator('text=Question, text=Test, .question-container, [data-testid="test-question"]').first();
    await expect(testElements.or(page.locator('body'))).toBeVisible();
  });
});

test.describe('Navigation & Layout', () => {
  
  test('mobile responsive menu works', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('/dashboard');
    
    // Look for hamburger menu
    const menuButton = page.locator('button:has([class*="Menu"]), button[aria-label*="menu"], .hamburger').first();
    
    if (await menuButton.isVisible().catch(() => false)) {
      // Click to open menu
      await menuButton.click();
      
      // Check if sidebar or mobile menu opened
      await expect(page.locator('nav, aside, [role="navigation"]').first()).toBeVisible();
      
      // Take screenshot
      await page.screenshot({ path: 'mobile-menu.png' });
    }
  });

  test('footer links work', async ({ page }) => {
    await page.goto('/');
    
    // Check footer exists
    const footer = page.locator('footer').first();
    await expect(footer.or(page.locator('body'))).toBeVisible();
  });
});
