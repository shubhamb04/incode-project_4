const { Router } = require("express");
const router = Router();
const { redirectToLogin} = require("../middleware")

router.get('/', redirectToLogin, (req, res) => {
    // console.log(req.session.userId);
    res.render('../view/pages/home', {
      message: req.query.message
  })
})

module.exports = router