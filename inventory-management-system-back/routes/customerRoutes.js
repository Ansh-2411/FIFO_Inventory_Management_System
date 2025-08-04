const express = require("express");
const router = express.Router();
const { Customer } = require("../models");

router.post("/create", async (req, res) => {
    const { name, contact, address } = req.body;
    try {
        const customer = await Customer.findOne({ where: { name } });
        if (customer) {
            return res.status(400).json({
                success: false,
                message: "Customer already exists"
            });
        } else {
            const newCustomer = await Customer.create({ name, contact, address });
            res.status(201).json({
                success: true,
                message: "Customer created successfully",
                data: newCustomer
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error creating customer",
            error: error.message
        });
    }
})

router.get('/all',async(req,res)=>{
    try {
        const customers = await Customer.findAll();
        if(customers.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No customers found"
            });
        }
        else{
            return res.status(200).json({
                success: true,
                message: "Customers fetched successfully",
                data: customers
            })
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching customers",
            error: error.message
        });
    }
})

router.delete('/delete/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const customer = await Customer.findOne({ where: { customer_id: id } });
        if (!customer) {
            return res.status(404).json({ success: false, message: "Customer not found" });
        }

        await Customer.destroy({ where: { customer_id: id } });

        res.json({
            success: true,
            message: "Customer deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error deleting customer",
            error: error.message
        });
    }
})

module.exports = router;
