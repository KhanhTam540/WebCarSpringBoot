import { describe, expect, it } from 'vitest';
import { renderWithProviders, screen } from '../../../test/utils';
import { ProductCard } from './ProductCard';
import type { PartSummary } from '../types';

describe('ProductCard', () => {
  it('renders product text safely without creating executable markup', () => {
    const product: PartSummary = {
      id: 101,
      sku: 'SAFE-101',
      name: '<script>alert("xss")</script>Phụ tùng an toàn',
      price: 1250000,
      stockQuantity: 3,
      imageUrl: null,
      categoryId: 7,
      categoryName: 'Phanh',
    };

    const { container } = renderWithProviders(<ProductCard product={product} />);

    expect(screen.getByRole('heading', { name: /phụ tùng an toàn/i })).toBeInTheDocument();
    expect(screen.getByText(/1,250,000/i)).toBeInTheDocument();
    expect(container.querySelector('script')).not.toBeInTheDocument();
  });
});
