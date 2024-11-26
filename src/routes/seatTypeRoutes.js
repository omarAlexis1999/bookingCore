const express = require('express');
const router = express.Router();
const seatTypeController = require('../controllers/seatTypeController');


// CRUD para Booking
router.post('/', seatTypeController.createSeatType);
router.get('/:id', seatTypeController.getSeatTypeById);
router.get('/event/:id', seatTypeController.getAllSeatTypes);
router.patch('/:id', seatTypeController.updateSeatType);
router.delete('/:id', seatTypeController.deleteSeatType);

module.exports = router;