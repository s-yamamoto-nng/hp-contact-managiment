const express = require('express')
const createError = require('http-errors')

const { User, Account } = require('../models')

module.exports = {
  signup,
  login,
  resetPassword,
  getAll,
  userRequest,
  userApproval,
  removeUser,
}

async function resetPassword(req) {
  const { email, password } = req.body
  if (!email || !password) {
    throw createError(400)
  }
  let user = await User.findOne({ email })
  if (!user) {
    throw createError(401)
  }
  user.password = user.cipher(password)
  user.token = User.generateToken()
  await user.save()
  return { success: true }
}

async function removeUser(req) {
  let user = await User.findOne({ _id: req.params.id })
  let account = await Account.findOne({ _id: user.account })
  if (!user) throw createError(404)
  if (!account) throw createError(404)
  const io = require('../utils/io').io()
  io.to(account).emit('user:remove', user)
  io.to(account).emit('account:remove', account)
  await account.remove()
  return await user.remove()
}

async function userRequest(req) {
  let user = await User.findOne({ _id: req.params.id })
  user.userRequest = true
  await user.save()
  return { success: true }
}

async function userApproval(req) {
  const { email, password } = req.body

  if (!email || !password) {
    throw createError(400)
  }

  let user = await User.findOne({ email })
  if (!user) {
    throw createError(401)
  }
  user.userRequest = false
  await user.save()

  return { success: true }
}

async function login(req) {
  const { email, password, token } = req.body
  const userFlg = await User.find({ userRequest: false, email: email })
  const userNew = await User.find({ userRequest: null, email: email })
  if (userFlg.length !== 0 || userNew.length !== 0) {
    throw createError(401)
  }
  let user
  if (email && password) {
    user = await User.findOne({ email })
    if (!user || !user.verify(password)) {
      throw createError(401)
    }
  } else if (!email && !password && token) {
    user = await User.findOne({ token })
  }

  if (!user) throw createError(401)
  user = user.toObject({
    transform: (doc, obj) => {
      delete obj.password
      return obj
    },
  })

  return { success: true, user, token }
}

async function getAll() {
  return await User.find()
}

async function signup(req) {
  const { email, password, accountName } = req.body

  if (!email || !password || !accountName) {
    throw createError(400)
  }

  let account = await Account.findOne({ _id: accountName })
  if (account) {
    throw createError(401, 'このアカウント名はすでに使用されています')
  }

  let user = await User.findOne({ email })
  if (user) {
    throw createError(401, 'このメールアドレスはすでに使用されています')
  }

  // アカウント作成
  account = await Account.create({ _id: accountName })

  // ユーザー作成
  user = await new User({ email })
  user.password = user.cipher(password)
  user.account = accountName
  user.token = User.generateToken()
  await user.save()

  return { success: true, user }
}
