import express from 'express';
import handlebars from 'express-handlebars';
import { Server } from 'socket.io';
import __dirname from './utils.js';
import routerViews from './router/views.router.js'

const PORT = process.env.PORT || 8080;
const app = express();
const httpServer = app.listen(PORT, () => console.log('Listening...'));
// Configurar socket
const io = new Server(httpServer);

// Configuraciones de handlebars
app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');

// Ruta publica estática
app.use('/static', express.static(__dirname + '/public'));

// Rutas
app.get(('/health', (req, res) => {res.send('OK')}));
app.use('/', routerViews)

const messages = [];
// Conexión
io.on('connection', socket => {
    console.log('New connection');
    socket.on('new', user => console.log(`${user} se acaba de conectar`));

    socket.on('message', data => {
        messages.push(data);
        io.emit('logs', messages);
    });
});