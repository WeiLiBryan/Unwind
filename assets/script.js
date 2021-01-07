$(document).ready(function(){

// ONCE SEARCH BUTTON IS CLICKED
$('ZIP-INPUT-FIELD-CONFIRM').on("click", function() {
    // CHECKS ZIP CODE ENTERED IN INPUT FIELD
    var zipCode = $(".ZIP-INPUT-FIELD").val();

    if (zipCode.length === 5) {
        display();
    }
    else {
        generateModal();
    }

});















});

