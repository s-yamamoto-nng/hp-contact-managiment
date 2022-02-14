const express = require('express')
const createError = require('http-errors')

const { Staff } = require('../models')

module.exports = {
  getAll,
  create,
  update,
  remove,
}

async function remove(req) {
  const account = req.user.account
  let staff = await Staff.findOne({ _id: req.params.id, account })
  if (!staff) throw createError(404)

  const io = require('../utils/io').io()
  io.to(account).emit('staff:remove', staff)

  return await staff.remove()
}

async function update(req) {
  const account = req.user.account
  let staff = await Staff.findOneAndUpdate({ _id: req.params.id, account }, req.body, {
    new: true,
    runValidators: true,
  })
  if (!staff) throw createError(404)

  const io = require('../utils/io').io()
  io.to(account).emit('staff:update', staff)

  return staff
}

async function getAll(req) {
  const account = req.user.account
  return await Staff.find({ account })
}

async function create(req) {
  const account = req.user.account
  const { name } = req.body

  const staff = await Staff.create({ account, name })

  const io = require('../utils/io').io()
  io.to(account).emit('staff:update', staff)

  return { message: 'success' }
}
