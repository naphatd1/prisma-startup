import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import { prisma1, prisma2, prisma3 } from './database/mysql';

// routes
import departmanrRouter from './routes/department-route';
import { Prisma } from '../prisma/generate-client-db3';
import { errorHandler } from './middlewares/error-handler';

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

// localhost:4000/account (SQL Server db3)
app.get("/account", async (_: Request, res: Response) => {
  try {
   // create account
   await prisma3.account.create({
       data: {
           name: 'test2',
           email: 'test2@gmail.com'
       }
   });

   const account = await prisma3.account.findMany();
    res.status(200).json(account);

   } catch (error: any) {
       if (error instanceof Prisma.PrismaClientKnownRequestError) {
           if (error.code === 'P2002') {
                res.status(400).json({
                   error: error.message,
                   details: error.meta?.target,
                   error_thai: 'อีเมล์ซ้ำ กรุณาลองใหม่'
               });
           }
       }
       
       res.status(500).json({message: 'เกิดข้อผิดพลาด กรุณาลองใหม่'});
   }
});

//localhost:4000/api/v1/department
app.use('/api/v1/department', departmanrRouter);

// error middleware ต้องอยู่บรรทัดสุดท้ายของ user ตัวอื่นๆ เสมอ
app.use(errorHandler);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`🏋️‍♀️ Server is running at http://localhost:${port}`);
});
