import { describe, expect, it } from 'vitest';
import { render, screen } from '../../test/utils';
import { Button } from './Button';

describe('Button', () => {
  it('renders a primary button with an accessible name', () => {
    render(<Button>Lưu thay đổi</Button>);

    const button = screen.getByRole('button', { name: /lưu thay đổi/i });

    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('bg-brand-500');
    expect(button).toHaveClass('text-slate-950');
  });

  it('renders the secondary variant classes when requested', () => {
    render(
      <Button variant="secondary" className="w-full">
        Hủy
      </Button>,
    );

    const button = screen.getByRole('button', { name: /hủy/i });

    expect(button).toHaveClass('bg-slate-50');
    expect(button).toHaveClass('text-slate-900');
    expect(button).toHaveClass('w-full');
  });
});
