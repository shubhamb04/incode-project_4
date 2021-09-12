const { Router } = require("express");
const router = Router();
const db = require("../db/database");
const { check, validationResult, body } = require("express-validator");
const bcrypt = require("bcryptjs");

router.get("/signup", (req, res) => {
  res.render("../view/pages/signup");
});

router.get("/login", (req, res) => {
  res.render("../view/pages/login");
});

router.post(
  "/signup",
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
    check(
      "password"
    ).isLength({
          minLength: 8
      }).withMessage("Password must be greater than 8 characters!"),
    check("confirm_password", "Password does not match!")
      .custom((value, { req }) => value === req.body.password),
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
        res.redirect("/login?msg=User%20already%20exists!");
      } else {
        //bcrypt the password
        const hash = await bcrypt.hash(password, 10);

        //insert into database

        await db.none(
          "INSERT INTO users (firstname, lastname, email, password) VALUES ($1, $2, $3, $4);",
          [firstname, lastname, email, hash]
        );

        res.render("../view/pages/login", {message: "Successfully registered! Please login."});
      }
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Server Error");
    }
  }
);

router.post(
  "/login",
  [
    check("email", "Please enter valid email or password!")
      .isEmail()
      .normalizeEmail()
      .trim()
      .toLowerCase(),
    check("password", "Please enter valid email or password!")
      .isLength({ min: 8 })
      .trim(),
  ],
  async (req, res) => {
    try {
      const { email, password } = req.body;

      //input validation
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        const errMsgs = errors.array();
        res.render("../view/pages/login", { errMsgs });
      }

      //check if email exists in db
      const user = await db.oneOrNone(
        "SELECT * FROM users WHERE email = $1;",
        email
      );

      if (!user) {
        res.render("../view/pages/login", {message: "Invalid email or password!"});
      } else {
        res.send(user);
      }

      // res.send(req.body)
    } catch (error) {
      console.log(error);
    }
  }
);

module.exports = router;
