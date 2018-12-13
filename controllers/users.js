const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
  try {
    const users = await User
      .find({})
      .populate('blogs', { title: 1, likes: 1 } )
    let content
    if( users.length === 0) {
      content = {}
    } else {
      content = users.map(User.format)
    }
    response.json(content).end()
  } catch (exception) {
    response.status(400).json({ error: 'something went wrong...' })
  }
})

const credentialsOk = async (uname, pwd) => {
  if (pwd.length < 3) {
    return false
  }
  const oldUsernames = (await User.find({})).map(u => u.username)
  if (oldUsernames.includes(uname)) {
    return false
  }
  return true
}

usersRouter.post('/', async (request, response) => {
  try {
    const { username, name, password, adult } = request.body

    if (!(await credentialsOk(username, password))) {
      return response.status(400).json({ error: 'invalid credentials' })
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = new User({
      username,
      name,
      passwordHash,
      adult
    })

    const savedUser = await user.save()

    response.json(savedUser)
  } catch (exception) {
    console.log(exception)
    response.status(500).json({ error: 'something went wrong...' })
  }
})

module.exports = usersRouter
