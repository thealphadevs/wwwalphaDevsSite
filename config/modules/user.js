var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var userSchema = mongoose.Schema({
    local: {
        name: String,
        username: String,
        password: String
    },
    google: {
        id: String,
        token: String,
        name: String,
        email: String,
        photo: String
    },
    github: {
        id: String,
        token: String,
        name: String,
        username: String,
        email: String,
        photo: String

    },
    linkedin: {
        id: String,
        token: String,
        name: String,
        email: String,
        photo: String,
    }
})

userSchema.methods.generateHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(9));
}

userSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.local.password);
}

module.exports = mongoose.model('user', userSchema);