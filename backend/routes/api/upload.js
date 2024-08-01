const express = require('express');
const multer = require('multer');
const cloudinary = require('../../config/cloudinary'); // Import Cloudinary configuration
const router = express.Router();

// Configure multer for file uploads
const upload = multer({ dest: 'uploads/' });

router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    // Upload file to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path);

    // Send back the result
    res.json({ url: result.secure_url, public_id: result.public_id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
