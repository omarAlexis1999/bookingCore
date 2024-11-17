const { createLogger, format, transports } = require('winston');
require('dotenv').config()

// Configuración del formato de logs
const logFormat = format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), // Agrega una marca de tiempo
    format.printf(({ level, message, timestamp }) => {
        return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
    })
);

// Crear el logger
const logger = createLogger({
    level: process.env.LOG_LEVEL || 'info', // Nivel de logs basado en el entorno
    format: logFormat,
    transports: [
        new transports.Console(), // Logs en consola
        new transports.File({ filename: 'logs/error.log', level: 'error' }), // Logs de errores
        new transports.File({ filename: 'logs/combined.log' }), // Logs combinados
    ],
});

// Configuración adicional para producción
if (process.env.NODE_ENV === 'production') {
    // Agrega un transporte para la consola con formato JSON
    logger.add(new transports.Console({
        format: format.json(),
    }));
}

module.exports = logger;