const db = require("../db/database")

module.exports.signup_get = (req, res) => {
    res.render('../view/pages/signup')
}

module.exports.login_get = (req, res) => {
    res.render('../view/pages/login')
}

module.exports.signup_post = async (req, res) => {
    try {

        //destructure the inputs
        const { firstname, lastname, email, password, confirm_password } = req.body;

        //check if user already exists in db
        const user = await db.any("SELECT * FROM users WHERE email = $1", [email]);

        if (user.length !== 0) {
            return res.status(401).send("User already exist!")
        }
        
        //bcrypt the password
        const hash = await bcrypt.hash(password, 10)

        res.json(user)
    } catch (error) {
        console.log(error.message);
        res.status(500).sned("Server Error")
    }
}

module.exports.login_post = (req, res) => {
    const { email, password } = req.body;
    res.send(req.body)
}