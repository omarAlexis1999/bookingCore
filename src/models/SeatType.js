'use strict';
const BaseModel = require('./BaseModel');

module.exports = (sequelize, DataTypes) => {

    class SeatType extends BaseModel {
        static associate(models) {
            SeatType.belongsTo(models.Event, { foreignKey: 'event_id', as: 'event' });
            SeatType.hasMany(models.Seat, { foreignKey: 'seat_type_id', as: 'seats' });
        }
    }

    SeatType.init({
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING(50), // Example: "VIP", "General", "Preferential"
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        price: {
            type: DataTypes.DOUBLE,
            allowNull: false,
        },
        entryTime: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    }, {
        sequelize,
        tableName: 'SeatTypes',
        timestamps: true,
        paranoid: true,
    });

    return SeatType;
};
