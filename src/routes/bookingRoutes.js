const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');


// CRUD para Booking
router.post('/', bookingController.createBooking);
router.get('/:id', bookingController.getBookingById);
router.get('/', bookingController.getAllBookings);
router.patch('/:id', bookingController.updateBooking);
router.delete('/:id', bookingController.deleteBooking);

module.exports = router;