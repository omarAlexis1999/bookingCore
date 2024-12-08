const { app } = require('@azure/functions');
const seatTypeService = require('../../services/seatTypeService');
const errorHandler  = require('../../middlewares/errorHandler');
const logHandler = require('../../middlewares/logHandler');
const { responseHandler, parseRequestBody} = require('../../utils/requestUtils');

const listSeatTypesByEvent = async (request, context) => {
    context.log(`Http function processed request for url "${request.url}"`);
    const result = await logHandler('List SeatTypes', context, async () => {
        const { id } = request.params;
        const { page, limit, name, sortBy , order } = Object.fromEntries(request.query);
        return await seatTypeService.getAllSeatTypes(
            id,
            parseInt(page) || 1,
            parseInt(limit) || 10,
            name ,sortBy ,order
        );
    });
    return responseHandler(200, result);
};
app.http('ListSeatTypes', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'seatType/event/{id}',
    handler: errorHandler(listSeatTypesByEvent),
});