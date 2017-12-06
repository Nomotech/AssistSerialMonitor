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
  });
  $('#roicon').toggleClass('spin-icon',true);
}
$('#reload').click(function(){
  updatePort();
  $('#port').toggleClass('green-flash',true);
});

endAnimation('#roicon');
endAnimation('#port');
endAnimation('#bitrate');

// ------------------------------------------< Click Connect >------------------------------------------

let connectPort = function(){
  if($('#connect').hasClass('active')){
      chrome.serial.disconnect(connectionId, onDisconnectCallback);
      $('#port').toggleClass('red-flash',true);
      $('#bitrate').toggleClass('red-flash',true);
  }else{
    let e = document.getElementById('port');
    let b = document.getElementById('bitrate');
    chrome.serial.connect(
      e.options[e.selectedIndex].value, 
      {bitrate: Number(b.options[b.selectedIndex].value)}, 
      onConnectCallback
    );
    $('#port').toggleClass('blue-flash',true);
    $('#bitrate').toggleClass('blue-flash',true);
  }
}
$('#connect').on('click', function(){
  connectPort();
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
  $('#sendStr').toggleClass('blue-flash',true);
}
document.getElementById('sendbtn').addEventListener("click", sendData, false);
endAnimation('#sendStr');

// ------------------------------------------< Receive Data >------------------------------------------

let openReceiveOption = function(info){
  let type = info.srcElement.value;
  let data = parseInt(sendStr.value);
  if(info.isTrusted) {
    this.classList.toggle("active");
    var panel = document.getElementById('roption');
    if (panel.style.display === "block") panel.style.display = "none";
    else panel.style.display = "block";
  }
}
document.getElementById('receiveOption').addEventListener("click", openReceiveOption, false);


let scrollflag = 1; // -1 ... off 0 ... hold 1 ... on
let receiveData = function(info) {
  let box = document.getElementById('log');
  
  if (info.connectionId == connectionId && info.data) {
    let str = convertArrayBufferToString(info.data);  // 取得文字列
    str = searchHighlight(str);                       // 文字列検索
    
    // auto scroll 判定
    let scro = $('#log').get(0).scrollHeight - $('#log').scrollTop();
    if(scrollflag == 1 && scro > 498) scrollflag = 0;           // auto scroll 出るとき
    else if(scrollflag == 0 && scro > 600) scrollflag = -1;     // 判定ゾーンから抜けるまで
    else if(scrollflag == -1 && scro < 600) scrollflag = true;  // 判定ゾーンに入ってきたとき
    
    // 出力
    let data = $(`<pre>${str}</pre>`);
    $('#log').append(data);
    
    console.log(scro);
    if(scrollflag == 1) $('#log').scrollTop($('#log').get(0).scrollHeight);
  }
};
chrome.serial.onReceive.addListener(receiveData);

// Receive Option
$('#rclear').on('click', function(){
  console.log('clear click');
  $('#log').empty();
  $('#log').toggleClass('red-flash',true);
});
endAnimation('#log');


$('#rsave').on('click', function(){
  let option = {
    type: 'saveFile',
    suggestedName: getDateString() + '.txt',
    accepts: [ { description: 'Text files (*.txt)',extensions: ['txt']} ],
    acceptsAllTypes: true
  };
  chrome.fileSystem.chooseEntry(option, function(entry){
    console.log(entry);
    entry.createWriter(function(writer) {
      let data = $('#log').text();
      writer.write(new Blob([data], {type: 'text/plain'}));
    });
  });
});


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