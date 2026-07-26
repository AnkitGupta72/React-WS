import { Router } from 'express';
import { addUser, getUsers } from '../store/jsonStore.js';
import { createUserSchema } from '../validation.js';

export const usersRouter = Router();

usersRouter.get('/', async (_req, res, next) => {
  try {
    const users = await getUsers();
    res.json({ users });
  } catch (err) {
    next(err);
  }
});

usersRouter.post('/', async (req, res, next) => {
  try {
    const parsed = createUserSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.issues[0]?.message ?? 'Invalid body' });
      return;
    }
    const user = await addUser(parsed.data.name);
    res.status(201).json({ user });
  } catch (err) {
    next(err);
  }
});
