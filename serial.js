var connectionId = ''
var stringReceived = '';
var arrayReceived = [];

/* Interprets an ArrayBuffer as UTF-8 encoded string data. */
function convertArrayBufferToString(buf){
  var bufView = new Uint8Array(buf);
  var encodedString = String.fromCharCode.apply(null, bufView);
  return decodeURIComponent(escape(encodedString));
}



var onConnectCallback = function(connectionInfo){
  //  onReceiveイベントでconnectionIdの一致を確認するので、保持しておく
  connectionId = connectionInfo.connectionId;
}


var clickedListener = function() {
  console.log('clicked');

  var e = document.getElementById('port');
  var port = e.options[e.selectedIndex].value;

  document.getElementById('connect').value = 'dicconect';

  chrome.serial.connect(port, {bitrate: 115200}, onConnectCallback);
}
document.getElementById('connect').addEventListener("click", clickedListener, false);


var loadedListener = function() {
  console.log('loaded');

  //  デバイスをリスト化して、画面に表示する
  chrome.serial.getDevices(function(devices) {

    var selection = document.getElementById('port');

    devices.forEach(function(port){
      //  select menu に追加
      var option = document.createElement('option');
      option.value = port.path;
      //  今のところ、手元の環境ではport.displayNameが設定されていない
      option.text = port.displayName ? port.path + ' (' + port.displayName + ')' : port.path;
      selection.appendChild(option);
    });
  });
};
window.addEventListener('load', loadedListener, false);


var onReceiveCallback = function(info) {
  var box = document.getElementById('textbox');
  console.log('received');
  
  if (info.connectionId == connectionId && info.data) {
    // 取得文字列
    var str = convertArrayBufferToString(info.data);
    console.log(str);
    box.value += str;  // textarea に出力
    box.scrollTop = box.scrollHeight;
  }
};
chrome.serial.onReceive.addListener(onReceiveCallback);



var onDisconnectCallback = function(result) {
  if (result) { console.log('disconnected'); }
  else { console.log('error'); }
}

var onReceiveErrorCallback = function(info) {
  console.log('end');
  console.log(arrayReceived.join(','));

  var disconnect = chrome.serial.disconnect(connectionId, onDisconnectCallback)
}
chrome.serial.onReceiveError.addListener(onReceiveErrorCallback);