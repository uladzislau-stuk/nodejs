const express = require('express')
require('./db/mongoose')

const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express()
const port = process.env.PORT || 3000

// Without middleware: new request -> run route handler
// With middleware: new request -> do something -> run route handle
// app.use((req, res, next) => {
//   // console.log(req.method, req.path)
//   if (req.method === 'GET') {
//     res.send('GET requests are disabled')
//   } else {
//     next()
//   }
// })

// register middleware for maintanance mode
// app.use((req, res, next) => {
//   res.status(503).send('Site is currently down. Check back soon!')
// })

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

app.listen(port, () => {
  console.log('Server is up on port ' + port)
})

// const jwt = require('jsonwebtoken')
//
// const myFunction = async () => {
//   const token = jwt.sign({ _id: 'abc123' }, 'thisismynewcourse', {
//     expiresIn: '7 days'
//   })
//   // token is 3 parts
//   // 1 part is known as a header, contains meta information what type of token is used
//   // 2 base64 from data we provided
//   // 3 used to verify token
//
//   // main point of jwt is to create data that verifiable via signature
//   // in our case 'thisismynewcourse'
//
//   console.log(token)
//   // verify token
//   const data = jwt.verify(token, 'thisismynewcourse')
// }
//
// myFunction()
