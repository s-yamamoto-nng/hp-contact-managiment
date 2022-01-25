const mongoose = require('mongoose')

const connect = mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  retryWrites: false,
})
connect
  .then(() => {
    console.log('connected to db')
  })
  .catch(err => {
    console.log(err)
  })
