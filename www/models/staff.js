const mongoose = require('mongoose')
const Schema = mongoose.Schema

const memory = new Schema({
  name: { type: String, default: '' },
})

const schema = new Schema(
  {
    account: { type: Schema.Types.ObjectId, ref: 'Account' },
    name: { type: String, default: '' },
  },
  {
    timestamps: true,
    versionKey: false,
  }
)

schema.index({ account: 1 })

module.exports = mongoose.model('Staff', schema)
