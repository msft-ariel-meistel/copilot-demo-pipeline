const express = require('express');
const router = express.Router();

/**
 * POST /api/payments/charge
 * Process a payment charge
 * NOTE: Missing input validation — security auditor demo will find this
 */
router.post('/charge', async (req, res) => {
  // TODO: add auth check
  const { amount, currency, cardToken } = req.body;

  // BAD: no input validation — amount could be negative, currency could be arbitrary string
  const response = await fetch('/internal/charge-api', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount, currency, token: cardToken })
  });

  const result = await response.json();
  res.json(result);
});

/**
 * POST /api/payments/refund
 * Refund a payment
 * NOTE: Missing auth check — security auditor demo will find this
 */
router.post('/refund/:paymentId', async (req, res) => {
  const { paymentId } = req.params;
  // BAD: no auth check before processing refund
  const response = await fetch(`/internal/refund-api/${paymentId}`, {
    method: 'POST'
  });
  const result = await response.json();
  res.json(result);
});

module.exports = router;
