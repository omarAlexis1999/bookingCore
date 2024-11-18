const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');


// CRUD para Booking
router.post('/', eventController.createEvent);
router.get('/:id', eventController.getEventById);
router.get('/', eventController.getAllEvents);
router.patch('/:id', eventController.updateEvent);
router.delete('/:id', eventController.deleteEvent);

module.exports = router;