const express = require('express');
const routes = express.Router();
const { Op } = require('sequelize');
const { sequelize, Sale, Product, Purchase, StockLedger, Customer } = require('../models');

// routes.post('/create', async (req, res) => {
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

routes.post('/create', async (req, res) => {
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

routes.get('/all', async (req, res) => {
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

routes.get('/products-customers', async (req, res) => {
    try {
        // fetch all the product name and id and supplier name and id
        const products = await Product.findAll({ attributes: ['product_id', 'name'] });
        const customer = await Customer.findAll({ attributes: ['customer_id', 'name'] });
        res.json({ success: true, data: { products, customer } });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal server error', error: error.message });

    }
})

module.exports = routes;