var connectionId = ''
let stringReceived = '';
let arrayReceived = [];

/* Interprets an ArrayBuffer as UTF-8 encoded string data. */
function convertArrayBufferToString(buf){
  let bufView = new Uint8Array(buf);
  let encodedString = String.fromCharCode.apply(null, bufView);
  return decodeURIComponent(escape(encodedString));
}

/* Converts a string to UTF-8 encoding in a Uint8Array; returns the array */
function convertStringToArrayBuffer(str) {
   var encodedString = unescape(encodeURIComponent(str));
   var bytes = new Uint8Array(encodedString.length);
   for (var i = 0; i < encodedString.length; ++i) {
      bytes[i] = encodedString.charCodeAt(i);
   }
   return bytes.buffer;
};

// ------------------------------------------< Device Load >------------------------------------------
let loaded = function() {
  console.log('loaded');

  //  デバイスをリスト化して、画面に表示する
  chrome.serial.getDevices(function(devices) {
    
    // port 設定
    let selection = document.getElementById('port');
    devices.forEach(function(port){
      let option = document.createElement('option');
      option.value = port.path;
      option.text = port.displayName ? port.path + ' (' + port.displayName + ')' : port.path;
      selection.appendChild(option);
    });
  });
};
window.addEventListener('load', loaded, false);

// ------------------------------------------< Click Connect >------------------------------------------
let clickedConnect = function() {
  console.log('clicked');

  let e = document.getElementById('port');
  let port = e.options[e.selectedIndex].value;

  let b = document.getElementById('bitrate');
  let bitrate = Number(b.options[b.selectedIndex].value);

  document.getElementById('connect').value = 'dicconect';

  chrome.serial.connect(port, {bitrate: bitrate}, onConnectCallback);

}
document.getElementById('connect').addEventListener("click", clickedConnect, false);



// ------------------------------------------< On Connect >------------------------------------------
let onConnectCallback = function(connectionInfo){
  //  onReceiveイベントでconnectionIdの一致を確認するので、保持しておく
  connectionId = connectionInfo.connectionId;
}


// ------------------------------------------< Receive Data >------------------------------------------
let scrollflag = true;
let receiveData = function(info) {
  let box = document.getElementById('textbox');
  //console.log('received');
  
  if (info.connectionId == connectionId && info.data) {
    let str = convertArrayBufferToString(info.data);  // 取得文字列
    //console.log(str);
    let scro = box.scrollHeight - box.scrollTop;  // scroll位置確認
  
    // console.log(scro)
    // auto scroll 判定
    if(scrollflag && scro > 604) scrollflag = false;
    else if(!scrollflag && scro < 900) scrollflag = true; 
    box.value += str;  // textarea に出力
    
    // 出力
    if(scrollflag) box.scrollTop = box.scrollHeight;
    //document.getElementById('log').innerHTML += str + "<br>";
    
  }
};
chrome.serial.onReceive.addListener(receiveData);


// ------------------------------------------< Send Data >------------------------------------------
let sendData = function() {
  let data = document.getElementById('sendData').value;
  console.log('send: ' + data);
  // let port = e.options[e.selectedIndex].value;
  chrome.serial.send(connectionId, convertStringToArrayBuffer(data), function() {} );

}
document.getElementById('sendbtn').addEventListener("click", sendData, false);


// ------------------------------------------< On Discconect >------------------------------------------
let onDisconnectCallback = function(result) {
  if (result) { console.log('disconnected'); }
  else { console.log('error'); }
}

// ------------------------------------------< Error >------------------------------------------
let onReceiveErrorCallback = function(info) {
  console.log('end');
  console.log(arrayReceived.join(','));

  let disconnect = chrome.serial.disconnect(connectionId, onDisconnectCallback)
}
chrome.serial.onReceiveError.addListener(onReceiveErrorCallback);

