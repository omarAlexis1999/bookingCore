const { app } = require('@azure/functions');
const seatService = require('../../services/seatService');
const errorHandler  = require('../../middlewares/errorHandler');
const logHandler = require('../../middlewares/logHandler');
const { responseHandler, parseRequestBody} = require('../../utils/requestUtils');

const createSeat = async (request, context) => {
    context.log(`Http function processed request for url "${request.url}"`);
    const result = await logHandler('Create Seat', context, async () => {
        const data = await parseRequestBody(request);
        return await seatService.createSeat(data);
    });
    return responseHandler(201, result);
};
app.http('CreateSeat', {
    methods: ['POST'],
    authLevel: 'anonymous',
    route: 'seat',
    handler: errorHandler(createSeat),
});
