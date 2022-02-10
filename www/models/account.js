const mongoose = require('mongoose')
const Schema = mongoose.Schema

const schema = new Schema(
  {
    name: { type: String, required: true },
    token: { type: String, default: '12345' },
  },
  {
    timestamps: true,
    versionKey: false,
  }
)

schema.index({ name: 1, token: 1 })

module.exports = mongoose.model('Account', schema)
