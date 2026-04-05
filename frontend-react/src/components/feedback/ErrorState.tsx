export function ErrorState({ message = 'Đã xảy ra lỗi.' }: { message?: string }) {
  return <p className="text-sm text-rose-300">{message}</p>;
}
