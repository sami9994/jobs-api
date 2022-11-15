require('dotenv').config()
require('express-async-errors')
//security packages
const helmet = require('helmet')
const cors = require('cors')
const xss = require('xss-clean')
const rateLimiter = require('express-rate-limit')
const express = require('express')
const app = express()

// error handler
const notFoundMiddleware = require('./middleware/not-found')
const errorHandlerMiddleware = require('./middleware/error-handler')
const authRouter = require('./routes/auth.js')
const jobRouter = require('./routes/jobs.js')
const connectDB = require('./db/connect')
const authenticateUser = require('./middleware/authentication')
app.use(express.json())
// extra packages
app.set('trust proxy', 1)
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 100,
  })
)
app.use(helmet())
app.use(cors())
app.use(xss())
// routes

app.use('/api/v1/auth', authRouter)
app.use('/api/v1/jobs', authenticateUser, jobRouter)
app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

const port = process.env.PORT || 3000

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL)
    app.listen(port, () => console.log(`we are on ${port}`))
  } catch (error) {
    console.log(error)
  }
}

start()
