$(document).ready(function () {
    return displaySavedServices();
})

function displaySavedServices() {
    $.ajax({
        url: "/getfavouriteservices",
        method: "get"
    })
        .done(
            function (data) {
                if (data.length > 0) {
                    $(".info").show();
                    $(".info").empty().append();
                    $(".infoheader").show();
                }
                data.forEach(function (favservice) {
                    $(".info").append(`<li>${favservice.services}</li>`);
                });
            }
        )
        .fail(
            function (err) {
                console.log(err.responseText);
            }
        )
    return false;
}

