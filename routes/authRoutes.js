const { Router } = require('express')
const authController = require('../controller/authController')
const router = Router();
const db = require("../db/database")
const { check, validationResult } = require("express-validator")
const bcrypt = require("bcryptjs")

router.get('/signup',  (req, res) => {
    res.render('../view/pages/signup')
})



router.get('/login', (req, res) => {
    res.render('../view/pages/login')
})

router.post('/signup', [
    check("firstname", "Please enter atleast 3 character!").isLength({ min: 3 }).trim(),
    check("lastname", "Please enter atleast 3 character!").isLength({ min: 3 }).trim(),
    check("email", "Please enter valid email!").isEmail().normalizeEmail().trim(),
    check("password", "Please enter valid password(Min: 8 Characters)!").isLength({ min: 8 }).trim(),
    check("confirm_password", "Password does not match!").equals("password").trim()
],async (req, res) => {
    try {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            
            const errMsgs = errors.array();
            console.log(errMsgs);
            res.render('../view/pages/signup', {errMsgs})
        }

        //destructure the inputs
        const { firstname, lastname, email, password, confirm_password } = req.body;


        //check if user already exists in db
        const user = await db.any("SELECT * FROM users WHERE email = $1", [email]);

        if (user.length !== 0) {
            return res.status(401).send("User already exist!")
        }
        
        //bcrypt the password
        const hash = await bcrypt.hash(password, 10)

        res.json({firstname, lastname, email, password})
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Server Error")
    }
})

router.post('/login', (req, res) => {
    const { email, password } = req.body;
    res.send(req.body)
})

module.exports = router;