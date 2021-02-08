$(document).ready(function () {
    return displaySavedServices();
})

function displaySavedServices() {
    var credentials = {
        username: sessionStorage.getItem('username'),
    }
    $.ajax({
        url: "/getfavouriteservices?token="+sessionStorage.authToken,
        method: "post",
        data: credentials
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

