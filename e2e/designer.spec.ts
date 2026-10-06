import { expect, test, type Locator, type Page } from '@playwright/test';

async function openDesigner(page: Page) {
  await page.goto('/');
  await page.getByRole('button', { name: 'Vào xếp hoa' }).click();
  await expect(
    page.getByRole('heading', { level: 1, name: 'Xếp hoa' }),
  ).toBeVisible();
}

async function addFlowers(page: Page, names: string[]) {
  const tray = page.getByRole('list', { name: 'Khay hoa' });
  for (const name of names) await tray.getByRole('button', { name }).click();
}

const plane = (page: Page) =>
  page.getByRole('group', { name: 'Khung xếp hoa' });

async function center(locator: Locator) {
  const box = await locator.boundingBox();
  if (!box) throw new Error('element not visible');
  return { x: box.x + box.width / 2, y: box.y + box.height / 2 };
}

/**
 * Real touch input on Chromium (CDP), so a missing touch-action would scroll
 * the page. WebKit has no CDP; it gets touch-type pointer events instead.
 */
async function touchDrag(
  page: Page,
  browserName: string,
  target: Locator,
  dx: number,
  dy: number,
) {
  const from = await center(target);
  const steps = 8;
  if (browserName === 'chromium') {
    const cdp = await page.context().newCDPSession(page);
    const send = (
      type: 'touchStart' | 'touchMove' | 'touchEnd',
      x: number,
      y: number,
    ) =>
      cdp.send('Input.dispatchTouchEvent', {
        type,
        touchPoints: type === 'touchEnd' ? [] : [{ x, y, id: 1 }],
      });
    await send('touchStart', from.x, from.y);
    for (let step = 1; step <= steps; step += 1) {
      await send(
        'touchMove',
        from.x + (dx * step) / steps,
        from.y + (dy * step) / steps,
      );
    }
    await send('touchEnd', from.x + dx, from.y + dy);
    return;
  }
  const init = (x: number, y: number) => ({
    pointerId: 7,
    pointerType: 'touch',
    isPrimary: true,
    clientX: x,
    clientY: y,
    button: 0,
    buttons: 1,
    bubbles: true,
  });
  await target.dispatchEvent('pointerdown', init(from.x, from.y));
  for (let step = 1; step <= steps; step += 1) {
    await target.dispatchEvent(
      'pointermove',
      init(from.x + (dx * step) / steps, from.y + (dy * step) / steps),
    );
  }
  await target.dispatchEvent('pointerup', init(from.x + dx, from.y + dy));
}

test('adds, drags, selects and removes stems without scrolling the page', async ({
  page,
  browserName,
}) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await openDesigner(page);
  await addFlowers(page, ['Hồng đỏ', 'Tulip hồng', 'Eucalyptus']);
  const stems = plane(page).getByRole('button');
  await expect(stems).toHaveCount(3);

  const rose = plane(page).getByRole('button', { name: 'Hồng đỏ, cành 1' });
  const before = await center(rose);
  const scrollBefore = await page.evaluate(() => ({
    y: window.scrollY,
    scale: window.visualViewport?.scale ?? 1,
  }));
  await touchDrag(page, browserName, rose, 50, -30);
  const after = await center(rose);
  expect(
    Math.abs(after.x - before.x) + Math.abs(after.y - before.y),
  ).toBeGreaterThan(20);
  expect(
    await page.evaluate(() => ({
      y: window.scrollY,
      scale: window.visualViewport?.scale ?? 1,
    })),
  ).toEqual(scrollBefore);
  await expect(rose).toHaveAttribute('aria-pressed', 'false');

  await rose.click();
  await expect(rose).toHaveAttribute('aria-pressed', 'true');
  await page.getByRole('button', { name: 'Xoá' }).click();
  await expect(stems).toHaveCount(2);
  await page.getByRole('button', { name: /Hoàn tác/ }).click();
  await expect(stems).toHaveCount(3);
});

test('keeps stem positions proportional when the viewport changes', async ({
  page,
}) => {
  await openDesigner(page);
  await addFlowers(page, ['Hướng dương', 'Cúc họa mi']);
  const relative = async () => {
    const box = await plane(page).boundingBox();
    const head = await center(
      plane(page).getByRole('button', { name: 'Hướng dương, cành 1' }),
    );
    if (!box) throw new Error('plane missing');
    return {
      x: (head.x - box.x) / box.width,
      y: (head.y - box.y) / box.height,
    };
  };
  const wide = await relative();
  await page.setViewportSize({ width: 360, height: 640 });
  const narrow = await relative();
  expect(narrow.x).toBeCloseTo(wide.x, 2);
  expect(narrow.y).toBeCloseTo(wide.y, 2);
});

test('switches style and wraps, fits 360px and respects reduced motion', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 360, height: 800 });
  await openDesigner(page);
  await addFlowers(page, ['Hồng đỏ', "Baby's breath"]);
  await page.getByRole('button', { name: /Giấy kraft/ }).click();
  await expect(
    page.getByRole('button', { name: /Giấy kraft/ }),
  ).toHaveAttribute('aria-pressed', 'true');
  await page.getByRole('button', { name: 'Lẵng' }).click();
  await expect(plane(page)).toHaveAttribute('data-style', 'basket');
  await expect(page.getByRole('status')).toHaveText(
    'Đã xếp lại theo dáng lẵng',
  );
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  expect(
    await page.evaluate(
      () =>
        document
          .getAnimations()
          .filter((animation) => animation.playState === 'running').length,
    ),
  ).toBe(0);
});

test('tray scrolls sideways and stops adding at nine stems', async ({
  page,
}) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await openDesigner(page);
  const tray = page.getByRole('list', { name: 'Khay hoa' });
  const overflow = await tray.evaluate(
    (element) => element.scrollWidth > element.clientWidth,
  );
  if (overflow) {
    await tray.evaluate((element) => element.scrollBy({ left: 200 }));
    expect(
      await tray.evaluate((element) => element.scrollLeft),
    ).toBeGreaterThan(0);
  }
  for (let index = 0; index < 11; index += 1) {
    const card = tray.getByRole('button', { name: 'Hồng đỏ' });
    if (await card.isDisabled()) break;
    await card.click();
  }
  await expect(plane(page).getByRole('button')).toHaveCount(9);
  await expect(page.getByRole('status')).toContainText('Bó đã đủ 9 cành');
});
