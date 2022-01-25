const express = require('express')
const createError = require('http-errors')

const { Chat } = require('../models')

module.exports = {
  getAll,
  create,
}

async function getAll(req) {
  const account = req.user.account
  return await Chat.find({ account })
}

async function create(req) {
  const account = req.user.account
  const { text } = req.body

  const chat = await Chat.create({ account, text })

  const io = require('../utils/io').io()
  io.to(account.name).emit('chat:update', chat)

  return { message: 'success' }
}
