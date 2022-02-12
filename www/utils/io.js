const createError = require('http-errors')
const jwt = require('jsonwebtoken')
const { User, Account } = require('../models')

let io = null

module.exports = {
  io: () => io,
  initialize,
}

function initialize(server) {
  io = require('socket.io')(server, { cookie: true })

  io.sockets.use(async (socket, next) => {
    try {
      const { token, client, accountName } = socket.handshake.query

      socket.join(accountName)
      next()

      // if (client === 'web') {
      //   const decoded = jwt.verify(token, process.env.JWT_SECRET)
      //   const user = await User.findOne({ _id: decoded._id }).populate('account')
      //   if (user) {
      //     socket.join(user.account.name)
      //     next()
      //   } else {
      //     next(createError(400))
      //   }
      // } else if (client === 'unit') {
      //   const account = await Account.findOne({ name: accountName, token: String(token) })
      //   if (account) {
      //     socket.join(accountName)
      //     next()
      //   } else {
      //     next(createError(400))
      //   }
      // }
    } catch (error) {
      next(createError(401))
    }
  })

  return io
}
