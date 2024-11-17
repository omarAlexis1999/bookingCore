const { Booking, Seat } = require('../models');
const AppError = require('../utils/AppError');
const axios = require('axios');

exports.createBooking = async (user_id, bookingData) => {
    try {
        // Crea la reserva con los datos proporcionados
        const booking = await Booking.create({
            user_id,
            ...bookingData,
        });

        return booking;
    } catch (error) {
        throw new AppError('Error creating booking', 500, error);
    }
};

exports.getBookingById = async (id) => {
    try {
        // Busca la reserva por su ID
        const booking = await Booking.findByPk(id, {
            include: [{ model: Seat, as: 'seats' }],
        });

        if (!booking) {
            throw new AppError('Booking not found', 404);
        }

        // Devuelve la reserva
        return booking;
    } catch (error) {
        throw new AppError('Error fetching booking', 500, error);
    }
};

exports.getAllBookings = async (user_id) => {
    try {
        // Busca todas las reservas del usuario
        const bookings = await Booking.findAll({
            where: { user_id },
            include: [{ model: Seat, as: 'seats' }],
        });

        return bookings;
    } catch (error) {
        throw new AppError('Error fetching bookings', 500, error);
    }
};

exports.updateBooking = async (id, bookingData) => {
    try {
        // Busca la reserva por su ID
        const booking = await Booking.findByPk(id);

        if (!booking) {
            throw new AppError('Booking not found', 404);
        }

        // Actualiza la reserva
        await booking.update(bookingData);

        return booking;
    } catch (error) {
        throw new AppError('Error updating booking', 500, error);
    }
};

exports.deleteBooking = async (id) => {
    try {
        // Busca la reserva por su ID
        const booking = await Booking.findByPk(id);

        if (!booking) {
            throw new AppError('Booking not found', 404);
        }

        // Elimina la reserva (lógica)
        await booking.destroy();

        return true;
    } catch (error) {
        throw new AppError('Error deleting booking', 500, error);
    }
};
