const express = require('express')
const createError = require('http-errors')

const { Task } = require('../models')

module.exports = {
  getAll,
  create,
  update,
  remove,
}

async function remove(req) {
  const account = req.user.account
  let task = await Task.findOne({ _id: req.params.id, account })
  if (!task) throw createError(404)
  const io = require('../utils/io').io()
  io.to(account).emit('task:remove', task)
  return await task.remove()
}

async function update(req) {
  const account = req.user.account
  let task = await Task.findOneAndUpdate({ _id: req.params.id, account }, req.body, {
    new: true,
    runValidators: true,
  })
  if (!task) throw createError(404)
  const io = require('../utils/io').io()
  io.to(account).emit('task:update', task)
  return task
}

async function getAll(req) {
  // const account = req.user.account
  // return await Task.find({ account })
  return await Task.find()
}

async function create(req) {
  const account = req.user.account
  const { projectName, title, description } = req.body
  const task = await Task.create({ account, projectName, title, description })
  const io = require('../utils/io').io()
  io.to(account).emit('task:update', task)
  return { message: 'success' }
}
