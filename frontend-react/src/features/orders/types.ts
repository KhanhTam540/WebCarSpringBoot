export type OrderItem = {
  id: number;
  partId: number;
  partName: string;
  quantity: number;
  price: number;
};

export type Order = {
  id: number;
  username: string;
  totalPrice: number;
  status: string;
  shippingAddress: string;
  paymentMethod: string;
  createdAt: string;
  items: OrderItem[];
};
