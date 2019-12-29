const validator = require('validator');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')

//In backend monggose.model uses its second object as schema
//Declaring schema as separate object so we can use middleware
const userSchema = new mongoose.Schema({
    name: {
        type: String
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error('Age must be a positive integer')
            } ''
        }

    },
    password: {
        type: String,
        required: true,
        minlength: 5,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password cannot contain password')
            }
        }
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Please provide valid email')
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }

    }]
})

userSchema.virtual('tasks',{
    ref: 'tasks',
    localField: '_id',
    foreignField: 'owner'
})

//express calls JSON.stringify when we say res.send() it then calls toJSON method
userSchema.methods.toJSON = function(){
    const user = this
    const userObject = user.toObject();
    delete userObject.tokens;
    delete userObject.password;
    return userObject;
}

userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ '_id': user._id.toString() }, 'learningnodecourse')
    user.tokens = user.tokens.concat({token})
    await user.save()
    return token;
}
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ 'email': email });
    if (!user) {
        throw new Error('Unable to login')
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
        throw new Error('Unable to login')
    }
    return user;
}


//There are 4 types of middleware in mongoose, save comes under document middleware
//Hash plain ttext pwd before saving
userSchema.pre('save', async function (next) {
    //this refers to current document
    const user = this;
    //user.isModified -- true : when is user is first created & when password is modified
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }
    next() // to indicate this function has been completed it can call next function to implement
})
const User = mongoose.model('users', userSchema);

module.exports = User