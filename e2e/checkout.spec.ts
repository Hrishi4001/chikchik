import { test, expect, type Page } from '@playwright/test';
import { existsSync, readFileSync } from 'node:fs';

// Admin credentials come from the environment, falling back to .env.local
function adminEnv(key: string) {
  if (process.env[key]) return process.env[key];
  if (!existsSync('.env.local')) return undefined;
  return readFileSync('.env.local', 'utf8').match(new RegExp(`^${key}=(.*)$`, 'm'))?.[1].trim();
}

async function adminLogin(page: Page) {
  const res = await page.request.post('/api/admin/login', { data: { email: adminEnv('ADMIN_EMAIL'), password: adminEnv('ADMIN_PASSWORD') } });
  expect(res.ok()).toBeTruthy();
}

// Runs against the mock gateway (no Razorpay keys configured).
test('checkout: failed payment can be retried, order appears in admin', async ({ page }) => {
  await page.goto('/product/neem-tulsi-glycerin-soap');
  await page.getByRole('button', { name: 'Add to cart' }).first().click();
  await page.goto('/checkout');

  await page.getByLabel('Full Name *').fill('Test Patron');
  await page.getByLabel('Email *').fill('test.patron@example.com');
  await page.getByLabel('Mobile Number *').fill('9876543210');
  await page.getByRole('button', { name: 'Continue to Delivery' }).click();

  await page.getByLabel('Street Address & Building *').fill('12 MG Road, Indiranagar');
  await page.getByLabel('Pincode *').fill('560001');
  await expect(page.getByLabel('City *')).toHaveValue('Bengaluru');
  await page.getByRole('button', { name: 'Continue to Payment' }).click();

  await page.getByRole('button', { name: /^Pay / }).click();
  await page.getByRole('button', { name: 'Simulate failed payment' }).click();
  await expect(page.getByRole('alert').filter({ hasText: 'declined' })).toBeVisible();

  await page.getByRole('button', { name: /Retry Payment/ }).click();
  await page.getByRole('dialog').getByRole('button', { name: 'Card' }).click();
  await page.getByRole('button', { name: 'Simulate successful payment' }).click();

  await expect(page).toHaveURL(/\/order-success\//);
  await expect(page.getByText('Card (Paid)')).toBeVisible();

  await adminLogin(page);
  await page.goto('/admin/orders');
  await page.getByRole('link', { name: /RVN-/ }).first().click();
  await expect(page.getByText('Test Patron').first()).toBeVisible();
  await expect(page.getByText('Payment captured')).toBeVisible();
  await expect(page.getByText('Payment declined by bank (simulated)').first()).toBeVisible();
});

test('admin: sample data populates dashboard, analytics and payments', async ({ page }) => {
  await adminLogin(page);
  await page.goto('/admin');
  await page.getByRole('button', { name: 'Load sample orders' }).click();
  await expect(page.getByRole('heading', { name: 'Recent orders' })).toBeVisible();
  await page.getByRole('link', { name: 'Analytics' }).first().click();
  await expect(page.getByRole('heading', { name: 'Sales by category' })).toBeVisible();
  await page.getByRole('link', { name: 'Payments' }).first().click();
  await expect(page.getByText('Razorpay not configured')).toBeVisible();
});
