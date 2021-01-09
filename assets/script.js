var weatherApiKey = "c8cbf2d95a5dea77ab7ea30913acbe6d";
var googlePlacesApiKey = "AIzaSyBkWn72ID7mx-gdIlXW5iUCHaT8-O-3lBA";

$(document).ready(function(){

// ONCE SEARCH BUTTON IS CLICKED
$('.INFO-FIELD-SEARCH-BTN').on("click", function() {
    // CHECKS ZIP CODE ENTERED IN INPUT FIELD
    var zipCode = $(".ZIP-INPUT-FIELD").val().trim();

    if (zipCode.length === 5) {
        checkWeather(zipCode);
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
            var tempOBJ = {lat: "",lon: "", title: ""}
            tempOBJ.lat = response.result[i].geometry.location.lat;
            tempOBJ.lon = response.result[i].geometry.location.lon;
            tempOBJ.title = response.result[i].name;
            latNlon.push(tempOBJ);
        }

        drawMap(latNlon);
    });
}

function drawMap(mapMaker){

    var img = $('<img>');

    var staticMapURL = "https://maps.googleapis.com/maps/api/staticmap?c&size=600x300&maptype=roadmap" +
    "&markers=color:red%7Clabel:" + mapMaker[0].title + "%7C" + mapMaker[0].lat + "," + mapMaker[0].lon + 
    "&markers=color:red%7Clabel:" + mapMaker[1].title + "%7C" + mapMaker[1].lat + "," + mapMaker[1].lon + 
    "&markers=color:red%7Clabel:" + mapMaker[2].title + "%7C" + mapMaker[2].lat + "," + mapMaker[2].lon + 
    "&markers=color:red%7Clabel:" + mapMaker[3].title + "%7C" + mapMaker[3].lat + "," + mapMaker[3].lon + 
    "&markers=color:red%7Clabel:" + mapMaker[4].title + "%7C" + mapMaker[4].lat + "," + mapMaker[4].lon + 
    "&key=" + googlePlacesApiKey;


    img.attr("src", staticMapURL);
    
    $(".IMG-DIV-TARGET").append(img);
}

// function initMap() {
    

//     map = new google.maps.Map(document.getElementById("map"), {
//         center: { lat: -34.397, lng: 150.644 },
//         zoom: 8,
//     });

//     // Map construction
//     var map = new google.maps.Map(document.getElementById("map"), {
//         zoom: 5,
//         center: myLatLng,
//     });

//     // Places markers    
//     for (var i=0; i<mapMaker.length; i++) {
//         var myLatLng = { lat: mapMaker[i].lat, lng: mapMaker[i].lon };

//         var marker = new google.maps.Marker({
//             position: myLatLng,
//             map,
//             title: mapMaker[i].title
//         });

//         marker.setMap(map);
//     }

// }


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

function readingPreferences() {
    var genre = $('.GENRE-INPUT-DROPDOWN').val();
    var userSpec = $('.SPEC-USER-INPUT').val();
    var bookList = [];

    var queryURL = "https://www.googleapis.com/books/v1/volumes?q=subject:" + genre + "&intitle:" + userSpec;

    $.ajax ({
        url: queryURL,
        method: "GET"
    }).then(function(response) { 
        console.log("Book Results: " + response);

        for (var k=0; k<10; k++) {
            var tempOBJ = {isbn: "",author: "", title: "", thumbnail: ""}
            tempOBJ.title = response.items[k].volumeInfo.title;
            tempOBJ.author = response.items[k].volumeInfo.authors;
            tempOBJ.isbn = response.items[k].volumeInfo.industryIdentifiers[0].identifier;
            tempOBJ.thumbnail = response.items[k].volumeInfo.imageLinks.thumbnail;
            bookList.push(tempOBJ);
        }


        generateBookPreview(bookList);

    });
}

// WILL GENERATE THE BOOK PREVIEW CARDS
function generateBookPreview(bookList) {

    for (var l=0; l<bookList.length; l++){
        // CARD DIV
        var card = $('<div>');
        card.attr('class', 'card');
        card.attr('style', 'width: 300px;');

        // BOOK TITLE DIV
        var cardHeader = $('<div>');
        cardHeader.attr('class', 'card-divider');
        cardHeader.text(bookList[l].title);
        
        // THUMBNAIL
        var thumbnail = $('<img>');
        thumbnail.attr('src', bookList[l].thumbnail);

        // CONTAINER FOR THE ISBN AND AUTHOR
        var contentContainer = $('<div>');
        contentContainer.attr('class', 'card-section');

        // AUTHOR
        var author = $('<h5>');
        author.text(bookList[l].author);

        // ISBN
        var isbn = $('<p>');
        isbn.text(bookList[l].isbn);

        // APPEND AUTHOR AND ISBN 
        contentContainer.append(author);
        contentContainer.append(isbn);

        // APPEND HEADER, THUMBNAIL AND CARD CONTENT TO CARD DIV
        card.append(cardHeader);
        card.append(thumbnail);
        card.append(contentContainer);

        // APPENDS TO WHERE WE WILL PUT THE BOOKS
        $('.BOOK-DIV').append(card);
    }
}







});

