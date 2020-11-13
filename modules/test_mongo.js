const mongo = require('./mongo_connect.js')

...
	return mongo().then(db=>{
		var users = db.collection('users');
		return new Promise((resolve,reject)=>{
			users.find({id:id}).toArray(function(err, docs) {
				if(!err){
					resolve(docs)
				}else{
					return reject(err);
				}
			})
		})
	})
