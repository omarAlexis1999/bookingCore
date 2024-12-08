const { app } = require('@azure/functions');
const seatService = require('../../services/seatService');
const errorHandler  = require('../../middlewares/errorHandler');
const logHandler = require('../../middlewares/logHandler');
const { responseHandler, parseRequestBody} = require('../../utils/requestUtils');

const updateSeat = async (request, context) => {
    context.log(`Http function processed request for url "${request.url}"`);
    const result = await logHandler('Update Seat', context, async () => {
        const { id } = request.params;
        const data = await parseRequestBody(request);
        return await seatService.updateSeat(id, data);
    });
    return responseHandler(200, result);
};
app.http('UpdateSeat', {
    methods: ['PATCH'],
    authLevel: 'anonymous',
    route: 'seat/{id}',
    handler: errorHandler(updateSeat),
});
