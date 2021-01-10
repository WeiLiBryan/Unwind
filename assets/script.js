var weatherApiKey = "c8cbf2d95a5dea77ab7ea30913acbe6d";
var googlePlacesApiKey = "AIzaSyBkWn72ID7mx-gdIlXW5iUCHaT8-O-3lBA";

$(document).ready(function() {

    // ONCE SEARCH BUTTON IS CLICKED
    $(".zipCodeInput").on("click", function(event) {
        // CHECKS ZIP CODE ENTERED IN INPUT FIELD
        event.preventDefault();
        var zipCode = $(".zipInputField").val().trim();

        // UNHIDES THE MODAL
        $(".location").empty();
        checkWeather();

        if (zipCode.length === 5) {
            checkWeather(zipCode);
        }
        else {
            // ERROR MESSAGE
        }

    });

// ONCE SAVE BUTTON FOR BOOK FIELDS IS CLICKED
$('.BOOK-PREF-SAVE').on("click", function() {
    readingPreferences();
});

$('.LIBRARY-ZIP-CODE-BTN-SUBMIT').on("click", function() {
    var zipCode = $('LIBRARY-ZIP-INPUT-FIELD').val().trim();
    locate(zipCode, "library");
});

// ONCE LOCATION CARD IS CLICKED
$('.locationOption').on("click", function() {
    // SELECTS BOOK CHOICE CLASS/DIV ON SIDEBAR AND SAVES THE BOOK NAME TO IT
    $('.locationChoice').text(this.data);

    // HIDES THE MODAL ONCE THE CARD IS CLICKED
    $('.MODAL-CLASS').attr('display', 'none');
});

// ONCE BOOK CARD IS CLICKED
$('.bookOption').on("click", function() {
    // SELECTS BOOK CHOICE CLASS/DIV ON SIDEBAR AND SAVES THE BOOK NAME TO IT
    $('.bookChoice').text(this.data);

    // HIDES THE MODAL ONCE THE CARD IS CLICKED
    $('.MODAL-CLASS').attr('display', 'none');
});

// Convert address tags to google map links - Copyright Michael Jasper 2011
$('.address').each(function () {
    var link = "<a href='http://maps.google.com/maps?q=" + encodeURIComponent( $(this).text() ) + "' target='_blank'>" + $(this).text() + "</a>";
    $(this).html(link);
});

function checkWeather(zipCode) {
    
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?zip="+ zipCode + "&appid=" + weatherApiKey;

    $.ajax ({
        url: queryURL,
        method: "GET"
    }).then(function(response) { 
        console.log("Weather response: ", response);
        var weatherDesc = response.weather[0].description;
        if (weatherDesc === "clear sky"){
            locate(zipCode, "park");
        }
        else {
            locate(zipCode, "coffee");
        }
    });
}

function locate(zipCode, location) {
    var queryURL = "https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/textsearch/json?query=" + location + "+in+" + zipCode + "&key=" + googlePlacesApiKey;

    var latNlon = [];

    $.ajax ({
        url: queryURL,
        method: "GET"
    }).then(function(response) { 
        console.log("Google Map Response: ", response);

        // Construct a map making object containing all information needed
        for (var i=0; i < 5; i++){
            var tempOBJ = {lat: "",lon: "", title: "", address: "", thumbnail: ""}
            tempOBJ.lat = response.result[i].geometry.location.lat;
            tempOBJ.lon = response.result[i].geometry.location.lng;
            tempOBJ.title = response.result[i].name;
            tempOBJ.address = response.result[i].formatted_address;
            tempOBJ.thumbnail = response.result[i].

            latNlon.push(tempOBJ);
        }

        generateModal("location");
        drawMap(latNlon);
        generateLocationPreview(latNlon);
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
    
    $("#locationMap").append(img);
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

function readingPreferences() {
    var genre = $('.GENRE-INPUT-DROPDOWN').val();
    var userSpec = $('.SPEC-USER-INPUT').val();
    var bookList = [];

    var queryURL = "https://www.googleapis.com/books/v1/volumes?q=subject:" + genre + "&intitle:" + userSpec;

    $.ajax ({
        url: queryURL,
        method: "GET"
    }).then(function(response) { 
        console.log("Book Results: ", response);

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
        card.attr('class', 'card bookOption');
        card.attr('style', 'width: 300px;');
        card.attr('data-name', bookList[l].title);

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
        $('.MODAL-CONTENT').append(card);
    }
}

// GENERATES CARDS FOR THE LOCATION
function generateLocationPreview(latNlon) {

    for (var l=0; l<latNlon.length; l++){
        // CARD DIV
        var card = $('<div>');
        card.attr('class', 'card locationOption');
        card.attr('style', 'width: 300px;');
        card.attr('data-name', latNlon[l].title);

        // TITLE DIV
        var cardHeader = $('<div>');
        cardHeader.attr('class', 'card-divider');
        cardHeader.text(latNlon[l].title);
        
        // THUMBNAIL
        var thumbnail = $('<img>');
        thumbnail.attr('src', latNlon[l].thumbnail);

        // CONTAINER FOR ADDRESS
        var contentContainer = $('<div>');
        contentContainer.attr('class', 'card-section');

        // ADDRESS
        var address = $('<p>');
        address.text(latNlon[l].address);
        address.attr('class', 'address');

        // APPEND ADDRESS
        contentContainer.append(address); 

        // APPEND HEADER, THUMBNAIL AND CARD CONTENT TO CARD DIV
        card.append(cardHeader);
        card.append(thumbnail);
        card.append(contentContainer);

        // APPENDS TO WHERE WE WILL PUT THE BOOKS
        $('#location' + l).append(card);
    }
}

function generateModal(str) {
    
    // BUILD LOCATION MODAL
    if (str = "location"){
        var body = $('modalContent');
        // var row = $("<div>");
        // row.attr('class', 'grid-x');
        // var col = $("<div>");
        // col.attr('class', 'cell-small-6');
        // row.append(col);
        // row.append(col);
        var html = '<div class="grid-x">';
            html+= '<div class = "small-6-cell" ID="locationMap">MAP</div>';
            html+= '<div class="small-6-cell">';
            html+= '<div class="grid-x">';
            html+= '<div class ="small-4-cell" ID="location0">CARD ONE</div>';
            html+= '<div class ="small-4-cell" ID="location1">CARD 2</div>';
            html+= '<div class ="small-4-cell" ID="location2">CARD 3</div>';
            html+= '</div>';
            html+= '<div class="grid-x">';
            html+= '<div class ="small-4-cell" ID="location3">CARD 4</div>';
            html+= '<div class ="small-4-cell" ID="location4">CARD 5</div>';
            html+= '<div class ="small-4-cell" ID="location5">CARD 6</div>';
            html+= '</div>';
            html+= '</div>';
            html+= '</div>';
            html+= '</div>';
            // html+= '<button class="close-button" data-close aria-label="Close modal" type="button">';
            // html+= '<span aria-hidden="true">&times;</span>';
            // html+= '</button>';
            html+= '</div>';
            body.html(html);
    }
}

// div class="reveal" id="exampleModal1" data-reveal>
//         <div class="modalContent">
//             <div class="row">
//                 - <div class = "col-sm-6">MAP</div>
//                 - <div class="col-sm-6">
//                     <div class="row">
//                         <div class ="col-sm-4">CARD ONE</div>
//                         <div class ="col-sm-4">CARD 2</div>
//                         <div class ="col-sm-4">CARD 3</div>
//                     </div>
//                     <div class="row">
//                         <div class ="col-sm-4">CARD 4</div>
//                         <div class ="col-sm-4">CARD 5</div>
//                         <div class ="col-sm-4">CARD 6</div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//         <button class="close-button" data-close aria-label="Close modal" type="button">
//             <span aria-hidden="true">&times;</span>
//         </button>
//     </div>




});

