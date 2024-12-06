const { app } = require('@azure/functions');
const seatTypeService = require('../../services/seatTypeService');
const errorHandler  = require('../../middlewares/errorHandler');
const logHandler = require('../../middlewares/logHandler');
const { responseHandler, parseRequestBody} = require('../../utils/requestUtils');

const updateSeatType = async (request, context) => {
    context.log(`Http function processed request for url "${request.url}"`);
    const result = await logHandler('Update SeatType', context, async () => {
        const { id } = request.params;
        const data = await parseRequestBody(request);
        return await seatTypeService.updateSeatType(id, data);
    });
    return responseHandler(200, result);
};
app.http('UpdateSeatType', {
    methods: ['PATCH'],
    authLevel: 'anonymous',
    route: 'seatType/{id}',
    handler: errorHandler(updateSeatType)
});