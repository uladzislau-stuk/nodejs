const express = require('express')
const path = require('path')
const hbs = require('hbs')

const app = express()

// Define paths for Express config
// const publicDirectoryPath = path.join(__dirname, '../public')
const viewsDirectoryPath = path.join(__dirname, '../templates/views')
const partialsDirectoryPath = path.join(__dirname, '../templates/partials')

// Show express which templating engine to use
app.set('view engine', 'hbs')
// By default express searches files in view directory
app.set('views', viewsDirectoryPath)
hbs.registerPartials(partialsDirectoryPath)

// Setup static directory to serve
// app.use(express.static(publicDirectoryPath))

app.get('', (req, res) => {
  // It should match the name of template we created in a views folder
  res.render('index', {
    title: 'Index.hbs',
    name: `I'm index hbs`
  })
})

app.get('/help', (req, res) => {
  res.send({
    name: 'Vlad',
    age: 27
  })
})

app.get('/about', (req, res) => {
  res.render('about', {
    title: 'About',
    name: `I'm about hbs`
  })
})

app.get('/weather', (req, res) => {
  if (!req.query.city) {
    return res.send({
      error: 'You must provide a city'
    })
  }
  console.log(req.query)
  res.send('<h1>Weather</h1>')
})

app.get('/help/*', (req, res) => {
  res.send('<h1>Help article not found</h1>')
})

app.get('*', (req, res) => {
  res.send('<h1>404 page</h1>')
})

// app.com/help
// app.com/about
app.listen(3000, () => {
  console.log('Server is up on port 3000.')
})
