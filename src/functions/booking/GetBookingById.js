const { app } = require('@azure/functions');
const bookingService = require('../../services/bookingService');
const errorHandler  = require('../../middlewares/errorHandler');
const logHandler = require('../../middlewares/logHandler');
const { responseHandler} = require('../../utils/requestUtils');

const getBookingById = async (request, context) => {
    context.log(`Http function processed request for url "${request.url}"`);
    const result = await logHandler('Get Booking', context, async () => {
        const { id } = request.params;
        const { page, limit } = Object.fromEntries(request.query);
        return await bookingService.getBookingById(id,
            parseInt(page) || 1,
            parseInt(limit) || 10,
        );
    });
    return responseHandler(200, result);
};
app.http('GetBooking', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'booking/{id}',
    handler: errorHandler(getBookingById),
});
