const router = require('express').Router();
const {
    ensureAuthenticated
} = require('../config/auth')


router.get("/", ensureAuthenticated, (req, res) => {
    res.render("index", {
        name: req.user.name
    });
});

module.exports = router;