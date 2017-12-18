var connectionId = ''
let stringReceived = '';
let arrayReceived = [];

//init
$(function(){
  'use strict';
  $('.color-select').colorselector();
});

// ------------------------------------------< Device Load >------------------------------------------

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
  $('#rlicon').toggleClass('spin-icon',true);
}
$('#reload').click(function(){
  updatePort();
  $('#port').toggleClass('green-flash',true);
});
window.addEventListener('load', updatePort, false);

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
$('#connect').on('click',connectPort);



// ------------------------------------------< On Connect >------------------------------------------
let onConnectCallback = function(connectionInfo){
  //  onReceiveイベントでconnectionIdの一致を確認する
  connectionId = connectionInfo.connectionId;
  $("#sendbtn").prop("disabled", false);
  $('#connect').toggleClass('active',true);
  $('#connect').text('Disconnect');
  clickrstop();
}

// ------------------------------------------< On Discconect >------------------------------------------
let onDisconnectCallback = function(result) {
  if (result) console.log('disconnected'); 
  else  console.log('error');
  $("#sendbtn").prop("disabled", true);
  $('#connect').toggleClass('active',false);
  $('#connect').text('Connect');
  updatePort();
  clickrstop();
}

// --------------------------------< Send Data >--------------------------------
// send.js
// -------------------------------< Receive Data >--------------------------------
// receive.js

// ------------------------------------------< Error >------------------------------------------
let onReceiveErrorCallback = function(info) {
  console.log('end');
  console.log(arrayReceived.join(','));
  let disconnect = chrome.serial.disconnect(connectionId, onDisconnectCallback)
}
chrome.serial.onReceiveError.addListener(onReceiveErrorCallback);

// ------------------------------------------< animation >------------------------------------------
endAnimation('#rlicon');
endAnimation('#port');
endAnimation('#bitrate');
endAnimation('#log');
endAnimation('#sendStr');


$('#graphbtn').on('change', function(val){
  //console.log(val);
  window.resizeTo(1500,1000);
  $('.serialLogger').toggleClass('widelogger');
  $('.serialPlotter').toggleClass('wideplotter');
  // $("#sendbtn").prop("disabled", false);
  // chrome.serial.getDevices(function(info){console.log(info)});
  // chrome.serial.getConnections(function(info){console.log(info)});
  // chrome.serial.getInfo(connectionId, function(info){console.log(info)});
  // chrome.serial.getControlSignals(connectionId, function(info){console.log(info)});
});

$('#loggerbtn').on('change', function(val){
  //console.log(val);
  window.resizeTo(800,1000);
  $('.serialLogger').toggleClass('widelogger');
  $('.serialPlotter').toggleClass('wideplotter');
  // $("#sendbtn").prop("disabled", false);
  // chrome.serial.getDevices(function(info){console.log(info)});
  // chrome.serial.getConnections(function(info){console.log(info)});
  // chrome.serial.getInfo(connectionId, function(info){console.log(info)});
  // chrome.serial.getControlSignals(connectionId, function(info){console.log(info)});
});

