const express = require('express');
const authRouter = require('./auth');
const paymentsRouter = require('./payments');

const app = express();
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/payments', paymentsRouter);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 3000;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
