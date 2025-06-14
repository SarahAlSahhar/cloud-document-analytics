// const express = require('express');
// const classificationController = require('../controllers/classificationController');

// const router = express.Router();

// router.get('/', classificationController.getClassificationTree);
// router.post('/:documentId/classify', classificationController.classifyDocument);

// module.exports = router;


// const express = require('express');
// const classificationController = require('../controllers/classificationController');

// const router = express.Router();

// router.get('/', classificationController.getClassificationTree);
// router.post('/:documentId/classify', classificationController.classifyDocument);

// module.exports = router;

// routes/classificationRoutes.js - Updated with auto-classify route
const express = require('express');
const classificationController = require('../controllers/classificationController');

const router = express.Router();

// Get classification tree
router.get('/', classificationController.getClassificationTree);

// Classify a specific document
router.post('/:documentId/classify', classificationController.classifyDocument);

// Auto-classify all unclassified documents
router.post('/auto-classify', classificationController.autoClassifyAll);

// Get classification statistics
router.get('/stats', classificationController.getClassificationStats);

module.exports = router;