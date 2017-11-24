let connectionId = ''
let stringReceived = '';
let arrayReceived = [];

/* Interprets an ArrayBuffer as UTF-8 encoded string data. */
function convertArrayBufferToString(buf){
  let bufView = new Uint8Array(buf);
  let encodedString = String.fromCharCode.apply(null, bufView);
  return decodeURIComponent(escape(encodedString));
}



let onConnectCallback = function(connectionInfo){
  //  onReceiveイベントでconnectionIdの一致を確認するので、保持しておく
  connectionId = connectionInfo.connectionId;
}


let clickedListener = function() {
  console.log('clicked');

  let e = document.getElementById('port');
  let port = e.options[e.selectedIndex].value;

  let b = document.getElementById('bitrate');
  let bitrate = Number(b.options[b.selectedIndex].value);

  document.getElementById('connect').value = 'dicconect';

  chrome.serial.connect(port, {bitrate: bitrate}, onConnectCallback);

}
document.getElementById('connect').addEventListener("click", clickedListener, false);


let loadedListener = function() {
  console.log('loaded');

  //  デバイスをリスト化して、画面に表示する
  chrome.serial.getDevices(function(devices) {

    //110，300，1200，2400，4800，9600，19200，38400，57600，115200
    let bitrate = document.getElementById('bitrate');
    let bitrates = [115200,57600,38400,19200,9600,4800,2400,1200,300,110];
    for(let br of bitrates){
      let option = document.createElement('option');
      option.value = br;
      option.text = ' ' + br + ' bps';
      bitrate.appendChild(option);  
    }
    
    let selection = document.getElementById('port');
    devices.forEach(function(port){
      //  select menu に追加
      let option = document.createElement('option');
      option.value = port.path;
      option.text = port.displayName ? port.path + ' (' + port.displayName + ')' : port.path;
      selection.appendChild(option);
    });
  });
};
window.addEventListener('load', loadedListener, false);


let onReceiveCallback = function(info) {
  let box = document.getElementById('textbox');
  console.log('received');
  
  if (info.connectionId == connectionId && info.data) {
    // 取得文字列
    let str = convertArrayBufferToString(info.data);
    console.log(str);
    box.value += str;  // textarea に出力
    box.scrollTop = box.scrollHeight;
  }
};
chrome.serial.onReceive.addListener(onReceiveCallback);



let onDisconnectCallback = function(result) {
  if (result) { console.log('disconnected'); }
  else { console.log('error'); }
}

let onReceiveErrorCallback = function(info) {
  console.log('end');
  console.log(arrayReceived.join(','));

  let disconnect = chrome.serial.disconnect(connectionId, onDisconnectCallback)
}
chrome.serial.onReceiveError.addListener(onReceiveErrorCallback);