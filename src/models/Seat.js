'use strict';
const BaseModel = require('./BaseModel');

module.exports = (sequelize, DataTypes) => {

    class Seat extends BaseModel {
        static associate(models) {
            Seat.belongsToMany(models.Booking, { through: 'BookingSeats', as: 'bookings', foreignKey: 'seat_id' });
            Seat.belongsTo(models.SeatType, { foreignKey: 'seat_type_id', as: 'seatType' });
        }
    }

    Seat.init(
        {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
        },
        row: {
            type: DataTypes.STRING(5),
            allowNull: false,
        },
        number: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        status: {
            type: DataTypes.STRING(20),
            allowNull: false,
            defaultValue: 'available', // Other values: 'reserved', 'blocked'
        },
    }, {
        sequelize,
        tableName: 'Seats',
        timestamps: true,
        paranoid: true,
    });

    return Seat;
};
