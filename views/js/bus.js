// $(document).ready(function () {
//     // var urlParams = new URLSearchParams(window.location.search);
//     // eventId = urlParams.get('id');
//     // alert("HELLOW!");
//     // $.ajax({
//     //     url: "/getallbusarrivals",
//     //     method: "get"
//     // }).done(
//     //     function (data) {
//     //         $('#BusStopCode').val(data.BusStopCode);
//     //         // $('#description').val(data.description);
//     //         // $('#startDate').val(data.start.date);
//     //         // $('#startTime').val(data.start.time);
//     //         // $('#endDate').val(data.end.date);
//     //         // $('#endTime').val(data.end.time);
//     //     }
//     // ).fail(
//     //     function (err) {
//     //         console.log(err.responseText);
//     //     }


//     // var BusStopCode = new URLSearchParams(window.location.search);
//     // BusStopCode = BusStopCode.get('BusStopCode');
//     // getbusarrival();
//     // getallbusarrivals();
//     // )
// });
function getTicker() {
    var ticker = document.getElementById('#BusStopCode').value;
}
function getbusarrival() {
    var credentials = {
        BusStopCode: $("#BusStopCode").val()
    }
    $.ajax({
        url: "/getbusarrival" + getTicker().ticker,
        method: "get",
        data: credentials
    })
        .done(function (data) {
            $('#bs').text(data.BusStopCode);
        })
        .fail(function (err) {
            console.log(err.responseText);
            $(".statusMessage").text(err.responseText);
        })
    return false;
}

// function getbusarrival() {
//     console.log("in function")
//     $.ajax({
//         url: "/getbusarrival/" + BusStopCode,
//         method: "get"
//     })
//         .done(function (data) {
//             data.forEach(function (arrival) {
//                 $(".busarrival").append(`
//             <article class='busarrival'>
//             <b>${arrival.BusStopCode}</b>
//             </article>
//             `);
//             });
//         }).fail(
//             function (err) {
//                 console.log(err.responseText);
//             }
//         );
// }

// function getallbusarrival() {
//     console.log("in function")
//     $.ajax({
//         url: "/getallbusarrivals",
//         method: "get"
//     })
//         .done(function (data) {
//             data.forEach(function (arrival) {
//                 $(".busarrival").append(`
//             <article class='busarrival'>
//             <b>${arrival.BusStopCode}</b>
//             </article>
//             `);
//             });
//         }).fail(
//             function (err) {
//                 console.log(err.responseText);
//             }
//         );
// }















// var eventId = 0;
// $(document).ready(function() {
//     var urlParams = new URLSearchParams(window.location.search);
//     eventId = urlParams.get('id');

//     $.ajax({
//         url: "/getbusarrival",
//         method: "POST"
//         //add in parameter here
//     }).done(
//         function (data) {
//             alert(data);
//             data.Services.foreach(function(service) {
//                 $(".Busarrival").append(`
//                     <article>
//                     <h2>${service.ServiceNo}</h2>
//                     <div>
//                         Bus Service:${data.Services.ServiceNo}<br>
//                         Bus Operator: ${data.Services.Operator}<br>
//                         Bus origin code: ${data.Services.NextBus.OriginCode}<br>
//                         Bus Destination code: ${data.Services.NextBus.DestinationCode}<br>
//                         Arrival timing: ${data.Services.NextBus.EstimatedArrival}<br>
//                         Visit number: ${data.Services.NextBus.VisitNumber}<br>
//                         Bus load: ${data.Services.NextBus.Load}<br>
//                         Bus Type: ${data.Services.NextBus.Type}<br>
//                     </div>
//                     </article>
//                 `);
//             });
//             // $(".busstopcode").text(data.BusStopCode);            
//             // $(".serviceno").val(data.Services.ServiceNo);
//             // $('.operator').val(data.Services.Operator);
//             // $('.nextbusorigincode').val(data.Services.NextBus.OriginCode);
//             // $('.nextbusdestinationcode').val(data.Services.NextBus.DestinationCode);
//             // $('.nextbusestimatedarrival').val(data.Services.NextBus.EstimatedArrival);
//             // $('.nextbuslongitude').val(data.Services.NextBus.Longitude);
//             // $('.nextbusvisitnumber').val(data.Services.NextBus.VisitNumber);
//             // $('.nextbusload').val(data.Services.NextBus.Load);
//             // $('.nextbusfeature').val(data.Services.NextBus.Feature);
//             // $('.nextbustype').val(data.Services.NextBus.Type);
//             // $('.nextbus2origincode').val(data.Services.NextBus2.OriginCode);
//             // $('.nextbus2destinationcode').val(data.Services.NextBus2.DestinationCode);
//             // $('.nextbus2estimatedarrival').val(data.Services.NextBus2.EstimatedArrival);
//             // $('.nextbus2longitude').val(data.Services.NextBus2.Longitude);
//             // $('.nextbus2visitnumber').val(data.Services.NextBus2.VisitNumber);
//             // $('.nextbus2load').val(data.Services.NextBus2.Load);
//             // $('.nextbus2feature').val(data.Services.NextBus2.Feature);
//             // $('.nextbus2type').val(data.Services.NextBus2.Type);
//             // $('.nextbus3origincode').val(data.Services.NextBus3.OriginCode);
//             // $('.nextbus3destinationcode').val(data.Services.NextBus3.DestinationCode);
//             // $('.nextbus3estimatedarrival').val(data.Services.NextBus3.EstimatedArrival);
//             // $('.nextbus3longitude').val(data.Services.NextBus3.Longitude);
//             // $('.nextbus3visitnumber').val(data.Services.NextBus3.VisitNumber);
//             // $('.nextbus3load').val(data.Services.NextBus3.Load);
//             // $('.nextbus3feature').val(data.Services.NextBus3.Feature);
//             // $('.nextbus3type').val(data.Services.NextBus3.Type);
//         }
//     ).fail(
//         function (err) {
//             console.log(err.responseText);
//         }
//     );


// function getbusarrival() {
//     var newBusStop = {
//         BusStopCode: $("#BusStopCode").val(),
//         Services :[
//             {
//             ServiceNo: $("#ServiceNo").val(),
//             Operator: $("#Operator").val(),
//             NextBus: {
//                 OriginCode: $("#OriginCode").val(),
//                 DestinationCode: $("#DestinationCode").val(),
//                 EstimatedArrival: $("#EstimatedArrival").val(),
//                 Latitude: $("#Latitude").val(),
//                 Longitude: $("#Longitude").val(),
//                 VisitNumber: $("#VisitNumber").val(),
//                 Load: $("#Load").val(),
//                 Feature: $("#Feature").val(),
//                 Type: $("#Type").val(),
//             },
//             NextBus2: {
//                 OriginCode: $("#OriginCode").val(),
//                 DestinationCode: $("#DestinationCode").val(),
//                 EstimatedArrival: $("#EstimatedArrival").val(),
//                 Latitude: $("#Latitude").val(),
//                 Longitude: $("#Longitude").val(),
//                 VisitNumber: $("#VisitNumber").val(),
//                 Load: $("#Load").val(),
//                 Feature: $("#Feature").val(),
//                 Type: $("#Type").val(),
//             },
//             NextBus3: {
//                 OriginCode: $("#OriginCode").val(),
//                 DestinationCode: $("#DestinationCode").val(),
//                 EstimatedArrival: $("#EstimatedArrival").val(),
//                 Latitude: $("#Latitude").val(),
//                 Longitude: $("#Longitude").val(),
//                 VisitNumber: $("#VisitNumber").val(),
//                 Load: $("#Load").val(),
//                 Feature: $("#Feature").val(),
//                 Type: $("#Type").val(),
//             },
//         },
//         ],
//     };

//     $.ajax({
//         url:"/events?token="+sessionStorage.authToken,
//         method:"POST",
//         data: newEvent
//     })
//     .done(function(data){
//         $(".statusMessage").text(data);
//         setTimeout(function(){
//             location.reload();
//         },3000);
//     })
//     .fail(function(err){
//         $(".statusMessage").text("Unable to add new event");
//     })
//     return false;
// }

// //     $(".deleteEventBtn").on('click', function() {
// //         $.ajax(
// //             {
// //                 url: '/events/'+eventId+"?token="+sessionStorage.authToken,
// //                 method: 'delete'
// //             }
// //         ).done(
// //             function (data) {
// //                 alert("Event deleted!");
// //                 window.location.href = "/";
// //             }
// //         ).fail(
// //             function (err) {
// //                 console.log(err.responseText);
// //             }
// //         );
// //     });
// });