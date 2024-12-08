const { app } = require('@azure/functions');
const bookingService = require('../../services/bookingService');
const errorHandler  = require('../../middlewares/errorHandler');
const logHandler = require('../../middlewares/logHandler');
const { responseHandler, parseRequestBody} = require('../../utils/requestUtils');

const createBooking = async (request, context) => {
    context.log(`Http function processed request for url "${request.url}"`);
    const result = await logHandler('Create Booking', context, async () => {
        const {user_id, ...data} = await parseRequestBody(request);
        return await bookingService.createBooking(user_id,data);
    });
    return responseHandler(201, result);
};
app.http('CreateBooking', {
    methods: ['POST'],
    authLevel: 'anonymous',
    route: 'booking',
    handler: errorHandler(createBooking),
});
