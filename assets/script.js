var apiKey = "c8cbf2d95a5dea77ab7ea30913acbe6d";

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
    
    var queryURL = "api.openweathermap.org/data/2.5/weather?q="+ zipCode + "&appid=" + apiKey;

    $.ajax ({
        url: queryURL,
        method: "GET"
    }).then(function(response) { 
        console.log(response);
        var weatherDesc = reponse.weather.description;
        if (weatherDesc === "clear sky"){
            locatePark(zipCode);
        }
        else {
            generateModal("bad");
        }
    });
}

function generateModal(str) {
    if (str === "error"){
        // incorrect zip code case
    }

    if (str === "bad") {
        // bad weather case
    }
}













});

