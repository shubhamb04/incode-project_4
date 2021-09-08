module.exports.signup_get = (req, res) => {
    res.render('../view/pages/signup')
}

module.exports.login_get = (req, res) => {
    res.render('../view/pages/login')
}

module.exports.signup_post = (req, res) => {
    const { email, password } = req.body;
    res.send('new sign up')
}

module.exports.login_post = (req, res) => {
    const { email, password } = req.body;
    res.send(req.body)
}