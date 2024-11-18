const express = require('express');
const router = express.Router();
const bookingRoutes = require('./bookingRoutes');
const eventRoutes = require('./eventRoutes');
const seatRoutes = require('./seatRoutes');

router.use('/booking', bookingRoutes);
router.use('/event', eventRoutes);
router.use('/seat', seatRoutes);

module.exports = router;