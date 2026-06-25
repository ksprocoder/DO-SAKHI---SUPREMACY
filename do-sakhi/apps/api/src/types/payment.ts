export type PaymentEnvironment = "test" | "live";

export type CheckoutContact = {
  fullName: string;
  mobile: string;
  email: string;
};

export type CheckoutAddress = {
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pin: string;
  country: string;
  landmark?: string;
  deliveryNotes?: string;
};

export type CheckoutCartItem = {
  productId: string;
  variantId: string;
  quantity: number;
  tailoringRequested?: boolean;
  tailoringPayload?: any; // To be refined
};

export type CreatePaymentOrderRequest = {
  contact: CheckoutContact;
  address: CheckoutAddress;
  items: CheckoutCartItem[];
  checkoutDraftId?: string;
  cartId: string;
};

export type CreatePaymentOrderResponse = {
  orderId: string;
  orderNumber: string;
  razorpayOrderId: string;
  amount: number;
  currency: "INR";
  keyId: string;
};

export type VerifyPaymentRequest = {
  orderId: string;
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};

export type VerifyPaymentResponse = {
  verified: true;
  orderId: string;
  orderNumber: string;
  orderStatus: string;
  paymentStatus: string;
  razorpay: {
    orderId: string;
    paymentId: string;
  };
  message?: string;
};
