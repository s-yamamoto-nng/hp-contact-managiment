const mongoose = require('mongoose')
const Schema = mongoose.Schema

const schema = new Schema(
  {
    account: { type: String, ref: 'Account' },
    projectName: { type: String, default: '' },
    title: { type: String, default: '' },
    description: { type: String, default: '' },
    readFlg: { type: Boolean, default: false },
    deleteFlg: { type: Boolean, defaul: false },
  },
  {
    timestamps: true,
    versionKey: false,
  }
)

schema.index({ account: 1, projectName: 1, title: 1, description: 1 })

module.exports = mongoose.model('Task', schema)
