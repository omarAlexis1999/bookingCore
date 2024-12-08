const { app } = require('@azure/functions');
const seatService = require('../../services/seatService');
const errorHandler  = require('../../middlewares/errorHandler');
const logHandler = require('../../middlewares/logHandler');
const { responseHandler} = require('../../utils/requestUtils');

const listSeatsByEvent = async (request, context) => {
    context.log(`Http function processed request for url "${request.url}"`);
    const result = await logHandler('List Seats by event', context, async () => {
        const { id } = request.params;
        const { page, limit, row, status , minPrice , maxPrice } = Object.fromEntries(request.query);
        return await seatService.getSeatsByEvent(id,
            parseInt(page) || 1,
            parseInt(limit) || 10,
            row,
            status,
            minPrice,
            maxPrice
        );
    });
    return responseHandler(200, result);
};
app.http('ListSeatsByEvent', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'seat/event/{id}',
    handler: errorHandler(listSeatsByEvent),
});
