const express = require('express');
const { Category, Product, Image, Purchase, StockLedger , Sale } = require('../models');
const router = express.Router();

router.post('/create',  async(req,res) => {
    const {name} = req.body;
    try {
        const check = await Category.findOne({ where: { name } });
        console.log(check);
        if(check){
            res.send("Category already exists");
        }
        else{
             const category_name = await Category.create({name});
             res.status(201).json({
                success: true,
                message: "Category created successfully",
                data: category_name
            })
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error creating category",
            error: error.message
        });
    }
});

router.delete('/delete/:id', async (req, res) => {
  try {
    const id = req.params.id;

    const category = await Category.findOne({ where: { category_id: id } });
    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    const products = await Product.findAll({ where: { category_id: id } });

    if(products){
        return res.status(400).json({
            success: false,
            message: "Category cannot be deleted as it has associated products"
        }); 
    }
    else{
        await Category.destroy({ where: { category_id: id } });
        res.json({
            success: true,
            message: "Category deleted successfully"
        });
    }

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message
    });
  }
});

router.get("/all" , async(req,res) => {
    try {
        const category = await Category.findAll();
        res.json({
            success: true,
            message: "Categories fetched successfully",
            data: category
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
})

router.get("/:id" , async(req,res) => {
    try {
        const category = await Category.findOne({where : {category_id : req.params.id}});
        if(!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }
        res.json({
            success: true,
            message: "Categories fetched successfully",
            data: category
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
})

router.put('/update/:id', async (req, res) => {
    const {name} = req.body;
    const category = await Category.findOne({ where: { category_id: req.params.id } });
    if (!category) {
        return res.status(404).json({
            success: false,
            message: "Category not found"
        });
    }
    try {
        category.name = name;
        await category.save();
        res.json({
            success: true,
            message: "Category updated successfully",
            data: category
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
        
    }
})

module.exports = router;
