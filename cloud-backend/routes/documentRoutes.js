const express = require('express');
const multer = require('multer');
const documentController = require('../controllers/documentController');

const router = express.Router();

// Configure multer for file uploads
const upload = multer({
  dest: 'uploads/temp/', // Temporary storage
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  }
});

// Document routes
router.post('/upload', upload.single('document'), documentController.uploadDocument);
router.get('/', documentController.getAllDocuments);
router.get('/sort', documentController.sortDocuments);
router.get('/search', documentController.searchDocuments);
router.get('/:id', documentController.getDocumentById);
router.get('/:id/download', documentController.downloadDocument);
router.delete('/:id', documentController.deleteDocument);

module.exports = router;
