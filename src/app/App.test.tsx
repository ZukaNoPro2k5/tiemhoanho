import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { App } from './App';

describe('application shell', () => {
  it('opens directly into a named shop with a truthful preparation state', () => {
    render(<App />);
    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 1, name: 'Tiệm Hoa Nhỏ' }),
    ).toBeVisible();
    expect(screen.getByRole('status')).toHaveTextContent(
      'Tiệm đang được chuẩn bị',
    );
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('gives the non-interactive storefront a single accessible description', () => {
    render(<App />);
    expect(
      screen.getByRole('img', { name: /Mặt tiền tiệm hoa/ }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole('img')).toHaveLength(1);
  });
});
