import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { catalogApi } from '../../../api/catalogApi';
import { comboApi } from '../../../api/comboApi';
import { ErrorState } from '../../../components/feedback/ErrorState';
import { LoadingState } from '../../../components/feedback/LoadingState';
import { ProductDetailView } from '../components/ProductDetailView';
import type { ComboSummary, PartDetail } from '../types';

export function ProductDetailPage() {
  const { id } = useParams();
  const partId = Number(id);

  const productDetailQuery = useQuery<PartDetail>({
    queryKey: ['part', partId],
    queryFn: () => catalogApi.getPartDetail(partId),
    enabled: Number.isFinite(partId),
  });

  const comboQuery = useQuery<ComboSummary[]>({
    queryKey: ['combos', 'by-part', partId],
    queryFn: () => comboApi.getCombosByPart(partId),
    enabled: Number.isFinite(partId),
    retry: false,
  });

  if (productDetailQuery.isLoading) {
    return <LoadingState message="Đang tải chi tiết sản phẩm..." />;
  }

  if (productDetailQuery.isError || !productDetailQuery.data) {
    return <ErrorState message="Không thể tải thông tin sản phẩm." />;
  }

  return <ProductDetailView product={productDetailQuery.data} combos={comboQuery.data ?? []} />;
}
