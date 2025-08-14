const express = require('express');
const multer = require('multer');
const path = require('path');
const { Image, Product } = require('../models');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});

const upload = multer({ storage });

// Upload
router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    const { product_id, url } = req.body;
    if (!product_id || (!req.file && !url)) {
      return res.status(400).json({ success: false, message: "product_id and image or url required" });
    }
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : url;
    const newImage = await Image.create({ product_id, url: imageUrl });
    res.status(201).json({ success: true, message: "Image uploaded", data: newImage });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error uploading image", error: error.message });
  }
});

// Get all
router.get('/all', async (req, res) => {
  try {
    const images = await Image.findAll({
      include: [
        { model: Product, as: 'product', attributes: ['name'] }
      ]
    });
    res.status(200).json({
      success: true,
      message: "Images fetched successfully",
      data: images
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching images",
      error: error.message
    });
  }
});


// Update
router.put('/update/:id', upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const { product_id, url } = req.body;

    const image = await Image.findByPk(id);
    if (!image) {
      return res.status(404).json({ success: false, message: "Image not found" });
    }

    let newUrl = url;
    if (req.file) {
      newUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    }

    image.product_id = product_id || image.product_id;
    image.url = newUrl || image.url;

    await image.save();

    res.status(200).json({ success: true, message: "Image updated successfully", data: image });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating image", error: error.message });
  }
});

// Delete
router.delete('/delete/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const image = await Image.findByPk(id);
    if (!image) return res.status(404).json({ success: false, message: "Image not found" });
    await image.destroy();
    res.status(200).json({ success: true, message: "Image deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error deleting image", error: error.message });
  }
});

module.exports = router;
