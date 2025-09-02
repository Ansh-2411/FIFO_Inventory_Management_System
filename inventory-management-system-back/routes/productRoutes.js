const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const { Product, Category, Purchase, StockLedger, Image, Sale, Feedback } = require('../models');


router.post('/create', async (req, res) => {
  const { name, description, category_id, unit } = req.body;
  const product = await Product.findOne({ where: { name } });
  if (product) {
    return res.status(400).json({
      success: false,
      message: "Product with this name already exists"
    });
  }
  if (category_id) {
    const category = await Category.findOne({ where: { category_id } });
    if (!category) {
      return res.status(400).json({ success: false, message: 'Invalid category_id' });
    }
  }
  try {
    const newProduct = await Product.create({ name, description, category_id, unit });
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

router.get("/list-catagories", async (req, res) => {
  try {
    const category = await Category.findAll();

    if (category.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No categories found"
      });
    }
    res.json({
      success: true,
      message: "Categories fetched successfully",
      data: category
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
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

    // find feedback count and average rating for each product
    for (const product of products) {
      const feedbacks = await Feedback.findAll({
        where: {
          product_id: product.product_id
        }
      });
      const feedbackCount = feedbacks.length;
      const averageRating = feedbackCount > 0 ? (feedbacks.reduce((sum, fb) => sum + fb.rating, 0) / feedbackCount).toFixed(2) : 0;
      product.dataValues.feedbackCount = feedbackCount;
      product.dataValues.averageRating = parseFloat(averageRating);
    }
    // find stock quantity for each product
    for (const product of products) {
      const purchases = await Purchase.findAll({
        where: { product_id: product.product_id }
      });
      const stockQuantity = purchases.reduce((sum, purchase) => sum + parseFloat(purchase.quantity_remaining), 0);
      product.dataValues.stockQuantity = stockQuantity;
    }

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
    // find stock quantity for the product
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const purchases = await Purchase.findAll({
      where: { product_id: product.product_id, quantity_remaining: { [Op.gt]: 0 } }
    });
    // for each purchase, include supplier name from Supplier table
    for (let purchase of purchases) {
      const supplier = await purchase.getSupplier({ attributes: ['company_name'] });
      purchase.dataValues.supplierName = supplier.company_name;
    }

    product.dataValues.stockQuantity = purchases;

    // find feedback count and average rating for the product
    const feedbacks = await Feedback.findAll({
      where: { product_id: product.product_id }
    });
    const feedbackCount = feedbacks.length;
    const averageRating = feedbackCount > 0 ? (feedbacks.reduce((sum, fb) => sum + fb.rating, 0) / feedbackCount).toFixed(2) : 0;
    product.dataValues.feedbackCount = feedbackCount;
    product.dataValues.averageRating = parseFloat(averageRating);
    product.dataValues.feedbacks = feedbacks;

    // fetch images for the product
    const images = await Image.findAll({
      where: { product_id: product.product_id },
      attributes: ['image_id', 'url']
    });
    product.dataValues.images = images;

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