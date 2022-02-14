const mongoose = require('mongoose')
const Schema = mongoose.Schema

const schema = new Schema(
  {
    _id: { type: String },
    token: { type: String, default: '12345' },
  },
  {
    timestamps: true,
    versionKey: false,
  }
)

schema.index({ name: 1, token: 1 })

module.exports = mongoose.model('Account', schema)
