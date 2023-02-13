const express = require('express');
const router = express.Router();

const tripsController = require ('../controllers/trips');

/* GET home page. */
router
    .route('/trips')
    .get(tripsController.tripsList)
    .post(tripsController.tripsAddTrip);

router
    .route('/trips')
    .get(tripsController.tripsFindCode)
    .put(tripsController.tripsUpdateTrip);    


module.exports = router;
