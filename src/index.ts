import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import { prisma1, prisma2, prisma3 } from './database/mysql';

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

app.get('/user', async (_: Request, res: Response) => {
  const user = await prisma1.user.findMany({
    orderBy: {
      id: 'desc',
    },
  });
  res.status(200).json({
    data: user,
  });
});

app.get('/customer', async (_: Request, res: Response) => {
  const customer = await prisma2.customer.findMany({
    orderBy: {
      id: 'desc',
    },
  });
  res.status(200).json({
    data: customer,
  });
});

app.get('/admin', async (_: Request, res: Response) => {
  const admin = await prisma3.admin.findMany({
    orderBy: {
      id: 'desc',
    },
  });
  res.status(200).json({
    data: admin,
  });
});

app.get('/account', async (_: Request, res: Response) => {
  try {
    await prisma3.account.create({
      data: {
        name: 'test',
        email: 'naphat.d@gmail.com',
      },
    });
    const account = await prisma3.account.findMany({
      orderBy: { id: 'desc' },
    });
    res.status(200).json({
      data: account,
    });
  } catch (error: any) {
    if (error.code === 'P2002') {
      res.status(400).json({ message: error.message });
    } 
  }
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`🏋️‍♀️ Server is running at http://localhost:${port}`);
});
