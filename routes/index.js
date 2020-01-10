var express = require('express');
var router = express.Router();

router.use(function (req, res, next) {
	console.log(req.session);
	next();
});

router.get('/', function (req, res, next) {
	if (req.session.user === undefined) res.render('login');
	else {
		if (req.session.user.role == 'student') {
			res.render('student', req.session.user);
		} else if (req.session.user.role == 'teacher') {
			res.render('teacher');
		}
	}
});

module.exports = router;