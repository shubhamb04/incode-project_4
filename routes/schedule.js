const { Router } = require("express");
const router = Router();
const {check, validationResult} = require('express-validator');
const db = require("../db/database");

const handleDelete = async (schedId) => {
            try {
                const handleDelete = await fetch(`http://localhost:3000/schedule/${schedId}`, {
                    method: "DELETE"
                })
                console.log(handleDelete);
            } catch (error) {
                console.log(error);
            }
        }

        //function to convert day number to day name
const daysTransformation = (schedules) => {
  schedules.forEach(schedule => {
      const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

      days.forEach((weekday, index) => {
        if (schedule.day === index + 1) {
          schedule.day = weekday;
        }
      })
  })
  return schedules
}

router.get('/', async (req, res) => {
    try {
        const schedules = await db.manyOrNone(
    "SELECT user_id, schedule_id, day, TO_CHAR(start_time, 'HH12:MI AM') start_time, TO_CHAR(end_time, 'HH12:MI AM') end_time FROM schedules where user_id = $1", [req.session.userId]
        );

        //tranforming week days name
        daysTransformation(schedules);
        res.render('../view/pages/schedules' , {user_id: req.session.user_id, schedules, userEmail: req.session.userEmail, handleDelete, errMsgs: req.query.errMsgs})
    } catch (error) {
        console.log(error);
    }
    
})



router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params.id
        await db.query("DELETE FROM schedules WHERE schedule_id = $1;", id)

        res.redirect('/schedule')
    } catch (error) {
        console.log(error);
    }
    
})


module.exports = router