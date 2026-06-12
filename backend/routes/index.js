import { Router } from 'express';
import index from './index.js';
import auth from './auth.js';
import users from './users.js';
import leaderboard from './leaderboard.js';
import clans from './clans.js';
import payments from './payments.js';

const router = Router();
router.use('/', index);
router.use('/auth', auth);
router.use('/users', users);
router.use('/leaderboard', leaderboard);
router.use('/clans', clans);
router.use('/payments', payments);

export default router;
