const express = require('express');
const router = express.Router();
const { Product, Category, Purchase, StockLedger, Image, Sale } = require('../models');


router.post('/create' , async(req,res) => {
    const {name , description, category_id, unit} = req.body;
    const product = await Product.findOne({ where: { name } });
    if(product){
        return res.status(400).json({
            success: false,
            message: "Product already exists"
        });
    }
    if (category_id) {
      const category = await Category.findOne({ where: { category_id } });
      if (!category) {
        return res.status(400).json({ success: false, message: 'Invalid category_id' });
      }
    }
    try {
        const newProduct = await Product.create({name, description, category_id, unit});
        res.status(201).json({
            success: true,
            message: "Product created successfully",
            data: newProduct
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error creating product",
            error: error.message
        });
        
    }
})


router.delete('/delete/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const product = await Product.findOne({ where: { product_id: id } });
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    const productid = product.product_id;

    const purchases = await Purchase.findAll({ where: { product_id: productid } });

    for (const purchase of purchases) {
      await StockLedger.destroy({ where: { purchase_id: purchase.purchase_id } });
    }

    await Purchase.destroy({ where: { product_id: productid } });
    await Image.destroy({ where: { product_id: productid } });
    await Sale.destroy({ where: { product_id: productid } });
    await Product.destroy({ where: { product_id: productid } });

    res.json({
      success: true,
      message: "Product and related data deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting product",
      error: error.message
    });
  }
});

router.get('/all', async (req, res) => {
  try {
    const products = await Product.findAll({
      include: { model: Category, attributes: ['name'] }
    });

    res.json({ success: true, data: products });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findOne({
      where: { product_id: req.params.id },
      include: { model: Category, attributes: ['name'] }
    });

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({ success: true, data: product });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
  }
});

router.put('/update/:id', async (req, res) => {
  try {
    const { name, description, category_id, unit } = req.body;

    const product = await Product.findOne({ where: { product_id: req.params.id } });
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    if (category_id) {
      const category = await Category.findOne({ where: { category_id } });
      if (!category) {
        return res.status(400).json({ success: false, message: 'Invalid category_id' });
      }
    }

    await product.update({ name, description, category_id, unit });

    res.json({ success: true, message: 'Product updated successfully', data: product });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
  }
});

module.exports = router;