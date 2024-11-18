const express = require('express');
const router = express.Router();
const seatController = require('../controllers/seatController');


// CRUD para Booking
router.post('/', seatController.createSeat);
router.get('/:id', seatController.getSeatById);
router.get('/event/:id', seatController.getSeatsByEvent);
router.patch('/:id', seatController.updateSeat);
router.delete('/:id', seatController.deleteSeat);

module.exports = router;