const express = require('express')
const createError = require('http-errors')

const { User, Account } = require('../models')

module.exports = {
  signup,
  login,
  resetPassword,
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

async function login(req) {
  const { email, password, token } = req.body

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
