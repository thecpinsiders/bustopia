saveFavService

function saveFavService() {
    var newFavService = {
        services: $("#service").val(),
        username: sessionStorage.username,
    }
    $.ajax({
        url: "/api/savefavouritebus",
        method: "post",
        data: newFavService
    })
        .done(function (data) {
            $(".statusMessage").text(data);
        })
        .fail(function (err) {
            $(".statusMessage").text(err);
        })
    return false;
}

function saveFavStop() {
    var busstopcode = $("#BusStopCode").val();
    var newFavStop = {
        BusStopCode: busstopcode,
        username: sessionStorage.username,
    }
    $.ajax({
        url: "/api/savefavouritebusstop",
        method: "post",
        data: newFavStop
    })
        .done(function (data) {
            $(".statusMessage").text(data);
        })
        .fail(function (err) {
            $(".statusMessage").text(err);
        })
    return false;
}