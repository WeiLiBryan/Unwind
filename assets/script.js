var weatherApiKey = "c8cbf2d95a5dea77ab7ea30913acbe6d";
var googlePlacesApiKey = "AIzaSyBkWn72ID7mx-gdIlXW5iUCHaT8-O-3lBA";

$(document).ready(function(){

// ONCE SEARCH BUTTON IS CLICKED
$('.INFO-FIELD-SEARCH').on("click", function() {
    // CHECKS ZIP CODE ENTERED IN INPUT FIELD
    var zipCode = $(".ZIP-INPUT-FIELD").val().trim();

    if (zipCode.length === 5) {
        checkWeather(zipCode, city);
    }
    else {
        // WARNING
        generateModal("error");
    }

});

function checkWeather(zipCode) {
    
    var queryURL = "api.openweathermap.org/data/2.5/weather?q="+ zipCode + "&appid=" + weatherApiKey;

    $.ajax ({
        url: queryURL,
        method: "GET"
    }).then(function(response) { 
        console.log("Weather API Response: " + response);
        var weatherDesc = reponse.weather.description;
        if (weatherDesc === "clear sky"){
            locatePark(zipCode);
        }
        else {
            generateModal("bad");
        }
    });
}

function locatePark(zipCode) {
    var queryURL = "https://maps.googleapis.com/maps/api/place/textsearch/json?query=park+in+" + zipCode + "&key=" + googlePlacesApiKey;
    var latNlon = [];

    $.ajax ({
        url: queryURL,
        method: "GET"
    }).then(function(response) { 
        console.log("Google Map Response: " + response);

        // Construct a map making object containing all information needed
        for (var i=0; i < 5; i++){
            var tempOBJ = {lat: "",lon: ""}
            tempOBJ.lat = response.result[i].geometry.location.lat;
            tempOBJ.lon = response.result[i].geometry.location.lon;
            latNlon.push(tempOBJ);
        }

        drawMap(latNlon);
    });
}


function generateModal(str) {
    if (str === "error"){
        // incorrect zip code case
    }

    if (str === "bad") {
        // bad weather case
        // Prompt user yes or no if they want to visit a coffee shop instead
        // if yes execute locateShop();
    }
}













});

