const mongoose = require('mongoose')
const Schema = mongoose.Schema

const schema = new Schema(
  {
    account: { type: String, ref: 'Account' },
    name: { type: String, default: '' },
    deleteFlg: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    versionKey: false,
  }
)

schema.index({ account: 1, name: 1 })

module.exports = mongoose.model('Project', schema)
