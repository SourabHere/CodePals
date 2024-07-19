import { Request, Response } from "express";
import db from '../db/db';

export const getUserInRoom = async (req: Request, res: Response) => {
    const { roomId } = req.params;
    
    const query = `
        SELECT helpersRoom.id, user_id, name, room_id, logoURL, dateOfJoin FROM helpersRoom LEFT JOIN users ON users.clerkId = helpersRoom.user_id WHERE room_id = ?;
    `;

    db.query(query, [roomId], (err: any, result: any) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }

        res.status(200).json(result);
    });
}
export const addUserToRoom = async (req: Request, res: Response) => {
    const { roomId, clerkId } = req.params;
    const { dateOfJoin } = req.body;

    const checkQuery = `
        SELECT * FROM helpersRoom WHERE room_id = ? AND user_id = ? AND dateOfJoin = ?;
    `;

    const insertQuery = `
        INSERT INTO helpersRoom (room_id, user_id, dateOfJoin) VALUES (?, ?, ?);
    `;

    db.query(checkQuery, [roomId, clerkId, dateOfJoin], (checkErr: any, checkResult: any) => {
        if (checkErr) {
            console.log(checkErr);
            res.status(500).json({ error: checkErr.message });
            return;
        }

        
        if (checkResult.length > 0) {
            res.status(201).json({ message: 'User already in room for the date' });
            return;
        }

        
        db.query(insertQuery, [roomId, clerkId, dateOfJoin], (insertErr: any, insertResult: any) => {
            if (insertErr) {
                console.log(insertErr);
                res.status(500).json({ error: insertErr.message });
                return;
            }

            res.status(201).json({ message: 'User added to room' });
        });
    });
};
