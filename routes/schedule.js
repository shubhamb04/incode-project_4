const { Router } = require("express");
const router = Router();
const {check, validationResult} = require('express-validator');
const db = require("../db/database");

router.get('/', async (req, res) => {
    try {
        const schedules = await db.manyOrNone(
    "SELECT user_id, day, TO_CHAR(start_time, 'HH12:MI AM') start_time, TO_CHAR(end_time, 'HH12:MI AM') end_time FROM schedules where user_id = $1", [req.session.userId]
        );
        res.render('../view/pages/schedules' , {user_id: req.session.user_id, schedules, userEmail: req.session.userEmail})
    } catch (error) {
        console.log(error);
    }
    
})

router.post('/', [
    check("day", "Please select the day!").notEmpty(),
    check("start_time", "Please enter valid start time!").notEmpty(),
    check("end_time", "Please enter valid end time!").notEmpty(),
], async (req, res) => {
        try {
        const { day, start_time, end_time } = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errMsgs = errors.array()
            res.render("../view/pages/schedules", {errMsgs})
        } else {   
                 await db.none("INSERT INTO schedules (user_id, day, start_time, end_time) VALUES ($1,$2,$3,$4);", [req.session.userId, Number(day), start_time, end_time]);

                res.redirect('/schedule')
            
        }
        } catch (error) {
            console.log(error);
        }
})

module.exports = router