const express = require('express');

const { createRequest, getRequests, viewRequests, acceptRequest, rejectRequest, showNewRequestForm, deleteRequest, editRequest, updateRequest } = require('../controllers/requestsController');
const router = express.Router();


router.post('/', createRequest);
router.get('/', getRequests);

router.get('/new', showNewRequestForm);
router.get('/view', viewRequests);
router.get('/edit/:id', editRequest);
router.post('/update/:id', updateRequest);

router.post('/:id/accept', acceptRequest);
router.post('/:id/reject', rejectRequest);
router.post('/delete', deleteRequest);


module.exports = router;