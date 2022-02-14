const { Record } = require('../models')

module.exports = {
  findOne,
  create,
}

async function findOne(req) {
  const account = req.user.account
  const { memory, staff } = req.query
  return await Record.findOne({ account, staff, memory }).sort({ createdAt: -1 })
}

async function create(req) {
  const account = req.user.account

  const re = await Record.create({ account, ...req.body })
  const record = await Record.find({ account, _id: re._id }).populate('staff').populate('chair')

  const io = require('../utils/io').io()
  io.to(account).emit('record:create', record)

  return { message: 'success' }
}
