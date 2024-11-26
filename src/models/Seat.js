'use strict';
module.exports = (sequelize, DataTypes) => {
    const Seat = sequelize.define('Seat', {
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
        tableName: 'Seats',
        timestamps: true,
        paranoid: true,
    });

    Seat.associate = (models) => {
        Seat.belongsTo(models.SeatType, { foreignKey: 'seat_type_id', as: 'seatType' });
    };

    return Seat;
};
