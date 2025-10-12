const express = require('express');
const router = express.Router();
const { SimpleLinearRegression } = require('ml-regression-simple-linear');
const { sequelize, Sale, Product, Purchase, StockLedger, Customer } = require('../models');
const { Op, fn, col, literal, QueryTypes } = require('sequelize');


// router.post('/create', async (req, res) => {
//     const { product_id, customer_id, quantity, selling_price } = req.body;
//     try {
//         const product = await Product.findByPk(product_id);
//         if (!product) {
//             return res.status(404).json({
//                 success: false,
//                 message: 'Product not found'
//             });
//         }
//         else if (quantity <= 0) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'Quantity must be greater than zero'
//             });
//         }

//         const sale = await Sale.create({ product_id, customer_id, quantity, selling_price });
//         res.status(201).json({
//             success: true,
//             message: 'Sale created successfully',
//             data: sale
//         });

//     } catch (error) {
//         res.status(500).json({
//             sucess: false,
//             message: 'Error creating sale',
//             error: error.message
//         })
//     }
// })

router.post('/create', async (req, res) => {
    const { product_id, customer_id, quantity, selling_price } = req.body;
    const t = await sequelize.transaction(); // start transaction
    try {
        const product = await Product.findByPk(product_id);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        if (quantity <= 0) {
            return res.status(400).json({ success: false, message: 'Quantity must be greater than zero' });
        }

        // 1. Create sale
        const sale = await Sale.create({ product_id, customer_id, quantity, selling_price }, { transaction: t });

        // 2. Fetch purchases FIFO
        const purchases = await Purchase.findAll({
            where: { product_id, quantity_remaining: { [Op.gt]: 0 } },
            order: [['purchase_date', 'ASC']],
            transaction: t
        });

        let qtyNeeded = quantity;
        for (const purchase of purchases) {
            if (qtyNeeded <= 0) break;

            const deductQty = Math.min(qtyNeeded, purchase.quantity_remaining);

            // Update purchase
            await purchase.update(
                { quantity_remaining: purchase.quantity_remaining - deductQty },
                { transaction: t }
            );

            // Add ledger entry
            await StockLedger.create({
                sale_id: sale.sale_id,
                purchase_id: purchase.purchase_id,
                quantity: deductQty
            }, { transaction: t });

            qtyNeeded -= deductQty;
        }

        if (qtyNeeded > 0) {
            throw new Error("Not enough stock available!");
        }

        await t.commit();
        res.status(201).json({
            success: true,
            message: 'Sale created successfully with ledger entries',
            data: sale
        });

    } catch (error) {
        await t.rollback();
        res.status(500).json({
            success: false,
            message: 'Error creating sale',
            error: error.message
        });
    }
});

router.get('/all', async (req, res) => {
    try {
        // include product name and customer name in the sales  
        const sales = await Sale.findAll({
            include: [
                { model: Product, attributes: ['name'] },
                { model: Customer, attributes: ['name'] }
            ]
        });

        res.status(200).json({
            success: true,
            data: sales
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching sales',
            error: error.message
        });
    }
});

router.get('/products-customers', async (req, res) => {
    try {
        // fetch all the product name and id and supplier name and id
        const products = await Product.findAll({ attributes: ['product_id', 'name'] });
        const customer = await Customer.findAll({ attributes: ['customer_id', 'name'] });
        res.json({ success: true, data: { products, customer } });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal server error', error: error.message });

    }
})

router.get('/analytics', async (req, res) => {
    try {
        // 🧮 1️⃣ Monthly Sales — sum selling price grouped by month
        const monthlySales = await Sale.findAll({
            attributes: [
                [fn('DATE_FORMAT', col('sale_date'), '%Y-%m'), 'month'],
                [fn('SUM', col('selling_price')), 'total_sales']
            ],
            group: ['month'],
            order: [[literal('month'), 'ASC']]
        });

        // 💰 2️⃣ Monthly Profit — compute using stock_ledger + purchases + sales
        const monthlyProfit = await sequelize.query(
            `
      SELECT DATE_FORMAT(s.sale_date, '%Y-%m') AS month,
             SUM(sl.quantity * (s.selling_price - p.cost_price)) AS total_profit
      FROM stock_ledger sl
      JOIN sales s ON s.sale_id = sl.sale_id
      JOIN purchases p ON p.purchase_id = sl.purchase_id
      GROUP BY month
      ORDER BY month ASC;
      `,
            { type: QueryTypes.SELECT }
        );

        // 📦 3️⃣ Low Stock Items — threshold = 10
        const lowStockItems = await Product.findAll({
            where: { unit: { [Op.lte]: 10 } }, // adjust to actual stock column if you have one
            attributes: ['product_id', 'name', 'unit']
        });

        // 🆕 4️⃣ Recent 5 Sales (latest first)
        const recentSales = await Sale.findAll({
            limit: 5,
            order: [['sale_date', 'DESC']],
            attributes: ['sale_id', 'product_id', 'customer_id', 'sale_date', 'selling_price']
        });

        // 🧩 Attach product & customer names
        for (const sale of recentSales) {
            const product = await Product.findByPk(sale.product_id, { attributes: ['name'] });
            const customer = await sequelize.models.Customer.findByPk(sale.customer_id, { attributes: ['name'] });

            sale.dataValues.product_name = product ? product.name : null;
            sale.dataValues.customer_name = customer ? customer.name : null;
        }

        // 📊 5️⃣ Summary — totals
        const totalProducts = await Product.count();
        const totalSales = await Sale.count();
        const totalRevenue = await Sale.sum('selling_price');

        const totalProfitResult = await sequelize.query(
            `
      SELECT SUM(sl.quantity * (s.selling_price - p.cost_price)) AS total_profit
      FROM stock_ledger sl
      JOIN sales s ON s.sale_id = sl.sale_id
      JOIN purchases p ON p.purchase_id = sl.purchase_id;
      `,
            { type: QueryTypes.SELECT }
        );

        const totalProfit = totalProfitResult[0]?.total_profit || 0;

        // ✅ Response
        res.json({
            success: true,
            summary: {
                totalProducts,
                totalSales,
                totalRevenue: parseFloat(totalRevenue || 0).toFixed(2),
                totalProfit: parseFloat(totalProfit).toFixed(2)
            },
            monthlySales,
            monthlyProfit,
            lowStockItems,
            recentSales
        });
    } catch (error) {
        console.error('Error fetching analytics:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching analytics',
            error: error.message
        });
    }
});

router.get('/predict', async (req, res) => {
    try {
        // 1️⃣ Fetch all sales with product info
        const sales = await Sale.findAll({
            include: [{ model: Product, attributes: ['product_id', 'name', 'unit'] }],
            order: [['sale_date', 'ASC']]
        });

        if (sales.length === 0) {
            return res.status(404).json({ success: false, message: 'No sales data available' });
        }

        // 2️⃣ Group sales by product
        const productSales = {};
        sales.forEach(sale => {
            const pid = sale.product_id;
            if (!productSales[pid]) productSales[pid] = [];
            productSales[pid].push(sale);
        });

        const predictions = [];
        let totalPredictedSales = 0;

        // 3️⃣ Predict for each product
        for (const [pid, salesData] of Object.entries(productSales)) {
            const product = salesData[0].Product;

            // Extract X (time index) and Y (quantity)
            const X = salesData.map((_, i) => i + 1);
            const Y = salesData.map(s => parseFloat(s.quantity));

            if (X.length > 1) {
                // Train linear regression model
                const regression = new SimpleLinearRegression(X, Y);

                // Predict next day’s sale
                const nextDay = X.length + 1;
                const predictedSales = Math.max(0, regression.predict(nextDay));

                totalPredictedSales += predictedSales;

                // Get current stock from purchases
                const purchases = await Purchase.findAll({
                    where: { product_id: pid },
                    attributes: ['quantity_remaining']
                });
                const currentStock = purchases.reduce(
                    (sum, p) => sum + parseFloat(p.quantity_remaining),
                    0
                );

                const requiredStock = Math.max(0, predictedSales - currentStock);

                predictions.push({
                    product_id: pid,
                    product_name: product.name,
                    current_stock: currentStock,
                    predicted_sales: predictedSales.toFixed(2),
                    required_stock: requiredStock.toFixed(2),
                    unit: product.unit
                });
            }
        }

        res.status(200).json({
            success: true,
            message: 'Future sales and stock prediction successful',
            total_predicted_sales: totalPredictedSales.toFixed(2),
            predictions
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: err.message });
    }
});

router.get('/monthly-sales', async (req, res) => {
    try {
        const monthlySales = await Sale.findAll({
            attributes: [
                [sequelize.fn('DATE_FORMAT', sequelize.col('sale_date'), '%Y-%m'), 'month'],
                [sequelize.fn('SUM', sequelize.col('selling_price')), 'total_sales']
            ],
            group: ['month'],
            order: [[sequelize.literal('month'), 'ASC']]
        });

        res.json({ success: true, data: monthlySales });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching monthly sales', error: error.message });
    }
});

router.get('/sales-by-product', async (req, res) => {
    try {
        const productSales = await Sale.findAll({
            attributes: [
                'product_id',
                [sequelize.fn('SUM', sequelize.col('quantity')), 'total_quantity'],
                [sequelize.fn('SUM', sequelize.col('selling_price')), 'total_revenue']
            ],
            include: [{ model: Product, attributes: ['name'] }],
            group: ['product_id', 'Product.name'],
            order: [[sequelize.fn('SUM', sequelize.col('selling_price')), 'DESC']]
        });

        res.json({ success: true, data: productSales });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching product-wise sales', error: error.message });
    }
});

router.get('/low-stock', async (req, res) => {
    try {
        const lowStockThreshold = 10;

        const lowStock = await sequelize.query(`
      SELECT 
        p.product_id,
        p.name,
        p.unit,
        COALESCE(SUM(pr.quantity_remaining), 0) AS quantity_remaining
      FROM products p
      LEFT JOIN purchases pr ON p.product_id = pr.product_id
      GROUP BY p.product_id, p.name, p.unit
      HAVING quantity_remaining < ${lowStockThreshold};
    `, { type: sequelize.QueryTypes.SELECT });

        res.json({ success: true, data: lowStock });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching low stock products', error: error.message });
    }
});

router.get('/profit-by-product', async (req, res) => {
    try {
        const profits = await Sale.findAll({
            attributes: [
                'product_id',
                [sequelize.fn('SUM', sequelize.col('quantity')), 'total_quantity_sold'],
                [sequelize.fn('SUM', sequelize.col('selling_price')), 'total_revenue']
            ],
            include: [{ model: Product, attributes: ['name'] }],
            group: ['product_id', 'Product.name']
        });

        const result = [];

        for (const sale of profits) {
            // Find corresponding purchase cost
            const purchaseCost = await Purchase.findOne({ where: { product_id: sale.product_id } });
            const avgCost = purchaseCost ? parseFloat(purchaseCost.cost_price) : 0;
            const totalCost = avgCost * parseFloat(sale.dataValues.total_quantity_sold);
            const profit = parseFloat(sale.dataValues.total_revenue) - totalCost;

            result.push({
                product_id: sale.product_id,
                product_name: sale.Product.name,
                total_revenue: parseFloat(sale.dataValues.total_revenue),
                total_cost: totalCost,
                profit: profit.toFixed(2),
                profit_margin: ((profit / totalCost) * 100).toFixed(2)
            });
        }

        res.json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching profit data', error: error.message });
    }
});

module.exports = router;