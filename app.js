const express = require('express');
require('dotenv').config();
const app = express();
const path = require('path')
const db = require('./db')

const port = process.env.PORT;



//setting static folder
app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (req, res) => {
    res.send("Hello World!")
})

app.listen(port, () => console.log(`Your server is running on ${port}`))
