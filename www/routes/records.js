const express = require('express')
const createError = require('http-errors')

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
  const { name, memory, staff, chair } = req.body

  const re = await Record.create({ account, name, memory, staff, chair })
  const record = await Record.find({ account, _id: re._id }).populate('staff').populate('chair')

  console.log(record)

  const io = require('../utils/io').io()
  io.to(account.name).emit('record:create', record)

  return { message: 'success' }
}
