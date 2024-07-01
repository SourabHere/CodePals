import { Request, Response } from "express";
import db from '../db/db';
import { User } from '../interfaces/user';

export const createUser = (req: Request, res: Response) => {
    const { name, email, bio, location }: User = req.body;
    const  query = 'INSERT INTO Users (name, email, bio, location) VALUES (?, ?, ?, ?)';

    db.query(query, [name,email,bio,location], (err, result) => {
        if(err) {
            res.status(500).json({message: err.message});
            return;
        }
        res.status(201).json({message: 'User created successfully'});
    });
}

export const getUsers = (req: Request, res: Response) => {
    const query = 'SELECT * FROM Users';
    db.query(query, (err, result) => {
        if(err) {
            res.status(500).json({message: err.message});
            return;
        }
        res.status(200).json(result);
    });
}

export const getUserById = (req: Request, res: Response) => {
    const {id} = req.params;
    const query = 'SELECT * FROM Users WHERE id = ?';
    db.query(query, [id], (err, result) => {
        if(err) {
            res.status(500).json({message: err.message});
            return;
        }

        res.status(200).json(result);
    });
}

export const updateUser = (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, email, bio, location }: User = req.body;
    const query = 'UPDATE Users SET name = ?, email = ?, bio = ?, location = ? WHERE id = ?';
    db.query(query, [name, email, bio, location, id], (err, result) => {
        if (err) {
            console.error('Error updating user:', err);
            res.status(500).send('Error updating user');
            return;
        }
        res.status(200).send('User updated successfully');
    });
};
  
export const deleteUser = (req: Request, res: Response) => {
    const { id } = req.params;
    const query = 'DELETE FROM Users WHERE id = ?';
    db.query(query, [id], (err, result) => {
        if (err) {
            console.error('Error deleting user:', err);
            res.status(500).send('Error deleting user');
            return;
        }
        res.status(200).send('User deleted successfully');
    });
};