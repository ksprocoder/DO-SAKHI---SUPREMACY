export interface ProductQueryParams {
  collection?: string;
  size?: string;
  fabric?: string;
  occasion?: string;
  silhouette?: string;
  availability?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
}

export interface ProductMedia {
  id: string;
  product_id: string;
  url: string;
  media_role: string;
  position: number;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  sku: string;
  size_label: string;
  price_inr: string | number;
  stock_quantity: number;
  reserved_quantity: number;
  is_active: boolean;
}

export interface ProductSummary {
  id: string;
  slug: string;
  title: string;
  price: string | number;
  fabric: string;
  silhouette: string;
  available_sizes: string[];
  image: string | null;
  hover_image: string | null;
}

export interface ProductListResponse {
  data: ProductSummary[];
  pagination: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    limit: number;
  };
  availableFilters: {
    sizes: string[];
    fabrics: string[];
    occasions: string[];
  };
}

export interface ProductDetail {
  id: string;
  slug: string;
  title: string;
  description: string;
  short_description?: string;
  fabric_composition: string;
  fabric_feel: string;
  care_instructions: string;
  fit_note: string;
  silhouette: string;
  custom_tailoring_available: boolean;
  lead_time_min_days: number;
  lead_time_max_days: number;
  status: string;
  collection_id: string | null;
  collection_title: string | null;
  collection_slug: string | null;
  variants: ProductVariant[];
  media: ProductMedia[];
  stockAvailable: number;
  
  // Extended fields used in PDP
  neckline?: string;
  sleeve_type?: string;
  kurti_length?: string;
  bottom_type?: string;
  embroidery_detail?: string;
  print_detail?: string;
  pocket_available?: boolean;
  dupatta_included?: boolean;
  ribbon_label?: string;
}

export interface CreateCartPayload {
  guestId?: string;
}

export interface CreateCartResponse {
  id: string;
  guest_session_id: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface AddCartItemPayload {
  productId: string;
  variantId: string;
  quantity: number;
}

export interface AddCartItemResponse {
  id: string;
  cart_id: string;
  product_id: string;
  variant_id: string;
  quantity: number;
  unit_price_inr: string | number;
  tailoring_requested: boolean;
  tailoring_payload: any;
  created_at: string;
  updated_at: string;
}

export interface TailoringPayload {
  measurements: Record<string, number>;
  instructions?: string;
}

export interface TailoringResponse {
  id: string;
  cart_id: string;
  product_id: string;
  variant_id: string;
  quantity: number;
  unit_price_inr: string | number;
  tailoring_requested: boolean;
  tailoring_payload: any;
  created_at: string;
  updated_at: string;
}

export interface CheckoutPayload {
  cartId: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: {
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    pincode: string;
    country?: string;
  };
}

export interface CheckoutResponse {
  orderId: string;
  orderNumber: string;
  status: string;
  stockLockExpiresAt: string;
  payment: {
    gateway: string;
    gatewayOrderId: string;
    amount: number;
    currency: string;
    keyId: string;
  };
}

export interface HealthResponse {
  status: string;
  service: string;
  database: string;
}

export interface CreatePaymentOrderResponse {
  success: boolean;
  data?: {
    orderId: string;
    orderNumber: string;
    orderStatus: string;
    paymentStatus: string;
    amount: {
      subtotal: number;
      shipping: number | null;
      total: number;
      totalPaise: number;
      currency: string;
    };
    razorpay: {
      keyId: string;
      orderId: string;
      amount: number;
      currency: string;
    };
    stockLockExpiresAt: string;
  };
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

export interface VerifyPaymentRequest {
  orderId: string;
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface VerifyPaymentResponse {
  success: boolean;
  data?: {
    orderId: string;
    orderNumber: string;
    orderStatus: string;
    paymentStatus: string;
    verified: boolean;
    razorpay: {
      orderId: string;
      paymentId: string;
    };
    message?: string;
  };
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}
