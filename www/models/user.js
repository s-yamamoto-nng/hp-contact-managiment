const mongoose = require('mongoose')
const validator = require('validator')
const crypto = require('crypto')
const Schema = mongoose.Schema

const schema = new Schema(
  {
    account: { type: String, ref: 'Account' },
    name: { type: String, default: '' },
    email: { type: String, validate: { validator: e => e === '' || validator.isEmail(e) } },
    token: { type: String },
    password: { type: String },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      transform: function (doc, obj) {
        if (!obj.password) obj.nopass = true
        delete obj.password
        delete obj.token
        return obj
      },
    },
  }
)

schema.index({ account: 1, name: 1 })
schema.index({ token: 1 }, { unique: true, sparse: true })

schema.method('cipher', function (password) {
  return crypto.pbkdf2Sync(password, this._id.toString(), 96, 32, 'sha512').toString('hex')
})

schema.method('verify', function (password) {
  return this.password === this.cipher(password)
})

schema.static('generateToken', function () {
  const length = 32
  const chars = 'abcdefghijklmnopqrstuwxyzABCDEFGHIJKLMNOPQRSTUWXYZ0123456789_-'
  const rnd = crypto.randomBytes(length)
  const ret = []
  for (let i = 0; i < length; i++) {
    ret.push(chars[rnd[i] % chars.length])
  }
  return ret.join('')
})

module.exports = mongoose.model('User', schema)
