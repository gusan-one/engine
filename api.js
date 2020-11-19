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