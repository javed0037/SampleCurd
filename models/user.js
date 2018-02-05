const mongoose = require('mongoose');
let user = new mongoose.Schema;
user = {
    Name : {type : String},
    Email : {type : String},
    Password : {type : String},
    Status : {type : Boolean, default : true}
};
module.exports = mongoose.model('user',user);
