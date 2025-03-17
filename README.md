# Weather App API

## Overview
This is a simple Node.js & Express-based REST API for managing users, updating their location, and retrieving weather reports.

## Features
 * User Registration & Login with JWT authentication
 * Update user location (Country & City)
 * Fetch weather data for a given location
 * Automatic weather reporting to email for every 3 hours

## Installation

### Clone the Repository
git clone https://github.com/faizansafwan/weather-reporting.git 

cd weather-reporting

### Install Dependencies
touch .env

### Add variable and values to .env file
PORT=5000
MONGO_URI=replace_your_mongodb_connection_string
JWT_SECRET=your_secret_key
WEATHER_API_KEY=your_openweathermap_api_key

## API Endpoints

### User Registration
POST http://localhost:5000/api/users 

#### Request Body
{
  "name": "John Doe",
  "email": "johndoe@example.com",
  "password": "Secure@123",
  "country": "USA",
  "city": "New York"
}

### User Login
POST http://localhost:5000/api/users/login

#### Request Body
{
  "email": "johndoe@example.com",
  "password": "Secure@123"
}

### Update User Location
PUT http://localhost:5000/api/users/location/:userid

#### Headers
{
  "Authorization": "Bearer your_jwt_token"
}

#### Request Body
{
  "country": "Canada",
  "city": "Toronto"
}

### Get Weather Report
GET http://localhost:5000/api/weather/get-weather?date=YYYY-MM-DD

## Run Server
nodemon server.js 
