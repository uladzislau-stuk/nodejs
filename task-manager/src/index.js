const express = require('express')
require('./db/mongoose')
const User = require('./models/user')

// nodejs % curl -X POST -H "Content-Type: application/json" -d '{"name": "Vlad"}'  http://127.0.0.1:3000/users

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())

app.post('/users', async (req, res) => {
  try {
    const user = new User(req.body)
    await user.save()
    res.send(user)
  } catch (e) {
    res.status(400).send(e)
  }
})

app.listen(port, () => {
  console.log('Server is up on port ' + port)
})
