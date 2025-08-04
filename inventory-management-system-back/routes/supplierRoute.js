const express = require("express")
const { Supplier } = require("../models");
const routes = express.Router();

routes.post("/create" , async(req,res)=>{
    const {name , contact , address , } = req.body;
    const supplier = await Supplier.findOne({where : {name}});
    if(supplier){
       return res.status(400).json({
            success: false,
            message: "Supplier already exists"
        });
    }
    else{
        const supplier = await Supplier.create({name , contact , address});
        res.status(201).json({
            success: true,
            message: "Supplier created successfully",
            data: supplier
        });
    }
})

routes.get("/all" , async(req,res)=>{
    try {
        const suppliers = await Supplier.findAll();
        if(suppliers.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No suppliers found"
            });
        }else{
            res.status(200).json({
            success: true,
            message: "Suppliers fetched successfully",
            data: suppliers
        });
        }
    } catch (error) {
        res.status(500).json(({
            success: false,
            message: "Error fetching suppliers",
            error: error.message
        }))
    }

})

module.exports = routes;