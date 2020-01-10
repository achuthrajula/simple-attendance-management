var express = require('express');
var User = require('../models/User');
var router = express.Router();

router.get('/login', function (req, res, next) {
	res.render('login');
});

router.get('/signup', function (req, res) {
	res.render('signup');
});

router.get('/logout', function (req, res) {
	req.session.loggedIn = false;
	req.session.user = undefined;
	res.send("Logged out");
});

router.post('/login', (req, res) => {
	var id = req.body.id;
	var password = req.body.password;
	var role = req.body.role;

	if (role != "student" && role != "teacher") res.status(403).send("Invalid role");

	if (id == '' && password == '') res.status(403).send("Enter valid ID, password and try again");

	else if (id == '') res.status(403).send("Enter valid ID and try again");
	
	else if (password == '') res.status(403).send("Enter valid password and try again");

	else {

		User.findOne({ id: id }, (err, user) => {
			if (err) res.status(500).send("Internal server error: " + err);
			user.comparePassword(password, (err, isMatch) => {
				if (err) res.status(500).send("Internal server error: " + err);
				if (isMatch) {
					req.session.loggedIn = true;
					req.session.user = user;
					req.session.save();
					if (role == 'student') res.render('student', { user: user });
					else {
						User.find({ role: "student" }, (err, all) => {
							res.render('teacher', { user: user, students: all });
						})
					}
				} else res.send("Invalid password");
			});
		});
	}
	});

router.post('/signup', (req, res) => {
	User.create({
		firstname: req.body.firstname,
		lastname: req.body.lastname,
		password: req.body.password,
		mobile: req.body.mobile,
		id: req.body.id,
		role: req.body.role
	}).then((value) => {
		res.status(200).redirect('/auth/login');
	}).catch((reason) => {
		res.status(500).send(reason);
	});
});

module.exports = router;