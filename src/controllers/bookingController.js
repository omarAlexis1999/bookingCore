const bookingService = require('../services/bookingService');
const AppError = require('../utils/AppError');

exports.createBooking = async (req, res, next) => {
    const { user_id } = req.body; // ID del usuario desde el cliente
    const bookingData = req.body;

    try {
        const booking = await bookingService.createBooking(user_id, bookingData);
        res.status(201).json({
            message: 'Booking created successfully',
            booking,
        });
    } catch (error) {
        next(error);
    }
};

exports.getBookingById = async (req, res, next) => {
    const { id } = req.params;

    try {
        const booking = await bookingService.getBookingById(id);
        res.status(200).json(booking);
    } catch (error) {
        next(error);
    }
};

exports.getAllBookings = async (req, res, next) => {
    const { user_id } = req.params;

    try {
        const bookings = await bookingService.getAllBookings(user_id);
        res.status(200).json(bookings);
    } catch (error) {
        next(error);
    }
};

exports.updateBooking = async (req, res, next) => {
    const { id } = req.params;
    const bookingData = req.body;

    try {
        const booking = await bookingService.updateBooking(id, bookingData);
        res.status(200).json({
            message: 'Booking updated successfully',
            booking,
        });
    } catch (error) {
        next(error);
    }
};

exports.deleteBooking = async (req, res, next) => {
    const { id } = req.params;

    try {
        await bookingService.deleteBooking(id);
        res.status(200).json({ message: 'Booking deleted successfully' });
    } catch (error) {
        next(error);
    }
};
