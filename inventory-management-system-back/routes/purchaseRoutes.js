const express = require('express');
const router = express.Router();
const { Product, Supplier, Purchase } = require('../models');

router.post('/create', async (req, res) => {
  const { product_id, supplier_id, quantity, cost_price, purchase_date, batch_no } = req.body;
  try {
    const product = await Product.findByPk(product_id);
    const supplier = await Supplier.findByPk(supplier_id);

    if (!product || !supplier) {
      return res.status(404).json({ success: false, message: 'Product or Supplier not found' });
    }

    const purchase = await Purchase.create({
      product_id,
      supplier_id,
      quantity,
      quantity_remaining: quantity,
      cost_price,
      purchase_date,
      batch_no
    });

    res.json({
      success: true,
      message: 'Purchase created successfully',
      data: purchase
    });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

router.get('/all', async (req, res) => {
  try {
    const purchases = await Purchase.findAll({
      include: [
        { model: Product, attributes: ['name'] },
        { model: Supplier, attributes: ['name'] }
      ]
    });

    res.json({ success: true, data: purchases });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

module.exports = router;
