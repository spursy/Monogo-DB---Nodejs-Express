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
User.get1 = function(name, callback) {
  //打开数据库
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);//错误，返回 err 信息
    }
    //读取 users 集合
    db.collection('users', function (err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);//错误，返回 err 信息
      }
      //查找用户名（name键）值为 name 一个文档
      collection.findOne({
        name: name
      }, function (err, user) {
        mongodb.close();
        if (err) {
          return callback(err);//失败！返回 err 信息
        }
        callback(null, user);//成功！返回查询的用户信息
      });
    });
  });
};

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
