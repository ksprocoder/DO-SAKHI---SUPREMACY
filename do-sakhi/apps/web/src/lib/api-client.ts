import {
  ProductQueryParams,
  ProductListResponse,
  ProductDetail,
  CreateCartPayload,
  CreateCartResponse,
  AddCartItemPayload,
  AddCartItemResponse,
  TailoringPayload,
  TailoringResponse,
  CheckoutPayload,
  CheckoutResponse,
  HealthResponse,
  CreatePaymentOrderResponse,
  VerifyPaymentRequest,
  VerifyPaymentResponse
} from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:4000/api/v1';

async function fetchHelper<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // cache: 'no-store' prevents Next.js static generation from caching failed
  // API responses, ensuring SSR always attempts a live fetch and the try/catch
  // in server components can handle offline gracefully.
  const response = await fetch(url, {
    cache: 'no-store',
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorMessage = `HTTP Error: ${response.status} ${response.statusText}`;
    try {
      const errorData = await response.json();
      if (errorData && errorData.error) {
        // Return stringified error object to be parsed by caller or message if simple
        errorMessage = JSON.stringify(errorData.error);
      }
    } catch (e) {
      // Ignore JSON parse error for error response
    }
    throw new Error(errorMessage);
  }

  return response.json() as Promise<T>;
}

export const apiClient = {
  checkHealth: () => fetchHelper<HealthResponse>('/health'),
  
  getProducts: (params?: ProductQueryParams) => {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }
    const queryString = searchParams.toString();
    const endpoint = queryString ? `/products?${queryString}` : '/products';
    return fetchHelper<ProductListResponse>(endpoint);
  },

  getProductBySlug: (slug: string) => fetchHelper<{ data: ProductDetail }>(`/products/${slug}`).then(res => res.data),
  
  createCart: (payload?: CreateCartPayload) => fetchHelper<CreateCartResponse>('/cart', {
    method: 'POST',
    body: JSON.stringify(payload || {}),
  }),
  
  addCartItem: (cartId: string, payload: AddCartItemPayload) => fetchHelper<AddCartItemResponse>(`/cart/${cartId}/items`, {
    method: 'POST',
    body: JSON.stringify(payload),
  }),
  
  bindTailoring: (cartId: string, cartItemId: string, payload: TailoringPayload) => fetchHelper<TailoringResponse>(`/cart/${cartId}/items/${cartItemId}/tailoring`, {
    method: 'POST',
    body: JSON.stringify(payload),
  }),
  
  createPaymentOrder: (payload: any) => fetchHelper<CreatePaymentOrderResponse>('/checkout/create-payment-order', {
    method: 'POST',
    body: JSON.stringify(payload),
  }),

  verifyPayment: (payload: VerifyPaymentRequest) => fetchHelper<VerifyPaymentResponse>('/checkout/verify-payment', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
};
