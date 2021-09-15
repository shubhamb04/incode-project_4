const express = require("express")
const bcrypt = require("bcryptjs")
const router = express.Router()
const db = require("../database")

router.get('/', (req, res) => {
  res.send("Signup page")
})

router.post("/", (req, res) => {
  const { first_name, last_name, email, password, confirm_password } = req.body
  // 1. validate user data (also include whether password confirmation is accurate)

  // 2. check if the user already exists in db
  db.oneOrNone("SELECT * FROM users WHERE email = $1;", [email])
    .then(userExists => {
      if (userExists) {
        // user exists, please send message to prompt them to login
        res.redirect("/login?message=User%20already%20exists.")
      } else {
        // 3. hash password - clean the email
        const salt = bcrypt.genSaltSync(10)
        const hash = bcrypt.hashSync(password, salt)
        const cleanedEmail = email.toLowerCase().trim()

        // 4. insert into db
        db.none('INSERT INTO users (first_name, last_name, email, password) VALUES ($1, $2, $3, $4);', [first_name, last_name, cleanedEmail, hash])
        .then(() => {
          res.redirect('/login?message=User%20successfully%20created.')
        })
        .catch((error) => {
          console.log(error)
          res.json(error)
        })
      }
    })
    .catch(error => {
      console.log(error)
      res.json(error)
    })
})

module.exports = router