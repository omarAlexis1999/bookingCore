const express = require('express');
const router = express.Router();
const bookingRoutes = require('./bookingRoutes');
const eventRoutes = require('./eventRoutes');
const seatRoutes = require('./seatRoutes');
const seatTypeRoutes = require('./seatTypeRoutes');

router.use('/booking', bookingRoutes);
router.use('/event', eventRoutes);
router.use('/seat', seatRoutes);
router.use('/seatTypes', seatTypeRoutes);

module.exports = router;