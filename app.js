const express = require('express');
require('dotenv').config();
const morgan = require('morgan');
const app = express();
const path = require('path')
const db = require('./db/database')
const authRoutes = require('./routes/authRoutes')

const port = process.env.PORT;

//veiw engine
app.set('view engine', 'ejs')

app.get('/', (req, res) => {
    res.send("Hello World!")
})

app.use(authRoutes)

//setting static folder
app.use(express.static(path.join(__dirname, 'public')))




app.listen(port, () => console.log(`Your server is running on ${port}`))
