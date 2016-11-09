var should = require("should");
var Comment = require('../models/comment')
var mongodb = require('../models/db')

describe("Unit test comment module", function() {
    it("Validate comment save function", function(done) {
        var comment = new Comment("spursy" , "2016-10-25", "swift", "only tested")
        console.log(comment)
        comment.save(function(err){
            should.not.exist(err)
        })
        done() 
    })
})

