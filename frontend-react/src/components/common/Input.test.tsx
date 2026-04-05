import { describe, expect, it } from 'vitest';
import { render, screen } from '../../test/utils';
import { Input } from './Input';

describe('Input', () => {
  it('keeps accessible label wiring for form fields', () => {
    render(
      <label htmlFor="email-input">
        Email mới
        <Input id="email-input" name="email" />
      </label>,
    );

    const input = screen.getByLabelText(/email mới/i);

    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('name', 'email');
  });

  it('merges base and custom utility classes', () => {
    render(<Input aria-label="Tìm phụ tùng" className="border-brand-400" />);

    const input = screen.getByLabelText(/tìm phụ tùng/i);

    expect(input).toHaveClass('w-full');
    expect(input).toHaveClass('rounded-xl');
    expect(input).toHaveClass('border-brand-400');
  });
});
