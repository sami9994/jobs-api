const express = require('express')
const {
  getAllJobs,
  getJob,
  updateJob,
  deleteJob,
  createJob,
} = require('../controllers/jobs')

const router = express.Router()
router.route('/').post(createJob)
router.route('/').get(getAllJobs)
router.route('/:id').get(getJob)
router.route('/edit/:id').patch(updateJob)
router.route('/delete/:id').delete(deleteJob)

module.exports = router
