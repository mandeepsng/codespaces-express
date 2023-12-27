const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World3333!')
})

app.get('/demo', (req, res) => {
  res.send('demo testing!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
