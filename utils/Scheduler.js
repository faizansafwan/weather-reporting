
const cron = require('node-cron');
const axios = require("axios");
const UserSchema = require('../models/UserSchema');
const sendMail = require('./EmailService');

const getWeatherData = async (city, country) => {
    try {
        const APIKey = process.env.OPENWEATHER_API_KEY;

        const response = await axios.get(
            `api.openweathermap.org/data/2.5/forecast?q=${city},${country}&limit=1&appid=${APIKey}`);

            if (!response.data.length) return null;

            const { lat, lon } = response.data[0];

        
        const weatherResponse = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
        )

        return weatherResponse.data;
    } 

    catch (error) {
        console.error("Error fetching weather data:", error.message);
        return null;
      }
}

const sendWeatherReport = async () => {
    try {
        const users = await UserSchema.find({}, "email city country");

        for (const user of users) {
            if (!user.city || !user.country) continue;

            const weatherData = await getWeatherData(user.city, user.country);

            if (!weatherData) continue;

            const emailText = `
        Hello ${user.email},
        
        Here is your latest weather update:
        
        🌡️ Temperature: ${weatherData.main.temp}°C
        🌬️ Wind Speed: ${weatherData.wind.speed} m/s
        💧 Humidity: ${weatherData.main.humidity}%
        ☁️ Condition: ${weatherData.weather[0].description}

        Stay safe! `;

        await sendMail(user.email, 'Hourly Weather Report', emailText);
        }

        console.log("Weather reports sent to all users!");
    }

    catch (error) {
        console.error("Error in sending weather reports:", error.message);
    }
};

// Schedule to run every 3 hours
cron.schedule("0 */3 * * *", sendWeatherReport, {
    timezone: "Asia/Colombo", // Change based on your timezone
});

module.exports = sendWeatherReport;