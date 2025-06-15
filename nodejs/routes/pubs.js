const express = require('express');
const { addPub, getPubs, viewPubs, deletePub, updatePub, getPubAvailability, updatePubAvailability } = require('../controllers/pubsController');
const router = express.Router();
const multer = require('multer');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
      const uniqueName = Date.now() + '-' + file.originalname;
      cb(null, uniqueName);
    }
  });
const upload = multer({ storage: storage });


router.post('/', upload.single('image'), addPub);
router.get('/', getPubs);

router.get('/view',viewPubs);

router.delete('/:id', deletePub);
router.put('/:id', updatePub);

router.get('/:id/availability', getPubAvailability);
router.put('/:id/availability', updatePubAvailability);

module.exports = router;