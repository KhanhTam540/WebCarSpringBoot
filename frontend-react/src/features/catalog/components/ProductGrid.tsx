import { useEffect, useState } from 'react';
import { ProductCard } from './ProductCard';
import type { PartSummary } from '../types';

export function ProductGrid({ products }: { products: PartSummary[] }) {
  const [viewportWidth, setViewportWidth] = useState(() => window.innerWidth);

  useEffect(() => {
    const handleResize = () => setViewportWidth(window.innerWidth);

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const gridTestId = viewportWidth >= 1280 ? 'product-grid-desktop' : viewportWidth >= 768 ? 'product-grid-tablet' : 'product-grid-mobile';

  if (products.length === 0) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white/60 p-8 text-sm text-slate-600">
        Không tìm thấy sản phẩm phù hợp. Vui lòng thử lại với từ khóa hoặc bộ lọc khác.
      </div>
    );
  }

  return (
    <div data-testid={gridTestId} className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
