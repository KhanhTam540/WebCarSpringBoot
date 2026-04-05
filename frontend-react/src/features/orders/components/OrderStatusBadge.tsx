const statusLabelMap: Record<string, string> = {
  PENDING: 'Chờ xác nhận',
  PROCESSING: 'Đang xử lý',
  SHIPPED: 'Đang giao',
  DELIVERED: 'Đã giao',
  CANCELLED: 'Đã hủy',
};

export function OrderStatusBadge({ status }: { status: string }) {
  return (
    <span className="inline-flex rounded-full bg-brand-500/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-brand-100">
      {statusLabelMap[status] ?? status}
    </span>
  );
}
