const { BadRequestError, NotFoundError } = require('../errors')
const { StatusCodes } = require('http-status-codes')

const Job = require('../models/Job')
const getAllJobs = async (req, res) => {
  const allJobs = await Job.find({ createdBy: req.user.userId })
  const count = await Job.find({ createdBy: req.user.userId }).count()

  if (!allJobs) {
    throw new NotFoundError('no jobs ')
  }
  res.status(StatusCodes.OK).json({ jobs: allJobs, count })
}
const getJob = async (req, res) => {
  const { id } = req.params
  const job = await Job.findOne({ _id: id, createdBy: req.user.userId })
  if (!job) {
    throw new NotFoundError(`this job with id ${id} is not founded`)
  }
  res.status(StatusCodes.OK).json({ job })
}

const updateJob = async (req, res) => {
  const { id } = req.params
  const { company, status, position } = req.body
  const job = await Job.findOne({ _id: id, createdBy: req.user.userId })
  if (!job) {
    throw new NotFoundError(`this job with id ${id} is not founded`)
  }
  if (!company && !status && !position) {
    throw new BadRequestError('please provide fields')
  }
  job.company = company
  job.status = status
  job.position = position
  job.save()
  res.status(StatusCodes.OK).json({ job })
}
const createJob = async (req, res) => {
  const { company, position } = req.body
  if (!company || !position) {
    throw new BadRequestError('please provide all fields')
  }
  const job = await Job.create({
    company,
    position,
    createdBy: req.user.userId,
  })
  res.status(StatusCodes.CREATED).json({ job })
}
const deleteJob = async (req, res) => {
  const { id } = req.params

  const job = await Job.findOneAndDelete({
    _id: id,
    createdBy: req.user.userId,
  })
  if (!job) {
    throw new NotFoundError(`this job with id ${id} is not founded`)
  }
  res.json(`job with id ${id} has been successfully deleted`)
}
module.exports = {
  getAllJobs,
  getJob,
  updateJob,
  deleteJob,
  createJob,
}
