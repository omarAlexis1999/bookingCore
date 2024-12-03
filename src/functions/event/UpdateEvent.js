const { app } = require('@azure/functions');
const eventService = require('../../services/eventService');
const errorHandler  = require('../../middlewares/errorHandler');
const logHandler = require('../../middlewares/logHandler');
const { responseHandler, parseRequestBody} = require('../../utils/requestUtils');

const updateEvent = async (request, context) => {
    context.log(`Http function processed request for url "${request.url}"`);
    const result = await logHandler('Update Event', context, async () => {
        const { id } = request.params;
        const data = await parseRequestBody(request);
        return await eventService.updateEvent(id, data);
    });
    return responseHandler(200, result);
};
app.http('UpdateEvent', {
    methods: ['PATCH'],
    authLevel: 'anonymous',
    route: 'event/{id}',
    handler: errorHandler(updateEvent),
});
