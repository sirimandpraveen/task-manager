import express from 'express'
import dotenv from 'dotenv'
import './database/mongoose.js'
import userRouter from './routers/user.js'
import taskRouter from './routers/task.js'


dotenv.config()
// console.log('') /Users/sirim/mongodb/bin/mongod.exe --dbpath=/Users/sirim/mongodb-data
const app = express()

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

app.listen(process.env.PORT, () => console.log("server running at port " + process.env.PORT))

