const express = require('express')
const app = express()
const bcrypt = require('bcryptjs') 
const PORT = process.env.PORT || 8000

// Body Parser
app.use(express.json())
app.use(express.urlencoded({extended: false}))

// Set my template engine as EJS
app.set('view engine', 'ejs')
// app.set('views', './example') // set the views folder to a different name

// Set public folder as our static folder
app.use(express.static('public'))

// Homepage displays all schedules
app.get('/', (req, res) => {
    res.render('/pages/index')
}) 

// Signup Page
app.get('/signup', (req, res) => {
    res.render('pages/signup')
})

app.post('/signup', (req, res) => {
    const {firstname, lastname, email, password} = req.body
    const salt = bcrypt.genSaltSync(10)
    const hash = bcrypt.hashSync(password, salt)
    const newUser = {
        firstname,
        lastname,
        email,
        password: hash
    }
    data.users.push(newUser)
    res.redirect('/login')
})



// PORT rquest
app.listen(PORT, () => {console.log(`You're doing amazing! App is listening at http://localhost:${PORT}`)
})
