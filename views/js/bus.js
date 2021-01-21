var eventId = 0;
$(document).ready(function() {
    var urlParams = new URLSearchParams(window.location.search);
    eventId = urlParams.get('id');

    $.ajax({
        url: "/getbusarrival",
        method: "get"
    }).done(
        function (data) {
            data.forEach(function(event) {
                $(".busarrival").append(`
                    <article>
                    <h2>${data.BusStopCode}</h2>
                    <div>
                    ${data.Services.ServiceNo}
                        ${event.description}<br>
                        Start: ${event.start.date} ${event.start.time}<br>
                        End: ${event.end.date} ${event.end.time}<br>
                        Organized by: ${event.organizer.name} from ${event.organizer.company}<br>
                    </div>
                    </article>
                `);
            });
            // $(".busstopcode").text(data.BusStopCode);            
            // $(".serviceno").val(data.Services.ServiceNo);
            // $('.operator').val(data.Services.Operator);
            // $('.nextbusorigincode').val(data.Services.NextBus.OriginCode);
            // $('.nextbusdestinationcode').val(data.Services.NextBus.DestinationCode);
            // $('.nextbusestimatedarrival').val(data.Services.NextBus.EstimatedArrival);
            // $('.nextbuslongitude').val(data.Services.NextBus.Longitude);
            // $('.nextbusvisitnumber').val(data.Services.NextBus.VisitNumber);
            // $('.nextbusload').val(data.Services.NextBus.Load);
            // $('.nextbusfeature').val(data.Services.NextBus.Feature);
            // $('.nextbustype').val(data.Services.NextBus.Type);
            // $('.nextbus2origincode').val(data.Services.NextBus2.OriginCode);
            // $('.nextbus2destinationcode').val(data.Services.NextBus2.DestinationCode);
            // $('.nextbus2estimatedarrival').val(data.Services.NextBus2.EstimatedArrival);
            // $('.nextbus2longitude').val(data.Services.NextBus2.Longitude);
            // $('.nextbus2visitnumber').val(data.Services.NextBus2.VisitNumber);
            // $('.nextbus2load').val(data.Services.NextBus2.Load);
            // $('.nextbus2feature').val(data.Services.NextBus2.Feature);
            // $('.nextbus2type').val(data.Services.NextBus2.Type);
            // $('.nextbus3origincode').val(data.Services.NextBus3.OriginCode);
            // $('.nextbus3destinationcode').val(data.Services.NextBus3.DestinationCode);
            // $('.nextbus3estimatedarrival').val(data.Services.NextBus3.EstimatedArrival);
            // $('.nextbus3longitude').val(data.Services.NextBus3.Longitude);
            // $('.nextbus3visitnumber').val(data.Services.NextBus3.VisitNumber);
            // $('.nextbus3load').val(data.Services.NextBus3.Load);
            // $('.nextbus3feature').val(data.Services.NextBus3.Feature);
            // $('.nextbus3type').val(data.Services.NextBus3.Type);
        }
    ).fail(
        function (err) {
            console.log(err.responseText);
        }
    );

    $(".deleteEventBtn").on('click', function() {
        $.ajax(
            {
                url: '/events/'+eventId+"?token="+sessionStorage.authToken,
                method: 'delete'
            }
        ).done(
            function (data) {
                alert("Event deleted!");
                window.location.href = "/";
            }
        ).fail(
            function (err) {
                console.log(err.responseText);
            }
        );
    });
});