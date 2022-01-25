const express = require('express')
const createError = require('http-errors')

const jwt = require('jsonwebtoken')
const { User, Account } = require('../models')

const { getToken, COOKIE_OPTIONS, getRefreshToken } = require('../utils/authenticate')

module.exports = {
  signup,
  login,
  refreshToken,
  logout,
  me,
}

async function me(req) {
  return req.user
}

async function logout(req, res) {
  const { signedCookies = {} } = req
  const { refreshToken } = signedCookies

  const user = await User.findById(req.user._id)
  if (!user) createError(401)

  const tokenIndex = user.refreshToken.findIndex(item => item.refreshToken === refreshToken)
  if (tokenIndex !== -1) {
    user.refreshToken.id(user.refreshToken[tokenIndex]._id).remove()
    await user.save()
  }

  res.clearCookie('refreshToken', COOKIE_OPTIONS)
  return { success: true }
}

async function refreshToken(req, res) {
  const { signedCookies = {} } = req
  const { refreshToken } = signedCookies
  if (refreshToken) {
    const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
    const userId = payload._id
    const user = await User.findOne({ _id: userId }).populate('account')
    if (!user) throw createError(401)

    const tokenIndex = user.refreshToken.findIndex(item => item.refreshToken === refreshToken)

    if (tokenIndex === -1) {
      throw createError(401)
    } else {
      const token = getToken({ _id: userId })
      const newRefreshToken = getRefreshToken({ _id: userId })
      user.refreshToken[tokenIndex] = { refreshToken: newRefreshToken }
      user.save()
      res.cookie('refreshToken', newRefreshToken, COOKIE_OPTIONS)
      return { success: true, user, token }
    }
  } else {
    throw createError(401)
  }
}

async function login(req, res) {
  const token = getToken({ _id: req.user._id })
  const refreshToken = getRefreshToken({ _id: req.user._id })
  const user = await User.findById(req.user._id).populate('account').populate('useAccounts.account')
  if (!user) throw createError(401)

  user.refreshToken.push({ refreshToken })
  user.save()

  res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS)
  return { success: true, user, token }
}

async function signup(req, res) {
  const { username, password, accountName } = req.body

  if (!username || !password || !accountName) {
    throw createError(400, 'not enough data')
  }

  let account = await Account.findOne({ name: accountName })
  if (account) {
    throw createError(400, 'このアカウント名は、すでに使用されています')
  }

  let user = await User.findOne({ username })
  if (user) {
    throw createError(400, 'このEメールアドレスは、すでに使用されています')
  }

  // アカウント作成
  account = await Account.create({ name: accountName })
  const accounts = []
  accounts.push({
    admin: true,
    default: true,
    account,
  })

  // ユーザー作成
  user = await User.register(new User({ username }), password)
  const token = getToken({ _id: user._id })
  const refreshToken = getRefreshToken({ _id: user._id })
  user.refreshToken.push({ refreshToken })
  user.account = account
  user.useAccounts = accounts
  user.save()

  res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS)
  return { success: true, user, token }
}
