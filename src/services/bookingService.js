const { Booking, Seat } = require('../models');
const AppError = require('../utils/AppError');
const {Op} = require('sequelize');

exports.createBooking = async (user_id, bookingData) => {
    try {
        // Crea la reserva con los datos proporcionados
        const booking = await Booking.create({
            user_id,
            ...bookingData,
        });

        return booking;
    } catch (error) {
        throw error;
    }
};

exports.getBookingById = async (id) => {
    try {
        // Busca la reserva por su ID
        const booking = await Booking.findByPk(id, {
            include: [{ model: Seat, as: 'seats' }],
            where: {
                deletedAt: null
            },
            attributes: { exclude: ['deletedAt'] }
        });

        if (!booking) {
            throw new AppError('Reserva no encontrada', 404);
        }

        // Devuelve la reserva
        return booking;
    } catch (error) {
        throw error;
    }
};

exports.getAllBookings = async ({ page = 1, limit = 10, fromDate, toDate, status, user_id }) => {
    try {
        // Calcula el offset y el límite para la paginación
        const offset = (page - 1) * limit;

        // Construye las condiciones dinámicas para los filtros
        const whereConditions = { deletedAt: null };

        if (user_id) {
            whereConditions.user_id = user_id;
        }

        if (fromDate && toDate) {
            whereConditions.bookingDate = {
                [Op.between]: [new Date(fromDate), new Date(toDate)],
            };
        } else if (fromDate) {
            whereConditions.bookingDate = {
                [Op.gte]: new Date(fromDate),
            };
        } else if (toDate) {
            whereConditions.bookingDate = {
                [Op.lte]: new Date(toDate),
            };
        }

        if (status) {
            whereConditions.status = status;
        }

        // Consulta las reservas con paginación y filtros
        const { rows: bookings, count: total } = await Booking.findAndCountAll({
            where: whereConditions,
            include: [{ model: Seat, as: 'seats' }],
            attributes: { exclude: ['deletedAt'] },
            limit: parseInt(limit), // Límite de registros por página
            offset: parseInt(offset), // Desplazamiento
        });

        // Devuelve los resultados junto con información de la paginación
        return {
            total,
            page: parseInt(page),
            limit: parseInt(limit),
            totalPages: Math.ceil(total / limit),
            bookings,
        };
    } catch (error) {
        throw error;
    }
};



exports.updateBooking = async (id, bookingData) => {
    try {
        // Busca la reserva por su ID
        const booking = await Booking.findByPk(id, {
            where: {
                deletedAt: null
            }
        });

        if (!booking) {
            throw new AppError('Reserva no encontrada', 404);
        }

        // Actualiza la reserva
        await booking.update(bookingData);

        return booking;
    } catch (error) {
        throw error;
    }
};

exports.deleteBooking = async (id) => {
    try {
        // Busca la reserva por su ID
        const booking = await Booking.findByPk(id, {
            where: {
                deletedAt: null
            }
        });

        if (!booking) {
            throw new AppError('Reserva no encontrada', 404);
        }

        // Elimina la reserva (lógica)
        await booking.destroy();

        return true;
    } catch (error) {
        throw error;
    }
};
