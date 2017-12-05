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
  updatePort();
};
window.addEventListener('load', loaded, false);

let updatePort = function(){
  // selectにport 設定
  chrome.serial.getDevices(function(devices) {   
    $("#port").empty();
    devices.forEach(function(port){
      let op = (`<option value=${port.path}>
        ${port.displayName ? port.path + ' (' + port.displayName + ')' : port.path}
        </option>`);
      $("#port").append(op);
    });
    $('#roicon').toggleClass('reloadiconAnimation',true);
  });
}
$('#reload').click(function(){
  $('#roicon').toggleClass('reloadiconAnimation',false);
  updatePort();
});

// ------------------------------------------< Click Connect >------------------------------------------

$('#connect').on('click', function(){
  if($('#connect').hasClass('active')){
      chrome.serial.disconnect(connectionId, onDisconnectCallback);
  }else{
    let e = document.getElementById('port');
    let b = document.getElementById('bitrate');
    chrome.serial.connect(
      e.options[e.selectedIndex].value, 
      {bitrate: Number(b.options[b.selectedIndex].value)}, 
      onConnectCallback
    );
  }
});



// ------------------------------------------< On Connect >------------------------------------------
let onConnectCallback = function(connectionInfo){
  //  onReceiveイベントでconnectionIdの一致を確認する
  connectionId = connectionInfo.connectionId;
  $("#sendbtn").prop("disabled", false);
  $('#connect').toggleClass('active',true);
  $('#connect').text('Disconnect');
}

// ------------------------------------------< On Discconect >------------------------------------------
let onDisconnectCallback = function(result) {
  if (result) console.log('disconnected'); 
  else  console.log('error');
  $("#sendbtn").prop("disabled", true);
  $('#connect').toggleClass('active',false);
  $('#connect').text('Connect');
  updatePort();
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


let scrollflag = true;
let receiveData = function(info) {
  let box = document.getElementById('textbox');
  //console.log('received');
  
  if (info.connectionId == connectionId && info.data) {
    let str = convertArrayBufferToString(info.data);  // 取得文字列
    str = searchHighlight(str);
    //console.log(str);
    // let scro = box.scrollHeight - box.scrollTop;  // scroll位置確認
  
    // // console.log(scro)
    // // auto scroll 判定
    // if(scrollflag && scro > 604) scrollflag = false;
    // else if(!scrollflag && scro < 900) scrollflag = true; 
    // box.value += str;  // textarea に出力
    
    // // 出力
    // if(scrollflag) box.scrollTop = box.scrollHeight;
    let data = $(`<pre>${str}</pre>`);
    $('#log').append(data); 
  }
};
chrome.serial.onReceive.addListener(receiveData);


// ------------------------------------------< Send Data >------------------------------------------
let sendOption = function(info){
  let type = info.srcElement.value;
  let sendData = document.getElementById('sendData');
  let data = parseInt(sendStr.value);
  if(info.isTrusted) {
    this.classList.toggle("active");
    var panel = document.getElementById('soption');
    if (panel.style.display === "block") panel.style.display = "none";
    else panel.style.display = "block";
  }
}
document.getElementById('sendOption').addEventListener("click", sendOption, false);

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

// ------------------------------------------< Error >------------------------------------------
let onReceiveErrorCallback = function(info) {
  console.log('end');
  console.log(arrayReceived.join(','));

  let disconnect = chrome.serial.disconnect(connectionId, onDisconnectCallback)
}
chrome.serial.onReceiveError.addListener(onReceiveErrorCallback);


$('#rstop').on('click', function(){
  console.log('stop click');
  // $("#sendbtn").prop("disabled", false);
  // chrome.serial.getDevices(function(info){console.log(info)});
  // chrome.serial.getConnections(function(info){console.log(info)});
  // chrome.serial.getInfo(connectionId, function(info){console.log(info)});
  // chrome.serial.getControlSignals(connectionId, function(info){console.log(info)});
});