const express = require('express');
const upload = require('../multerConfig');

const router = express.Router();

router.post('/upload', upload.single('file'), (req, res) => {
  try {
    res.status(200).send({
      message: 'File uploaded successfully!',
      file: req.file,
    });
  } catch (error) {
    console.error('File Upload Error:', error.message);
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;
