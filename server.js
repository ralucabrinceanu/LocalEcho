import 'express-async-errors' // try catch
import * as dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import cors from 'cors'
const app = express()

import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import cloudinary from 'cloudinary'

// routers
import venueRouter from './routes/venueRouter.js'
import authRouter from './routes/authRouter.js'
import eventRouter from './routes/eventRouter.js'
import reviewRouter from './routes/reviewRouter.js'
import userRouter from './routes/userRouter.js'
import testimonialRouter from './routes/testimonialRouter.js'

// public
import { dirname } from 'path'
import { fileURLToPath } from 'url'
import path from 'path'

// middleware
import errorHandlerMiddleware from './middleware/error-handler.js'
import { authenticateUser } from './middleware/auth-middleware.js'

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
})

const __dirname = dirname(fileURLToPath(import.meta.url))

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true,
}

app.use(cors(corsOptions))
app.use(express.static(path.resolve(__dirname, './public')))
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
// app.use('/project/reviews', authenticateUser, reviewRouter)
app.use('/project/users', userRouter)
app.use('/project/testimonials', testimonialRouter)

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, './public', 'index.html'))
})

app.use('*', (req, res) => {
  res.status(404).json({ msg: 'not found' })
})

app.use(errorHandlerMiddleware)

const port = process.env.PORT || 5000

app.listen(port, () => {
  console.log(`Server is listening on port ${port}...`)
})
