const express = require('express')
const app = express()
const port = 3000
const morgan = require('morgan');
const connection = require('./connectionWithSequelize.js')

app.use(express.json())
app.use(express.static(__dirname + '/../client/dist'));
app.use(morgan('dev'));

app.get('/api/options', (req, res) => {
  connection.OptionsModel.findAll({})
  .then((product) => {
    console.log("yo from server")
    console.log(product)
    res.status(200).send(product)
  })
  .catch((err)=>{
    res.status(404).send(err)
  })
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})