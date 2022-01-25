const mongoose = require('mongoose')
const Schema = mongoose.Schema

const schema = new Schema(
  {
    account: { type: Schema.Types.ObjectId, ref: 'Account' },
    name: { type: String, default: '' },
    memory: { type: String, default: '' },
    staff: { type: Schema.Types.ObjectId, ref: 'Staff' },
    chair: { type: Schema.Types.ObjectId, ref: 'Chair' },
  },
  {
    timestamps: true,
    versionKey: false,
  }
)

schema.index({ account: 1 })

module.exports = mongoose.model('Record', schema)
