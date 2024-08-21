import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from './config/dbConfig';
import { IError } from './types/error.types';
const app = express();



dotenv.config();
connectDB();

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, Express with TypeScript!');
});

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    methods: ['GET', 'POST'],
  }),
)
app.use(express.json())
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to NodeJs Backend',
  })
})

app.post('/data', (req: Request, res: Response) => {
  res.json(req.body);
});
app.use((req: Request, res: Response, next: NextFunction) => {
  const error: IError = new Error(
    `API Endpoint Not found - ${req.originalUrl}`,
  )
  error.status = 404
  next(error)
})
// app.use('/', routes)

app.listen(process.env.PORT, async () => {
  console.log(`Server is running on port: ${process.env.PORT}`);
});
