var mongodb = require('./db'),
    async = require('async');

function User(user) {
  this.name = user.name;
  this.password = user.password;
  this.email = user.email;
};

module.exports = User;

//存储用户信息
User.prototype.save = function(callback) {
  //要存入到数据库中的文档
  var user = {
    name: this.name,
    password: this.password,
    email: this.email
  }

  async.waterfall([
    function(cb) {
      mongodb.open(function (err, db){
        cb(err, db) 
      }) 
    },
    function(db, cb) {
      db.collection("users", function (err, collection) {
        cb(err, collection)
      })
    }, 
    function(collection, cb) {
      collection.insert(user, {save: true}, function(err, user){
        cb(err, user)
      })
    }
  ], function(err, user){
      mongodb.close()
      callback(err, user)
  })
}

//读取用户信息
User.get = function(name, callback) {
    async.waterfall([
      function(cb) {
        mongodb.open(function(err, db) {
          cb(err, db)
        })
      },
      function(db, cb) {
        db.collection('users', function (err, collection){
          cb(err, collection)
        })
      }, 
      function(collection, cb) {
        collection.findOne({name: name}, function(err, user) {
          cb(err, user)
        })
      }
    ], function (err, user) {
      mongodb.close()
      callback(err, user)
    })
}
