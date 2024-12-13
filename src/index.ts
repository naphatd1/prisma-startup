import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';

const app: Express = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json({ limit: '50mb' }));

app.get('/', (_: Request, res: Response) => {
  res.status(200).json({
    message: 'API VERSION1.0.0',
  });
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
