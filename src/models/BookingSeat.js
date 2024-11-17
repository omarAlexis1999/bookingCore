'use strict';
module.exports = (sequelize, DataTypes) => {
    const BookingSeat = sequelize.define('BookingSeat', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
        },
        booking_id: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        seat_id: {
            type: DataTypes.UUID,
            allowNull: false,
        },
    }, {
        tableName: 'BookingSeats',
        timestamps: true,
        paranoid: true,
    });

    return BookingSeat;
};
