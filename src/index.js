const express = require('express');
const app = express();
const routes = require('./routes');
const db = require('./models');
const errorHandler = require('./middlewares/errorHandler');

app.use(express.json());
app.use('/api/v1', routes);

// Middleware de manejo de errores
app.use(errorHandler);

const PORT = process.env.PORT || 4000;
// Sincroniza los modelos con la base de datos
db.sequelize.sync({ alter: true }) // Puedes usar { force: true } para recrear tablas (¡Cuidado, puede borrar datos!)
    .then(() => {
        console.log('Base de datos sincronizada.');
        // Inicia el servidor una vez que la base de datos esté sincronizada
        app.listen(PORT, () => {
            console.log(`Servidor corriendo en http://localhost:${PORT}`);
        });
    })
    .catch(err => {
        console.error('Error al sincronizar la base de datos:', err);
    });
