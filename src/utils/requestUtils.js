// Función para manejar respuestas
const responseHandler = (status, data) => {
    return {
        status,
        body: JSON.stringify(data.toJSON ? data.toJSON() : data),
        headers: {
            'Content-Type': 'application/json',
        }
    };
};

// Función para analizar el cuerpo de una solicitud
const parseRequestBody = async (request) => {
    try {
        return JSON.parse(await request.text());
    } catch (error) {
        throw new Error('Invalid JSON body');
    }
};

// Exportar ambas funciones
module.exports = {
    responseHandler,
    parseRequestBody,
};
