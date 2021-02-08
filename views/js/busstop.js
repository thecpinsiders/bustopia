

$(document).ready(function () {
});

function getbusstop() {
    var BusStopName = document.getElementById("BusStopName").value;
    $.ajax({
        url: "/searchstopname?token="+sessionStorage.authToken,
        method: "get"
    })
        .done(function (data) {
            var i;
            for (i = 0; i < data.value.length; ++i) {
                if(data.value[i].Description == BusStopName) {
                $(".info").empty().append(data);
                $(".info").append(`
                    <article>
                    <div>
                        BusStopCode :${data.value[i].BusStopCode}<br>
                        Road Name: ${data.value[i].RoadName}<br>
                        Bus Stop Name: ${data.value[i].Description}<br>
                        <a href="https://maps.google.com/?q=@${data.value[i].Latitude},${data.value[i].Longitude}">See in Google Maps</a><br>
                    </div>
                    </article>
                `);
                break;
                } else if(data.value[i].Description != BusStopName){
                    $(".info").empty().append(data);
                        $(".info").append(`
                        <article>
                        <div>
                        Please enter a valid bus stop name.
                        </div>
                        </article>
                    `);
                }
            }
        })
        .fail(function (err) {
            console.log(err.responseText);
            $(".statusMessage").text(err.responseText);
        })
    return false;
}

