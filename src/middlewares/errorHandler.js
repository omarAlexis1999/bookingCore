const AppError = require('../utils/AppError');
const {responseHandler} = require('../utils/requestUtils');

const errorHandler = (handler) => async (req, context) => {
    try {
        return await handler(req, context);
    } catch (error) {
        context.log(`[ERROR] ${error.message}`);
        if (error instanceof AppError) {
            return responseHandler(error.statusCode, { message: error.message});
        }
        return responseHandler(500, { message: 'Internal Server Error' });
    }
};
module.exports = errorHandler;