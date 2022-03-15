const express = require('express')
const createError = require('http-errors')

const { Project } = require('../models')

module.exports = { getAll, create, update, remove }

async function remove(req) {
  const account = req.user.account
  let project = await Project.findOneAndUpdate({ _id: req.params.id, account }, { deleteFlg: true }, { new: true })
  if (!project) throw createError(404)
  const io = require('../utils/io').io()
  io.to(account).emit('project:remove', project)
  return await project
}

async function update(req) {
  const account = req.user.account
  let project = await Project.findOneAndUpdate({ _id: req.params.id, account }, req.body, {
    new: true,
    runValidators: true,
  })
  if (!project) throw createError(404)
  const io = require('../utils/io').io()
  io.to(account).emit('project:update', project)
  return project
}

async function getAll(req) {
  // const account = req.user.account
  // return await Project.find({ account })
  return await Project.find()
}

async function create(req) {
  const account = req.user.account
  const { name } = req.body
  // await Project.create({ account, name })
  const project = await Project.create({ account, name })
  const io = require('../utils/io').io()
  io.to(account).emit('project:update', project)
  return { message: 'success' }
}
