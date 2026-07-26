import { Router } from 'express';
import { getListForUser, setListForUser } from '../store/jsonStore.js';
import type { ListKind } from '../types.js';
import { listKindSchema, putListSchema } from '../validation.js';

export const listsRouter = Router();

listsRouter.get('/:kind', async (req, res, next) => {
  try {
    const kindResult = listKindSchema.safeParse(req.params.kind);
    if (!kindResult.success) {
      res.status(400).json({ error: 'Invalid list kind' });
      return;
    }
    const userId = Number(req.query.userId);
    if (!Number.isInteger(userId) || userId < 1) {
      res.status(400).json({ error: 'userId query parameter is required' });
      return;
    }
    const bucket = await getListForUser(kindResult.data as ListKind, userId);
    res.json({ kind: kindResult.data, userId, bucket });
  } catch (err) {
    next(err);
  }
});

listsRouter.put('/:kind', async (req, res, next) => {
  try {
    const kindResult = listKindSchema.safeParse(req.params.kind);
    if (!kindResult.success) {
      res.status(400).json({ error: 'Invalid list kind' });
      return;
    }
    const bodyResult = putListSchema.safeParse(req.body);
    if (!bodyResult.success) {
      res.status(400).json({ error: bodyResult.error.issues[0]?.message ?? 'Invalid body' });
      return;
    }
    const bucket = await setListForUser(
      kindResult.data as ListKind,
      bodyResult.data.userId,
      bodyResult.data.bucket,
    );
    res.json({ kind: kindResult.data, userId: bodyResult.data.userId, bucket });
  } catch (err) {
    const status = (err as { status?: number }).status ?? 500;
    if (status === 404) {
      res.status(404).json({ error: (err as Error).message });
      return;
    }
    next(err);
  }
});
