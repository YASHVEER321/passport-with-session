const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const Account = new Schema({
    username: String,
    password: String,
    address:String,
    companyName:String
});

Account.plugin(passportLocalMongoose);//use when register the user in passport

module.exports = mongoose.model('accounts', Account);
