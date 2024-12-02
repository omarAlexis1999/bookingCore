const { Booking, Seat , SeatType, Event } = require('../models');
const AppError = require('../utils/AppError');
const {Op, literal} = require('sequelize');

exports.createBooking = async (user_id, bookingData) => {
    const { bookingDate, status = 'pending', seats } = bookingData;

    try {
        // Valida que se proporcionen los asientos
        if (!seats || seats.length === 0) {
            throw new AppError('Debe seleccionar al menos un asiento.', 400);
        }

        // Validación de asientos
        const foundSeats = await validateSeatsAvailability(seats);

        // Calcula el costo total sumando los precios de los asientos
        const totalCost = foundSeats.reduce((sum, seat) => {
            if (!seat.seatType || typeof seat.seatType.price === 'undefined') {
                throw new AppError(`El asiento ${seat.id} no tiene un precio válido.`, 422);
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

        return booking.toSafeJSON();
    } catch (error) {
        throw error;
    }
};

exports.getBookingById = async ({id,page = 1, limit = 10}) => {
    try {
        const offset = (page - 1) * limit;
        // Busca la reserva por su ID
        const booking = await Booking.findByPk(id);

        if (!booking) {
            throw new AppError('Reserva no encontrada', 404);
        }

        // Consulta los asientos asociados con paginación
        const { rows: seats, count: totalSeats } = await Seat.findAndCountAll({
            include: [
                {
                    model: Booking,
                    as: 'bookings',
                    where: { id }, // Filtra por el ID de la reserva
                    through: { attributes: [] }, // Excluye los campos de la tabla intermedia
                    attributes: []
                },
                {
                    model: SeatType,
                    as: 'seatType',
                    attributes: ['name', 'price'], // Incluye solo los atributos necesarios
                    include: [
                        {
                            model: Event, // Incluye información del evento asociado al SeatType
                            as: 'event',
                            attributes: ['name'], // Incluye solo el nombre del evento
                        },
                    ],
                },
            ],
            limit,
            offset,
        });

        // Devuelve los datos junto con información de la paginación
        return {
            ...booking.dataValues   ,
            seats,
            pagination: {
                totalSeats,
                currentPage: page,
                totalPages: Math.ceil(totalSeats / limit),
                limit,
            },
        };
    } catch (error) {
        throw error;
    }
};

exports.getAllBookings = async ({ page = 1, limit = 10, fromDate, toDate, status, user_id }) => {
    try {
        // Calcula el offset y el límite para la paginación
        const offset = (page - 1) * limit;

        // Construye las condiciones dinámicas para los filtros
        const whereConditions = { };

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
            attributes: {
                include: [
                    // Subconsulta para contar los asientos asociados
                    [
                        literal(`(
                            SELECT COUNT(*)
                            FROM "BookingSeats"
                            WHERE "BookingSeats"."booking_id" = "Booking"."id"
                        )`),
                        'seatCount',
                    ],
                ],
            },
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
        const { seats: newSeatIds, ...dataToUpdate } = bookingData;

        // Bloquea la modificación de `totalCost`
        if ('totalCost' in dataToUpdate) {
            delete dataToUpdate.totalCost;
        }

        // Encuentra la reserva existente
        const booking = await Booking.findByPk(id, {
            include: [
                {
                    model: Seat,
                    as: 'seats',
                    through: { attributes: [] }, // Excluye BookingSeats
                    required: false,
                }
            ]
        });

        if (!booking) {
            throw new AppError('Reserva no encontrada', 404);
        }

        // Obtén los IDs de los asientos actualmente asociados
        const currentSeatIds = booking.seats.map(seat => seat.id);

        // Identifica los nuevos asientos que se agregarán
        const seatsToAdd = newSeatIds.filter(seatId => !currentSeatIds.includes(seatId));
        const seatsToRemove = currentSeatIds.filter(seatId => !newSeatIds.includes(seatId));

        // Valida que los nuevos asientos estén disponibles
        if (seatsToAdd && seatsToAdd.length > 0) {
            const availableSeats = await validateSeatsAvailability(seatsToAdd);

            if (availableSeats.length !== seatsToAdd.length) {
                throw new AppError('Uno o más asientos no están disponibles para la reserva.', 409);
            }
        }

        // Cambia el estado de los asientos que se eliminarán a "available"
        if (seatsToRemove.length > 0) {
            await Seat.update(
                { status: 'available' },
                { where: { id: seatsToRemove } }
            );
            await booking.removeSeats(seatsToRemove);
        }

        // Actualiza los asientos asociados
        if (seatsToAdd.length > 0) {
            const seatsToAssociate = await Seat.findAll({
                where: { id: seatsToAdd }
            });
            await booking.addSeats(seatsToAssociate);

            // Cambia el estado de los nuevos asientos a "reserved"
            await Seat.update(
                { status: 'reserved' },
                { where: { id: seatsToAdd } }
            );
        }

        // Actualiza otros campos de la reserva
        await booking.update(dataToUpdate);

        // Recalcula el `totalCost` después de las modificaciones en los asientos
        const allSeats = await booking.getSeats({
            include: [{ model: SeatType, as: 'seatType' }]
        });

        const totalCost = allSeats.reduce((sum, seat) => sum + seat.seatType.price, 0);
        await booking.update({ totalCost });


         await booking.reload({
            include: [
                {
                    model: Seat,
                    as: 'seats',
                    through: { attributes: [] },
                    required: false,
                    include: [
                        {
                            model: SeatType,
                            as: 'seatType',
                            attributes: ['name', 'price'],
                            required: false,
                        },
                    ],
                },
            ],
        });
        return booking.toSafeJSON();
    } catch (error) {
        throw error;
    }
};


exports.deleteBooking = async (id) => {
    try {
        // Busca la reserva por su ID
        const booking = await Booking.findByPk(id, {
            include: [
                {
                    model: Seat,
                    as: 'seats',
                    required: false,
                }
            ]
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


const validateSeatsAvailability = async (seatIds) => {
    try {
        // Busca los asientos que existen en la base de datos y están disponibles
        const foundSeats = await Seat.findAll({
            where: {
                id: seatIds,
                status: 'available', // Valida que el estado sea 'available'
            },
            include: [{
                model: SeatType,
                as: 'seatType',
                attributes: ['price']
            }],
        });

        // Verifica que todos los asientos solicitados existan y estén disponibles
        if (foundSeats.length !== seatIds.length) {
            // Encuentra los IDs de los asientos que no están disponibles o no existen
            const unavailableSeats = seatIds.filter(
                seatId => !foundSeats.some(foundSeat => foundSeat.id === seatId)
            );

            // Busca detalles de los asientos no disponibles
            const unavailableDetails = await Seat.findAll({
                where: { id: unavailableSeats },
                attributes: ['row', 'number'],
            });

            // Construye el mensaje de error
            const seatDetails = unavailableDetails
                .map(seat => `[${seat.row}][${seat.number}]`)
                .join(', ');

            throw new AppError(`Asientos ${seatDetails} no están disponibles.`, 409);
        }

        // Devuelve los asientos disponibles si no hay errores
        return foundSeats;
    } catch (error) {
        throw error;
    }
};
