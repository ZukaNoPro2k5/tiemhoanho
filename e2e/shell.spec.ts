import { expect, test } from '@playwright/test';

const viewports = [
  { width: 360, height: 800 },
  { width: 375, height: 667 },
  { width: 390, height: 844 },
  { width: 430, height: 932 },
  { width: 1440, height: 900 },
];

for (const viewport of viewports) {
  test(`production shell at ${viewport.width}x${viewport.height}`, async ({
    page,
  }, testInfo) => {
    await page.setViewportSize(viewport);
    const failures: string[] = [];
    page.on('pageerror', (error) => failures.push(error.message));
    page.on('console', (message) => {
      if (message.type() === 'error') failures.push(message.text());
    });
    page.on('response', (response) => {
      if (response.status() >= 400)
        failures.push(`${response.status()} ${response.url()}`);
    });
    page.on('requestfailed', (request) =>
      failures.push(`${request.url()}: ${request.failure()?.errorText}`),
    );

    const response = await page.goto('/');
    expect(response?.ok()).toBe(true);
    await expect(page).toHaveTitle('Tiệm Hoa Nhỏ');
    await expect(
      page.getByRole('heading', { level: 1, name: 'Tiệm Hoa Nhỏ' }),
    ).toBeVisible();
    await expect(
      page.getByRole('img', { name: /Mặt tiền tiệm hoa/ }),
    ).toBeVisible();
    await expect(page.getByRole('status')).toContainText(
      'Tiệm đang được chuẩn bị',
    );
    await expect(page.locator('html')).toHaveAttribute('lang', 'vi');
    await expect(page.getByRole('button')).toHaveText(['Vào xếp hoa']);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);

    const shell = await page.getByRole('main').boundingBox();
    expect(shell).not.toBeNull();
    expect(shell?.width).toBeLessThanOrEqual(430);
    if (viewport.width > 430) {
      expect(
        Math.abs((shell?.x ?? 0) - (viewport.width - (shell?.width ?? 0)) / 2),
      ).toBeLessThan(1);
    }
    if (viewport.width === 390) {
      const footer = await page.locator('footer').boundingBox();
      expect(
        (footer?.y ?? Infinity) + (footer?.height ?? 0),
      ).toBeLessThanOrEqual(viewport.height);
    }
    await page.locator('footer').scrollIntoViewIfNeeded();
    await expect(page.locator('footer')).toBeVisible();
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForLoadState('networkidle');
    const screenshot = testInfo.outputPath('shell.png');
    await page.screenshot({ path: screenshot, fullPage: true });
    await testInfo.attach('shell', {
      path: screenshot,
      contentType: 'image/png',
    });
    expect(failures).toEqual([]);
  });
}

test('reduced-motion shell remains readable', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  expect(
    await page.evaluate(
      () =>
        document
          .getAnimations()
          .filter((animation) => animation.playState === 'running').length,
    ),
  ).toBe(0);
});

test('install metadata serves real icons and the cached shell reloads offline', async ({
  page,
  context,
}) => {
  await page.goto('/');
  const manifestUrl = await page
    .locator('link[rel="manifest"]')
    .getAttribute('href');
  expect(manifestUrl).toBeTruthy();
  const manifestResponse = await page.request.get(manifestUrl ?? '');
  expect(manifestResponse.ok()).toBe(true);
  const manifest: {
    name: string;
    display: string;
    lang: string;
    icons: { src: string; sizes: string; purpose: string }[];
  } = await manifestResponse.json();
  expect(manifest.name).toBe('Tiệm Hoa Nhỏ');
  expect(manifest.display).toBe('standalone');
  expect(manifest.lang).toBe('vi');
  expect(manifest.icons.some((icon) => icon.purpose === 'maskable')).toBe(true);
  for (const icon of manifest.icons) {
    const response = await page.request.get(icon.src);
    expect(response.ok()).toBe(true);
    expect(response.headers()['content-type']).toContain('image/png');
    const png = await response.body();
    const size = Number(icon.sizes.split('x')[0]);
    expect(png.subarray(1, 4).toString()).toBe('PNG');
    expect(png.readUInt32BE(16)).toBe(size);
    expect(png.readUInt32BE(20)).toBe(size);
  }

  await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
  });
  await page.waitForFunction(() => navigator.serviceWorker.controller !== null);
  await context.setOffline(true);
  await page.reload();
  await expect(
    page.getByRole('heading', { level: 1, name: 'Tiệm Hoa Nhỏ' }),
  ).toBeVisible();
  await expect(
    page.getByRole('img', { name: /Mặt tiền tiệm hoa/ }),
  ).toBeVisible();
  expect(await page.evaluate(() => navigator.onLine)).toBe(false);
});
