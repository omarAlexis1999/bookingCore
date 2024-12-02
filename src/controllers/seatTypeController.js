const seatTypeService = require('../services/seatTypeService');
const AppError = require("../utils/AppError");
const logger = require('../utils/logger');


/**
 * Crear un nuevo tipo de asiento
 */
exports.createSeatType = async (req, res, next) => {
    try {
        const seatType = await seatTypeService.createSeatType(req.body);
        res.status(201).json({
            message: 'Tipo de Asiento creado exitosamente',
            ...seatType,
        });
        logger.info(`Tipo de asiento creado con ID: ${seatType.id}`);
    } catch (error) {
        logger.error('Error en la creación del tipo de asiento', error.message);
        if (error instanceof AppError) {
            return next(error);
        }
        next(new AppError('Error en el servidor', 500));
    }
};

/**
 * Obtener un tipo de asiento por ID
 */
exports.getSeatTypeById = async (req, res, next) => {
    const { id } = req.params;
    try {
        const seatType = await seatTypeService.getSeatTypeById(id);
        res.status(200).json(seatType);
        logger.info(`Tipo de asiento encontrado con ID: ${seatType.id}`);
    } catch (error) {
        logger.error(`Error al buscar el tipo de asiento con ID: ${id}`, error.message);
        if (error instanceof AppError) {
            return next(error);
        }
        next(new AppError('Error en el servidor', 500));
    }
};

/**
 * Listar todos los tipos de asiento con paginación, ordenamiento y filtro
 */
exports.getAllSeatTypes = async (req, res, next) => {
    const { page, limit, name, sortBy, order } = req.query;
    const { id } = req.params;

    try {
        const seatTypes = await seatTypeService.getAllSeatTypes(id,{ page, limit, name, sortBy, order });
        res.status(200).json(seatTypes);
        logger.info('Tipos de asiento encontrados');
    } catch (error) {
        logger.error('Error al buscar los tipos de asiento', error.message);
        if (error instanceof AppError) {
            return next(error);
        }
        next(new AppError('Error en el servidor', 500));
    }
};


/**
 * Actualizar un tipo de asiento
 */
exports.updateSeatType = async (req, res, next) => {
    const { id } = req.params;
    try {
        const seatType = await seatTypeService.updateSeatType(id, req.body);
        res.status(200).json({
            message: 'Tipo de Asiento actualizado correctamente',
            ...seatType,
        });
        logger.info(`Tipo de asiento actualizado con ID: ${seatType.id}`);
    } catch (error) {
        logger.error(`Error al actualizar el tipo de asiento con ID: ${id}`, error.message);
        if (error instanceof AppError) {
            return next(error);
        }
        next(new AppError('Error en el servidor', 500));
    }
};

/**
 * Eliminar un tipo de asiento (lógicamente)
 */
exports.deleteSeatType = async (req, res, next) => {
    const { id } = req.params;
    try {
        await seatTypeService.deleteSeatType(id);
        res.status(200).json({
            message: 'Tipo de Asiento eliminado correctamente',
        });
        logger.info(`Tipo de asiento eliminado con ID: ${id}`);
    } catch (error) {
        logger.error(`Error al eliminar el tipo de asiento con ID: ${id}`, error.message);
        if (error instanceof AppError) {
            return next(error);
        }
        next(new AppError('Error en el servidor', 500));
    }
};
