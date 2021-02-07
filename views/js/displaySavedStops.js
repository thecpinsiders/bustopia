$(document).ready(function () {
    return displaySavedStops()
})

function displaySavedStops() {
    $.ajax({
        url: "/getfavouritestops",
        method: "get"
    })
        .done(
            function (data) {
                if (data.length > 0) {
                    $(".info").show();
                    $(".info").empty().append();
                    $(".infoheader").show();
                }
                data.forEach(function (favstop) {
                    $(".info").append(`
        <form onsubmit="return getbusarrival()">
            <li id="BusStopCode" value="${favstop.stops}">${favstop.stops}</li>
            <input type="submit" value="Submit">
        </form>`);
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