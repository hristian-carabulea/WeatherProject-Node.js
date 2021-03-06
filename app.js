// must login to openweathermap.org and get own api id
// paste the URL below in the browser, and using the JSON Viewer Pro extension you get the info below.

//******************************* MUST ADD YOUR OWN OPENWEATHERMAPID IN THE APPID BELOW ***********************************/
// const url = "https://api.openweathermap.org/data/2.5/weather?
//****************************************************************************************************************/

const express = require("express");
const https = require('https');
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res){
  res.sendFile(__dirname + "/index.html");
  // res.send("Server is up and running.");
  
}) // end app.get("/", function(req, res)

app.post("/", function(req, res){
  console.log(req.body.cityName);
  var responseCode = 0;
  const query = req.body.cityName;
  require("./config.js");
  const apiKey = SECRET_API_KEY;
  const unit = "metric";
  const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + apiKey + "&units=" + unit;
  /* For light rain icon = "10d" the picture URL is https://openweathermap.org/img/wn/10d@2x.png */

  https.get(url, function(response){ //call the variable response because we alredy have a variable call res.
    console.log(response.statusCode);
    if (response.statusCode == 404) {
      console.log("Location was not found " + query);
      res.write("<h1>The location " + query + " was not found!</h1>");
      res.send();
    } // end if
    else {
      response.on("data", function(data) {
        const weatherData = JSON.parse(data); // checkout what JSON.stringfy(object) at some point in time - the opposite
        const cityName = weatherData.name;
        const weatherID = weatherData.weather[0].id;
        const mainData = weatherData.weather[0].main;
        const mainDescription = weatherData.weather[0].description;
        const mainIcon = weatherData.weather[0].icon;
        const imageURL = 'https://openweathermap.org/img/wn/'  + mainIcon + '@2x.png';
        const temp = weatherData.main.temp;
        const feels_like = weatherData.main.feels_like;
        const clouds = weatherData.clouds.all;
        const windSpeed = weatherData.wind.speed;

        console.log("City: " + cityName);
        console.log("Weather Status: " + mainData);
        console.log("Description: " + mainDescription);
        console.log("Weather symbol: " + mainIcon);
        console.log("Cloud coverage: " + clouds + " %");
        console.log("Temperature: " + temp + " C");
        console.log("Temperature feels like: " + feels_like + " C");
        console.log("Cloud coverage: " + clouds + " %");
        console.log("Wind speed: " + windSpeed);
        console.log("weatherID: " + weatherID);
        console.log("weatherIcon: " + mainIcon);
        console.log("imageURL: " + imageURL);

        res.write("<h1>The current weather for " + cityName + ":</h1>");

        res.write("<h2>The temperature is " + temp + " degrees Celcius.</h2>");
        res.write("<h2>The temperature feels like " + feels_like + " degrees Celcius.</h2>");
        res.write("<h2>The weather description is " + mainDescription + ".</h2>");
        res.write("<h2>Cloud coverage: " + clouds + " %" + ".</h2>");
        // res.write("<p>The weather ID is currently " + weatherID + ".</p>");
        // res.write("<p>The weather icon is currently " + mainIcon + ".</p>");
        res.write("<img src=" + imageURL + ">");
        res.send();
      }) // end response.on
    } // end else

  }); // end https.get(url, function(response)
    
}) // end app.post

app.listen(3000, function() {
  console.log("Server is running on port 3000.");
})
