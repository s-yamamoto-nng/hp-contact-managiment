const createError = require('http-errors')
const { User, Account } = require('../models')

let io = null

module.exports = {
  io: () => io,
  initialize,
}

function initialize(server) {
  io = require('socket.io')(server, { cookie: false })

  io.sockets.use(async (socket, next) => {
    try {
      const { id, token, accountName, client } = socket.handshake.query
      if (client === 'unit') {
        if (await Account.findOne({ _id: accountName, token })) {
          socket.join(accountName)
          next()
        } else {
          next(createError(400))
        }
      } else {
        if (await User.findOne({ _id: id, token })) {
          socket.join(accountName)
          next()
        } else {
          next(createError(400))
        }
      }
    } catch (error) {
      next(createError(401))
    }
  })

  return io
}
