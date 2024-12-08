const { app } = require('@azure/functions');
const seatService = require('../../services/seatService');
const errorHandler  = require('../../middlewares/errorHandler');
const logHandler = require('../../middlewares/logHandler');
const { responseHandler} = require('../../utils/requestUtils');

const getSeatById = async (request, context) => {
    context.log(`Http function processed request for url "${request.url}"`);
    const result = await logHandler('Get Seat', context, async () => {
        const { id } = request.params;
        return await seatService.getSeatById(id);
    });
    return responseHandler(200, result);
};
app.http('GerSeat', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'seat/{id}',
    handler: errorHandler(getSeatById),
});
