const logHandler = async (operation, context, action) => {
    context.log(`+++++++++++++++Starting operation: ${operation}`);
    try {
        const result = await action();
        if (Array.isArray(result)) {
            context.log(`---------------Finish operation: ${operation} - Items returned: ${result.length}`);
        } else if (result && result.id) {
            context.log(`---------------Finish operation: ${operation} - ID: ${result.id}`);
        } else {
            context.log(`---------------Finish operation: ${operation}`);
        }
        return result;
    } catch (error) {
        context.log(`[ERROR] ${operation} failed: ${error.message}`);
        throw error;
    }
};
module.exports = logHandler;