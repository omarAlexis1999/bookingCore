const { SeatType , Event } = require('../models');
const AppError = require('../utils/AppError');
const { Op } = require('sequelize');

/**
 * Crear un nuevo tipo de asiento
 */
exports.createSeatType = async (seatTypeData) => {
    try {
        const { event_id  } = seatTypeData;
        const event = await Event.findByPk(event_id);
        if (!event) {
            throw new AppError('Evento no encontrado', 404);
        }

        const seatType = await SeatType.create({
            ...seatTypeData,
            event_id
        });
        return seatType.toSafeJSON();
    } catch (error) {
        throw error;
    }
};

/**
 * Obtener un tipo de asiento por ID
 */
exports.getSeatTypeById = async (id) => {
    try {
        const seatType = await SeatType.findByPk(id);
        if (!seatType) {
            throw new AppError('Tipo de Asiento no encontrado', 404);
        }
        return seatType;
    } catch (error) {
        throw error;
    }
};

/**
 * Listar todos los tipos de asiento por evento con paginación, ordenamiento y filtro
 */
exports.getAllSeatTypes = async (event_id, page = 1, limit = 10, name, sortBy = 'price', order = 'ASC' ) => {
    try {
        // Calcula el offset y el límite para la paginación
        const offset = (page - 1) * limit;

        // Construye las condiciones dinámicas para el filtro
        const whereConditions = {event_id};
        if (name) {
            whereConditions.name = { [Op.like]: `%${name}%` }; // Filtro por nombre parcial
        }

        // Valida que el campo de ordenamiento sea válido
        const validSortFields = ['price', 'entryTime', 'name'];
        if (!validSortFields.includes(sortBy)) {
            throw new AppError(`Campo de ordenación no válido. Campos permitidos: ${validSortFields.join(', ')}`, 400);
        }

        // Consulta paginada con filtros y ordenamiento
        const { rows: seatTypes, count: total } = await SeatType.findAndCountAll({
            where: whereConditions,
            order: [[sortBy, order.toUpperCase()]], // Ordenamiento dinámico
            limit: parseInt(limit),
            offset: parseInt(offset),
        });

        return {
            total,
            page: parseInt(page),
            limit: parseInt(limit),
            totalPages: Math.ceil(total / limit),
            seatTypes,
        };
    } catch (error) {
        throw error;
    }
};

/**
 * Actualizar un tipo de asiento
 */
exports.updateSeatType = async (id, seatTypeData) => {
    try {
        const seatType = await SeatType.findByPk(id);
        if (!seatType) {
            throw new AppError('Tipo de Asiento no encontrado', 404);
        }
        const seatTypeUpdate = await seatType.update(seatTypeData);
        return seatTypeUpdate.toSafeJSON();
    } catch (error) {
        throw error;
    }
};

/**
 * Eliminar un tipo de asiento (lógicamente)
 */
exports.deleteSeatType = async (id) => {
    try {
        const seatType = await SeatType.findByPk(id);
        if (!seatType) {
            throw new AppError('Tipo de Asiento no encontrado', 404);
        }
        await seatType.destroy();
        return true;
    } catch (error) {
        throw error;
    }
};
