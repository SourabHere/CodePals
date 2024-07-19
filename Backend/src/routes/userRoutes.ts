import { Router } from 'express';

import {
    createUser,
    deleteUser,
    getUserById,
    getUsers,
    updateUser,
    getGraphData,
    updateStreaks,
    getStreaks,
    getContributionsByDate,
    getCommunityStats,
    creditUser,
    UpdateContributions
} from '../controllers/userController';

import { addUserToRoom, getUserInRoom } from '../controllers/roomController';

import { getPosts, addNewPost, getPostPriorities, getPostsByUserId, resolvePost } from '../controllers/postController';

const router = Router();

const mainRoute = '/users';

router.get(mainRoute, getUsers);
router.post(mainRoute, createUser);
router.get(`${mainRoute}/:clerkId`, getUserById);
router.put(`${mainRoute}/:clerkId`, updateUser);
router.delete(`${mainRoute}/:clerkId`, deleteUser);
router.get(`${mainRoute}/graphData/:clerkId`, getGraphData);
router.get(`${mainRoute}/contributionsByDate/:clerkId`, getContributionsByDate);

router.put(`${mainRoute}/contributions/:clerkId`, UpdateContributions);

router.get(`${mainRoute}/streaks/:clerkId`, getStreaks);
router.put(`${mainRoute}/streaks/:clerkId`, updateStreaks);

router.get(`${mainRoute}/community/:clerkId`, getCommunityStats);
router.put(`${mainRoute}/community/:clerkId`, creditUser);


router.get(`${mainRoute}/public/posts`, getPosts);
router.get(`${mainRoute}/posts/priorities`, getPostPriorities);
router.post(`${mainRoute}/:clerkId/posts`, addNewPost);
router.get(`${mainRoute}/:clerkId/posts`, getPostsByUserId);

const roomRoute = '/rooms';

router.post(`${roomRoute}/:roomId/:clerkId`, addUserToRoom);
router.get(`${roomRoute}/:roomId`, getUserInRoom);



const postRoute = '/posts';

router.patch(`${postRoute}/resolve/:clerkId/:postId`, resolvePost);

export default router;