const { app } = require('@azure/functions');
const eventService = require('../../services/eventService');
const errorHandler  = require('../../middlewares/errorHandler');
const logHandler = require('../../middlewares/logHandler');
const { responseHandler, parseRequestBody} = require('../../utils/requestUtils');

const deleteEvent = async (request, context) => {
    context.log(`Http function processed request for url "${request.url}"`);
    await logHandler('Delete Event', context, async () => {
        const { id } = request.params;
        return await eventService.deleteEvent(id);
    });
    return responseHandler(200, {message: 'Evento eliminado exitosamente'});
};
app.http('DeleteEvent', {
    methods: ['DELETE'],
    authLevel: 'anonymous',
    route: 'event/{id}',
    handler: errorHandler(deleteEvent),
});
