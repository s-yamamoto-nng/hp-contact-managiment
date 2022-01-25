const mongoose = require('mongoose')
const Schema = mongoose.Schema

const schema = new Schema(
  {
    account: { type: Schema.Types.ObjectId, ref: 'Account' },
    text: { type: String, required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
)

schema.index({ account: 1 })

module.exports = mongoose.model('Chat', schema)
