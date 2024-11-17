function errorHandler(err, req, res, next) {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Ocurrió un error en el servidor';

    res.status(statusCode).json({
        message: message
    });
}

module.exports = errorHandler; // Exporta la función para usarla en otros archivos