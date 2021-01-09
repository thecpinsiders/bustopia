$(document).ready(function () {
    $.ajax({
        url: "/events",
        method: "get"
    })
        .done(
            function (data) {
                data.forEach(function(event) {
                    $(".events").append(`
                        <article>
                        <h2><a href="/edit?id=${event._id}">${event.name}</a></h2>
                        <div>
                            ${event.description}<br>
                            Start: ${event.start.date} ${event.start.time}<br>
                            End: ${event.end.date} ${event.end.time}<br>
                        </div>
                        </article>
                    `);
                });
            }
        )
        .fail(
            function (err) {
                console.log(err.responseText);
            }
        )

    $(".addEvent").click(function () {
        $(".addNewEvent").show();
    })
})

function addEvent() {
    var newEvent = {
        name: $("#name").val(),
        description: $("#description").val(),
        startDate: $("#startDate").val(),
        startTime: $("#startTime").val(),
        endDate: $("#endDate").val(),
        endTime: $("#endTime").val()
    };

    $.ajax({
        url:"/events?token="+sessionStorage.authToken,
        method:"POST",
        data: newEvent
    })
    .done(function(data){
        $(".statusMessage").text(data);
        setTimeout(function(){
            location.reload();
        },3000);
    })
    .fail(function(err){
        $(".statusMessage").text("Unable to add new event");
    })
    return false;
}