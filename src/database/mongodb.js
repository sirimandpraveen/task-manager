import { MongoClient, ObjectId } from "mongodb";

const url = 'mongodb://localhost:27017'
const client = new MongoClient(url)

const dbName1 = 'Users'
const dbName2 = 'Tasks'

async function main() {
  await client.connect()
  console.log('Connected successfully to server')

  const Users = client.db(dbName1).collection('documents')
  const Tasks = client.db(dbName2).collection('documents')

  Users.insertMany([
  { name: 'andrew', age: 27},
  { name: 'Mike', age: 25}  
  ])

  Tasks.insertMany([
    {
      description: 'Clean the house',
      completed: true
    }, {
      description: 'Renew inspection',
      completed: false
    }
  ])

  // const finalResult = await Tasks.find({ completed: false }).toArray()
  // console.log(finalResult)

  // Tasks.findOne({ completed: false })
  //   .then((res) => console.log(res))
  //   .catch(() => console.log('This is the custom error'))

  // Users.updateOne({ 
  //     _id: ObjectId('63ab05afeaebc48dcb581b0b') 
  // },{ 
  //     $inc: { 
  //       age: 1 
  //     }
  // }).then((result) => console.log(result))
  //   .catch((error) => console.log(error))

  // Tasks.updateMany({
  //   completed: false
  //   }, {
  //   $set: {
  //   completed: true
  //   }
  //   }).then((result) => console.log(result))
  //   .catch((error) => console.log(error))

  // Users.deleteMany({
  //   age: 27
  //  }).then((result) => console.log(result))
  //  .catch((error) => console.log(error))

  //  Tasks.deleteOne({ description: "Clean the house"})
  //  .then((result) => {console.log(result)})
  //  .catch((error) => {console.log(error)})

  return 'done'
}
  

main()
  .then(console.log)
  .catch(console.log)
  // .finally(() => client.close())

// const id = new ObjectId()
// console.log(id)