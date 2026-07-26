import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import path from 'node:path';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { listsRouter } from './routes/lists.js';
import { usersRouter } from './routes/users.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const clientOrigins = (
  process.env.CLIENT_ORIGIN ?? 'http://localhost:5173'
)
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

export function createApp() {
  const app = express();

  app.use(
    helmet({
      contentSecurityPolicy: false,
      crossOriginEmbedderPolicy: false,
    }),
  );
  app.use(
    cors({
      origin: clientOrigins,
      methods: ['GET', 'POST', 'PUT'],
    }),
  );
  app.use(express.json({ limit: '32kb' }));

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true });
  });

  app.use('/api/users', usersRouter);
  app.use('/api/lists', listsRouter);

  const clientDist = path.resolve(__dirname, '../../client/dist');
  if (existsSync(clientDist)) {
    app.use(express.static(clientDist));
    app.get('/{*splat}', (req, res, next) => {
      if (req.path.startsWith('/api')) {
        next();
        return;
      }
      res.sendFile(path.join(clientDist, 'index.html'), (err) => {
        if (err) next();
      });
    });
  }

  app.use(
    (
      err: unknown,
      _req: express.Request,
      res: express.Response,
      _next: express.NextFunction,
    ) => {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    },
  );

  return app;
}
