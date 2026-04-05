import { useQuery } from '@tanstack/react-query';
import { favoriteApi } from '../../../api/favoriteApi';
import { ErrorState } from '../../../components/feedback/ErrorState';
import { LoadingState } from '../../../components/feedback/LoadingState';
import { ProductCard } from '../../catalog/components/ProductCard';

export function FavoritesPage() {
  const favoritesQuery = useQuery({
    queryKey: ['favorites'],
    queryFn: favoriteApi.getFavorites,
  });

  if (favoritesQuery.isPending) {
    return <LoadingState message="Đang tải danh sách yêu thích..." />;
  }

  if (favoritesQuery.isError) {
    return <ErrorState message="Không thể tải danh sách yêu thích." />;
  }

  const favoriteItems = favoritesQuery.data ?? [];

  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-slate-900">Sản phẩm yêu thích</h1>
        <p className="text-sm text-slate-600">Lưu nhanh các phụ tùng bạn muốn xem lại hoặc mua sau.</p>
      </div>

      {favoriteItems.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-slate-300 px-4 py-8 text-sm text-slate-600">
          Bạn chưa có sản phẩm yêu thích nào.
        </p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {favoriteItems.map((item) => (
            <ProductCard
              key={item.id}
              product={{
                id: item.partId,
                sku: item.sku,
                name: item.name,
                price: item.price,
                stockQuantity: item.stockQuantity,
                imageUrl: item.imageUrl,
                categoryId: item.categoryId,
                categoryName: item.categoryName,
              }}
            />
          ))}
        </div>
      )}
    </section>
  );
}
