export const serviceConfig = {
  users: {
    name: 'user-service',
    url: process.env.USER_SERVICE_URL || 'http://localhost:3000',
    timeout: 10000,
  },
  products: {
    name: 'product-service',
    url: process.env.PRODUCT_SERVICE_URL || 'http://localhost:3001',
    timeout: 10000,
  },
  checkout: {
    name: 'checkout-service',
    url: process.env.CHECKOUT_SERVICE_URL || 'http://localhost:3003',
    timeout: 10000,
  },
  payments: {
    name: 'payment-service',
    url: process.env.PAYMENT_SERVICE_URL || 'http://localhost:3004',
    timeout: 10000,
  },
} as const;
