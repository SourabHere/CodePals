import { Server } from "socket.io";

interface UserSocketMap {
    [key: string]: string;
}

export const UserSocketMap: UserSocketMap = {};

export function getAllConnectedClients(io: Server, roomId: string) {
    return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map((socketId) => {
        return {
            socketId,
            userId: UserSocketMap[socketId]
        }
    })
}

export function getCurrentUser(id: string) {
    return UserSocketMap[id];
}