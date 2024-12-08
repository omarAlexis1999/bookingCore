const { app } = require('@azure/functions');
const bookingService = require('../../services/bookingService');
const errorHandler  = require('../../middlewares/errorHandler');
const logHandler = require('../../middlewares/logHandler');
const { responseHandler} = require('../../utils/requestUtils');

const deleteBooking = async (request, context) => {
    context.log(`Http function processed request for url "${request.url}"`);
    await logHandler('Delete Booking', context, async () => {
        const { id } = request.params;
        return await bookingService.deleteBooking(id);
    });
    return responseHandler(200, {message: 'Reserva eliminada exitosamente'});
};
app.http('DeleteBooking', {
    methods: ['DELETE'],
    authLevel: 'anonymous',
    route: 'booking/{id}',
    handler: errorHandler(deleteBooking),
});
