const MongoClient = require('mongodb').MongoClient

var db = false;



// ==================================================================
// Принцип работы:
// Крепим var mongo = require('./mongo_connect7.js');
// Каждый раз кога нужен доступ к таблице во внешнем коде
// Мы создаем или переиспользуем соединение используя сниппет:

// mongo({db:'db_name'}).then(db=>{
// 	var some_tbl = db.collection('sometable');
// 	some_tbl.insertOne({ololo:"atata"})
// })

// Если не передать опции mongo().then(db=>... то использует базу default_db

// Если база уже подключена, то ее соединение записано в db
// И мы его вернем, иначе бедет создано новое и записано в db
// В любом случае вернется промис => вернется db инстанс монго
// ==================================================================

// Реализовать процедуры
// * Обновить итем если существует, если нет -> catch
// Создание индексов


module.exports = mongo = function(settings){

	// Опции по умолчанию
	let opt = {
		host: '127.0.0.1',
		port: 27017,
		db: 'default_db',
		cfg: {
			useNewUrlParser: true, // для того чтобы убрать варнинги 
			useUnifiedTopology: true, // для того чтобы убрать варнинги 
			connectTimeoutMS: 1000*60*1, // default 30 * 1000
			socketTimeoutMS: 1000*60*1 // default 30 * 1000
		}
	};

	// Если settings заданы дополним его дефаултными
	if(settings !== undefined){
		opt = Object.assign(opt, settings)
	}


	if(!db){
		let mongo_url = 'mongodb://'+opt.host+':'+opt.port; 

		return new Promise((resolve,reject) => {
			MongoClient.connect(mongo_url, opt.cfg,	function(err, client) { 

				if(err == null || err == undefined){
					console.log("Mongo db \""+opt.db+"\" successfully connected");
				}else{
					return reject(err);
				}

			 	// Выбрать базу (Создаст автоматом, если не сущест)
				db = client.db(opt.db);
				return resolve(db);
			});
		})		
	}else{
		return new Promise((resolve,reject) => {
			console.log("Mongo db \""+opt.db+"\" reused");
			return resolve(db)
		})
	}
}


// ================== index ==========================

// collection.createIndex(
// 	{ lastName : -1, dateOfBirth : 1 },
// 	{ unique:true },
// 	function(err, result) {
// 		console.log(result);
// 		callback(result);
// });


// collection.createIndex(
// 	{ lastName : -1 }, function(err, result) {
// 	console.log(result);
// 	callback(result);
// });


function create_index(collection, field){
	index_opt={}
	index_opt[field] = 1

	opt = {
		name: 'def_index',
		unique: false,
		background: true
	}

	return new Promise((resolve,reject)=>{
		collection.createIndex(index_opt, opt, function(err, result) {
			return resolve(result);
		});
	})		
}