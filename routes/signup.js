const { Router } = require("express");
const router = Router();
const db = require("../db/database");
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");


router.get("/", (req, res) => {
  res.render("../view/pages/signup",  {
      message: req.query.message
  });
});

router.post(
  "/",
  [
    check("firstname", "Please enter atleast 3 character!")
      .isLength({ min: 3 })
      .trim(),
    check("lastname", "Please enter atleast 3 character!")
      .isLength({ min: 3 })
      .trim(),
    check("email", "Please enter valid email!")
      .isEmail()
      .normalizeEmail()
      .trim()
      .toLowerCase(),
    check("password")
      .isStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
      })
      .withMessage(
        "Password must be greater than 8 and contain at least one uppercase letter, one lowercase letter, and one number!"
      ),
    check("confirm_password", "Password does not match!").custom(
      (value, { req }) => value === req.body.password
    ),
  ],
  async (req, res) => {
    try {
      //input validation
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const errMsgs = errors.array();
        res.render("../view/pages/signup", { errMsgs });
      }

      //destructure the inputs
      const {
        firstname,
        lastname,
        email,
        password,
        confirm_password,
      } = req.body;

      //check if user already exists in db
      const user = await db.any("SELECT * FROM users WHERE email = $1", [
        email,
      ]);

      if (user.length !== 0) {
        res.redirect("/signup?message=User%20already%20exist!"
        );
      } else {
        //bcrypt the password
        const hash = await bcrypt.hash(password, 10);

        //insert into database

        await db.none(
          "INSERT INTO users (firstname, lastname, email, password) VALUES ($1, $2, $3, $4);",
          [firstname, lastname, email, hash]
        );

        res.redirect("/login?message=Registered%20successfully!%20Please%20login.");
      }
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Server Error");
    }
  }
);

module.exports = router;