const express = require('express');
const { StockLedger, Sale, Product, Customer, Purchase } = require('../models');
const e = require('express');
const router = express.Router();


// router.get('/all', async (req, res) => {
//     try {
//         const ledgerEntries = await StockLedger.findAll();
//         res.status(200).json({
//             success: true,
//             message: "Stock ledger entries fetched successfully",
//             data: ledgerEntries
//         });
//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: "Error fetching stock ledger entries",
//             error: error.message
//         });
//     }
// });
router.get('/all', async (req, res) => {
    try {
        // include product name and customer name in the sales  
        const sales = await Sale.findAll({
            include: [
                { model: Product, attributes: ['name'] },
                { model: Customer, attributes: ['name'] }
            ]
        });
        // for each sale entry, get the stock ledger entries
        for (let sale of sales) {
            const ledgerEntries = await StockLedger.findAll({ where: { sale_id: sale.sale_id } });
            // for each ledger entry , include purchase price from Purchase table
            for (let entry of ledgerEntries) {
                const purchase = await Purchase.findByPk(entry.purchase_id, {
                    attributes: ['cost_price']
                });
                entry.dataValues.cost_price = purchase.cost_price;
            }
            sale.dataValues.ledgerEntries = ledgerEntries;
        }


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

module.exports = router;
