# Unwind

Unwind offers the user an all-in-one book, weather, and location search to help them plan an unplugged day of leisure. With our technology we encourage people to slow down, put down their phones, and enjoy a day of reading outside or in a local coffee shop to reconnect with the small joys that make us human. To help the user along the way we offer location information on local libraries where they can find their book, and present them with either park of coffee shop option depending on the weather.

![alt-text](assets/images/unwind-screen.gif)

## Table of Contents
|                                     |                                         |                                         |
| :---------------------------------- | :-------------------------------------- | :-------------------------------------- |
| [Project Introduction](#Unwind)     | [Table of Contents](#table-of-contents) | [Goals and Methods](#goals-and-methods) |
| [Technologies](#technologies)       | [Deployed Link](#deployed-link)         | [Authors](#authors)                     |
| [Acknowledgments](#acknowledgments) | [License](#license)                     |
---
## Goals and Methods
The goal of our app is to use several APIs that help the user to put together an experience catered to their interests, location, and local weather conditions. In the design process we put together the physical layout of the app but also focused on creating a greater narrative to help guide the user experience. We identified a "problem"- the stress of being constantly connected and almost robotic- and then offered a "solution"- be a human and go read a book somewhere. 

Building a mobile-first responsive website was crucial to us and to building any modern application today. To accomplish this, we chose to use Foundation, a popular responsive front-end framework. Their responsive grid system allowed us to easily incorporate breakpoints and manipulate the various UI components of our site. Snippet 1 below displays the use of the Foundation grid system as well as how we used their built in classes and attributes to determine break points and stick elements to specific parts of the page. Also included in this snippet is the ID summary which serves as an example of how JQuery targets were painted on elements of interest.

Snippet 1:
```HTML
<div class="grid-x grid-padding-x">
    <div class="large-4 cell" data-sticky-container>
        <div class="card sticky" id="summary" data-sticky data-margin-top="0" data-top-anchor="header:bottom"
            style="width: 100%;">
            <div class="card-divider">
                Relaxation Menu
            </div>
    </div>
```
Foundation offered the team a fast and easy way to create elements on the page which brought the process to making javascript that could fetch data from a collection of APIs and write them to the page. The first step we asked the user to take was to input some reading preferences and use those as headers in an ajax request to Google Books API. Generating the ajax request URL was a matter of taking user input and concatenating it into the correct endpoint provided by Google. See Snippet 2 for specifics:
Snippet 2:
```javascript
 var queryURL = "https://www.googleapis.com/books/v1/volumes?q=" + keyword + "&subject:" + genre
 ```
 The response from Google Books API was then parsed to collect information that was of interest and was subsequently passed off to a helper function that would populate the page. In order to ensure that the helper function had what it needed at time of execution we opted to put the parsed data into an object that was passed to the function. Alternatively we could have asked ajax to wait using .complete instead of .then. Snippet 3 describes what was done:
```javascript
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
```
The next step in the user story was to ask for their zip code and use it to find a park or coffee shop. We also used the zipcode to make a request to OpenWeatherAPI to see what the weather is in their area. If the weather is nice we would suggest parks in the area. Otherwise we would recommend a coffee shop. The strings "park" and "coffeeshop" served as headers in a request to the Google Places API. We selected this API as it can handle searching for a place inside a zip code (Snippet 4). In order to eliminate a CORS issue we used a proxy service cors-anywhere.herokuapp. This was a fast solution that allowed the team to continue with project development  

Snippet 4:
```javascript
        var queryURL = "https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/textsearch/json?query=" + location + "+in+" + zipCode + "&key=" + googlePlacesApiKey;
```
Important data were parsed from the response, stored in an object, and passed to a helper function that would populate the page. Additionally the location's latitude and longitude were passed to the Google Static Maps API to build us a map that we could display to the user. Google Static Maps API will create, style, and label markers that can be passed along with the URL request. By collecting several locations and adding them to a single request we were able to have a map of the user's locations made for us. Snippet 5 demonstrates the request URL construction which was used to make all the static maps shown in the GIF above.
Snippet 5:
```javascript
var staticMapURL = "https://maps.googleapis.com/maps/api/staticmap?c&size=600x300&maptype=roadmap";
    for (var n = 0; n < mapMaker.length; n++) {
        staticMapURL += "&markers=color:red%7Clabel:" + (n + 1) + "%7C" + mapMaker[n].lat + "," + mapMaker[n].lon;
    }
    staticMapURL += "&key=" + googlePlacesApiKey;
```
The final piece of the puzzle is a collection of functions that use data from the various APIs to create and populate HTML elements. Foundation classes as well as useful JQuery targets were painted onto elements as they were made. Once generated their respective text, numerical, and graphic values would be filled. Completing this functionality was not considered a stretch goal and will not be discussed. Please see script.js if you are interested.

## Technologies 
* [HTML](https://developer.mozilla.org/en-US/docs/Web/HTML)
* [CSS](https://developer.mozilla.org/en-US/docs/Web/CSS)
* [Foundation](https://get.foundation/frameworks-docs.html)
* [Javascript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
* [Jquery](https://jquery.com/)
* [OpenWeatherAPI](https://openweathermap.org/api)
* [Google Places API](https://developers.google.com/places/web-service/overview)
* [Google Books API](https://developers.google.com/books)
* [Unsplash](https://unsplash.com/)
* [cors-anywhere](https://github.com/Rob--W/cors-anywhere/#documentation)
## Deployed Link
* [See Live Site](https://weilibryan.github.io/Unwind/)
## Authors
Coleman Buffa
- [Link to Git Hub](https://github.com/coleman-buffa/)
- [Link to LinkedIn](https://www.linkedin.com/in/coleman-buffa-0a12a5201/)

William Bryan
- [Link to Git Hub](https://github.com/WeiLiBryan)
- [Link to LinkedIn](https://www.linkedin.com/in/william-bryan-72730019a/)

Pamela Gutierrez
- [Link to Git Hub](https://github.com/pamela-gutierrez)
- [Link to LinkedIn](https://www.linkedin.com/in/pamela-gutierrez/)

## Acknowledgments
Many thanks to UCB Bootcamp Instructional and Support Staff
## License
* Foundation and JQuery are all released under the MIT license 
### [Back to Table of Contents](#table-of-contents) 