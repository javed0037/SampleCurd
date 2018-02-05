var express = require('express');
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var app =  express();
var bodyparser = require('body-parser');
const user = require('./models/user');
app.use(bodyparser.urlencoded({
  extended:false
}));
app.use(bodyparser.json());
mongoose.connect('mongodb://localhost/users');
app.post('/user', function(req, res){
    bcrypt.hash(req.body.Password, 9 ,function(err, hash){
        if(err){
            return res.json(err)
        }
        let userCriteria = {
            Name : req.body.Name,
            Email : req.body.Email,
            Password : hash
        };
        user.create(userCriteria, function(err, record){
            if(err){
                return res.json(err)
            }
            return res.json(record)
        });
    });
});

app.post('/login', function(req, res){
    let userCriteria = {
        Email : req.body.Email
    };
    user.findOne(userCriteria, function(err, record){
        if(err){
            return res.json(err)
            }
        if(record)
        {
            bcrypt.compare(req.body.Password,record.Password,(err,result)=>{
                if(result){
                    var token = jwt.sign({id: user._id}, "name", { expiresIn: 86400 });
                    // return res.json(record)
                    return res.json({ auth: true, token: token })
                }
                return res.json(err)
            })
        }
    });
});

app.get('/user', function(req, res){
    user.find({}, function(err, record){
        if(err){
            return res.json(err)
        }
        return res.json(record)
    });
});

app.get('/userid', function(req, res) {
    var token = req.headers['token'];
    jwt.verify(token, "name", function(err, decoded) {
      if (err) return res.json(err);
      return res.json(decoded);
    });
  });


app.put('/user', function(req, res){
    let preCriteria = req.body.ID;
    let criteria = {
        _id  : preCriteria
    }
    let updatedRecords = {
        Name : req.body.Name,
        Email : req.body.Email,
        Password : req.body.Password
    };
    user.update( criteria, updatedRecords, function(err, record){
        if(err){
            return res.json(err)
        }
        return res.json(record)
    })
}); 

app.delete('/user', function(req, res){
    let preCriteria = req.body.ID;
    let criteria = {
        _id  : preCriteria
    }
    user.remove( criteria, function(err, record){
        if(err){
            return res.json(err)
        }
        return res.json(record)
    })
});


app.listen(8000, function(req,res){console.log("App Running on Port 8000")});
