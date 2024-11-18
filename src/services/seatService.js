const { Seat, SeatType } = require('../models');
const AppError = require('../utils/AppError');

/**
 * Crear un nuevo asiento
 */
exports.createSeat = async (seatData) => {
    try {
        return await Seat.create(seatData);
    } catch (error) {
        throw error;
    }
};

/**
 * Obtener un asiento por ID
 */
exports.getSeatById = async (id) => {
    try {
        const seat = await Seat.findByPk(id, {
            where: {
                deletedAt: null
            },
            include: [{ model: SeatType, as: 'seatType' }],
            attributes: { exclude: ['deletedAt'] },
        });

        if (!seat) {
            throw new AppError('Asiento no encontrado', 404);
        }

        return seat;
    } catch (error) {
        throw error;
    }
};

/**
 * Listar todos los asientos de un evento
 */
exports.getSeatsByEvent = async (eventId, { page = 1, limit = 10, row, status, minPrice, maxPrice }) => {
    try {
        // Calcula el offset y el límite para la paginación
        const offset = (page - 1) * limit;

        // Construye las condiciones dinámicas para los filtros
        const whereConditions = { event_id: eventId, deletedAt: null };

        if (row) {
            whereConditions.row = row; // Filtra por fila específica
        }

        if (status) {
            whereConditions.status = status; // Filtra por estado (ejemplo: disponible, reservado)
        }

        if (minPrice && maxPrice) {
            whereConditions['$seatType.price$'] = {
                [Op.between]: [minPrice, maxPrice],
            }; // Filtra por rango de precio
        } else if (minPrice) {
            whereConditions['$seatType.price$'] = {
                [Op.gte]: minPrice,
            }; // Precio mínimo
        } else if (maxPrice) {
            whereConditions['$seatType.price$'] = {
                [Op.lte]: maxPrice,
            }; // Precio máximo
        }

        // Consulta paginada con filtros
        const { rows: seats, count: total } = await Seat.findAndCountAll({
            where: whereConditions,
            include: [{ model: SeatType, as: 'seatType' }],
            attributes: { exclude: ['deletedAt'] },
            limit: parseInt(limit), // Límite de registros por página
            offset: parseInt(offset), // Desplazamiento
        });

        if (!seats || seats.length === 0) {
            throw new AppError('No hay asientos para este evento', 404);
        }

        // Devuelve los resultados junto con información de la paginación
        return {
            total,
            page: parseInt(page),
            limit: parseInt(limit),
            totalPages: Math.ceil(total / limit),
            seats,
        };
    } catch (error) {
        throw error;
    }
};


/**
 * Actualizar un asiento
 */
exports.updateSeat = async (id, seatData) => {
    try {
        const seat = await Seat.findByPk(id,{
            where: {
                deletedAt: null
            }
        });
        if (!seat) {
            throw new AppError('Asiento no encontrado', 404);
        }

        await seat.update(seatData);
        return seat;
    } catch (error) {
        throw error;
    }
};

/**
 * Eliminar un asiento (lógicamente)
 */
exports.deleteSeat = async (id) => {
    try {
        const seat = await Seat.findByPk(id,{
            where: {
                deletedAt: null
            }
        });
        if (!seat) {
            throw new AppError('Asiento no encontrado', 404);
        }

        // Elimina lógicamente el asiento
        await seat.destroy();
        return true;
    } catch (error) {
        throw error;
    }
};
