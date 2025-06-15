const express = require('express');

const { createRequest, getRequests, viewRequests, acceptRequest, rejectRequest, showNewRequestForm } = require('../controllers/requestsController');
const router = express.Router();


router.post('/', createRequest);
router.get('/', getRequests);

router.get('/new', showNewRequestForm);
router.get('/view', viewRequests);

router.post('/:id/accept', acceptRequest);
router.post('/:id/reject', rejectRequest);

module.exports = router;