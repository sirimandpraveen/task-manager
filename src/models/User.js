import mongoose from 'mongoose';
import validator from 'validator'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import Task from './Tasks.js';

mongoose.set('strictQuery', true)

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  age: { type: Number, default: 0, 
    validate(value) {
      if(value<0) { throw new Error('Age must be positive number.')}
  }},
  email: { type: String, required: true, 
    validate(value) {
      if(!validator.isEmail(value)) {
        throw new Error('Email is invalid')
      }
  }},
  password: { type: String, required: true, minlength: 7, trim: true,
    validate(value) {
      if(value.toLowerCase().includes('password')) {
        throw new Error('Password cannot contain "password"')
      }
  }},
  tokens: [{
    token: {type: String, required: true}
  }],
  avatar: { type: Buffer }
}, { versionKey: false, timestamps: true })

userSchema.virtual('tasks', {
  ref: 'Task',
  localField: '_id',
  foreignField: 'owner'
})

userSchema.methods.toJSON = function() {
  const user = this
  const userObject = user.toObject()
  
  if(userObject.avatar) {
    userObject.avatar = 'its there'
  }
  
  delete userObject.password
  delete userObject.tokens

  return userObject
}

userSchema.methods.generateAuthToken = async function() {
  const user = this
  const token = jwt.sign({_id: user._id.toString()}, process.env.jwt_key)
  user.tokens = user.tokens.concat({token})
  await user.save()
  return token
}

userSchema.pre('save', async function(next) {
  const user = this

  if(user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8)
  }
  next()
})

userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({email})
  if(!user) { throw new Error('Email not found.') }
  const isMatch = await bcrypt.compare(password, user.password)
  if(!isMatch) { throw new Error('Password not matched.')}
  return user
}

userSchema.pre('remove', async function(next) {
  const user = this
  await Task.deleteMany({ owner: user._id})
  next()
})

const User = mongoose.model('User', userSchema)

export default User