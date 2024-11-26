const { Event, SeatType } = require('../models');
const AppError = require('../utils/AppError');
const { Op } = require('sequelize');

/**
 * Crear un nuevo evento
 */
exports.createEvent = async (eventData) => {
    try {
        return await Event.create(eventData);
    } catch (error) {
        throw error;
    }
};

/**
 * Obtener un evento por ID
 */
exports.getEventById = async (id) => {
    try {
        const event = await Event.findByPk(id, {
            include: [
                { model: SeatType, as: 'seatTypes' }
            ],
            where: {
                deletedAt: null
            },
            attributes: { exclude: ['deletedAt'] }
        });
        if (!event) {
            throw new AppError('Evento no encontrado', 404);
        }
        return event;
    } catch (error) {
        throw error;
    }
};

/**
 * Listar todos los eventos con filtros y paginación
 */
exports.getAllEvents = async ({ page = 1, limit = 10, name, address, status }) => {
    try {
        const offset = (page - 1) * limit;
        const whereConditions = { deletedAt: null };

        if (name) {
            whereConditions.name = { [Op.like]: `%${name}%` };
        }

        if (address) {
            whereConditions.address = { [Op.like]: `%${address}%` };
        }

        if (status) {
            whereConditions.status = status;
        }

        const { rows: events, count: total } = await Event.findAndCountAll({
            where: whereConditions,
            include: [
                { model: SeatType, as: 'seatTypes' }
            ],
            attributes: { exclude: ['deletedAt'] },
            limit: parseInt(limit),
            offset: parseInt(offset),
        });

        return {
            total,
            page: parseInt(page),
            limit: parseInt(limit),
            totalPages: Math.ceil(total / limit),
            events,
        };
    } catch (error) {
        throw error;
    }
};

/**
 * Actualizar un evento
 */
exports.updateEvent = async (id, eventData) => {
    try {
        const event = await Event.findByPk(id,{
            where: {
                deletedAt: null
            }
        });
        if (!event) {
            throw new AppError('Evento no encontrado', 404);
        }

        await event.update(eventData);
        return event;
    } catch (error) {
        throw error;
    }
};

/**
 * Eliminar un evento (lógicamente)
 */
exports.deleteEvent = async (id) => {
    try {
        const event = await Event.findByPk(id,{
            where: {
                deletedAt: null
            }
        });
        if (!event) {
            throw new AppError('Evento no encontrado', 404);
        }

        // Elimina lógicamente el evento
        await event.destroy();
        return true;
    } catch (error) {
        throw error;
    }
};
