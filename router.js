module.exports = function(app){


	app.get('/', function (req, res, next) {
		console.log("req")
		res.render('pages/home.pug', { 
			title: 'Main Page'
		});
	});

	app.get('/about', function (req, res, next) {
		res.render('pages/about.pug', { 
			title: 'About Page'
		});
	});


}