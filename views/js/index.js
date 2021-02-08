$(document).ready(function () {
    

    var token = sessionStorage.authToken;

    if(token==undefined) {
        $(".authrequired").hide();
        $(".authnotrequired").show();
    } else {
        $(".authrequired").show();
        $(".authnotrequired").hide();
    }
})