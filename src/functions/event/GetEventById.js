const { app } = require('@azure/functions');
const eventService = require('../../services/eventService');
const errorHandler  = require('../../middlewares/errorHandler');
const logHandler = require('../../middlewares/logHandler');
const { responseHandler, parseRequestBody} = require('../../utils/requestUtils');

const getEventById = async (request, context) => {
    context.log(`Http function processed request for url "${request.url}"`);
    const result = await logHandler('Get Event', context, async () => {
        const { id } = request.params;
        return await eventService.getEventById(id);
    });
    return responseHandler(200, result);
};
app.http('GetEvent', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'event/{id}',
    handler: errorHandler(getEventById),
});
