import { Router } from 'express';

import {
    createUser,
    deleteUser,
    getUserById,
    getUsers,
    updateUser
} from '../controllers/userController';

const router = Router();

const mainRoute = '/users';

router.post(mainRoute, createUser);
router.get(mainRoute, getUsers);
router.get(`${mainRoute}/:id`, getUserById);
router.put(`${mainRoute}/:id`, updateUser);
router.delete(`${mainRoute}/:id`, deleteUser);


export default router;