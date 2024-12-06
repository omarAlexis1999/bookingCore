const { app } = require('@azure/functions');
const seatTypeService = require('../../services/seatTypeService');
const errorHandler  = require('../../middlewares/errorHandler');
const logHandler = require('../../middlewares/logHandler');
const { responseHandler} = require('../../utils/requestUtils');

const deleteSeatType = async (request, context) => {
    context.log(`Http function processed request for url "${request.url}"`);
    await logHandler('Delete SeatType', context, async () => {
        const { id } = request.params;
        return await seatTypeService.deleteSeatType(id);
    });
    return responseHandler(200, {message: 'Tipo de asiento eliminado exitosamente'});
};
app.http('DeleteSeatType', {
    methods: ['DELETE'],
    authLevel: 'anonymous',
    route: 'seatType/{id}',
    handler: errorHandler(deleteSeatType),
});