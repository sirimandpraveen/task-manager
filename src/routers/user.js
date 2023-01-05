import express from 'express'
import User from '../models/User.js'
import auth from '../middleware/auth.js'
import multer from 'multer'
import sharp from 'sharp'
// import sendWelcomeEmail, {sendCancelationEmail} from '../emails/email.js'
const router = express.Router()

router.post('/users', async (req, res) => {
  const user = new User(req.body)

  try {
    await user.save()
    // sendWelcomeEmail(user.email, user.name)
    const token = await user.generateAuthToken()
    res.status(201).send({user,token})
  } catch (e) {
    res.status(400).send({Error: e.message})
  }
})

router.post('/users/login', async (req, res) => {
  try {
    const user = await User.findByCredentials(req.body.email, req.body.password)
    const token = await user.generateAuthToken()
    res.send({user, token})
  } catch (e) {
    res.status(400).send(e.message)
  }
})

router.post('/users/logout', auth, async(req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token
    })
    await req.user.save()
    res.send()
  } catch (e) {
    res.status(500).send()
  }
})
 
router.post('/users/logoutAll', auth, async(req, res) => {
  try {
    req.user.tokens = []
    await req.user.save()
    res.send()
  } catch (e) {
    res.status(500).send()
  }
})

router.get('/users', (req, res) => {
  const myArray = []
  var myUser = {}
  User.find({})
    .then((user)=> {
      user.forEach((user) => { 
        myUser._id = user._id
        myUser.name = user.name
        myUser.age = user.age
        myUser.email = user.email
        myUser.password_hashed = user.password
        myUser.tokens_data = user.tokens
        myUser.createdAt = user.createdAt
        myUser.updatedAt = user.updatedAt

        if(user.avatar) {
          myUser.avatar = 'its there'
        }

        myArray.push(myUser)
        myUser = {}
      })
      res.send(myArray)
    })
})

router.get('/users/me', auth, (req, res) => {
  res.send(req.user)
})

router.patch('/users/me', auth, async(req, res) => {
  const updates = Object.keys(req.body)
  const allowedUpdates = ['name', 'email', 'password', 'age']
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

  if(!isValidOperation) {
    return res.status(400).send({error: 'Invalid updates'})
  }
  try {
    updates.forEach((update) => req.user[update] = req.body[update])
    await req.user.save()
    res.send(req.user)
  } catch(e) {
    res.status(400).send(e)
  }
})

router.delete('/users/me', auth, async(req, res) => {
  try {
    await req.user.remove()
    // sendCancelationEmail(req.user.email, req.user.name)
    res.send(req.user)
  } catch (e) {
    res.status(500).send(e)
  }
})

const storage = multer.memoryStorage()
const upload = multer({
  // dest: 'avatars',
  storage: storage,
  limits: {fileSize:1000000},
  fileFilter(req, file, cb) {
    if(!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error("please upload a image"))
    }

    cb(undefined, true)
  }
})

router.post('/avatar', auth, upload.single('avatar'), async (req, res) => {
  const buffer = await sharp(req.file.buffer).resize(250, 250).png().toBuffer()
  req.user.avatar = buffer
  await req.user.save()
  res.set('Content-Type', 'image/png')
  res.send(buffer)
  }, (error, req, res, next) => {
    res.status(400).send({error: error.message})
  }
)

router.delete('/avatar', auth, async (req, res) => {
  req.user.avatar = undefined
  await req.user.save()
  res.send()
})

router.get('/avatar/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if(!user || !user.avatar) {
    throw new Error("Might no user/avatar ")
    }
    res.set('Content-Type', 'image/png')
    res.send(user.avatar)
  } catch (e) {
    res.status(404).send(e.message)
  }
})

export default router