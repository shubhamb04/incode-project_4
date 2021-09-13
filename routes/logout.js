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
        res.render("../view/pages/signup", {
          message: "User already registered!",
        });
      } else {
        //bcrypt the password
        const hash = await bcrypt.hash(password, 10);

        //insert into database

        await db.none(
          "INSERT INTO users (firstname, lastname, email, password) VALUES ($1, $2, $3, $4);",
          [firstname, lastname, email, hash]
        );

        res.render("../view/pages/login", {
          message: "Successfully registered! Please login.",
        });
      }
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Server Error");
    }
  }
);

//login post route
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
        res.render("../view/pages/login", {
          message: "Invalid email or password!",
        });
      } else {
        bcrypt.compare(password, user.password, (err, result) => {
          try {
              if (result) {
                req.session.userId = user.user_id; 
                res.send("Successfully logged in!");
                 
            } else {
              res.render("../view/pages/login", {
                message: "Invalid email or password!",
              });
            }
          } catch (err) {
            console.log(err);
            res.send(err);
          }
        });
      }
    } catch (error) {
      console.log(error);
    }
  }
);

module.exports = router;
