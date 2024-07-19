import { Request, Response } from "express";
import db from '../db/db';
import {getUserByClerkId} from './userController';

export const getPosts = async (req: Request, res: Response) => {
    const query = `
        SELECT posts.id, user_id, resolved, comment, room_id, date_time, type, priority, tags, name, logoURL FROM posts LEFT JOIN users ON posts.user_id = users.id where resolved = FALSE;
    `;

    db.query(query, (err: any, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }

        res.status(200).json(result);
    
    })

};

export const resolvePost = async (req: Request, res: Response) => {
    const query = `UPDATE posts SET resolved = TRUE WHERE id = ?;`;
    const authQuery = `SELECT user_id FROM posts WHERE id = ?;`;

    const { postId , clerkId } = req.params;

    const user_id = await getUserByClerkId(clerkId);

    db.query(authQuery, [postId], (err: any, result: any) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }

        if (result.length === 0) {
            res.status(404).json({ message: 'Post not found' });
            return;
        }

        if (result[0].user_id !== user_id) {
            res.status(403).json({ error: 'Unauthorized' });
            return;
        }

        db.query(query, [postId], (err: any, result: any) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            
            if (result.affectedRows === 0) {
                res.status(404).json({ message: 'Post not found' });
                return;
            }
        
    
            res.status(200).json({ message: 'Post resolved' });
        });

    });
    
};

export const addNewPost = async (req: Request, res: Response) => {
    const { comment, room_id, date_time, type, priority, tags } = req.body;
    const { clerkId } = req.params;

    if (!clerkId) {
        return res.status(400).json({ error: 'Missing user ID in headers' });
    }

    const user_id = await getUserByClerkId(clerkId);

    const query = `
        INSERT INTO posts (user_id, comment, room_id, date_time, type, priority, tags)
        VALUES (?, ?, ?, ?, ?, ?, ?);`;

    db.query(query, [user_id, comment, room_id, date_time, type, priority, JSON.stringify(tags)], (err: any, result: any) => {
        if (err) {
            console.log(err)
            res.status(500).json({ error: err.message });
            return;
        }

        res.status(201).json({ message: 'Post created successfully' });
    });
};



export const getPostsByUserId = async (req: Request, res: Response) => {
    const query = `SELECT posts.id, user_id, comment, room_id, date_time, type, priority, tags, name, logoURL, resolved FROM posts LEFT JOIN users ON posts.user_id = users.id
     WHERE user_id = ?;`;
    const { clerkId } = req.params;

    const userId = await getUserByClerkId(clerkId);

    db.query(query, [userId], (err: any, result: any) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }

        res.status(200).json(result);
    });
}



export const getPostPriorities = async (req: Request, res: Response) => {
    const query = `SELECT * FROM postPriorities;`;

    db.query(query, (err: any, result: Response) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }

        res.status(200).json(result);
    });

}