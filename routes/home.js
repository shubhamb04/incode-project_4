const { Router } = require("express");
const router = Router();
const { redirectToLogin } = require("../middleware");
const db = require("../db/database");

router.get("/", redirectToLogin, async (req, res) => {
  try {
    const schedules = await db.any(
      "SELECT * , TO_CHAR(start_time, 'HH12:MI AM') start_time, TO_CHAR(end_time, 'HH12:MI AM') end_time FROM schedules left join users on schedules.user_id = users.user_id;");
  res.render("../view/pages/home", {
      schedules, userId: req.session.userId, userEmail: req.session.userEmail
    })
  } catch (err) {
    console.log(err);
      res.send(err);
  }
});

router.get("/:id", redirectToLogin, async(req, res) => {
  const userID = Number(req.params.id)
  
  const givenUser = await db.any("SELECT * FROM users LEFT JOIN schedules ON users.user_id = schedules.user_id WHERE users.user_id = $1;", userID)

  res.render('../view/pages/user', {givenUser})
})

module.exports = router;
