import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { handleSocketConnection } from './controllers/socketController';
import userRoutes from './routes/userRoutes';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(cors());

app.use(express.json());

app.use('/api', userRoutes);


io.on('connection', handleSocketConnection(io));

const PORT = process.env.PORT || 3456;
server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
