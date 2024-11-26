'use strict';
module.exports = (sequelize, DataTypes) => {
    const Event = sequelize.define('Event', {
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
        tableName: 'Events',
        timestamps: true,
        paranoid: true, // Enables soft deletes (deletedAt)
    });

    Event.associate = (models) => {
        Event.hasMany(models.SeatType, { foreignKey: 'event_id', as: 'seatTypes' });
    };

    return Event;
};
