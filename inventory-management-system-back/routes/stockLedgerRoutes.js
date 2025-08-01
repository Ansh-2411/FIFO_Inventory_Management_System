const express = require('express');
const { StockLedger } = require('../models');
const e = require('express');
const router = express.Router();

router.post('/create', async (req, res) => {
    const { sale_id, purchase_id, quantity } = req.body;

    const sales = await StockLedger.findOne({ where: { sale_id } });
    const purchases = await StockLedger.findOne({ where: { purchase_id } });

    if (sales && purchases) {
        try {
            const ledgerEntry = await StockLedger.create({sale_id,purchase_id,quantity});
            res.status(201).json({
                success: true,
                message: "Stock ledger entry created successfully",
                data: ledgerEntry
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Error creating stock ledger entry",
                error: error.message
            });
        }
    }
    else {
        res.status(404).json({
            success: false,
            message: "Sale or Purchase not found"
        });
    }
});

router.get('/all', async (req, res) => {
    try {
        const ledgerEntries = await StockLedger.findAll();
        res.status(200).json({
            success: true,
            message: "Stock ledger entries fetched successfully",
            data: ledgerEntries
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching stock ledger entries",
            error: error.message
        });
    }
});

module.exports = router;
