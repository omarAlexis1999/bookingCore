const { app } = require('@azure/functions');
const seatTypeService = require('../../services/seatTypeService');
const errorHandler  = require('../../middlewares/errorHandler');
const logHandler = require('../../middlewares/logHandler');
const { responseHandler} = require('../../utils/requestUtils');

const getSeatTypeById = async (request, context) => {
    context.log(`Http function processed request for url "${request.url}"`);
    const result = await logHandler('Get SeatType', context, async () => {
        const { id } = request.params;
        return await seatTypeService.getSeatTypeById(id);
    });
    return responseHandler(200, result);
};
app.http('GetSeatType', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'seatType/{id}',
    handler: errorHandler(getSeatTypeById),
});