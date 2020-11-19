var mongo = require('./modules/mongo_connect7.js')
// mongo({db:'db_name'}).then(db=>{
// 	var some_tbl = db.collection('sometable');
// 	some_tbl.insertOne({ololo:"atata"})
// })



module.exports = function(app){

	// client must set application-json content type
	app.post("/echo", function (req, res, next) {
		console.log("POST.data:", {
			body: req.body,
			headers: req.headers
		})
		res.status(200).json({response:{
			echo: req.body,
			ololo:'atata',
			headers: req.headers
		}});
	})



}