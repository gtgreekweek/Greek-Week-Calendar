function openFacebook() {
    var userAgent = navigator.userAgent || navigator.vendor || window.opera;
    var url = "https://www.facebook.com/groups/georgiatechgreekweek/";
    var appUri = "fb://page/272429399583477";

    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
        // setTimeout(function () {
        //     window.location = url;
        // }, 5);
        window.location = appUri;
    }
}