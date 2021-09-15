const { Router } = require("express");
const router = Router();

router.get('/', (req, res) => {
    res.render('../view/pages/schedules' , {userId: req.session.userId})
})

router.post('/', (req, res) => {

})

module.exports = router