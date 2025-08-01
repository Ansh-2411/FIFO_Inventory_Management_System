const express = require('express');
const routes = express.Router();
const { Sale , Product } = require('../models');

routes.post('/create', async(req,res) => {
    const { product_id, customer_id, quantity, selling_price } = req.body;
    try {
        const product = await Product.findByPk(product_id);
        if(!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }
        else if (quantity <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Quantity must be greater than zero'
            });
        }
        else{
            const sale = await Sale.create({product_id,customer_id,quantity,selling_price});
            res.status(201).json({
                success: true,
                message: 'Sale created successfully',
                data: sale
            });
        }
    } catch (error) {
        res.status(500).json({
            sucess: false,
            message: 'Error creating sale',
            error: error.message
        })
    }
})

routes.get('/all', async(req, res) => {
    try {
        const sales = await Sale.findAll();
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

module.exports = routes;