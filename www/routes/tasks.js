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
  return await task.remove()
}

async function update(req) {
  const account = req.user.account
  let task = await Task.findOneAndUpdate({ _id: req.params.id, account }, req.body, {
    new: true,
    runValidators: true,
  })
  if (!task) throw createError(404)

  return task
}

async function getAll(req) {
  const account = req.user.account
  return await Task.find({ account })
}

async function create(req) {
  const account = req.user.account
  const { name } = req.body

  await Task.create({ account, name })

  return { message: 'success' }
}
