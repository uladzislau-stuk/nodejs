import express from 'express';

const app = express();

app.get('', (req, res) => {
  res.send('Hello express!')
})

app.get('/help', (req, res) => {
  res.send({
    name: 'Vlad',
    age: 27
  })
})

app.get('/about', (req, res) => {
  res.send('About page')
})

app.get('/weather', (req, res) => {
  res.send('<h1>Weather</h1>>')
})

// app.com/help
// app.com/about
app.listen(3000, () => {
  console.log('Server is up on port 3000.')
})
