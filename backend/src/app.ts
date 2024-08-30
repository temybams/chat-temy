import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors'
import dotenv from 'dotenv'
import routes from './routes'
import connectDB from './config/dbConfig';
import { IError } from './types/error.types';
import { errorHandler } from './middlewares'
const app = express();

dotenv.config();
connectDB();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    methods: ['GET', 'POST'],
  }),
)
app.use(express.json())

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, Express with TypeScript!');
});

app.use('/', routes)

app.use((req: Request, res: Response, next: NextFunction) => {
  const error: IError = new Error(
    `API Endpoint Not found - ${req.originalUrl}`,
  )
  error.status = 404
  next(error)
})
app.use(errorHandler)


app.listen(process.env.PORT, async () => {
  console.log(`Server is running on port: ${process.env.PORT}`);
});
