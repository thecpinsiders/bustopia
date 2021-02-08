var userId = 0;
$(document).ready(function () {
    userId = sessionStorage.Id;

    $.ajax({
        url: "/user/" + userId ,
        method: "get"
    })
        .done(
            function (data) {
               
                    $(".user").append(`
                        <article>
                        <div>
                        <h3>Click Name to change password</h3>
                        <h3><a href="/editProfile?id=${data._id}">${data.username}</a></h3>
                        </div>
                        <br>
                        
                        </article>
                    `);
               
                
            }
            
        )
        .fail(
            function (err) {
                console.log(err.responseText);
            }
        )
    })