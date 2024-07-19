import { Request, Response } from "express";
import db from '../db/db';
import { User } from '../interfaces/user';
import { Streak, Contributions } from '../interfaces/contribution';
import { RowDataPacket } from 'mysql2';

export const createUser = (req: Request, res: Response) => {
    const { name, email, bio, location, clerkId, logoURL }: User = req.body;
    const  query = 'INSERT INTO Users (name, email, bio, location, clerkid, logoURL) VALUES (?, ?, ?, ?, ?, ?)';

    db.query(query, [name,email,bio,location, clerkId, logoURL], (err, result) => {
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

export const getUserByClerkId = (clerkId: string | string[] | undefined) => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT id FROM Users WHERE clerkId = ?';
        db.query(query, [clerkId], (err, result: any) => {
            if (err) {
                reject(err);
            } else {
                resolve(result[0].id);
            }
        });
    });

}

export const getUserById = async (req: Request, res: Response) => {
    const {clerkId} = req.params;

    const id = await getUserByClerkId(clerkId);

    const query = 'SELECT * FROM Users WHERE id = ?';
    db.query(query, [id], (err, result:any) => {
        if(err) {
            res.status(500).json({message: err.message});
            return;
        }

        res.status(200).json(result[0]);
    });
}

export const updateUser = async (req: Request, res: Response) => {
    const { clerkId } = req.params;

    const id = await getUserByClerkId(clerkId);

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
  
export const deleteUser = async (req: Request, res: Response) => {
    const { clerkId } = req.params;

    const id = await getUserByClerkId(clerkId);

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

export const getStreaks = async (req: Request, res: Response) => {
    const { clerkId } = req.params;

    const userID = await getUserByClerkId(clerkId);

    const query = 'SELECT * FROM Streaks WHERE user_id = ?';

    db.query(query, [userID], (err, result:any) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.status(200).json(result[0]);
    });

};

  
export const updateStreaks = async (req: Request, res: Response) => {

    const { clerkId } = req.params;

    const { highest_streak, highest_streak_from, highest_streak_to, current_streak, current_streak_from, current_streak_to, total_contributions }: Streak = req.body;

    const user_id = await getUserByClerkId(clerkId);

    const query = 'UPDATE Streaks SET highest_streak = ?, highest_streak_from = ?, highest_streak_to = ?, current_streak = ?, current_streak_from = ?, current_streak_to = ?, total_contributions = ? WHERE user_id = ?';

    db.query(query, [highest_streak, highest_streak_from, highest_streak_to, current_streak, current_streak_from, current_streak_to, total_contributions, user_id], (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.status(200).json(result);
    });
};

export const getGraphData = async (req: Request, res: Response) => {
    const { clerkId } = req.params;

    const user_id = await getUserByClerkId(clerkId);
  
    try {
      const contributions: any = await new Promise((resolve, reject) => {
        db.query('SELECT * FROM Contributions WHERE user_id = ?', [user_id], (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        });
      });
  
      
      const languages: any = await new Promise((resolve, reject) => {
        db.query('SELECT * FROM Languages WHERE user_id = ?', [user_id], (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        });
      });
      
  
      const response = {
       "contributions": contributions,
        "languages": languages 
      };
  
      res.status(200).json(response);
  
    } catch (error:any) {
      res.status(500).json({ error: error.message });
    }
  };
  
  export const getContributionsByDate = async (req: Request, res: Response) => {
    const { clerkId } = req.params;
    const { dateFrom, dateTo } = req.query;

    if (!dateFrom || !dateTo) {
        return res.status(400).json({ error: 'Missing dateFrom or dateTo query parameters' });
    }

    const userID = await getUserByClerkId(clerkId);


    try {
        const contributions: any = await new Promise((resolve, reject) => {
            const query = `
                SELECT * 
                FROM Contributions 
                WHERE user_id = ? AND date BETWEEN ? AND ? ORDER BY date ASC
            `;
            db.query(query, [userID, dateFrom, dateTo], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });

        const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        
        const formattedContributions = contributions.reduce((acc: any, contribution: Contributions) => {
            const dateObj = new Date(contribution.date);
            const dayName = dayNames[dateObj.getUTCDay()];
            
            if (!acc[dayName]) {
                acc[dayName] = { private: 0, public: 0 };
            }
            
            if (contribution.type === 'public') {
                acc[dayName].public += contribution.count;
            } else if (contribution.type === 'private') {
                acc[dayName].private += contribution.count;
            }
            return acc;
        }, {});

        res.status(200).json(formattedContributions);


    } catch (error:any) {
        res.status(500).json({ error: error.message });
    }
};


export const getCommunityStats = async (req: Request, res: Response) => {
    const { clerkId } = req.params;

    const user_id = await getUserByClerkId(clerkId);

    const query = 'SELECT * FROM CommunityStats WHERE user_id = ?';

    db.query(query, [user_id], (err, result:any) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.status(200).json(result[0]);
    });
}

export const creditUser = async (req: Request, res: Response) => {
    const { clerkId } = req.params;

    const user_id = await getUserByClerkId(clerkId);

    const query = 'UPDATE CommunityStats SET reputations = reputations + 1 WHERE user_id = ?';

    db.query(query, [user_id], (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.status(200).json(result);
    });
};

export const UpdateContributions = async (req: Request, res: Response) => {
    const { clerkId } = req.params;
    const { date, type } = req.body;

    const user_id = await getUserByClerkId(clerkId);

    const checkQuery = `SELECT * FROM contributions WHERE user_id = ? AND date = ? AND type = ?;`;

    db.query(checkQuery, [user_id, date, type], (err, result: any) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }

        if (result.length === 0) {
            const insertQuery = `
                INSERT INTO contributions (user_id, date, type, count)
                VALUES (?, ?, ?, 1);
            `;

            db.query(insertQuery, [user_id, date, type], (err, result) => {
                if (err) {
                    res.status(500).json({ error: err.message });
                    return;
                }
                res.status(200).json(result);
            });
            return;
        }

        else {

            const updateQuery = `
                UPDATE Contributions SET count = count + 1
                WHERE date = ? AND user_id = ? AND type = ?;
            `;


            db.query(updateQuery, [date, user_id, type], (err, result) => {
                if (err) {
                    res.status(500).json({ error: err.message });
                    return;
                }
                res.status(200).json(result);
            });

        }
    });

    const updateStreaksQuery = `
        UPDATE Streaks SET total_contributions = total_contributions + 1 WHERE user_id = ?;
    `;

    db.query(updateStreaksQuery, [user_id], (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
    });

    const updateCommunityStatsQuery = `
        UPDATE CommunityStats SET contributions = contributions + 1 WHERE user_id = ?;
    `;

    db.query(updateCommunityStatsQuery, [user_id], (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
    });
}