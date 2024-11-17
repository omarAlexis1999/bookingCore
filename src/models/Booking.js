'use strict';
module.exports = (sequelize, DataTypes) => {
    const Booking = sequelize.define('Booking', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
        },
        bookingDate: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        status: {
            type: DataTypes.STRING(20),
            allowNull: false,
            defaultValue: 'pending', // Other values: 'confirmed', 'cancelled'
        },
        totalCost: {
            type: DataTypes.DOUBLE,
            allowNull: false,
        },
        user_id: {
            type: DataTypes.UUID, // Referencia al ID de usuario en AuthCore
            allowNull: false,
        },
    }, {
        tableName: 'Bookings',
        timestamps: true,
        paranoid: true,
    });

    Booking.associate = (models) => {
        Booking.belongsToMany(models.Seat, { through: 'BookingSeats', as: 'seats', foreignKey: 'booking_id' });
    };

    return Booking;
};
