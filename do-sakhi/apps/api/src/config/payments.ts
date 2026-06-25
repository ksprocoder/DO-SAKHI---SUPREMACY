import dotenv from 'dotenv';
dotenv.config();

export const paymentsConfig = {
  enabled: process.env.PAYMENTS_ENABLED === 'true',
  env: process.env.RAZORPAY_ENV === 'live' ? 'live' : 'test',
  keyId: process.env.RAZORPAY_KEY_ID || '',
  keySecret: process.env.RAZORPAY_KEY_SECRET || '',
  webhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET || ''
};

// Validate config on load if payments are enabled
if (paymentsConfig.enabled) {
  if (!paymentsConfig.keyId || !paymentsConfig.keySecret) {
    console.warn('⚠️ WARNING: PAYMENTS_ENABLED is true but RAZORPAY keys are missing in environment.');
  }

  if (paymentsConfig.env === 'live') {
    // For future production readiness gating
    console.warn('🚨 DANGER: RAZORPAY_ENV is set to live. Ensure production readiness checks pass.');
  }
}
