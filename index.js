var settings = require('./settings.js');

var mongo = require('./modules/mongo_connect7.js')
// mongo({db:'db_name'}).then(db=>{
// 	var some_tbl = db.collection('sometable');
// 	some_tbl.insertOne({ololo:"atata"})
// })


var exapp = require('./modules/express_app3.js');


exapp(settings).then(app=>{

	app.use(function (error, req, res, next) {
		if (error instanceof SyntaxError) {
			console.log(error)
			res.status(400).json({error:{message:"Invalid JSON"}});
		}else{
			next();
		}
	});


	// client must set application-json ct
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



	// Это нужно поместить в конец, чтобы перехватить запрос и дать 404
	// Если не один из предыдущих запросов не сработал
	app.all("*", function (req, res, next) {
		// res.status(200).send({test:{echo_body:req.body}});
		res.status(404).json({error:{echo:req.body, message:'no such route'}});
	})


}).catch(err=>{ console.log(err) })




