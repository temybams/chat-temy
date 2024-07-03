import createError, { HttpError } from 'http-errors';
import express, { Request, Response, NextFunction, Application } from 'express';
import path from 'path';
import dotenv from 'dotenv';
import cookieSession from 'cookie-session';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from 'cors';

import usersRouter from './routes/usersRoutes';
import indexRouter from './routes/indexRoutes';

dotenv.config();
const app: Application = express();


// view engine setup
app.set('views', path.join(__dirname, '..', 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '..', 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);


// catch 404 and forward to error handler
app.use((req: Request, res: Response, next: NextFunction) => {
  next(createError(404));
});

// error handler
app.use((err: HttpError, req: Request, res: Response) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

export default app;
