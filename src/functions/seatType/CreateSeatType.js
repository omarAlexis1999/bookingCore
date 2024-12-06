const { app } = require('@azure/functions');
const seatTypeService = require('../../services/seatTypeService');
const errorHandler  = require('../../middlewares/errorHandler');
const logHandler = require('../../middlewares/logHandler');
const { responseHandler, parseRequestBody} = require('../../utils/requestUtils');

const createSeatType = async (request, context) => {
    context.log(`Http function processed request for url "${request.url}"`);
    const result = await logHandler('Create SeatType', context, async () => {
        const data = await parseRequestBody(request);
        return await seatTypeService.createSeatType(data);
    });
    return responseHandler(201, result);
};
app.http('CreateSeatType', {
    methods: ['POST'],
    authLevel: 'anonymous',
    route: 'seatType',
    handler: errorHandler(createSeatType),
});
