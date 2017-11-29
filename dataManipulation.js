/* Interprets an ArrayBuffer as UTF-8 encoded string data. */
function convertArrayBufferToString(buf){
  let bufView = new Uint8Array(buf);
  let encodedString = String.fromCharCode.apply(null, bufView);
  return decodeURIComponent(escape(encodedString));
}

/* Converts a string to UTF-8 encoding in a Uint8Array; returns the array */
function convertStringToArrayBuffer(str) {
   //let encodedString = unescape(encodeURIComponent(str));
   let encodedString = unescape(str);
   let bytes = new Uint8Array(encodedString.length);
   for (let i = 0; i < encodedString.length; ++i) {
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

let sendDataInput = function(data){
  let form = data.srcElement;
  let inputData = form.value;
  let num = form.value.length;
  let inputArray = [];
  let str = '';
  form.focus();
  let forcus = form.selectionStart;   // 書き始めのカーソルの位置をとっておく
  
  // 入力されたデータの処理と、入力formの編集
  switch(data.target.id) {
    case 'sendStr':
      for(let i  = 0 ; i < inputData.length ; i++) {
        inputArray[i] = inputData.charCodeAt(i);
      }
      break;
    case 'sendHex':
      inputArray = stringSlices(form.value.replace(/[^0-9a-fA-F]+/g,""),2);
      for(let h of inputArray) str += h + ' ';
      str = str.slice( 0, -1)
      //if(data.key == 'Backspace') str = str.slice( 0, -1);
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
      str = str.slice( 0, -1)
      //if(data.key == 'Backspace') str = str.slice( 0, -1);
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
      str = str.slice( 0, -1) 
      //if(data.key == 'Backspace') str = str.slice( 0, -1);
      form.value = str;
      inputArray = inputArray.map(function(x){ return parseInt(x,2); });
      break;
    default : break;
  }

  // 入力されていないformの内容も更新
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
  //console.log(inputArray);
  // カーソル位置の調整
  form.selectionStart = forcus + form.value.length - num; // スペースとかが増えた分の調整
  form.selectionEnd = form.selectionStart;
}