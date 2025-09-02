const express = require('express');
const router = express.Router();
const { Product, Supplier, Purchase, Customer } = require('../models');

router.get('/all', async (req, res) => {
    try {
        const customer = await Customer.findAll()
        res.json({ success: true, data: customer });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
    }
})

router.post('/create', async (req, res) => {
    try {
        const { name, contact, address, email } = req.body;
        console.log(req.body)
        if (!name || !contact || !address || !email) {
            return res.status(400).json({ success: false, message: 'Informations are missing!.' });
        }
        const newCustomer = await Customer.create({ name, contact, address, email });
        res.status(201).json({ success: true, message: 'Customer created successfully', data: newCustomer });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error creating customer', error: error.message });
    }
});


module.exports = router;