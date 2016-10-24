var monogodb = require('./db')

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
        title = this.title,
        comment = this.comment;

    //打开数据库
    monogodb.open(function(err, db) {
       if (err) {
            mongodb.close();
            return callback(err);
       }
       //读取posts集合
       db.collection('posts', function (err, collection) {
           if (err) {
               monogodb.close();
               return callback(err);
           }
           //通过用户名、时间以及标题查找文档，并把一条留言对象添加到commnets 数组里面
           collection.update({
               "name": name,
               "time.day": day,
               "title": title
           }, {
               $push: {"comments": comment}
           }, function(err) {
               monogodb.close();
               if (err) {
                   return callback(err); 
               }               
           })
       })
    })
}

