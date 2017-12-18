// ------------------------------------------< Receive Data >------------------------------------------
let openReceiveOption = function(info){
  let type = info.srcElement.value;
  let data = parseInt(sendStr.value);
  if(info.isTrusted) {
    this.classList.toggle("active");
    let panel = document.getElementById('roption');
    if (panel.style.display === "block") panel.style.display = "none";
    else panel.style.display = "block";
  }
}
document.getElementById('receiveOption').addEventListener("click", openReceiveOption, false);


let scrollflag = 1; // -1 ... off 0 ... hold 1 ... on
let receiveDataType = 'Str';
let receiveData = function(info) {
  let box = document.getElementById('log');
  let ts = Date.now();
  if (info.connectionId == connectionId && info.data) {
    let str = changeDataType(info.data,receiveDataType);
    //let str = convertArrayBufferToString(info.data);  // 取得文字列
    str = searchHighlight(str);                       // 文字列検索
    
    // auto scroll 判定
    let scro = $('#log').get(0).scrollHeight - $('#log').scrollTop();
    if(scrollflag == 1 && scro > 498) scrollflag = 0;           // auto scroll 出るとき
    else if(scrollflag == 0 && scro > 600) scrollflag = -1;     // 判定ゾーンから抜けるまで
    else if(scrollflag == -1 && scro < 600) scrollflag = true;  // 判定ゾーンに入ってきたとき
    
    // 出力
    let data = $(`<pre class='ts'>time:${ts}\n</pre><pre class='in'>${str}</pre>`);
    $('#log').append(data);
    if(!$('#tsbtn').hasClass('active')) $('.ts').hide();
    if(scrollflag == 1) $('#log').scrollTop($('#log').get(0).scrollHeight);
    if(autodel > 0){
      while($('#log pre.in').length > autodel){
        $('pre.ts').eq(0).remove();
        $('pre.in').eq(0).remove();
      };
    }
  }
};
chrome.serial.onReceive.addListener(receiveData);

// Receive Option
let clickrstop = function(){
  if($('#connect').hasClass('active')){
    let data = ('<i class="fa fa-hand-paper-o" aria-hidden="true"></i> Stop');
    $('#rstop').empty(); $('#rstop').append(data);
    $('.sendlog').css('display', 'block');
  }else{
    let data = ('<i class="fa fa-hand-o-right" aria-hidden="true"></i> Start');
    $('#rstop').empty(); $('#rstop').append(data);
    $('.sendlog').hide();
  }
}
$('#rstop').on('click',function(){
  connectPort();
  clickrstop();
});

$('#bottom').on('click', function(){
  $('#log').scrollTop($('#log').get(0).scrollHeight);
  scrollflag == -1;
});

$('#rclear').on('click', function(){
  console.log('clear click');
  $('#log').empty();
  $('#log').toggleClass('red-flash',true);
});

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
    $('#log').toggleClass('green-flash',true);
  });
});

$('#receiveDataType').change(function(info){receiveDataType = $(this).val();});



$('#sendlogbtn').on('click',function(){
  $(this).toggleClass('active');
  if($(this).hasClass('active')){
    let data = ('<i class="fa fa-paper-plane" aria-hidden="true"></i> hide send log');
    $(this).empty(); $(this).append(data);
    $('.sendlog').css('display', 'block');
  }else{
    let data = ('<i class="fa fa-paper-plane" aria-hidden="true"></i> show send log');
    $(this).empty(); $(this).append(data);
    $('.sendlog').hide();
  }
  if(scrollflag == 1) $('#log').scrollTop($('#log').get(0).scrollHeight);
});

$('#tsbtn').on('click',function(){
  $(this).toggleClass('active');
  if($(this).hasClass('active')){
    let data = ('<i class="fa fa-clock-o" aria-hidden="true"></i> hide timestamp');
    $(this).empty(); $(this).append(data);
    $('.ts').css('display', 'block');
  }else{
    let data = ('<i class="fa fa-clock-o" aria-hidden="true"></i> show timestamp');
    $(this).empty(); $(this).append(data);
    $('.ts').hide();
  }
  if(scrollflag == 1) $('#log').scrollTop($('#log').get(0).scrollHeight);
});

// auto delete receive box
let autodel = 200;
$('.autodelflag').on('change',function(e){
  if($(this).prop('checked')) autodel = Number($('#autodel').val());
  else autodel = 0;
})
$('#autodel').on('change',function(){
  if($('.autodelflag').prop('checked')) autodel = Number($('#autodel').val());
  else autodel = 0;
})