import 'express-async-errors' // try catch
import * as dotenv from 'dotenv'
dotenv.config()

import express from 'express'
const app = express()

import morgan from 'morgan'
import cookieParser from 'cookie-parser'

// routers
import venueRouter from './routes/venueRouter.js'
import authRouter from './routes/authRouter.js'
import eventRouter from './routes/eventRouter.js'
import ratingRouter from './routes/ratingRouter.js'
import reviewRouter from './routes/reviewRouter.js'
import userRouter from './routes/userRouter.js'

// middleware
import errorHandlerMiddleware from './middleware/error-handler.js'
import { authenticateUser } from './middleware/auth-middleware.js'

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

app.use(express.json())
app.use(cookieParser(process.env.JWT_SECRET))

app.get('/', (req, res) => {
  res.send('hello world')
})

// frontend
app.get('/project/test', (req, res) => {
  res.json({ msg: 'test route' })
})

// routes
app.use('/project/venues', venueRouter)
app.use('/project/auth', authRouter)
app.use('/project/events', eventRouter)
app.use('/project/ratings', authenticateUser, ratingRouter)
app.use('/project/reviews', authenticateUser, reviewRouter)
app.use('/project/users', authenticateUser, userRouter)

app.use('*', (req, res) => {
  res.status(404).json({ msg: 'not found' })
})

app.use(errorHandlerMiddleware)

const port = process.env.PORT || 5000

app.listen(port, () => {
  console.log(`Server is listening on port ${port}...`)
})