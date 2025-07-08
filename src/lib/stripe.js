import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe with your publishable key
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || 'pk_test_your_publishable_key_here');

export default stripePromise;

// Payment data from Stripe
export const paymentPlans = [
  {
    name: "Video Bot",
    amount: 99,
    priceId: "price_1RidIQEV6sbsDlR8wjIAJZh2",
    paymentLink: "https://buy.stripe.com/4gMdR96Kx09I3ls9OF5ZC02",
    currency: "usd",
    interval: "month"
  }
];

// Helper function to handle Stripe checkout
export const redirectToCheckout = (paymentLink) => {
  window.open(paymentLink, '_blank');
};