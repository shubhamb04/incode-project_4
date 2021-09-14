const express = require('express');
require('dotenv').config();
const morgan = require('morgan');
const session = require("express-session")
const app = express();
const path = require('path')
const signupRouter = require('./routes/signup');
const loginRouter = require('./routes/login');
const homeRouter = require('./routes/home');
const logoutRouter = require('./routes/logout')
const bodyParser = require('body-parser')
const {redirectToHome, redirectToLogin} = require('./middleware')

const port = process.env.PORT;

//veiw engine
app.set('view engine', 'ejs')

//middlewares
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }))

//session config
app.use(session({
    cookie: {
        maxAge: 1000 * 60 * 60 * 24
    },
    name: "schedule_sid",
    resave: false,
    saveUninitialized: false,
    secret: process.env.SESS_SECRET
}));

// app.get('/', (req, res) => {
//     res.render('../view/pages/login')
// })

//routes middleware
app.use((req, res, next) => {
    res.locals.session = req.session.userId;
    next();
    
})
app.use('/signup', redirectToHome,  signupRouter);
app.use('/login', redirectToHome, loginRouter);
app.use('/logout', redirectToLogin, logoutRouter)
app.use('/', homeRouter);

//setting static folder
app.use(express.static(path.join(__dirname, 'public')))




app.listen(port, () => console.log(`Your server is running on ${port}`))
