

$(document).ready(function () {
    // var BusStopCodeObj = new URLSearchParams(window.location.search);
    //BusStopCode = BusStopCodeObj.get('BusStopCode');

});

function getbusarrival() {
    var BusStopCode = document.getElementById("BusStopCode").value;
    // var BusStopCode = $("#BusStopCode").val();
    $.ajax({
        url: "/getbusarrival/" + BusStopCode,
        method: "get"
    })
        .done(function (data) {
            $(".info").empty().append(data);
            $('.bsc').text(data.BusStopCode);
            var i;
            var load;
            var type;
            for (i = 0; i < data.Services.length; ++i) {
                var h = new Date(data.Services[i].NextBus.EstimatedArrival).getHours();
                var m = new Date(data.Services[i].NextBus.EstimatedArrival).getMinutes();

                if (data.Services[i].NextBus.Load == "SEA") {
                    load = "Seat Available";
                }
                else if (data.Services[i].NextBus.Load == "SDA") {
                    load = "Standing Available";
                } else {
                    load = "Limited Standing";
                }

                if (data.Services[i].NextBus.Type == "SD") {
                    type = "Single Deck";
                }
                else if (data.Services[i].NextBus.Type == "DD") {
                    type = "Double Deck";
                } else {
                    type = "Bendy";
                }
                var output = h + ':' + m;
                $(".info").append(`
                    <article>
                    <h2>${data.Services[i].ServiceNo}</h2>
                    <div>
                        Bus Service:${data.Services[i].ServiceNo}<br>
                        Bus Operator: ${data.Services[i].Operator}<br>
                        Bus origin code: ${data.Services[i].NextBus.OriginCode}<br>
                        Bus Destination code: ${data.Services[i].NextBus.DestinationCode}<br>
                        Arrival timing: ${output}<br>
                        Visit number: ${data.Services[i].NextBus.VisitNumber}<br>
                        Bus load: ${load}<br>
                        Bus Type: ${type}<br>
                    </div>
                    </article>
                `)
            }
        })
        .fail(function (err) {
            console.log(err.responseText);
            $(".statusMessage").text(err.responseText);
        })
    return false;
}

function isNumberKey(evt, obj) {
    var LIMIT = 5;
    var charCode = (evt.which) ? evt.which : event.keyCode
    var txt = obj.value.length;
    if ((txt == LIMIT) && (charCode == 8)) {
        obj.value = obj.value.toString().substring(0, txt - 1);
    }
    if (charCode > 31 && (charCode < 48 || charCode > 57))
        return false;
    else {
        if (txt < LIMIT) {
            return true;
        }
        else {
            return false;
        }
    }
}


