const express = require('express');
const { protect } = require('../middlewares/auth');
const { getWeatherByLocation } = require('../controllers/WeatherController');

const router = express.Router();


// Retrieve weather data for a given day 
router.get('/get-weather', protect, getWeatherByLocation);

module.exports = router;



