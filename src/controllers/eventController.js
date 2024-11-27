const eventService = require('../services/eventService');
const AppError = require('../utils/AppError');
const logger = require('../utils/logger');

/**
 * Crear un nuevo evento
 */
exports.createEvent = async (req, res, next) => {
    try {
        const event = await eventService.createEvent(req.body);
        res.status(201).json({
            message: 'Evento creado exitosamente',
            ...event,
        });
        logger.info(`Evento creado con ID: ${event.id}`);
    } catch (error) {
        logger.error('Error en la creación del evento', error);
        if (error instanceof AppError) {
            return next(error);
        }
        next(new AppError('Error en el servidor', 500));
    }
};

/**
 * Obtener un evento por ID
 */
exports.getEventById = async (req, res, next) => {
    const { id } = req.params;
    try {
        const event = await eventService.getEventById(id);
        res.status(200).json(event);
        logger.info(`Evento encontrado con ID: ${event.id}`);
    } catch (error) {
        logger.error(`Error al buscar el evento con ID: ${id}`, error);
        if (error instanceof AppError) {
            return next(error);
        }
        next(new AppError('Error en el servidor', 500));
    }
};

/**
 * Listar todos los eventos con filtros y paginación
 */
exports.getAllEvents = async (req, res, next) => {
    const { page, limit, name, address, status } = req.query;

    try {
        const events = await eventService.getAllEvents({ page, limit, name, address, status });
        res.status(200).json(events);
        logger.info('Listado de Evento encontrados');
    } catch (error) {
        logger.error('Error al buscar los eventos', error);
        if (error instanceof AppError) {
            return next(error);
        }
        next(new AppError('Error en el servidor', 500));
    }
};

/**
 * Actualizar un evento
 */
exports.updateEvent = async (req, res, next) => {
    const { id } = req.params;

    try {
        const event = await eventService.updateEvent(id, req.body);
        res.status(200).json({
            message: 'Evento actualizado exitosamente',
            ...event,
        });
        logger.info(`Evento actualizado con ID: ${event.id}`);
    } catch (error) {
        logger.error(`Error al actualizar el evento con ID: ${id}`, error);
        if (error instanceof AppError) {
            return next(error);
        }
        next(new AppError('Error en el servidor', 500));
    }
};

/**
 * Eliminar un evento (lógicamente)
 */
exports.deleteEvent = async (req, res, next) => {
    const { id } = req.params;

    try {
        await eventService.deleteEvent(id);
        res.status(200).json({
            message: 'Evento eliminado exitosamente',
        });
        logger.info(`Evento eliminado con ID: ${id}`);
    } catch (error) {
        logger.error(`Error al eliminar el evento con ID: ${id}`, error);
        if (error instanceof AppError) {
            return next(error);
        }
        next(new AppError('Error en el servidor', 500));
    }
};
