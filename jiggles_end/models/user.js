const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

const {ArtistSchema} = require("./artist");
const {AlbumSchema} = require("./album");
const {TrackSchema} = require("./track");

let UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        unique: true,
        validate: {
            validator: value => validator.isEmail(value),
            message: '{VALUE} is not a valid email'
        }
    },
    name: {
        type: String,
        trim: true,
        default: "John"
    },
    type: {
        type: String,
        trim: true,
        minlength: 1,
        default: "Listener"
    },
    caption: {
        type: String,
        default: "resources/users/default/000.svg"
    },
    password: {
        type: String,
        require: true,
        minlength: 6
    },
    friends: [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    }],
    store : {
        tracks: [TrackSchema],
        albums: [AlbumSchema],
        artists: [ArtistSchema]
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]
}, {
    usePushEach: true
});


UserSchema.methods.toJSON = function () {
    let user = this;
    let userObject = user.toObject();

    return _.pick(userObject, ['_id', 'email', 'name', 'type', 'caption', 'friends', 'content']);
};

UserSchema.methods.generateAuthToken = function () {
    let user = this;
    let access = 'auth';

    let token = jwt.sign({_id: user._id.toString(), access}, process.env.JWT_SECRET).toString();

    user.tokens = user.tokens.concat([{access, token}]);

    return user.save().then(() => token).catch((e) => {
        console.error(e);
    });
};

UserSchema.methods.removeToken = function (token) {
    let user = this;

    return user.update({
        $pull: {
            tokens: {token}
        }
    });
};

UserSchema.statics.findByToken = function(token) {
    let User = this;
    let decoded;

    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (e) {
        return Promise.reject();
    }

    return User.findOne({
        '_id': decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    });
};

UserSchema.statics.findByCredentials = function(email, password) {
    let User = this;

    return User.findOne({email}).then((user) => {
        if(!user) {
            return Promise.reject();
        }

        return new Promise((resolve, reject) => {
            // Use bcrypt.compare to compare password and user.password
            bcrypt.compare(password, user.password, (err, res) => {
                if(res) {
                    resolve(user);
                } else {
                    reject();
                }
            });
        });
    });
};

UserSchema.pre('save', function (next) {
    let user = this;

    if(user.isModified('password')) {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash;
                next();
            });
        });
    } else {
        next();
    }
});

let User = mongoose.model('User', UserSchema);

module.exports = {User, UserSchema};