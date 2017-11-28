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

function stringSlices(str, n) {
  var l = str.length;
  var result = [];
  for (var i = 0; i < l; i += n) {
      result.push(str.slice(i, i + n));
  }
  return result;
}

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
// onKeyup="this.value=this.value.replace(/[^0-9]+/,'')"
let sendDataType = 'str';
let sendTypeChange = function(info){
  let type = info.srcElement.value;
  let sendData = document.getElementById('sendData');
  let data = parseInt(sendStr.value);
  //.toggle("active");
  if(info.isTrusted) {
    this.classList.toggle("active");
    var panel = document.getElementById('soption');
    //panel.classList.toggle("active");
    if (panel.style.display === "block") {
        panel.style.display = "none";
    } else {
        panel.style.display = "block";
    }
  }
  // switch(type) {
  //   case 'str':
  //     break;
  //   case 'char':
  //     /* Toggle between adding and removing the "active" class,
  //     to highlight the button that controls the panel */
  //     // this.classList.toggle("active");

  //     /* Toggle between hiding and showing the active panel */
      
  //     break;
  //   case 'base2':
  //     sendData.value = data.toString(2);
  //     break;
  //   case 'base10':
  //     sendData.value = data.toString(10);
  //     break;
  //   case 'base16':
  //     sendData.value = data.toString(16);
  //     break;
  //   default : break;
  // }
  // sendDataType = info.srcElement.value; 
}
document.getElementById('sendOption').addEventListener("click", sendTypeChange, false);

let checkInput = function(data){
  let form = data.srcElement;
  let inputData = form.value;
  let inputArray = [];
  let str = '';
  console.log(data)
  switch(data.target.id) {
    case 'sendStr':
      for(let i  = 0 ; i < inputData.length ; i++) {
        inputArray[i] = inputData.charCodeAt(i);
      }
      break;
    case 'sendHex':
      inputArray = stringSlices(form.value.replace(/[^0-9a-fA-F]+/g,""),2);
      for(let h of inputArray) str += h + ' ';
      if(data.key == 'Backspace') str = str.slice( 0, -1);
      form.value = str;
      inputArray = inputArray.map(function(x){ return parseInt(x,16); });
      break;
    case 'sendDec':
      inputArray = stringSlices(form.value.replace(/[^0-9]+/g,""),3);
      for(let i=0 ; i < inputArray.length ; i++){
        if(Number(inputArray[i]) > 255) inputArray[i] = 255;
        if(data.key == ' ' && i == inputArray.length - 1) {
          while(inputArray[i].length < 3) inputArray[i] = '0' + inputArray[i];
        }
        str += inputArray[i] + ' ';
      }
      if(data.key == 'Backspace') str = str.slice( 0, -1);
      form.value = str;
      inputArray = inputArray.map(function(x){ return Number(x); });
      break;
    case 'sendBin':
      inputArray = stringSlices(form.value.replace(/[^0-1]+/g,""),8);
      for(let i=0 ; i < inputArray.length ; i++){
        if(data.key == ' ' && i == inputArray.length - 1) {
          while(inputArray[i].length < 8) inputArray[i] = '0' + inputArray[i];
        }
        str += inputArray[i] + ' ';
      }
      if(data.key == 'Backspace') str = str.slice( 0, -1);
      form.value = str;
      inputArray = inputArray.map(function(x){ return parseInt(x,2); });
      break;
    default : break;

  }

  if(data.target.id != 'sendStr') {
    str = '';
    for(let a of inputArray) str += String.fromCharCode(a);
    //document.getElementById('sendStr').value = str.replace(/[^0-9a-zA-Z]/g,"?");
    document.getElementById('sendStr').value = str;
  }
  if(data.target.id != 'sendHex') {
    str = '';
    for(let a of inputArray) str += a.toString(16) + ' ';
    document.getElementById('sendHex').value = str;
  }
  if(data.target.id != 'sendDec') {
    str = '';
    for(let a of inputArray) str += a + ' ';
    document.getElementById('sendDec').value = str;
  }
  if(data.target.id != 'sendBin') {
    str = '';
    for(let a of inputArray) {
      a = a.toString(2);
      while(a.length < 8) a = '0' + a;
      str += a + ' ';
    }
    document.getElementById('sendBin').value = str;
  }
  
  console.log(inputArray)
}
document.getElementById('sendStr').addEventListener("keyup", checkInput, false);
document.getElementById('sendHex').addEventListener("keyup", checkInput, false);
document.getElementById('sendDec').addEventListener("keyup", checkInput, false);
document.getElementById('sendBin').addEventListener("keyup", checkInput, false);

let sendData = function() {
  let data = document.getElementById('sendStr').value;
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

var acc = document.getElementsByClassName("accordion");
var i;

for (i = 0; i < acc.length; i++) {
    acc[i].onclick = function(){
        /* Toggle between adding and removing the "active" class,
        to highlight the button that controls the panel */
        this.classList.toggle("active");

        /* Toggle between hiding and showing the active panel */
        var panel = this.nextElementSibling;
        if (panel.style.display === "block") {
            panel.style.display = "none";
        } else {
            panel.style.display = "block";
        }
    }
}