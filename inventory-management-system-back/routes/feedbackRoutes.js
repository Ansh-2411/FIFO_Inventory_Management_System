const express = require('express');
const { Feedback } = require('../models');
const { json } = require('sequelize');
const router = express.Router();

router.post('/create',async(req,res)=>{
    const {rating , customer_id, feedback , product_id} = req.body;
    try {
        const feedbackData = await Feedback.create({rating , customer_id,feedback,product_id});
        res.status(201).json({
            success: true,
            message: "Feedback created successfully",
            data: feedbackData
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error creating feedback",
            error: error.message
        });
        
    }
})

router.get('/all', async (req, res) => {
    try {
        const feedbacks = await Feedback.findAll();
        res.status(200).json({
            success: true,
            message: "Feedbacks fetched successfully",
            data: feedbacks
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching feedbacks",
            error: error.message
        });
    }
})

router.delete('/delete/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const feedbacks = await Feedback.findByPk(id);
        if(!feedbacks) {
            return res.status(404).json({
                success: false,
                message: "Feedback not found"
            });
        }else{
            await feedbacks.destroy();
            res.status(200).json({
                success: true,
                message: "Feedback deleted successfully"
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching feedbacks",
            error: error.message
        });
    }
})

module.exports = router;