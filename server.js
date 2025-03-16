require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const UserRoute = require('./routes/UserRoute.js');
const WeatherRoute = require('./routes/WeatherRoute.js');

const app = express();

app.use(cors());
app.use(express.json());

// DB Connection
mongoose.connect(
    process.env.MONGO_URI)
    .then( () => console.log("MongoDB Connected"))
    .catch( (err) => console.error("MongoDB Connection Error:", err));

app.use('/api/users', UserRoute);
app.use('/api/weather', WeatherRoute);

// Sample route
app.get("/", (req, res) => {
    res.send("API is running...");
  });
  

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

