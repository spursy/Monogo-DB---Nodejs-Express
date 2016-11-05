var User = require('../models/user.js')

var newUser = new User({
        name: "123",
        password: "123123123",
        email: "12313@123.com"
});

newUser.save(function (err, user) {
    console.log(1)
        if (err) {
            console.log(2)
          console.log(err)
        }
        else {
            console.log(3)
            console.log(user)
        }
            
});

