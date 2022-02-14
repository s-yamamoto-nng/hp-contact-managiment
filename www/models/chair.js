const mongoose = require('mongoose')
const Schema = mongoose.Schema

const schema = new Schema(
  {
    account: { type: String, ref: 'Account' },
    id: { type: String, default: '' },
    name: { type: String, default: '' },
  },
  {
    timestamps: true,
    versionKey: false,
  }
)

schema.index({ account: 1, id: 1, name: 1 })

module.exports = mongoose.model('Chair', schema)
