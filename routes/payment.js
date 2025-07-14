import express from 'express';
const router = express.Router();
import Stripe from 'stripe';
import Payment from '../models/Payment.js';

const stripe = new Stripe('sk_test_51QJef7RwP0CS6vlp1xPmO3Nre0XQtp4VMvgKfYvMWeipbCfvV38ECuNVUOTiOHPikUYDhFSWh1gkhhlYE8LfLUEN00x5umMnMs');

router.post('/create-payment-intent', async (req, res) => {
  try {
    const { amount, currency, metadata } = req.body;
    
    // Validate required fields
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
    
    // Handle specific Stripe errors
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

// Save payment details
router.post('/save-payment', async (req, res) => {
  try {
    const { userId, itemId, amount, currency, paymentIntentId, status } = req.body;
    
    // Validate required fields
    if (!userId || !itemId || !amount || !paymentIntentId) {
      return res.status(400).json({ 
        error: 'Missing required fields: userId, itemId, amount, and paymentIntentId are required' 
      });
    }

    // Validate amount is a number
    const numericAmount = Number(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      return res.status(400).json({ error: 'Invalid amount provided' });
    }

    // Optional: Verify the payment with Stripe
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

    // Check for existing payment using the correct field name
    const existingPayment = await Payment.findOne({ PaymentID: paymentIntentId });
    if (existingPayment) {
      return res.status(409).json({ 
        error: 'Payment already recorded',
        payment: existingPayment 
      });
    }

    const payment = new Payment({
      userId,
      itemId,
      amount: numericAmount,
      currency: currency || 'usd',
      PaymentID: paymentIntentId,  // Use PaymentID instead of paymentIntentId
      status: status || 'succeeded'
    });
    
    const savedPayment = await payment.save();
    
    res.json({ 
      success: true, 
      payment: savedPayment 
    });
    
  } catch (err) {
    console.error('Error saving payment:', err);
    
    // Handle MongoDB validation errors
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(e => e.message);
      res.status(400).json({ error: 'Validation error', details: errors });
    } else if (err.code === 11000) {
      // Duplicate key error
      res.status(409).json({ error: 'Payment record already exists' });
    } else {
      res.status(500).json({ error: 'Failed to save payment details' });
    }
  }
});

// Optional: Get payment by ID
router.get('/payment/:paymentIntentId', async (req, res) => {
  try {
    const { paymentIntentId } = req.params;
    
    // Use PaymentID field for query
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

// Optional: Get user payments
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

export default router;