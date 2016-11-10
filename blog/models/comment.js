var mongodb = require('./db'),
    async = require('async');

function Comment (name, day, title, comment) {
    this.name = name;
    this.day = day;
    this.title = title;
    this.comment = comment;
}

module.exports = Comment

Comment.prototype.save = function(callback) {
    var name = this.name,
        day = this.day,
        comment = this.comment,
        title = this.title;
    async.waterfall([
        function(cb){
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
            collection.update({
                "name": name, "time.day": day, "title": title}, {
                $push: {"comments": comment}
            }, function(err) {
                cb(err)
            })
        }
    ], function(err) {
        callback(err)
    })
}



