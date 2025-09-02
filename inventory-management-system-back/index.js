require('dotenv').config();
const express = require('express');
const db = require('./models');
const cors = require('cors');
const path = require('path');
const categoryRoutes = require('./routes/categoryRoutes.js');
const ProductRoutes = require('./routes/productRoutes.js');
const PurchaseRoutes = require('./routes/purchaseRoutes.js');
const FeedbackRoutes = require('./routes/feedbackRoutes.js');
const saleRoutes = require('./routes/saleRoutes.js');
const StockLedgerRoutes = require('./routes/stockLedgerRoutes.js');
const SupplierRoutes = require('./routes/suppliersRoutes.js');
const CustomerRoutes = require('./routes/customerRoutes.js');
const imageRoutes = require('./routes/imageRoutes.js');

const app = express();
app.use(cors())
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


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
app.use('/api/feedbacks', FeedbackRoutes);
app.use('/api/sales', saleRoutes);
app.use('/api/stock-ledger', StockLedgerRoutes);
app.use('/api/suppliers', SupplierRoutes);
app.use('/api/customers', CustomerRoutes);
app.use('/api/images', imageRoutes);

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


