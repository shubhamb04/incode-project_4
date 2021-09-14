module.exports.redirectToLogin = (req, res, next) => {
    if (!req.session.userId) {
        res.clearCookie("schedule_sid")
        res.redirect("/login")
    } else {
        next()
    }
}

module.exports.redirectToHome = (req, res, next) => {
    if (req.session.userId) {
        res.redirect("/")
    } else {
        next()
    }
}