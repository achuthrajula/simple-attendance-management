var express = require('express');
var User = require('../models/User');
var router = express.Router();

router.post('/save', (req, res) => {
	let attendance = req.body.attendance;
	let attendanceSheet = [];
	let itr = 0;
	console.log(attendance)
	User.find({ role: "teacher" }, (err, teacher) => {
		let totalClasses = teacher[0].daysPresent + 1;
		User.findOneAndUpdate({"_id": teacher[0]._id},{$set:{"daysPresent": totalClasses}}, {new: true}, (err, e) => {
			if(e)console.log(e)
		});
	User.find({ role: "student" }, (err, all) => {
		console.log(totalClasses)
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
		for(let i = 0; i < attendanceSheet.length; i++) {
			if(attendanceSheet[i] == 0) {
				let daysPresent = all[i].daysPresent + 1;
				let attendance = ((daysPresent/totalClasses) * 100).toFixed(2);
				attendance = attendance.toString();
				console.log('present', daysPresent, totalClasses, attendance)
				User.findOneAndUpdate({"_id": all[i]._id},{$set:{"daysPresent": daysPresent}}, (err, e) => {
					if(e)console.log(e)
				});
				User.findOneAndUpdate({"_id": all[i]._id},{$set:{"attendance": attendance}}, (err, e) => {
					if(e)console.log(e)
				});
			}
			else {
				let daysPresent = all[i].daysPresent;
				let attendance = ((daysPresent/totalClasses) * 100).toFixed(2);
				attendance = attendance.toString();
				console.log('absent', daysPresent, totalClasses, attendance)
				User.findOneAndUpdate({"_id": all[i]._id},{$set:{"attendance": attendance}}, (err, e) => {
					if(e)console.log(e)
				});
			}
		}
		res.render('success', { totalAbsentees: totalAbsentees });
	})
})
});

module.exports = router;