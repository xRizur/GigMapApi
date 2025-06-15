const express = require('express');
const multer = require('multer');
const { addBand, getBands, viewBands, deleteBand, updateBand, getBandAvailability, updateBandAvailability } = require('../controllers/bandsController');
const router = express.Router();
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

router.post('/', upload.single('image'), addBand);
router.get('/', getBands);

router.get('/view', viewBands);

router.delete('/:id', deleteBand);
router.put('/:id', updateBand);

router.get('/:id/availability', getBandAvailability);
router.put('/:id/availability', updateBandAvailability);

module.exports = router;