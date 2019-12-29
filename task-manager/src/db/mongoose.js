const mongoose = require('mongoose');
//mongoose uses mongodb driver behind 
mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api', {
    useNewUrlParser: true,
    useCreateIndex: true
});

//define model
/* const user = mongoose.model('users', {
    name: {
        type: String
    },
    age: {
        type: Number
    }
});

let user1 = new user({
    name: 'NIKITA',
    age: 23
})
user1.save().then((user) => {
    console.log(user)
}).catch((error) => {
     console.log('Error while inserting ', error)
})*/

const task = mongoose.model('Tasks', {
    description: {
        type: String,
        required: true,
        //to provide custom validation
        validate(value){
            if(value.length < 4){
                throw new Error('Description cannot be too short')
            }
        }
    },
    completed: {
        type: Boolean,
        default: false
    }
})

/* const task1 = new task({
    description: 'Learn React js',
})
task1.save().then((task) => {
    console.log(task)
}).catch((Error) => {
    return console.log(Error)
}) */
