var weatherApiKey = "c8cbf2d95a5dea77ab7ea30913acbe6d";
var googlePlacesApiKey = "AIzaSyBkWn72ID7mx-gdIlXW5iUCHaT8-O-3lBA";

$(document).ready(function () {


    // ONCE SEARCH BUTTON IS CLICKED
    $(".zipCodeInput").on("click", function (event) {
        // CHECKS ZIP CODE ENTERED IN INPUT FIELD
        event.preventDefault();
        var zipCode = $(".zipInputField").val().trim();


        // EMPTY ZIP FIELD TO PREPARE FOR MAP + LOCATION CARDS
        $("#relaxationSpot").empty();

        if (zipCode.length === 5) {
            checkWeather(zipCode);
        }
        else {
            // ERROR MESSAGE
        }

    });

    // ONCE SAVE BUTTON FOR BOOK FIELDS IS CLICKED
    $('#bookSubmit').on("click", function () {
        readingPreferences();
    });

    $('.LIBRARY-ZIP-CODE-BTN-SUBMIT').on("click", function () {
        var zipCode = $('LIBRARY-ZIP-INPUT-FIELD').val().trim();
        locate(zipCode, "library");
    });

    // ONCE LOCATION CARD IS CLICKED
    $('.locationOption').on("click", function () {
        // SELECTS BOOK CHOICE CLASS/DIV ON SIDEBAR AND SAVES THE LOCATION CARD TO IT


        // HIDES THE MODAL ONCE THE CARD IS CLICKED
        $('#choiceModal').attr('display', 'none');
    });

    // ONCE BOOK CARD IS CLICKED
    $('.bookOption').on("click", function () {
        // SELECTS BOOK CHOICE CLASS/DIV ON SIDEBAR AND SAVES THE BOOK NAME TO IT
        $('.bookChoice').text(this.data);

        // HIDES THE MODAL ONCE THE CARD IS CLICKED
        $('.MODAL-CLASS').attr('display', 'none');
    });

    // Convert address tags to google map links - Copyright Michael Jasper 2011
    $('.address').each(function () {
        var link = "<a href='http://maps.google.com/maps?q=" + encodeURIComponent($(this).text()) + "' target='_blank'>" + $(this).text() + "</a>";
        $(this).html(link);
    });

    function checkWeather(zipCode) {

        var queryURL = "https://api.openweathermap.org/data/2.5/weather?zip=" + zipCode + "&appid=" + weatherApiKey;

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            console.log("Weather response: ", response);
            var weatherDesc = response.weather[0].description;
            if (weatherDesc === "clear sky") {
                locate(zipCode, "park");
                locate(zipCode, "library");
            }
            else {
                locate(zipCode, "coffeeshop");
                locate(zipCode, "library");
            }
        });
    }

    function locate(zipCode, location) {
        var queryURL = "https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/textsearch/json?query=" + location + "+in+" + zipCode + "&key=" + googlePlacesApiKey;

        var latNlon = [];

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            console.log("Google Map Response: ", response);
            // Construct a map making object containing all information needed
            for (var i = 0; i < 6; i++) {
                var tempOBJ = { lat: "", lon: "", title: "", address: "" };
                tempOBJ.lat = response.results[i].geometry.location.lat;
                tempOBJ.lon = response.results[i].geometry.location.lng;
                tempOBJ.title = response.results[i].name;
                tempOBJ.address = response.results[i].formatted_address;

                latNlon.push(tempOBJ);
            }
            //Call skeleton for either coffeeshop or park
            generatePreviewSkeleton(location);
            drawMap(latNlon, location);
            generateLocationPreview(latNlon, location);
        });
    }

    function drawMap(mapMaker, str) {
        var img = $('<img>');

        var staticMapURL = "https://maps.googleapis.com/maps/api/staticmap?c&size=600x300&maptype=roadmap";
        for (var n = 0; n < mapMaker.length; n++) {
            staticMapURL += "&markers=color:red%7Clabel:" + (n + 1) + "%7C" + mapMaker[n].lat + "," + mapMaker[n].lon;
        }
        staticMapURL += "&key=" + googlePlacesApiKey;

        img.attr("src", staticMapURL);
        if ( (str == "park") || (str == "coffeeshop") ) {
            $("#locationMap").append(img);
        } else {
            $("#libraryMap").append(img);
        }
    }

    function readingPreferences() {
        var genre = $('#genre').val();
        var keyword = $('#keyword').val();
        var bookList = [];

        var queryURL = "https://www.googleapis.com/books/v1/volumes?q=" + keyword + "&subject:" + genre; 
        console.log(queryURL);
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            console.log("Book Results: ", response);

            for (var k = 0; k < 10; k++) {
                var tempOBJ = { isbn: "", author: "", title: "", thumbnail: "" }

                tempOBJ.title = response.items[k].volumeInfo.title;
                tempOBJ.author = response.items[k].volumeInfo.authors;
                tempOBJ.isbn = response.items[k].volumeInfo.industryIdentifiers[0].identifier;
                tempOBJ.thumbnail = response.items[k].volumeInfo.imageLinks.smallThumbnail;
                bookList.push(tempOBJ);
            }

            console.log(bookList);
            $("#bookRecs").empty();
            generatePreviewSkeleton("book");
            generateBookPreview(bookList);

        });
    }

    // WILL GENERATE THE BOOK PREVIEW CARDS
    function generateBookPreview(bookList) {

        for (var l = 0; l < bookList.length; l++) {
            // CARD DIV
            var card = $('<div>');
            card.attr('class', 'card bookOption');
            card.attr('style', 'width: 300px;', 'height: 400px');
            card.attr('data-name', bookList[l].title);

            // BOOK TITLE DIV
            var cardHeader = $('<div>');
            cardHeader.attr('class', 'card-divider');
            cardHeader.text(bookList[l].title);

            // THUMBNAIL
            var thumbnail = $('<img>');
            thumbnail.attr("style", "width: fit-content", "height: fit-content");
            thumbnail.attr('src', bookList[l].thumbnail);

            // CONTAINER FOR THE ISBN AND AUTHOR
            var contentContainer = $('<div>');
            contentContainer.attr('class', 'card-section');

            // AUTHOR
            var author = $('<h5>');
            author.text(bookList[l].author);

            // ISBN
            var isbn = $('<p>');
            isbn.text("ISNB: " + bookList[l].isbn);

            // APPEND AUTHOR AND ISBN 
            contentContainer.append(author);
            contentContainer.append(isbn);

            // APPEND HEADER, THUMBNAIL AND CARD CONTENT TO CARD DIV
            card.append(cardHeader);
            card.append(thumbnail);
            card.append(contentContainer);

            // APPENDS TO WHERE WE WILL PUT THE BOOKS
            $("#book" + l).append(card);
        }
    }

    // GENERATES CARDS FOR THE LOCATION SELECTION PREVIEW
    function generateLocationPreview(latNlon, str) {

        for (var l = 0; l < latNlon.length; l++) {
            // CARD DIV
            var card = $('<div>');
            card.attr('class', 'card locationOption');
            card.attr('style', 'width: 300px;');
            card.attr('data-name', latNlon[l].title);

            // TITLE DIV
            var cardHeader = $('<div>');
            cardHeader.attr('class', 'card-divider');
            cardHeader.text((l + 1) + ") " + latNlon[l].title);

            // // THUMBNAIL
            // var thumbnail = $('<img>');
            // thumbnail.attr('src', latNlon[l].thumbnail);

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
            // card.append(thumbnail);
            card.append(contentContainer);

            // APPENDS WHERE WE WILL PUT THE LOCATION PREVIEW CARDS
            if ( (str == "park") || (str == "coffeeshop") ) {
                $('#location' + l).append(card);
                console.log("Appended to #location");
            } else {
                $("#library" + l).append(card);
                console.log("Appended to #library");

            }
        }
    }

    // BUILDS HTML SKELETON FOR A LOCATION OR BOOK SELECTION PREVIEW
    function generatePreviewSkeleton(str) {

        // BUILD LOCATION PREVIEW 
        if ( (str == "park") || (str == "cofeeshop") ) {
            var container = $("<div>").attr("class", "grid-x");
            var leftColumn = $("<div>").attr("class", "small-6-cell").attr("id", "locationMap");
            container.append(leftColumn);

            var rightColumn = $("<div>").attr("class", "small-6-cell");

            var topRow = $("<div>").attr("class", "grid-x");
            var loc0 = $("<div>").attr("class", "small-4-cell").attr("id", "location0");
            var loc1 = $("<div>").attr("class", "small-4-cell").attr("id", "location1");
            var loc2 = $("<div>").attr("class", "small-4-cell").attr("id", "location2");
            topRow.append(loc0).append(loc1).append(loc2);
            rightColumn.append(topRow);

            var bottomRow = $("<div>").attr("class", "grid-x");
            var loc3 = $("<div>").attr("class", "small-4-cell").attr("id", "location3");
            var loc4 = $("<div>").attr("class", "small-4-cell").attr("id", "location4");
            var loc5 = $("<div>").attr("class", "small-4-cell").attr("id", "location5");
            bottomRow.append(loc3).append(loc4).append(loc5);
            rightColumn.append(bottomRow);            
            container.append(rightColumn);

           $("#relaxationSpot").append(container);
        }

        if (str == "library") {
            var libcontainer = $("<div>").attr("class", "grid-x");
            var leftColumn = $("<div>").attr("class", "small-6-cell").attr("id", "libraryMap");
            libcontainer.append(leftColumn);

            var rightColumn = $("<div>").attr("class", "small-6-cell");

            var topRow = $("<div>").attr("class", "grid-x");
            var library0 = $("<div>").attr("class", "small-4-cell").attr("id", "library0");
            var library1 = $("<div>").attr("class", "small-4-cell").attr("id", "library1");
            var library2 = $("<div>").attr("class", "small-4-cell").attr("id", "library2");
            topRow.append(library0).append(library1).append(library2);
            rightColumn.append(topRow);

            var bottomRow = $("<div>").attr("class", "grid-x");
            var library3 = $("<div>").attr("class", "small-4-cell").attr("id", "library3");
            var library4 = $("<div>").attr("class", "small-4-cell").attr("id", "library4");
            var library5 = $("<div>").attr("class", "small-4-cell").attr("id", "library5");
            bottomRow.append(library3).append(library3).append(library4);
            rightColumn.append(bottomRow);            
            libcontainer.append(rightColumn);

            $("#library").append(libcontainer);
        }
        //BUILD BOOK PREVIEW
        if (str == "book") {
            var container = $("<div>").attr("class", "grid-x");

            var topRow = $("<div>").attr("class", "grid-x");
            var book0 = $("<div>").attr("class", "small-4-cell").attr("id", "book0");
            var book1 = $("<div>").attr("class", "small-4-cell").attr("id", "book1");
            var book2 = $("<div>").attr("class", "small-4-cell").attr("id", "book2");
            topRow.append(book0).append(book1).append(book2);
            container.append(topRow);
            
            var bottomRow = $("<div>").attr("class", "grid-x");
            var book3 = $("<div>").attr("class", "small-4-cell").attr("id", "book3");
            var book4 = $("<div>").attr("class", "small-4-cell").attr("id", "book4");
            var book5 = $("<div>").attr("class", "small-4-cell").attr("id", "book5");
            bottomRow.append(book3).append(book4).append(book5);
            container.append(bottomRow);

            $("#bookRecs").append(container);
        }
    }

});