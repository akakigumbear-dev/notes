import express from 'express';
import cors from 'cors';
import routes from './routes/notes.routes';
import router from './routes';

export const app = express();

app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type'],
  })
);

app.use(express.json());

app.get('/', (_req, res) => {
  res.send('Server is running');
});

app.use(router);
