var express = require('express');
var User = require('../models/User');
var router = express.Router();

router.post('/save', (req, res) => {
	let attendance = req.body.attendance;
	let totalClasses = req.body.totalClasses;
	let attendanceSheet = [];
	let itr = 0;
	console.log(attendance)
	User.find({ role: "student" }, (err, all) => {
		let totalAbsentees = attendance.length - all.length
		for(let i = 0; i < attendance.length; i++) {
				if(attendance[i] == 0 && attendance[i+1] == 1) {
					attendanceSheet[itr++] = 1;
					i++;
				}
				else
					attendanceSheet[itr++] = 0
		}
		console.log("Total Absentees", totalAbsentees, "Attendance Sheet", attendanceSheet)
		for(i = 0; i < attendanceSheet.length; i++) {
			if(attendanceSheet[i] == 0) {
				let daysPresent = all[i].daysPresent + 1;
				let attendance = ((daysPresent/totalClasses) * 100).toFixed(2);
				attendance = attendance.toString();
				let j = i+1;
				User.findOneAndUpdate({"id": j},{$set:{"daysPresent": daysPresent}}, (err, e) => {
					if(e)console.log(e)
				});
				User.findOneAndUpdate({"id": j},{$set:{"attendance": attendance}}, (err, e) => {
					if(e)console.log(e)
				});
			}
			else {
				let attendance = ((all[i].daysPresent/totalClasses) * 100).toFixed(2);
				attendance = attendance.toString();
				let j = i+1;
				User.findOneAndUpdate({"id": j},{$set:{"attendance": attendance}}, (err, e) => {
					if(e)console.log(e)
				});
			}
		}
		res.render('success', { totalAbsentees: totalAbsentees });
	})
});

module.exports = router;