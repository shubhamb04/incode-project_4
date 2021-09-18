const { Router } = require("express");
const router = Router();
const {check, validationResult} = require('express-validator');
const db = require("../db/database");


router.get('/', (req, res) => {
    res.render("../view/pages/newSchedule")
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
            
            res.render("../view/pages/newSchedule", {errMsgs})
        } else {

            const timeConversion = (time) => time.split(":")[0] + time.split(":")[1]

            const convertedStTime = timeConversion(start_time);
            const convertedEndTime = timeConversion(end_time);

            if (Number(convertedEndTime) <= Number(convertedStTime)) {
                req.flash("error", "End time should be later than start time!")
                res.redirect("/newSchedule")
            }
            
            // const timeValidation = (stTimeDB, endTimeDB) => {
            //     const startInput = Number(start_time.substr(0, 2));
            //     const endInput = Number(end_time.substr(0, 2))
            //     if (stTimeDB < startInput && startInput < endTimeDB
            //         || endInput < startInput) {
            //         res.redirect("/schedule?msg=Enter%20valid%20time")
            //         }
            // }


            // const times = await db.any("SELECT start_time, end_time FROM schedules WHERE user_id = $1;", req.session.userId)
            // times.forEach(element => {
            //     const stTimeA = Number(element.start_time.substr(0, 2))
            //     const endTimeA = Number(element.end_time.substr(0, 2))
                
            //     timeValidation(stTimeA, endTimeA);
                
            // });
                 await db.none("INSERT INTO schedules (user_id, day, start_time, end_time) VALUES ($1,$2,$3,$4);", [req.session.userId, Number(day), start_time, end_time]);
                res.redirect('/schedule')
            
        }
        } catch (error) {
            console.log(error);
        }
})

module.exports = router