import mongoose from 'mongoose';
import dotenv from 'dotenv'
dotenv.config()

mongoose.set('strictQuery', true)
main().catch(err => console.log(err));

async function main() {
  mongoose.connect(process.env.mongodb_urlP);
}

// const me = new User({
//   name: 'harry',
//   age: 27,
//   email: 'harry@example.com'
// })

// const _id = '63ab0bdcc49c9a08581b746e'
//   User.findOne({_id})
//     .then((user) => {
//       if(!user) { return console.log(404) }
//       console.log(user)
//     }).catch((e) => {
//       console.log(500)
//     })

// me.save()
//   .then(() => console.log(me))
//   .catch((e) => console.log('Error', e))