var userId = 0;
$(document).ready(function() {
    //extract para from the url
    var urlParams = new URLSearchParams(window.location.search);
    userId = urlParams.get('id');

    $.ajax({
        url: "/user/" + userId,
        method: "get" // after get user
    }).done( // fill in data so it will get user
        function (data) { // callback data
            console.log(data);
            //$('#password').val();
        }
    ).fail(
        function (err) {
            console.log(err.responseText);
        }
    );
});

function editUser() {
    var user = {
        id: userId,
        password: $("#password").val(),
    };
    $.ajax(
        {
            url: '/user?token='+sessionStorage.authToken,
            method: 'put',
            data: user
        }
    ).done(
        function (data) {
            alert("Password successfuly changed!");
        }
    ).fail(
        function (err) {
           console.log(err.responseText);
        }
    );
    return false;
};