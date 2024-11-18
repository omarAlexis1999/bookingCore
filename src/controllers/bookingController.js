const bookingService = require('../services/bookingService');
const AppError = require('../utils/AppError');
const logger = require('../utils/logger');

exports.createBooking = async (req, res, next) => {
    const { user_id } = req.body; // ID del usuario desde el cliente
    const bookingData = req.body;

    try {
        const booking = await bookingService.createBooking(user_id, bookingData);
        const { deletedAt, ...bookingData } = booking.toJSON();
        res.status(201).json({
            message: 'Reserva creada exitosamente',
            ...bookingData,
        });
        logger.info(`Reserva creada con ID: ${booking.id}`);
    } catch (error) {
        logger.error('Error en la creación de la reserva', error);
        if (error instanceof AppError) {
            return next(error);
        }
        next(new AppError('Error en el servidor', 500));
    }
};

exports.getBookingById = async (req, res, next) => {
    const { id } = req.params;

    try {
        const booking = await bookingService.getBookingById(id);
        res.status(200).json(booking);
        logger.info(`Reserva encontrada con ID: ${booking.id}`);
    } catch (error) {
        logger.error('Error al buscar la reserva', error);
        if (error instanceof AppError) {
            return next(error);
        }
        next(new AppError('Error en el servidor', 500));
    }
};

exports.getAllBookings = async (req, res, next) => {
    const { page, limit, fromDate, toDate, status, user_id } = req.query;

    try {
        const bookings = await bookingService.getAllBookings({ page, limit, fromDate, toDate, status, user_id });
        res.status(200).json(bookings);
        logger.info('Reservas encontradas');
    } catch (error) {
        logger.error('Error al buscar las reservas', error);
        if (error instanceof AppError) {
            return next(error);
        }
        next(new AppError('Error en el servidor', 500));
    }
};


exports.updateBooking = async (req, res, next) => {
    const { id } = req.params;
    const bookingData = req.body;

    try {
        const booking = await bookingService.updateBooking(id, bookingData);
        const { deletedAt, ...bookingData } = booking.toJSON();
        res.status(200).json({
            message: 'Reserva actualizada exitosamente',
            ...bookingData,
        });
        logger.info(`Reserva actualizada con ID: ${booking.id}`);
    } catch (error) {
        logger.error(`Error al actualizar la reserva ${id}`, error);
        if (error instanceof AppError) {
            return next(error);
        }
        next(new AppError('Error en el servidor', 500));
    }
};

exports.deleteBooking = async (req, res, next) => {
    const { id } = req.params;

    try {
        await bookingService.deleteBooking(id);
        const { deletedAt, ...bookingData } = booking.toJSON();
        res.status(200).json({ message: 'Reserva eliminada exitosamente', ...bookingData});
        logger.info(`Reserva eliminada con ID: ${id}`);
    } catch (error) {
        logger.error(`Error al eliminar la reserva ${id}`, error);
        if (error instanceof AppError) {
            return next(error);
        }
        next(new AppError('Error en el servidor', 500));
    }
};
