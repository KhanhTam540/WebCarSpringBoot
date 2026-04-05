import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { catalogApi } from '../../../api/catalogApi';
import { useAuthStore, selectIsAuthenticated } from '../../../store/authStore';

const StarIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
  </svg>
);

const StarOutline = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
  </svg>
);

type Props = {
  partId: number;
};

export function ProductReviews({ partId }: Props) {
  const queryClient = useQueryClient();
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ['reviews', partId],
    queryFn: () => catalogApi.getPartReviews(partId),
  });

  const addReviewMutation = useMutation({
    mutationFn: () => catalogApi.addPartReview({ partId, rating, comment }),
    onSuccess: () => {
      setComment('');
      setRating(5);
      setErrorMsg(null);
      queryClient.invalidateQueries({ queryKey: ['reviews', partId] });
    },
    onError: (error: Error) => {
      setErrorMsg(error.message || 'Không thể đăng đánh giá. Vui lòng thử lại sau.');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      setErrorMsg('Vui lòng nhập nội dung đánh giá.');
      return;
    }
    addReviewMutation.mutate();
  };

  if (isLoading) {
    return <div className="animate-pulse h-32 bg-slate-100 rounded-xl mt-8"></div>;
  }

  const avgRating = reviews.length > 0 
    ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1)
    : 0;

  return (
    <div className="mt-12 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Đánh giá sản phẩm</h2>
      
      <div className="flex items-center gap-4 mb-8">
        <div className="text-4xl font-bold text-slate-900">{avgRating}</div>
        <div>
          <div className="flex text-amber-500">
            {[1, 2, 3, 4, 5].map((star) => (
              star <= Number(avgRating) ? 
                <StarIcon key={star} className="h-5 w-5" /> : 
                <StarOutline key={star} className="h-5 w-5" />
            ))}
          </div>
          <p className="text-sm text-slate-500 mt-1">{reviews.length} đánh giá</p>
        </div>
      </div>

      {isAuthenticated ? (
        <form onSubmit={handleSubmit} className="mb-10 bg-slate-50 p-4 rounded-xl border border-slate-200">
          <h3 className="font-semibold text-slate-800 mb-3">Viết đánh giá của bạn</h3>
          
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm text-slate-600">Đánh giá:</span>
            <div className="flex cursor-pointer text-amber-500">
              {[1, 2, 3, 4, 5].map((star) => (
                <div key={star} onClick={() => setRating(star)}>
                  {star <= rating ? <StarIcon className="h-6 w-6" /> : <StarOutline className="h-6 w-6" />}
                </div>
              ))}
            </div>
          </div>

          <textarea 
            rows={3} 
            className="w-full rounded-xl border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3 mb-4"
            placeholder="Chia sẻ cảm nhận của bạn về sản phẩm này..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          
          {errorMsg && <p className="text-sm text-rose-500 mb-3">{errorMsg}</p>}
          
          <button 
            type="submit" 
            disabled={addReviewMutation.isPending}
            className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-medium hover:bg-indigo-700 transition"
          >
            {addReviewMutation.isPending ? 'Đang gửi...' : 'Gửi đánh giá'}
          </button>
        </form>
      ) : (
        <div className="mb-10 rounded-xl bg-orange-50 p-4 text-orange-800 text-sm border border-orange-100">
          Vui lòng đăng nhập để gửi đánh giá sản phẩm.
        </div>
      )}

      <div className="space-y-6">
        {reviews.length === 0 ? (
          <p className="text-slate-500 text-sm">Chưa có đánh giá nào cho sản phẩm này.</p>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="border-b border-slate-100 pb-6 last:border-0">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-slate-800">{review.userFullName}</span>
                <span className="text-xs text-slate-400">
                  {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                </span>
              </div>
              <div className="flex text-amber-500 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  star <= review.rating ? 
                    <StarIcon key={star} className="h-4 w-4" /> : 
                    <StarOutline key={star} className="h-4 w-4" />
                ))}
              </div>
              <p className="text-slate-600 text-sm leading-relaxed">{review.comment}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
