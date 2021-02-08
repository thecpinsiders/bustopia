function saveFavService() {
    var newFavService = {
        services: $("#service").val(),
        username: sessionStorage.username,
    }
    $.ajax({
        url: "/savefavouritebus",
        method: "post",
        data: newFavService
    })
        .done(function (data) {
            $(".statusMessage").text(data);
        })
        .fail(function (err) {
            $(".statusMessage").text("Please check if you are logged in before using this feature.");
        })
    return false;
}

function saveFavStop() {
    var busstopcode = $("#saveBusStopCode").val();
    var newFavStop = {
        BusStopCode: busstopcode,
        username: sessionStorage.username,
    }
    $.ajax({
        url: "/savefavouritebusstop",
        method: "post",
        data: newFavStop
    })
        .done(function (data) {
            $(".statusMessage").text(data);
        })
        .fail(function (err) {
            $(".statusMessage").text("Please check if you are logged in before using this feature.");
        })
    return false;
}