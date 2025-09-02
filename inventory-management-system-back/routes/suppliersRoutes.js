const express = require('express');
const router = express.Router();
const { Product, Supplier, Purchase } = require('../models');

router.get('/all', async (req, res) => {
    try {
        const suppliers = await Supplier.findAll()
        res.json({ success: true, data: suppliers });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
    }
})

router.post('/create', async (req, res) => {
    try {
        const { contact_number, company_name, contact_person, address, email } = req.body;
        console.log(req.body)
        if (!contact_number || !company_name || !contact_person || !address || !email) {
            return res.status(400).json({ success: false, message: 'Informations are missing!.' });
        }
        const total_orders = 0
        const newSupplier = await Supplier.create({ contact_number, company_name, contact_person, address, email, total_orders });
        res.status(201).json({ success: true, message: 'Supplier created successfully', data: newSupplier });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error creating supplier', error: error.message });
    }
});

module.exports = router;