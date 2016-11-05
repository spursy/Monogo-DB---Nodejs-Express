var should = require("should");
var Post = require('../models/post')
var mongodb = require('../models/db')

describe('Access to post DB: ', function(){
        it('Validate data has been insert into post DB.', function (done) {
            var post = new Post("NodeJs test", "Post save function", ["Post One", "Post two", "Post three"], 
            "Hi boy, let's start unite test")

            post.save(function(err) {
                should.not.exist(err)
                done()
            })
        })
        it('Validate get posts by parameter.', function(done) {
            Post.getTen("spursy",1, function(err, docs) {
                should.not.exist(err)
                docs[0].name.should.be.equal("spursy")
                done()
            }) 
        })
});