require('dotenv').config()
const User = require('../models/User.js')
const { StatusCodes } = require('http-status-codes')
const BadRequestError = require('../errors/bad-request')
const UnauthenticatedError = require('../errors/unauthenticated')

const register = async (req, res) => {
  const { name, password, email } = req.body

  if (!name || !password || !email) {
    throw new BadRequestError('please provide all fields')
  }

  const user = await User.create({ name, email, password })
  const token = user.createJWT()

  res.status(StatusCodes.CREATED).json({
    msg: 'the user has successfully created',
    token,
  })
}
const login = async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    throw new BadRequestError('please provide email and password')
  }
  const user = await User.findOne({ email })
  if (!user) {
    throw new UnauthenticatedError('invalid credentials')
  }
  const isPassword = await user.comparePassword(password)
  if (!isPassword) {
    throw new UnauthenticatedError('invalid credentials')
  }
  const token = user.createJWT()
  res.status(StatusCodes.OK).json({ user: { name: user.name }, token })
}
module.exports = {
  register,
  login,
}
