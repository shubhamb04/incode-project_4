const { Router } = require("express");
const router = Router();

router.get("/", (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.log(err);
      res.send(err)
    } else {
      res.clearCookie('schedule_sid')
      res.redirect("/login");
   }
    
  }) 

});


module.exports = router;
