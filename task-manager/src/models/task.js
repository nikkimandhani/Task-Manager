const mongoose = require('mongoose');
const task = mongoose.model('tasks', {
    description: {
        type: String,
        required: true,
        //to provide custom validation
        validate(value) {
            if (value.length < 4) {
                throw new Error('Description cannot be too short')
            }
        }
    },
    completed: {
        type: Boolean,
        default: false
    },
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'users'
    }
})
module.exports = task;