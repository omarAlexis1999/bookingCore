'use strict';
const BaseModel = require('./BaseModel');

module.exports = (sequelize, DataTypes) => {

    class Event extends BaseModel {
        static associate(models) {
            Event.hasMany(models.SeatType, { foreignKey: 'event_id', as: 'seatTypes' });
        }
    }

    Event.init({
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        startTime: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        endTime: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        address: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        latitude: {
            type: DataTypes.DOUBLE,
            allowNull: true,
            validate: {
                min: -90,
                max: 90,
            },
        },
        longitude: {
            type: DataTypes.DOUBLE,
            allowNull: true,
            validate: {
                min: -180,
                max: 180,
            },
        },
        status: {
            type: DataTypes.STRING(20),
            allowNull: false,
            defaultValue: 'active', // Other values: 'cancelled', 'finished'
        },
        totalCapacity: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    }, {
        sequelize,
        tableName: 'Events',
        timestamps: true,
        paranoid: true, // Enables soft deletes (deletedAt)
    });


    return Event;
};
