import { Router } from 'express';
import indexRouter from './index.router.js';
import authRouter from './auth.route.js';
import usersRouter from './users.route.js';
import leaderboardRouter from './leaderboard.route.js';
import clansRouter from './clans.route.js';
import paymentsRouter from './payments.route.js';

const router = Router();
router.use('/', indexRouter);
router.use('/auth', authRouter);
router.use('/users', usersRouter);
router.use('/leaderboard', leaderboardRouter);
router.use('/clans', clansRouter);
router.use('/payments', paymentsRouter);

export default router;
