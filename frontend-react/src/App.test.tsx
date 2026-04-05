import App from './App';
import { render, screen } from '@testing-library/react';

describe('App bootstrap', () => {
  it('renders the active storefront homepage', async () => {
    render(<App />);

    expect(screen.getByTestId('app-header')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /web oto react migration/i })).toBeInTheDocument();
    expect(
      await screen.findByRole('heading', { name: /tìm đúng phụ tùng cho đúng đời xe/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /filter phụ tùng/i })).toBeInTheDocument();
  });
});
