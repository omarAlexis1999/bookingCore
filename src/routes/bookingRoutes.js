const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');


// CRUD para Booking
router.post('/', bookingController.createBooking);
router.get('/:id', bookingController.getBookingById);
router.get('/user/:user_id', bookingController.getAllBookings); // Todas las reservas de un usuario
router.patch('/:id', bookingController.updateBooking);
router.delete('/:id', bookingController.deleteBooking);

module.exports = router;