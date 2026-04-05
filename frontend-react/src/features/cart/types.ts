export type CartItem = {
  id: number;
  partId: number;
  partName: string;
  price: number;
  quantity: number;
  imageUrl: string | null;
};

export type CreateOrderPayload = {
  address: string;
  paymentMethod: string;
  cartItemIds: number[];
};
