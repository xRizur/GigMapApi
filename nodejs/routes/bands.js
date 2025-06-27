const express = require('express');
const multer = require('multer');
const { addBand, getBands, viewBands, deleteBand, updateBand, getBandAvailability, updateBandAvailability, editBand, deleteBandForm } = require('../controllers/bandsController');
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
router.get('/new', (req, res) => {
  const basePath = res.locals.basePath || req.app.locals.basePath || '';
  res.render('band_form', { 
    basePath,
    availabilityStart: '',
    availabilityEnd: ''
  });
});
router.get('/view', viewBands);

router.get('/edit/:id', editBand);
router.post('/update/:id', upload.single('image'), updateBand);
router.post('/delete', deleteBandForm);

router.get('/:id/availability', getBandAvailability);
router.put('/:id/availability', updateBandAvailability);


module.exports = router;