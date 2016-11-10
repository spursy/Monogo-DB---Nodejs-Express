var mongodb = require('./db'),
    markdown = require('markdown').markdown,
    async = require('async');

function Post(name, title, tags, post, comments) {
  this.name = name;
  this.title = title;
  this.tags = tags;
  this.post = post;
  this.comments = comments;
}

module.exports = Post;

//存储一篇文章及其相关信息
Post.prototype.save = function(callback) {
  var date = new Date();
  //存储各种时间格式，方便以后扩展
  var time = {
      date: date,
      year : date.getFullYear(),
      month : date.getFullYear() + "-" + (date.getMonth() + 1),
      day : date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(),
      minute : date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + 
      date.getHours() + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) 
  }
  //要存入数据库的文档
  var post = {
      name: this.name,
      time: time,
      title: this.title,
      tags: this.tags,
      post: this.post,
      comments: [],
      pv: 0
  };
  
  async.waterfall([
    function (cb) {
      mongodb.open(function(err, db) {
        cb(err, db)
      })
    },
    function(db, cb) {
      db.collection('posts', function(err, collection) {
        cb(err, collection)
      })
    },
    function(collection, cb) {
      collection.insert(post, {safe: true }, function (err) {
        cb(err)
      })  
    }
    ], function (err) {
      mongodb.close()
      callback(err)
  })
};

//一次获取十篇文章
Post.getTen = function(name, page, callback) {
  async.waterfall([
    function(cb) {
      mongodb.open(function(err, db){
        cb(err, db)
      })
    },
    function(db, cb){
      db.collection('posts', function(err, collection) {
        cb(err, collection)
      })
    },
    function(collection, cb) {
      var query = {}
      if (name) {
        query.name = name
      }
      collection.find(query, {skip: (page-1)* 10, limit: 10}).sort({time: -1}).toArray(function(err, docs) {
        cb(err, docs)
      })
    }
  ], function(err, docs) {
    mongodb.close()
    if (docs) {
      //analyse markdown to html
      docs.forEach(function (doc) {
        doc.post = markdown.toHTML(doc.post);
      });
    }
    
    callback(err, docs)
  })
}

//Get all 
Post.getAll = function(name, callback) {
  async.waterfall([
    function(cb) {
      mongodb.open(function(err, db){
        cb(err, db)
      })
    },
    function(db, cb){
      db.collection('posts', function(err, collection) {
        cb(err, collection)
      })
    },
    function(collection, cb) {
      var query = {};
      if (name) {
        query.name = name;
      }
      collection.find(query).sort({time: -1}).toArray(function(err, docs) {
        cb(err, docs)
      })
    }
  ], function(err, docs) {
    mongodb.close()
    if (docs) {
      //analyse markdown to html
      docs.forEach(function (doc) {
        doc.post = markdown.toHTML(doc.post);
      });
    }
    
    callback(err, docs)
  })
}

//获取一篇文章
Post.getOne = function(name, day, title, callback) {
  //打开数据库
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);
    }
    //读取 posts 集合
    db.collection('posts', function (err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
      //根据用户名、发表日期及文章名进行查询
      collection.findOne({
        "name": name,
        "time.day": day,
        "title": title
      }, function (err, doc) {
        if (err) {
          mongodb.close();
          return callback(err);
        }
        if (doc) {
          //每访问 1 次，pv 值增加 1
          collection.update({
            "name": name,
            "time.day": day,
            "title": title
          }, {
            $inc: {"pv": 1}
          }, function (err) {
            mongodb.close();
            if (err) {
              return callback(err);
            }
          });
          //解析 markdown 为 html
          doc.post = markdown.toHTML(doc.post);
          doc.comments.forEach(function (comment) {
            comment.content = markdown.toHTML(comment.content);
          });
          callback(null, doc);//返回查询的一篇文章
        }
      });
    });
  });
};

Post.edit = function(name, day, title, callback) {
  async.waterfall([
    function(cb) {
      mongodb.open(function(err, db){
        cb(err, db)
      })
    }, 
    function(db, cb) {
      db.collection('Post', function(err, collection) {
        cb(err, collection)
      })
    },
    function(collection, cb) {
      collection.find({
        "name": name,
        "time.day": day,
        "title": title
      }, function(err, doc) {
        doc = markdown.toHTML(doc);
        cb(err, doc)
      })
    }], function(err, doc) {
      mongodb.close();
      doc = markdown.toHTML(doc);
      callback(null, doc);
  })
}

//返回原始发表的内容（markdown 格式）
Post.edit1 = function(name, day, title, callback) {
  //打开数据库
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);
    }
    //读取 posts 集合
    db.collection('posts', function (err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
      //根据用户名、发表日期及文章名进行查询
      collection.findOne({
        "name": name,
        "time.day": day,
        "title": title
      }, function (err, doc) {
        mongodb.close();
        if (err) {
          return callback(err);
        }
        doc = markdown.toHTML(doc);
        callback(null, doc);//返回查询的一篇文章（markdown 格式）
      });
    });
  });
};

//更新一篇文章及其相关信息
Post.update = function(name, day, title, post, callback) {
  //打开数据库
  async.waterfall([
    function(cb) {
      mongodb.open(function (err, db) { 
        cb(err, db)
      })
    },
    function(db, cb) {
      db.collection('posts', function(err, collection) {
        cb(err, collection)
      })
    },
    function(collection, cb) {
      collection.update({
        "name": name,
        "time.day": day,
        "titile": title
      }, {
        $set: {post: post}
      }, function (err) {
        cb(err)
      })
    }
  ], function(err) {
    mongodb.close()
    callback(err)
  })
};

//删除一篇文章
Post.remove = function(name, day, title, callback) {
  //打开数据库
  async.waterfall([
    function(cb) {
      mongodb.open(function(err, db) {
        cb(err, db)
      })
    },
    function(db, cb) {
      db.collection("posts", function(err, collection) {
        cb(err, collection)
      })
    },
    function(collection, cb) {
      collection.remove({
        "name": name,
        "time.day": day,
        "title": title
      }, {
        w: 1
      }, function(err) {
        cb(err)
      })
    }
  ], function(err) {
    callback(err)
  })
};

//返回所有文章存档信息
Post.getArchive = function(callback) {
  console.log(2)
  //打开数据库
  async.waterfall([
    function(cb) {
       mongodb.open(function (err, db) { 
         cb(err, db)
       })
    },
    function(db, cb) {
      db.collection('posts', function (err, collection) { 
        cb(err, collection)
      })
    },
    function(collection, cb) {
      collection.find({}, {
        "name": 1,
        "time": 1,
        "title": 1
      }).sort({
        time: -1
      }).toArray(function (err, docs) {
        cb(err, docs)
      });
    }
  ], function (err, docs) {
    mongodb.close()
    callback(err, docs);
  })
};

//返回所有标签
Post.getTags = function(callback) {
  async.waterfall([
     function(cb) {
       mongodb.open(function (err, db) { 
         cb(err, db)
      })
     },
     function(db, cb) {
       db.collection('posts', function (err, collection) {
         cb(err, collection)
       })
     },
     function(collection, cb) {
       //distinct 用来找出给定键的所有不同值
      collection.distinct("tags", function (err, docs) {
        cb(err, docs)
      });
     }
  ], function(err, docs) {
    mongodb.close();
    callback(err, docs);
  })
};

//返回含有特定标签的所有文章
Post.getTag = function(tag, callback) {
  async.waterfall([
    function(cb) {
      mongodb.open(function (err, db) { 
        cb(err, db)
      })
    },
    function(db, cb) {
      db.collection('posts', function (err, collection) {
        cb(err, collection)
      })
    },
    function(collection, cb) {
      //查询所有 tags 数组内包含 tag 的文档
      //并返回只含有 name、time、title 组成的数组
      collection.find({
        "tags": tag
      }, {
        "name": 1,
        "time": 1,
        "title": 1
      }).sort({
        time: -1
      }).toArray(function (err, docs) {
        cb(err, docs)
      })
    } 
  ], function(err, docs){
    mongodb.close();
    callback(err, docs);
  })
};

//返回通过标题关键字查询的所有文章信息
Post.search = function(keyword, callback) {
  async.waterfall([
    function(cb) {
      mongodb.open(function (err, db) {
        cb(err, db)
      })
    },
    function(db, cb) {
      db.collection('posts', function (err, collection) {
        cb(err, collection)
      })
    },
    function(collection, cb) {
      var pattern = new RegExp(keyword, "i");
      collection.find({
        "title": pattern
      }, {
        "name": 1,
        "time": 1,
        "title": 1
      }).sort({
        time: -1
      }).toArray(function (err, docs) {
        cb(err, docs)
      });
    }
  ], function(err, docs) {
    mongodb.close();
    callback(err, docs);
  })
};

