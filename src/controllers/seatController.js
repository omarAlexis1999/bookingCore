const seatService = require('../services/seatService');
const AppError = require("../utils/AppError");
const logger = require('../utils/logger');

exports.createSeat = async (req, res, next) => {
    try {
        const seat = await seatService.createSeat(req.body);
        res.status(201).json({
            message: 'Asiento creado exitosamente',
            ...seat,
        });
        logger.info(`Asiento creado con ID: ${seat.id}`);
    } catch (error) {
        logger.error('Error en la creación del asiento', error);
        if (error instanceof AppError) {
            return next(error);
        }
        next(new AppError('Error en el servidor', 500));
    }
};

exports.getSeatById = async (req, res, next) => {
    const { id } = req.params;

    try {
        const seat = await seatService.getSeatById(id);
        res.status(200).json(seat);
        logger.info(`Asiento encontrado con ID: ${seat.id}`);
    } catch (error) {
        logger.error(`Error al buscar el asiento con ID: ${id}`, error);
        if (error instanceof AppError) {
            return next(error);
        }
        next(new AppError('Error en el servidor', 500));
    }
};

exports.getSeatsByEvent = async (req, res, next) => {
    const { page, limit, row, status, minPrice, maxPrice } = req.query;
    const { id } = req.params;

    try {
        const seats = await seatService.getSeatsByEvent(id, { page, limit, row, status, minPrice, maxPrice });
        res.status(200).json(seats);
        logger.info(`Asientos encontrados para el evento con ID: ${id}`);
    } catch (error) {
        logger.error(`Error al buscar los asientos para el evento con ID: ${id}`, error);
        if (error instanceof AppError) {
            return next(error);
        }
        next(new AppError('Error en el servidor', 500));
    }
};

exports.updateSeat = async (req, res, next) => {
    const { id } = req.params;

    try {
        const seat = await seatService.updateSeat(id, req.body);
        res.status(200).json({
            message: 'Asiento actualizado exitosamente',
            ...seat,
        });
        logger.info(`Asiento actualizado con ID: ${seat.id}`);
    } catch (error) {
        logger.error(`Error al actualizar el asiento con ID: ${id}`, error);
        if (error instanceof AppError) {
            return next(error);
        }
        next(new AppError('Error en el servidor', 500));
    }
};

exports.deleteSeat = async (req, res, next) => {
    const { id } = req.params;

    try {
        await seatService.deleteSeat(id);
        res.status(200).json({
            message: 'Asiento eliminado exitosamente',
        });
        logger.info(`Asiento eliminado con ID: ${id}`);
    } catch (error) {
        logger.error(`Error al eliminar el asiento con ID: ${id}`, error);
        if (error instanceof AppError) {
            return next(error);
        }
        next(new AppError('Error en el servidor', 500));
    }
};
