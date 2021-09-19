const { Router } = require("express");
const router = Router();
const db = require("../db/database");
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const session = require("express-session");

router.get("/", (req, res) => {
   
    res.render("../view/pages/login", {
      message: req.query.message
  });
});

//login post route
router.post(
  "/",
  [
    check("email", "Please enter valid email!")
      .isEmail()
      .normalizeEmail()
      .trim()
      .toLowerCase(),
    check("password", "Please enter valid password!")
      .isLength({ min: 8 })
      .trim(),
  ],
  async (req, res) => {
    try {
      

      //input validation
      const { email, password } = req.body;
      const errors = validationResult(req);
        
      if (!errors.isEmpty()) {
        const errMsgs = errors.array();
        res.render("../view/pages/login", {errMsgs});
      } else {

          //check if email exists in db
      const user = await db.oneOrNone(
        "SELECT * FROM users WHERE email = $1;",
        email
      );

      if (!user) {
        res.redirect("/login?message=User%20does%20not%20exist.")
      } else {
        bcrypt.compare(password, user.password, (err, result) => {
          try {
              if (result) {
                req.session.userId = user.user_id;
                req.session.userEmail = user.email;
                res.redirect("/");
                 
            } else {
              res.redirect('/login?message=Email%20or%20password%20is%20incorrect.');
            }
          } catch (err) {
            console.log(err);
            res.send(err);
          }
        });
      }
      }

       
        
      
    } catch (error) {
      console.log(error);
    }
  }
);

module.exports = router;
