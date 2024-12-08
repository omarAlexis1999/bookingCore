const { app } = require('@azure/functions');
const seatService = require('../../services/seatService');
const errorHandler  = require('../../middlewares/errorHandler');
const logHandler = require('../../middlewares/logHandler');
const { responseHandler} = require('../../utils/requestUtils');

const deleteSeat = async (request, context) => {
    context.log(`Http function processed request for url "${request.url}"`);
    await logHandler('Delete Seat', context, async () => {
        const { id } = request.params;
        return await seatService.deleteSeat(id);
    });
    return responseHandler(200, {message: 'Asiento eliminado exitosamente'});
};
app.http('DeleteSeat', {
    methods: ['DELETE'],
    authLevel: 'anonymous',
    route: 'seat/{id}',
    handler: errorHandler(deleteSeat),
});
