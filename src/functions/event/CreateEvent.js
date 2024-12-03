const { app } = require('@azure/functions');
const eventService = require('../../services/eventService');
const errorHandler  = require('../../middlewares/errorHandler');
const logHandler = require('../../middlewares/logHandler');
const { responseHandler, parseRequestBody} = require('../../utils/requestUtils');

const createEvent = async (request, context) => {
    context.log(`Http function processed request for url "${request.url}"`);
    const result = await logHandler('Create Event', context, async () => {
        const data = await parseRequestBody(request);
        return await eventService.createEvent(data);
    });
    return responseHandler(201, result);
};
app.http('CreateEvent', {
    methods: ['POST'],
    authLevel: 'anonymous',
    route: 'event',
    handler: errorHandler(createEvent),
});
