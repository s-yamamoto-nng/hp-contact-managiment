const express = require('express')
const createError = require('http-errors')

const { Project } = require('../models')

module.exports = { getAll, create, update, remove }

async function remove(req) {
  const account = req.user.account
  let project = await Project.findOne({ _id: req.params.id, account })
  if (!project) throw createError(404)
  return await project.remove()
}

async function update(req) {
  const account = req.user.account
  let project = await Project.findOneAndUpdate({ _id: req.params.id, account }, req.body, {
    new: true,
    runValidators: true,
  })
  if (!project) throw createError(404)

  return project
}

async function getAll(req) {
  const account = req.user.account
  return await Project.find({ account })
}

async function create(req) {
  const account = req.user.account
  const { name } = req.body

  await Project.create({ account, name })

  return { message: 'success' }
}
