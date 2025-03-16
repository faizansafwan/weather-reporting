const UserSchema = require("../models/UserSchema");
const jwt = require('jsonwebtoken');
const axios = require("axios");

const getWeatherByLocation = async (req, res) => {
    try {
        const userId = req.user.id;
        const { date } = req.query;
        const apiKey = process.env.OPENWEATHER_API_KEY;

        if (!date) {
            return res.status(400).json({ message: "Date query parameter is required" });
        }

        // Fetch user details from DB
        const user = await UserSchema.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const { city, country } = user;
        if (!city || !country) {
            return res.status(400).json({ message: "User location (city & country) is missing" });
        }
  
        // OpenWeatherAPI: Get city coordinates (latitude & longitude)
        const response = await axios.get(
        `http://api.openweathermap.org/geo/1.0/direct?q=${city},${country}&limit=1&appid=${apiKey}`
        );

        if (!response.data.length) {
        return res.status(404).json({ message: "Location not found" });
        }

        const { lat, lon } = response.data[0];

        // OpenWeatherAPI: Get weather data using coordinates
        const weatherResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
        );

        // Filter weather data for the specified date
        const filteredWeather = weatherResponse.data.list.filter((entry) =>
        entry.dt_txt.startsWith(date) // Format: "YYYY-MM-DD"
        );

        if (!filteredWeather.length) {
        return res.status(404).json({ message: "No weather data available for the specified date" });
        }

        res.json({
        location: { city, country, latitude: lat, longitude: lon },
        weather: filteredWeather,
        });
        } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
        }
  };

  
// // Retrieve Weather Data for a Given Day
// const getWeatherDataByDate = async (req, res) => {
//     try {
//         const { date } = req.query;
//         const user = await UserSchema.findById(req.params.id);

//         if (!user) return res.status(404).json({ message: "User not found" });

//         const filteredData = user.weatherData.filter((entry) => 
//             new Date(entry.date).toDateString() === new Date(date).toDateString()
//         );

//         res.json(filteredData.length ? filteredData : { message: "No data found for this date" });
//     } catch (error) {
//         res.status(500).json({ message: "Server error", error: error.message });
//     }
// };

module.exports = { getWeatherByLocation };
  