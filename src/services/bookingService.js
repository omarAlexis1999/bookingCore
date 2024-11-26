const { Booking, Seat , SeatType } = require('../models');
const AppError = require('../utils/AppError');
const {Op} = require('sequelize');

exports.createBooking = async (user_id, bookingData) => {
    const { bookingDate, status = 'pending', seats } = bookingData;

    try {
        // Valida que se proporcionen los asientos
        if (!seats || seats.length === 0) {
            throw new AppError('Debe seleccionar al menos un asiento.', 400);
        }

        // Busca los asientos en la base de datos
        const foundSeats = await Seat.findAll({
            where: {
                id: seats,
                status: 'available', // Solo permite asientos disponibles
                deletedAt: null,
            },
            include: [{
                model: SeatType,
                as: 'seatType',
                attributes: ['price']
            }],
        });

        // Verifica que todos los asientos existan y estén disponibles
        if (foundSeats.length !== seats.length) {
            throw new AppError('Uno o más asientos no están disponibles o no existen.', 400);
        }

        // Calcula el costo total sumando los precios de los asientos
        const totalCost = foundSeats.reduce((sum, seat) => {
            if (!seat.seatType || typeof seat.seatType.price === 'undefined') {
                throw new AppError(`El asiento ${seat.id} no tiene un precio válido.`, 400);
            }
            return sum + seat.seatType.price;
        }, 0);



        // Crea la reserva
        const booking = await Booking.create({
            user_id,
            bookingDate,
            status,
            totalCost,
        });

        // Asocia los asientos a la reserva
        await booking.addSeats(foundSeats);

        // Actualiza el estado de los asientos a 'reserved'
        await Seat.update(
            { status: 'reserved' },
            { where: { id: seats } }
        );

        return booking;
    } catch (error) {
        throw error;
    }
};

exports.getBookingById = async (id) => {
    try {
        // Busca la reserva por su ID
        const booking = await Booking.findByPk(id, {
            include: [
                {
                    model: Seat,
                    as: 'seats',
                    attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
                    through: { attributes: [] },
                    include: [
                        {
                            model: SeatType,
                            as: 'seatType',
                            attributes: ['name', 'price'], // Incluye nombre y precio del SeatType
                        },
                    ],
                }
            ],
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
            include: [
                {
                    model: Seat,
                    as: 'seats',
                    attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
                    through: { attributes: [] },
                    include: [
                        {
                            model: SeatType,
                            as: 'seatType',
                            attributes: ['name', 'price'], // Incluye nombre y precio del SeatType
                        },
                    ],
                }
            ],
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
            },
            include: [{ model: Seat, as: 'seats' }]
        });

        if (!booking) {
            throw new AppError('Reserva no encontrada', 404);
        }
        // Actualiza los asientos a 'available'
        const seatIds = booking.seats.map(seat => seat.id);
        await Seat.update(
            { status: 'available' },
            { where: { id: seatIds } }
        );

        // Elimina la reserva (lógica)
        await booking.destroy();

        return true;
    } catch (error) {
        throw error;
    }
};
