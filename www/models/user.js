const mongoose = require('mongoose')
const Schema = mongoose.Schema

const passportLocalMongoose = require('passport-local-mongoose')

const Session = new Schema({
  refreshToken: {
    type: String,
    default: '',
  },
})

const Account = new Schema(
  {
    admin: { type: Boolean, default: false },
    default: { type: Boolean, default: false },
    account: { type: Schema.Types.ObjectId, ref: 'Account' },
  },
  {
    timestamps: true,
    versionKey: false,
  }
)

const schema = new Schema({
  name: { type: String, default: '' },
  account: { type: Schema.Types.ObjectId, ref: 'Account' },
  authStrategy: { type: String, default: 'local' },
  refreshToken: { type: [Session] },
  useAccounts: [Account],
})

schema.set('toJSON', {
  transform(doc, ret, options) {
    delete ret.refreshToken
    return ret
  },
})

schema.index({ account: 1, name: 1 })

schema.plugin(passportLocalMongoose)

module.exports = mongoose.model('User', schema)
