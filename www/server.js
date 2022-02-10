const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const passport = require('passport')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

require('./utils/connectDB')
require('./utils/jwtStrategy')
require('./utils/localStrategy')
require('./utils/authenticate')

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser(process.env.COOKIE_SECRET))

const whitelist = process.env.WHITELISTED_DOMAINS ? process.env.WHITELISTED_DOMAINS.split(',') : []

const corsOptions = {
  origin(origin, callback) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,
  exposedHeaders: ['set-cookie'],
}

app.use(cors(corsOptions))

app.use(passport.initialize())
app.use(express.static(`${__dirname}/public`))

const server = app.listen(process.env.PORT || 3222, () => {
  console.log('server started at port:', server.address().port)
})

const createError = require('http-errors')
const HttpError = createError.HttpError
const $ = handler => async (req, res) => {
  try {
    const data = await handler(req, res)
    if (!res.headersSent) res.status(200).json(data)
  } catch (err) {
    if (err instanceof HttpError) {
      res.status(err.status).json(err)
    } else if (err.name === 'CastError' && err.kind === 'ObjectId') {
      res.status(404).json({ message: 'Not Found' })
    } else if (err.name === 'ValidationError') {
      const errors = {}
      Object.keys(err.errors).forEach(field => (errors[field] = err.errors[field].message))
      res.status(400).json({ message: err.message, errors })
    } else {
      console.log('Unhandled Error:', err)
      res.status(500).json({ message: 'Internal Server Error' })
    }
  }
}

const { users, chats, staffs, chairs, records } = require('./routes')
const { verifyUser } = require('./utils/authenticate')

app.use('/api/login', passport.authenticate('local'), express.Router().post('/', $(users.login)))
app.use('/api/signup', express.Router().post('/', $(users.signup)))
app.use('/api/refreshToken', express.Router().post('/', $(users.refreshToken)))
app.use('/api/users', verifyUser, express.Router().get('/me', $(users.me)).get('/logout', $(users.logout)))
app.use('/api/chats', verifyUser, express.Router().get('/', $(chats.getAll)).post('/', $(chats.create)))
app.use('/api/records', verifyUser, express.Router().get('/', $(records.findOne)).post('/', $(records.create)))
app.use('/api/staffs', verifyUser, express.Router().get('/', $(staffs.getAll)).post('/', $(staffs.create)).put('/:id', $(staffs.update)).delete('/:id', $(staffs.remove)))
app.use('/api/chairs', verifyUser, express.Router().get('/', $(chairs.getAll)).post('/', $(chairs.create)).put('/:id', $(chairs.update)).delete('/:id', $(chairs.remove)))

require('./utils/io').initialize(server)
