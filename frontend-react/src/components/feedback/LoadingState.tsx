export function LoadingState({ message = 'Đang tải dữ liệu...' }: { message?: string }) {
  return <p className="text-sm text-slate-600">{message}</p>;
}
