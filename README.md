# Unwind
Unwind offers the user an all-in-one book, weather, and location search to help them plan an unplugged day of leisure. With our technology we encourage people to slow down, put down their phones, and enjoy a day of reading outside or in a local coffee shop to reconnect with the small joys that make us human. To help the user along the way, we offer location information on local libraries where they can find their book and give present them with either park of coffee shop option depending on the weather.

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

Building a mobile-first responsive website was crucial to us and to building any modern application today. To accommplish this, we chose to use Foundation, a popular responsive front-end framework. Their responsive grid system allowed us to easily incorporate breakpoints and manipulate the various UI components of our site. The code snippet below displays the use of the Foundation grid system as well as how we used their built in classes and attributes to determin break points and stick elements to specific parts of the page.

```
  <div class="grid-x grid-padding-x">
        <div class="large-4 cell" data-sticky-container>
            <div class="card sticky" id="summary" data-sticky data-margin-top="0" data-top-anchor="header:bottom"
                style="width: 100%;">
                <div class="card-divider">
                    Relaxation Menu
                </div>
            </div>
```

Project goals and methods goes here...
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