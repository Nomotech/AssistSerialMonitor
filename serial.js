var connectionId = ''
let stringReceived = '';
let arrayReceived = [];


//init
$(function(){
  'use strict';
  $('.color-select').colorselector();
});

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
  let e = document.getElementById('port');
  let port = e.options[e.selectedIndex].value;
  let b = document.getElementById('bitrate');
  let bitrate = Number(b.options[b.selectedIndex].value);
  chrome.serial.connect(port, {bitrate: bitrate}, onConnectCallback);
}
document.getElementById('connect').addEventListener("click", clickedConnect, false);



// ------------------------------------------< On Connect >------------------------------------------
let onConnectCallback = function(connectionInfo){
  //  onReceiveイベントでconnectionIdの一致を確認するので、保持しておく
  connectionId = connectionInfo.connectionId;
}


// ------------------------------------------< Receive Data >------------------------------------------
let openReceiveOption = function(info){
  let type = info.srcElement.value;
  let data = parseInt(sendStr.value);
  if(info.isTrusted) {
    this.classList.toggle("active");
    var panel = document.getElementById('roption');
    if (panel.style.display === "block") {
        panel.style.display = "none";
    } else {
        panel.style.display = "block";
    }
  }
}
document.getElementById('receiveOption').addEventListener("click", openReceiveOption, false);


let scrollflag = 1; // -1 ... off 0 ... hold 1 ... on
let receiveData = function(info) {
  let box = document.getElementById('log');
  //console.log('received');
  
  if (info.connectionId == connectionId && info.data) {
    let str = convertArrayBufferToString(info.data);  // 取得文字列
    str = searchHighlight(str);                       // 文字列検索
    
    // auto scroll 判定
    let scro = $('#log').get(0).scrollHeight - $('#log').scrollTop();
    if(scrollflag == 1 && scro > 498) scrollflag = 0;           // auto scroll 出るとき
    else if(scrollflag == 0 && scro > 800) scrollflag = -1;     // 判定ゾーンから抜けるまで
    else if(scrollflag == -1 && scro < 800) scrollflag = true;  // 判定ゾーンに入ってきたとき
    
    // 出力
    let data = $(`<pre>${str}</pre>`);
    $('#log').append(data);
    
    console.log(scro);
    if(scrollflag == 1) $('#log').scrollTop($('#log').get(0).scrollHeight);
  }
};
chrome.serial.onReceive.addListener(receiveData);


// ------------------------------------------< Send Data >------------------------------------------
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
}
document.getElementById('sendOption').addEventListener("click", sendTypeChange, false);

document.getElementById('sendStr').addEventListener("keyup", sendDataInput, false);
document.getElementById('sendHex').addEventListener("keyup", sendDataInput, false);
document.getElementById('sendDec').addEventListener("keyup", sendDataInput, false);
document.getElementById('sendBin').addEventListener("keyup", sendDataInput, false);

let sendData = function() {
  let data = document.getElementById('sendStr').value;
  console.log('send: ' + data);
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
        this.classList.toggle("active");

        var panel = this.nextElementSibling;
        if (panel.style.display === "block") {
            panel.style.display = "none";
        } else {
            panel.style.display = "block";
        }
    }
}
