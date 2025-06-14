// const express = require('express');
// const documentRoutes = require('./documentRoutes');
// const classificationRoutes = require('./classificationRoutes');
// const statisticsRoutes = require('./statisticsRoutes');

// const router = express.Router();

// router.use('/documents', documentRoutes);
// router.use('/classifications', classificationRoutes);
// router.use('/statistics', statisticsRoutes);

// module.exports = router;

const express = require('express');
const documentRoutes = require('./documentRoutes');
const classificationRoutes = require('./classificationRoutes');
const statisticsRoutes = require('./statisticsRoutes');

const router = express.Router();

router.use('/documents', documentRoutes);
router.use('/classifications', classificationRoutes);
router.use('/statistics', statisticsRoutes);

module.exports = router;