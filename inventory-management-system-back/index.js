require('dotenv').config();
const express = require('express');
const db = require('./models');
const categoryRoutes = require('./routes/categoryRoutes.js');
const ProductRoutes = require('./routes/productRoutes.js');
const PurchaseRoutes = require('./routes/purchaseRoutes.js');
const FeedbackRoutes = require('./routes/feedbackRoutes.js');
const saleRoutes = require('./routes/saleRoutes.js');
const StockLedgerRoutes = require('./routes/stockLedgerRoutes.js');
const supplierRoutes = require('./routes/supplierRoute.js');
const customerRoutes = require('./routes/customerRoutes.js');

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    message: "Welcome to the API",
    status: "running",
    version: "1.0.0"
  });
});

app.use('/api/categories', categoryRoutes);
app.use('/api/products', ProductRoutes);
app.use('/api/purchases', PurchaseRoutes);
app.use('/api/feedback', FeedbackRoutes);
app.use('/api/sales', saleRoutes);
app.use('/api/stock_ledger', StockLedgerRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/feedbacks', FeedbackRoutes);


// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: err.message
  });
});

const PORT = process.env.PORT || 3005;

db.sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error('Failed to sync database:', err);
});


