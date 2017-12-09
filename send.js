let sendOption = function(info){
  let type = info.srcElement.value;
  let sendData = document.getElementById('sendData');
  let data = parseInt(sendStr.value);
  if(info.isTrusted) {
    this.classList.toggle("active");
  }
}
document.getElementById('sendOption').addEventListener("click", sendOption, false);

document.getElementById('sendStr').addEventListener("keyup", sendDataInput, false);
document.getElementById('sendHex').addEventListener("keyup", sendDataInput, false);
document.getElementById('sendDec').addEventListener("keyup", sendDataInput, false);
document.getElementById('sendBin').addEventListener("keyup", sendDataInput, false);

let sendData = function() {
  let data = document.getElementById('sendStr').value;
  //console.log('send: ' + data);
  chrome.serial.send(connectionId, convertStringToArrayBuffer(data), function(log) {console.log(log)} );
  dataObject = $(`<pre class="ts">time:${Date.now()}</pre><pre class="sendlog">${data}\n</pre>`);
  $('#log').append(dataObject);

  if(!$('#sendlogbtn').hasClass('active')) $('.sendlog').hide();
  if(!$('#tsbtn').hasClass('active')) $('.ts').hide();
  if(scrollflag == 1) $('#log').scrollTop($('#log').get(0).scrollHeight);

  $('#sendStr').toggleClass('blue-flash',true);
}
document.getElementById('sendbtn').addEventListener("click", sendData, false);
