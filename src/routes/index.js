const express = require('express');
const router = express.Router();
const bookingRoutes = require('./bookingRoutes');
const eventRoutes = require('./eventRoutes');

router.use('/booking', bookingRoutes);
router.use('/event', eventRoutes);

module.exports = router;