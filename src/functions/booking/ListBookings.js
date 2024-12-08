const { app } = require('@azure/functions');
const bookingService = require('../../services/bookingService');
const errorHandler  = require('../../middlewares/errorHandler');
const logHandler = require('../../middlewares/logHandler');
const { responseHandler} = require('../../utils/requestUtils');

const listBooking = async (request, context) => {
    context.log(`Http function processed request for url "${request.url}"`);
    const result = await logHandler('List Booking', context, async () => {
        const { page, limit, fromDate, toDate, status, user_id } = Object.fromEntries(request.query);
        return await bookingService.getAllBookings(
            parseInt(page) || 1,
            parseInt(limit) || 10,
            fromDate ,toDate ,status, user_id
        );
    });
    return responseHandler(200, result);
};
app.http('ListBooking', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'booking',
    handler: errorHandler(listBooking),
});
