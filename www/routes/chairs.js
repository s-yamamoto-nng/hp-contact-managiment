const express = require('express')
const createError = require('http-errors')

const { Chair } = require('../models')

module.exports = {
  getAll,
  create,
  update,
  remove,
}

async function remove(req) {
  const account = req.user.account
  let staff = await Chair.findOne({ _id: req.params.id, account })
  if (!staff) throw createError(404)

  const io = require('../utils/io').io()
  io.to(account).emit('chair:remove', staff)

  return await staff.remove()
}

async function update(req) {
  const account = req.user.account
  const chair = await Chair.findOneAndUpdate({ _id: req.params.id, account }, req.body, {
    new: true,
    runValidators: true,
  })
  if (!chair) throw createError(404)

  const re = await Chair.findOne({ _id: req.params.id, account })

  const io = require('../utils/io').io()
  io.to(account).emit('chair:update', re)

  return re
}

async function getAll(req) {
  const account = req.user.account
  return await Chair.find({ account })
}

async function create(req) {
  const account = req.user.account
  const { name, id } = req.body

  const staff = await Chair.create({ account, name, id })

  const io = require('../utils/io').io()
  io.to(account).emit('chair:update', staff)

  return { message: 'success' }
}
