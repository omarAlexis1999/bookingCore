const { app } = require('@azure/functions');
const eventService = require('../../services/eventService');
const errorHandler  = require('../../middlewares/errorHandler');
const logHandler = require('../../middlewares/logHandler');
const { responseHandler, parseRequestBody} = require('../../utils/requestUtils');

const listEvents = async (request, context) => {
    context.log(`Http function processed request for url "${request.url}"`);
    const result = await logHandler('List Events', context, async () => {
        const { page, limit, name, address , status } = Object.fromEntries(request.query);
        return await eventService.getAllEvents(
            parseInt(page) || 1,
            parseInt(limit) || 10,
            name ,address ,status
        );
    });
    return responseHandler(200, result);
};
app.http('ListEvents', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'event',
    handler: errorHandler(listEvents),
});
