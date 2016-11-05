require("should");
var User = require('../models/user')
var mongodb = require('../models/db')

describe('Access to DB: ', function(){
        it('Validate parameter should be equal to result.', function(done){
            User.get("spursy", function(err, user){
                // console.log(user)
                 "spursy".should.be.equal(user.name);
                 done()
            })
            
        });

        it('Validate data has been insert into DB.', function (done) {
            var user = new User ({name: "yy", password: "123456", email: "yy@sina.com"});
            user.save(function(err, user1) {
                
                "yy".should.be.equal(user1.ops[0].name)
                done()
            })
            
        })
});
