import express from 'express';
import path from 'path';
import http from 'http';
import { Server } from 'socket.io';
import ACTIONS from './actions';
import { handleSocketConnection } from './controllers/socketController';

const app = express();
const server = http.createServer(app);
const io = new Server(server);


app.use(express.static('build'));


app.use((req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});


io.on('connection', handleSocketConnection(io));

const PORT = process.env.PORT || 3456;
server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
