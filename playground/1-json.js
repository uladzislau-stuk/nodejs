const fs = require('fs')

const FILE_NAME = '1-json.json'

const book = {
  id: Math.random() * 1000,
  title: 'my title',
  author: 'vlad stuk'
}

fs.writeFileSync(FILE_NAME, JSON.stringify(book))
// why we call data buffer (what comes back it is not a string, it
// s actually this the way nodejs represent data)
const dataBuffer = fs.readFileSync(FILE_NAME) // return bytes
const dataJSON = dataBuffer.toString() // return data
// const data = JSON.parse(dataJSON)
