// CRUD
const {MongoClient, ObjectID} = require('mongodb')
const connectionURL = 'mongodb://127.0.0.1:27017'
const databaseName = 'task-manager'

const id = new ObjectID();
console.log(id)
console.log(id.getTimestamp())
console.log(id.id) // binary data
console.log(id.id.length)
console.log(id.toHexString().length)

MongoClient.connect(connectionURL, {useUnifiedTopology: true}, (error, client) => {
  if (error) {
    console.log('Unable to connect to database')
  }
  
  // db reference
  const db = client.db(databaseName)
  
  // one item
  // db.collection('users').insertOne({
  //   _id: id,
  //   name: 'Vlad',
  //   age: 27
  //   // called when operation is done
  // }, (error, result) => {
  //   if (error) {
  //     return console.log('Unable to insert user')
  //   }
  //   // contains all documents we have inserted
  //   // [ { name: 'Vlad', age: 27, _id: 608714a41c52824fb419f52d } ]
  //   console.log(result.ops)
  // })
  
  // many items
  // db.collection('users').insertMany([
  //   {
  //     name: 'Jen',
  //     age: 28
  //   },
  //   {
  //     name: 'Gunther',
  //     age: 27
  //   }
  // ], (error, result) => {
  //   if (error) {
  //     return console.log('Unable to insert user')
  //   }
  //
  //   console.log(result.ops)
  // })
  
  // guid - globally unique identifiers
  
  // find one item by name
  // db.collection('users').findOne({name: 'Jen'}, (error, user) => {
  //   if (error) {
  //     return console.log('Unable to fetch')
  //   }
  //
  //   console.log(user)
  // })
  
  // // find one item by id
  // db.collection('users').findOne({_id: new ObjectID("60871970ee409c56b91f1e16")}, (error, user) => {
  //   if (error) {
  //     return console.log('Unable to fetch')
  //   }
  //
  //   console.log(user)
  // })
  
  // find
  // find return cursor as a value
  // cursor is a pointer to the database
  db.collection('users').find({
    age: 27
  }).toArray( (error, users) => {
    if (error) {
      return console.log('Unable to fetch')
    }
    
    console.log(users)
  })
  
  // count
  // there is no need to fetch all data and save them in memory
  // we can return just simple value
  db.collection('users').find({
    age: 27
  }).count( (error, count) => {
    if (error) {
      return console.log('Unable to fetch')
    }
    
    console.log(count)
  })
})

