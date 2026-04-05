import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { cartApi } from '../../../api/cartApi';
import { httpClient } from '../../../api/httpClient';
import { orderApi } from '../../../api/orderApi';
import { ErrorState } from '../../../components/feedback/ErrorState';
import { LoadingState } from '../../../components/feedback/LoadingState';
import { useAuthStore } from '../../../store/authStore';
import { useCartStore } from '../../../store/cartStore';
import { CartSummary } from '../components/CartSummary';
import { CartTable } from '../components/CartTable';
import type { CartItem } from '../types';

const EMPTY_CART_ITEMS: CartItem[] = [];

export function CartPage() {
  const queryClient = useQueryClient();
  const syncBadgeCountFromItems = useCartStore((state) => state.syncBadgeCountFromItems);
  const setCartBadgeCount = useAuthStore((state) => state.setCartBadgeCount);
  const [selectedItemIds, setSelectedItemIds] = useState<number[]>([]);
  const [shippingAddress, setShippingAddress] = useState('');
   const [paymentMethod, setPaymentMethod] = useState('COD');
   const [selectedBank, setSelectedBank] = useState('');
   const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [viewportWidth, setViewportWidth] = useState(() => window.innerWidth);

  useEffect(() => {
    const handleResize = () => setViewportWidth(window.innerWidth);

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const cartQuery = useQuery<CartItem[]>({
    queryKey: ['cart'],
    queryFn: cartApi.getCart,
  });

  const cartItems = cartQuery.data ?? EMPTY_CART_ITEMS;

  useEffect(() => {
    syncBadgeCountFromItems(cartItems);
    setCartBadgeCount(cartItems.reduce((total, item) => total + item.quantity, 0));
  }, [cartItems, setCartBadgeCount, syncBadgeCountFromItems]);

  useEffect(() => {
    setSelectedItemIds((currentSelection) => {
      if (currentSelection.length === 0) {
        const nextSelection = cartItems.map((item) => item.id);

        if (nextSelection.length === 0) {
          return currentSelection;
        }

        return nextSelection;
      }

      const nextSelection = currentSelection.filter((itemId) => cartItems.some((item) => item.id === itemId));

      if (
        nextSelection.length === currentSelection.length &&
        nextSelection.every((itemId, index) => itemId === currentSelection[index])
      ) {
        return currentSelection;
      }

      return nextSelection;
    });
  }, [cartItems]);

  const updateQuantityMutation = useMutation({
    mutationFn: ({ itemId, quantity }: { itemId: number; quantity: number }) => cartApi.updateItemQuantity(itemId, quantity),
    onSuccess: async () => {
      setErrorMessage(null);
      await queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
    onError: (error: Error) => {
      setErrorMessage(error.message);
    },
  });

  const removeItemMutation = useMutation({
    mutationFn: (itemId: number) => cartApi.removeItem(itemId),
    onSuccess: async (_, itemId) => {
      setErrorMessage(null);
      setSelectedItemIds((currentSelection) => currentSelection.filter((selectedId) => selectedId !== itemId));
      await queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
    onError: (error: Error) => {
      setErrorMessage(error.message);
    },
  });

  const checkoutMutation = useMutation({
    mutationFn: (payload: { address: string; paymentMethod: string; cartItemIds: number[] }) =>
      orderApi.createOrder(payload),
    onSuccess: async (order) => {
      setErrorMessage(null);
      
      if (paymentMethod === 'VNPAYQR' || paymentMethod === 'VNBANK' || paymentMethod === 'MOMO') {
        try {
          let methodParam = '';
          let bankCodeParam = '';
          
          if (paymentMethod === 'MOMO') {
            methodParam = 'MOMO';
          } else {
            methodParam = 'VNPAY';
            bankCodeParam = paymentMethod === 'VNBANK' ? selectedBank : paymentMethod;
          }
          
          const data = await httpClient<{url: string}>({ 
            path: `/payment/create_url?orderId=${order?.id}&method=${methodParam}&bankCode=${bankCodeParam}&returnBaseUrl=${window.location.origin}`
          });
          if (data.url) {
            window.location.href = data.url;
            return;
          }
        } catch (e) {
          console.error("Failed to get payment url", e);
          setErrorMessage('Không thể tạo liên kết thanh toán. Vui lòng thử lại.');
          return;
        }
        
        // If we reach here and it was VNPAY/MOMO, it means data.url was empty but no exception.
        setErrorMessage('Dịch vụ thanh toán tạm thời gián đoạn. Xin thử lại sau.');
        return;
      }

      setFeedbackMessage(`Đơn hàng #${order.id} đã được tạo thành công.`);
      setShippingAddress('');
      setSelectedItemIds([]);
      await queryClient.invalidateQueries({ queryKey: ['cart'] });
      await queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
    onError: (error: Error) => {
      setErrorMessage(error.message);
    },
  });

  const selectedTotal = useMemo(
    () =>
      cartItems
        .filter((item) => selectedItemIds.includes(item.id))
        .reduce((total, item) => total + item.price * item.quantity, 0),
    [cartItems, selectedItemIds],
  );

  if (cartQuery.isPending) {
    return <LoadingState message="Đang tải giỏ hàng..." />;
  }

  if (cartQuery.isError) {
    return <ErrorState message="Không thể tải giỏ hàng." />;
  }

  const toggleItemSelection = (itemId: number) => {
    setSelectedItemIds((currentSelection) =>
      currentSelection.includes(itemId)
        ? currentSelection.filter((selectedId) => selectedId !== itemId)
        : [...currentSelection, itemId],
    );
  };

  const handleCheckout = () => {
    if (selectedItemIds.length === 0) {
      setErrorMessage('Vui lòng chọn ít nhất một sản phẩm để đặt hàng.');
      return;
    }

    if (!shippingAddress.trim()) {
      setErrorMessage('Vui lòng nhập địa chỉ giao hàng.');
      return;
    }

    checkoutMutation.mutate({
      address: shippingAddress.trim(),
      paymentMethod,
      cartItemIds: selectedItemIds,
    });
  };

  const cartTestId = viewportWidth >= 1280 ? 'cart-desktop' : viewportWidth >= 768 ? 'cart-tablet' : 'cart-mobile';

  return (
    <section data-testid={cartTestId} className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-slate-900">Giỏ hàng của bạn</h1>
        <p className="text-sm text-slate-600">Quản lý số lượng, chọn sản phẩm thanh toán và tạo đơn hàng trực tiếp từ giỏ.</p>
      </div>

      {feedbackMessage ? <p className="text-sm text-emerald-300">{feedbackMessage}</p> : null}
      {errorMessage ? <p role="alert" className="text-sm text-rose-300">{errorMessage}</p> : null}

      {cartItems.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-slate-300 px-4 py-8 text-sm text-slate-600">
          Giỏ hàng của bạn đang trống.
        </p>
      ) : (
        <div className="grid gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)] xl:items-start">
          <CartTable
            items={cartItems}
            selectedItemIds={selectedItemIds}
            onToggleItem={toggleItemSelection}
            onIncreaseQuantity={(item) => updateQuantityMutation.mutate({ itemId: item.id, quantity: item.quantity + 1 })}
            onDecreaseQuantity={(item) => updateQuantityMutation.mutate({ itemId: item.id, quantity: Math.max(1, item.quantity - 1) })}
            onRemoveItem={(itemId) => removeItemMutation.mutate(itemId)}
          />

          <CartSummary
            totalPrice={selectedTotal}
            shippingAddress={shippingAddress}
            onShippingAddressChange={setShippingAddress}
            paymentMethod={paymentMethod}
            onPaymentMethodChange={setPaymentMethod}
            selectedBank={selectedBank}
            onBankChange={setSelectedBank}
            onCheckout={handleCheckout}
            isSubmitting={checkoutMutation.isPending}
          />
        </div>
      )}
    </section>
  );
}
