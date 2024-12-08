const { app } = require('@azure/functions');
const bookingService = require('../../services/bookingService');
const errorHandler  = require('../../middlewares/errorHandler');
const logHandler = require('../../middlewares/logHandler');
const { responseHandler, parseRequestBody} = require('../../utils/requestUtils');

const updateBooking = async (request, context) => {
    context.log(`Http function processed request for url "${request.url}"`);
    const result = await logHandler('Update Booking', context, async () => {
        const { id } = request.params;
        const data = await parseRequestBody(request);
        return await bookingService.updateBooking(id, data);
    });
    return responseHandler(200, result);
};
app.http('UpdateBooking', {
    methods: ['PATCH'],
    authLevel: 'anonymous',
    route: 'booking/{id}',
    handler: errorHandler(updateBooking),
});
