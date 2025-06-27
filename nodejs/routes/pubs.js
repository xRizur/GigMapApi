const express = require('express');
const { addPub, getPubs, viewPubs, deletePub, updatePub, getPubAvailability, updatePubAvailability, editPub, deletePubForm } = require('../controllers/pubsController');
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
router.get('/new', (req, res) => {
  const basePath = res.locals.basePath || req.app.locals.basePath || '';
  res.render('pub_form', { 
    basePath,
    availabilityStart: '',
    availabilityEnd: ''
  });
});
router.get('/view',viewPubs);

router.get('/edit/:id', editPub);
router.post('/update/:id', upload.single('image'), updatePub);
router.post('/delete', deletePubForm);

router.get('/:id/availability', getPubAvailability);
router.put('/:id/availability', updatePubAvailability);


module.exports = router;