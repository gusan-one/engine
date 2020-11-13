var fs = require('fs');
var http = require('http');
var https = require('https'); 
var rp = require('request-promise');
var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var pug = require('pug');

const debug = true;




/*

{} 
Запустит только http на localhost:8080

{
	host: "192.168.7.77",
	port: 8380
}
Запустит только http на 192.168.7.77:8380

{
	host: "192.168.7.77",
	port: 8380,
	ports: 8344
}
Будет ошибка, нужны ертификаты...

{
	host: "192.168.7.77",
	port: 8380,
	ports: 8344,
	key: '/etc/letsencrypt/live/igoos.website/privkey.pem'
	cert: '/etc/letsencrypt/live/igoos.website/cert.pem'
	ca: НЕ ОБЯЗАТЕЛЬНО
}
Запустит http и https на 192.168.7.77:8380:8344

*/



// Тут захардкожены httproot и pug директории 
function make_express_app(settings){
	// console.log(settings)
	// {
	// 	host: "localhost", // обязательно или по дефолту localhost
	// 	port: 8380, // обязательно или 8080
	// 	ports: 8343, // НЕ ОБЯЗАТЕЛЬНО , только если используется https
	// 	key: '/etc/letsencrypt/live/igoos.website/privkey.pem', // НЕ ОБЯЗАТЕЛЬНО , только если используется https
	// 	cert: '/etc/letsencrypt/live/igoos.website/cert.pem', // НЕ ОБЯЗАТЕЛЬНО , только если используется https 
	// 	ca: '/etc/letsencrypt/live/igoos.website/chain.pem' // НЕ ОБЯЗАТЕЛЬНО , даже с https
	// }

	try{

		var app = express();
		app.use("/", express.static('httproot/'));

		app.use( bodyParser.urlencoded({extended:false}) );
		app.use( bodyParser.json() );

		app.use(cookieParser()); // usage: req.cookies.cookie_name
		app.set('views', './pug/'); 
		app.set('view engine', 'pug');

		if(settings.ports !== undefined){
			var credentials = {}
			credentials.key = fs.readFileSync(settings.key, 'utf8');
			credentials.cert = fs.readFileSync(settings.cert, 'utf8');
			if(settings.ca !== undefined){
				credentials.ca = fs.readFileSync(settings.cert, 'utf8');
			}
			var https_server = https.Server(credentials, app);
		}

		var http_server = http.Server(app);

		server_promisess = [];
		server_promisess.push(new Promise((resolve,reject)=>{
			http_server.listen(settings.port, settings.host, function () {
				console.log('webserver listening on http://'+settings.host+":"+settings.port);
				return resolve(app)
			});
		}))
		if(settings.ports !== undefined){
			server_promisess.push(new Promise((resolve,reject)=>{
				https_server.listen(settings.ports, settings.host, function () {
					console.log('webserver_s listening on https://'+settings.host+":"+settings.ports);
					return resolve(app)
				});
			}))
		}

		return Promise.all(server_promisess).then(arr => {
			return arr[0] // [app, app] || [app]
		})

		
	}catch(err){
		return new Promise((resolve,reject)=>{
			return reject(err)
		})
	}

}

module.exports = make_express_app
