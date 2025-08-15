import express from 'express';
const router = express.Router();
import Stripe from 'stripe';
import Payment from '../models/Payment.js';
import Shop from '../models/shop.js';
import User from '../models/user.js';



const stripe = new Stripe('sk_test_51QJef7RwP0CS6vlp1xPmO3Nre0XQtp4VMvgKfYvMWeipbCfvV38ECuNVUOTiOHPikUYDhFSWh1gkhhlYE8LfLUEN00x5umMnMs');

// Create PaymentIntent
router.post('/create-payment-intent', async (req, res) => {
  try {
    const { amount, currency, metadata } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount provided' });
    }

    if (!currency) {
      return res.status(400).json({ error: 'Currency is required' });
    }

    const amountInCents = Math.round(Number(amount));
    if (isNaN(amountInCents) || amountInCents < 50) {
      return res.status(400).json({ error: 'Amount must be at least $0.50' });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: currency.toLowerCase(),
      metadata: metadata || {},
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });

  } catch (err) {
    console.error('Stripe PaymentIntent creation error:', err);

    if (err.type === 'StripeCardError') {
      res.status(400).json({ error: err.message });
    } else if (err.type === 'StripeInvalidRequestError') {
      res.status(400).json({ error: 'Invalid request parameters' });
    } else if (err.type === 'StripeAPIError') {
      res.status(500).json({ error: 'Stripe API error occurred' });
    } else if (err.type === 'StripeConnectionError') {
      res.status(500).json({ error: 'Network error occurred' });
    } else if (err.type === 'StripeAuthenticationError') {
      res.status(401).json({ error: 'Stripe authentication failed' });
    } else {
      res.status(500).json({ error: 'An unexpected error occurred' });
    }
  }
});

// Save Payment + Reduce Stock
router.post('/save-payment', async (req, res) => {
  try {
    const { userId, itemId, quantity, amount, currency, paymentIntentId, status } = req.body;

    if (!userId || !itemId || !amount || !paymentIntentId || !quantity) {
      return res.status(400).json({
        error: 'Missing required fields: userId, itemId, quantity, amount, and paymentIntentId are required'
      });
    }

    const numericAmount = Number(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      return res.status(400).json({ error: 'Invalid amount provided' });
    }

    const numericQty = Number(quantity);
    if (isNaN(numericQty) || numericQty <= 0) {
      return res.status(400).json({ error: 'Invalid quantity provided' });
    }

    // Optional: Verify payment status via Stripe
    try {
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      if (paymentIntent.status !== 'succeeded') {
        return res.status(400).json({
          error: 'Payment not completed successfully',
          stripeStatus: paymentIntent.status
        });
      }
    } catch (stripeError) {
      console.error('Error verifying payment with Stripe:', stripeError);
    }

    // Check if payment already recorded
    const existingPayment = await Payment.findOne({ PaymentID: paymentIntentId });
    if (existingPayment) {
      return res.status(409).json({
        error: 'Payment already recorded',
        payment: existingPayment
      });
    }

    // Check if item exists and has sufficient stock
    const shop = await Shop.findOne({ "items._id": itemId });
    if (!shop) {
      return res.status(404).json({ error: 'Item not found in any shop' });
    }

    const item = shop.items.id(itemId);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    if (item.availableqty < numericQty) {
      return res.status(400).json({ error: 'Insufficient stock' });
    }

    item.availableqty -= numericQty;
    await shop.save();

    // Save payment record
    const payment = new Payment({
      userId,
      itemId,
      quantity: numericQty,
      amount: numericAmount,
      currency: currency || 'usd',
      PaymentID: paymentIntentId,
      status: status || 'succeeded'
    });

    const savedPayment = await payment.save();

    res.json({
      success: true,
      payment: savedPayment
    });

  } catch (err) {
    console.error('Error saving payment:', err);

    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(e => e.message);
      res.status(400).json({ error: 'Validation error', details: errors });
    } else if (err.code === 11000) {
      res.status(409).json({ error: 'Payment record already exists' });
    } else {
      res.status(500).json({ error: 'Failed to save payment details' });
    }
  }
});

// Get payment by ID
router.get('/payment/:paymentIntentId', async (req, res) => {
  try {
    const { paymentIntentId } = req.params;

    const payment = await Payment.findOne({ PaymentID: paymentIntentId });

    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    res.json({ payment });

  } catch (err) {
    console.error('Error fetching payment:', err);
    res.status(500).json({ error: 'Failed to fetch payment details' });
  }
});

// Get user payments
router.get('/payments/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 10, skip = 0 } = req.query;

    const payments = await Payment.find({ userId })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    const total = await Payment.countDocuments({ userId });

    res.json({
      payments,
      total,
      hasMore: total > parseInt(skip) + parseInt(limit)
    });

  } catch (err) {
    console.error('Error fetching user payments:', err);
    res.status(500).json({ error: 'Failed to fetch payment history' });
  }
});

// Get all payments
router.get('/payments', async (req, res) => {
  try {
    const { limit = 20, skip = 0, status } = req.query;

    let query = {};
    if (status) {
      query.status = status;
    }

    const payments = await Payment.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    const total = await Payment.countDocuments(query);

    res.json({
      payments,
      total,
      hasMore: total > parseInt(skip) + parseInt(limit)
    });
  } catch (err) {
    console.error('Error fetching all payments:', err);
    res.status(500).json({ error: 'Failed to fetch payments' });
  }
});



export default router;
