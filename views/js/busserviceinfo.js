$(document).ready(function () {
});

function getbusinfo() {
    var BusServiceName = document.getElementById("BusService").value;
    $.ajax({
        url: "/getserviceinfo",
        method: "get"
    })
        .done(function (data) {
            $(".info").empty().append(data);
            var i;
            for (i = 0; i < data.value.length; ++i) {
                if(data.value[i].ServiceNo == BusServiceName) {
                $(".info").append(`
                    <article>
                    <div>
                        Service  :${data.value[i].ServiceNo}<br>
                        Road Operator: ${data.value[i].Operator}<br>
                        Bus Stop Code: ${data.value[i].BusStopCode}<br>
                        Weekday First Bus: ${data.value[i].WD_FirstBus}<br>
                        Weekday Last Bus: ${data.value[i].WD_LastBus}<br>
                        Sat First Bus: ${data.value[i].SAT_FirstBus}<br>
                        Sat Last Bus: ${data.value[i].SAT_LastBus}<br>
                        Sun First Bus: ${data.value[i].SUN_FirstBus}<br>
                        Sun Last Bus: ${data.value[i].SUN_LastBus}<br><br>
                    </div>
                    </article>
                `);
                
                //break;
            }
                //    if(BusServiceName != data.value[i].ServiceNo){
                //     $(".info2").empty().append(data);
                //     $(".info2").append(`
                //     <article>
                //     PLEASE ENTER VALID BUS SERVICE
                //     </article>
                //     `);
                //     break;
                //  }
             } 
        })
        .fail(function (err) {
            console.log(err.responseText);
            $(".statusMessage").text(err.responseText);
        })
    return false;
}

