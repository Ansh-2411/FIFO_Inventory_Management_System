const express = require('express');
const router = express.Router();
const { Product, Purchase, Sale, StockLedger, Customer } = require('../models');
const { Op, fn, col, literal } = require('sequelize');


router.get('/summary', async (req, res) => {
  try {
    // 1. Total Products
    const totalProducts = await Product.count();

    // 2. Total Sales (count + total revenue)
    const totalSalesCount = await Sale.count();
    const totalRevenue = await Sale.sum('selling_price');

    // 3. Profit Margin
    // For profit, sum of (sale.selling_price * sale.quantity) - (purchase.cost_price * ledger.quantity)
    const stockLedgers = await StockLedger.findAll({
      include: [
        { model: Sale, attributes: ['selling_price', 'quantity'] },
        { model: Purchase, attributes: ['cost_price'] }
      ]
    });

    let totalCost = 0;
    let totalSell = 0;
    stockLedgers.forEach(entry => {
      const salePrice = entry.Sale.selling_price;
      const costPrice = entry.Purchase.cost_price;
      const qty = entry.quantity;
      totalSell += salePrice * qty;
      totalCost += costPrice * qty;
    });

    const profit = totalSell - totalCost;
    const profitMargin = totalSell ? ((profit / totalSell) * 100).toFixed(2) : 0;

    // 4. Low Stock Items (e.g., total remaining stock < 10)
    const lowStock = await Purchase.findAll({
      attributes: [
        'product_id',
        [fn('SUM', col('quantity_remaining')), 'total_remaining']
      ],
      group: ['product_id'],
      having: literal('SUM(quantity_remaining) < 10'),
      include: [{ model: Product, attributes: ['name'] }],
      order: [[literal('total_remaining'), 'ASC']]
    });


    // 5. 5 Recent Sales
    const recentSales = await Sale.findAll({
      limit: 5,
      order: [['sale_date', 'DESC']],
      include: [
        { model: Product, attributes: ['name'] },
        { model: Customer, attributes: ['name'] }
      ],
      attributes: ['sale_id', 'sale_date', 'selling_price', 'quantity']
    });

    // 6. 5 Lowest Stock Products
    const lowestStock = lowStock.slice(0, 5).map(item => ({
      product_name: item.Product.name,
      product_left: parseFloat(item.dataValues.total_remaining)
    }));

    res.status(200).json({
      success: true,
      summary: {
        totalProducts,
        totalSalesCount,
        totalRevenue,
        profit,
        profitMargin: `${profitMargin}%`,
        lowStockCount: lowStock.length
      },
      recentSales: recentSales.map(sale => ({
        product_name: sale.Product.name,
        customer_name: sale.Customer.name,
        sale_date: sale.sale_date,
        price: sale.selling_price
      })),
      lowestStock
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard summary',
      error: error.message
    });
  }
});

module.exports = router;
