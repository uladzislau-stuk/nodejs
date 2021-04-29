const mongoose = require('mongoose')

const host = 'mongodb://127.0.0.1:27017'
const databaseName = 'task-manager-api'
const url = host + '/' + databaseName;

// build on top of mongodb
mongoose.connect(url, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true
})
