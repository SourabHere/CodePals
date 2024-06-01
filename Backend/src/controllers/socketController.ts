import {Server, Socket} from 'socket.io';
import ACTIONS from '../actions';
import {getAllConnectedClients, getCurrentUser, UserSocketMap} from '../models/user';
import { formatMessage } from '../utils/formatMessage';

export function handleSocketConnection(io: Server){

    return (socket: Socket) => {

        socket.on(ACTIONS.JOIN, ({roomId, username}: {roomId: string, username: string}) => {
            UserSocketMap[socket.id] = username;
            socket.join(roomId);
            const clients = getAllConnectedClients(io, roomId);

            clients.forEach(({socketId}) => {
                
                io.to(socketId).emit(ACTIONS.JOINED, {
                    clients,
                    username,
                    socketId: socket.id,
                });
            
            });

        });

        socket.on(ACTIONS.CODE_CHANGE, ({roomId, code}: {roomId: string, code: string}) => {
            socket.in(roomId).emit(ACTIONS.CODE_CHANGE, {code});
        })

        socket.on(ACTIONS.SYNC_CODE, ({socketId, code}: {socketId: string, code: string}) => {
            socket.to(socketId).emit(ACTIONS.CODE_CHANGE, {code});
        });

        socket.on(ACTIONS.CHATMESSAGE, ({msg,roomId}: {msg: string, roomId: string}) => {
            const user = getCurrentUser(socket.id);
            io.to(roomId).emit('message', formatMessage(user, msg))
        })

        socket.on(ACTIONS.DISCONNECTING, () => {
            const rooms = [...socket.rooms];
            rooms.forEach((roomId) => {
                socket.in(roomId).emit(ACTIONS.DISCONNECTED, {
                    socketId: socket.id,
                    username: UserSocketMap[socket.id],
                });
            });

        });

        socket.on(ACTIONS.DISCONNECT, () => {
            delete UserSocketMap[socket.id];
        });

    }

}