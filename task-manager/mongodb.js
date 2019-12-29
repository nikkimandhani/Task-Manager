
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient
const ObjectID = mongodb.ObjectID
const connectionURL = 'mongodb://127.0.0.1:27017';
const databaseName = 'task-manager-api';

//12 byte object id consists of
//a - 4 byte representing seconds
//a - 5 random value
//a - 3 counter starting with random value
/* const id = new ObjectID();
console.log(id);
console.log(id.getTimestamp()) */


MongoClient.connect(connectionURL, { useNewUrlParser: true }, (error, client) => {
    if (error)
        return console.log('Unable to connect')
    console.log('Connected')
    const db = client.db(databaseName)
    //Insert one document
    /*   db.collection('users').insertOne({
          name : 'Nikita',
          age: 23
      },(err, res)=>{
          if(err)
           console.log('Error while inserting data');
           console.log(res.ops);
      }) */

    //Insert multiple documents
    /*  db.collection('users').insertMany([{
         name: 'Niki',
         age: 23
     }, {
         name: 'Niks',
         age: 24
     }], (errror, res)=>{
         if(error){
             return console.log('error while inserting data')
         }else{
             console.log(res.ops)
         }
     }) */

    /*  db.collection('tasks').insertMany([{
         description: 'Learn Node js',
         completed: false,
         inProgress: true
     }, {
         description: 'Learn React js',
         completed: false,
         inProgress: false
     }], (err, res) => {
         if (err) {
             return console.log('Error while inserting tasks')
         } else {
             console.log(`Inserted documents:${res.insertedCount}`)
         }
     }) */

    //Retrieve document based on field
    //If multiple document exists it returns first matching record
    /*  db.collection('tasks').findOne({ description: 'Learn Node js' }, (error, user) => {
         if (error) {
             return console.log('Error while retrieving data')
         } else {
             console.log(user)
         }
     }) */

    //It returns null
    /* db.collection('tasks').findOne({ _id: '5dff2738a8f4321e5f6ecdb1' }, (error, user) => {
        if (error) {
            return console.log('Error while retrieving data')
        } else {
            console.log(user)
        }
    })
 */

   /*  db.collection('tasks').findOne({ _id: new ObjectID("5dff2738a8f4321e5f6ecdb1") }, (error, user) => {
        if (error) {
            return console.log('Error while retrieving data')
        } else {
            console.log(user)
        }
    })
 */

 // It returns cursor
 //toArray -- The callback format for results
 db.collection('tasks').find({inProgress: false}).toArray((err, tasks)=>{
    if(err){
        return console.log('Error')
    }
    console.log(tasks)
 })

 db.collection('tasks').find().count((err, tasks)=>{
    if(err){
        return console.log('Error')
    }
    console.log(tasks)
 })



})
