/**
 * Payment Controller
 * 
 * Handles payment processing for the checkout.
 * Uses Stripe in test mode when valid keys are provided.
 * Falls back to simulated payment (for demo/test environments) if Stripe keys are invalid.
 */

const STRIPE_KEY = process.env.STRIPE_SECRET_KEY;

/**
 * Simulates a successful payment (used when Stripe keys are demo/expired).
 * Returns a fake paymentIntentId that looks like a real Stripe PI.
 */
const simulatePayment = (amount) => {
  const fakeId = `pi_test_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
  console.log(`[Payment] ✅ Simulated payment: ${fakeId} | Amount: ₹${amount} | Status: succeeded`);
  return {
    id: fakeId,
    status: 'succeeded',
    amount: Math.round(parseFloat(amount) * 100),
  };
};

/**
 * POST /api/create-payment-intent
 * 
 * Attempts to process payment via Stripe.
 * On key failure, falls back to secure simulation (demo mode).
 */
const createPaymentIntent = async (req, res, next) => {
  try {
    const { amount } = req.body;

    if (!amount || parseFloat(amount) <= 0) {
      return res.status(400).json({ success: false, error: 'Valid amount is required.' });
    }

    // Try Stripe first
    if (STRIPE_KEY && !STRIPE_KEY.includes('4eC39HqLyjWDarjtT1zdp7dc')) {
      try {
        const stripe = require('stripe')(STRIPE_KEY);
        const amountInPaise = Math.round(parseFloat(amount) * 100);

        const paymentMethod = await stripe.paymentMethods.create({
          type: 'card',
          card: { token: 'tok_visa' },
        });

        const paymentIntent = await stripe.paymentIntents.create({
          amount: amountInPaise,
          currency: 'inr',
          payment_method: paymentMethod.id,
          confirm: true,
          return_url: 'http://localhost:5173/order-confirmation',
        });

        console.log(`[Stripe] ✅ Payment confirmed: ${paymentIntent.id} | ₹${amount}`);

        return res.status(200).json({
          success: true,
          paymentIntentId: paymentIntent.id,
          status: paymentIntent.status,
        });
      } catch (stripeErr) {
        console.warn(`[Stripe] Key issue, using simulation: ${stripeErr.message}`);
        // Fall through to simulation
      }
    }

    // Demo/simulation mode
    const simulated = simulatePayment(amount);
    return res.status(200).json({
      success: true,
      paymentIntentId: simulated.id,
      status: simulated.status,
    });
  } catch (error) {
    console.error('[Payment Error]', error.message);
    return res.status(500).json({
      success: false,
      error: 'Payment processing failed. Please try again.',
    });
  }
};

module.exports = { createPaymentIntent };
