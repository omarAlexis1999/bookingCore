const { Model } = require('sequelize');

class BaseModel extends Model {
    static init(attributes, options) {
        // Aplica el defaultScope y otras configuraciones de manera general
        if (!options.defaultScope) {
            options.defaultScope = {
                where: {
                    deletedAt: null,
                },
                attributes: { exclude: ['deletedAt'] },
            };
        }
        return super.init(attributes, options);
    }
    // Metodo para excluir atributos sensibles o no deseados
    toSafeJSON() {
        const data = this.toJSON(); // Convierte el modelo a un objeto JSON
        delete data.deletedAt; // Elimina el campo deletedAt
        return data; // Retorna el objeto sin deletedAt
    }
}

module.exports = BaseModel;
