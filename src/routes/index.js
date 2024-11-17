const express = require('express');
const router = express.Router();

const bookingRoutes = require('./bookingRoutes');


router.use('/booking', bookingRoutes);

module.exports = router;