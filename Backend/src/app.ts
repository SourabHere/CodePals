import express from 'express';
import path from 'path';
import http from 'http';
import { Server } from 'socket.io';
import { handleSocketConnection } from './controllers/socketController';
import userRoutes from './routes/userRoutes';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.json());
app.use(express.static('build'));

app.use('/api', userRoutes);

app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

io.on('connection', handleSocketConnection(io));

const PORT = process.env.PORT || 3456;
server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
