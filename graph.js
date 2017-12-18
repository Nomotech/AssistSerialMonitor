$('#linebtn').on('change', function(val){
  $('.line').toggleClass('active').css('display', 'inline-block');
  if($('.line').hasClass('active')) $('.line').toggleClass('createGraph');
  else clearCanvas('.linecan');
});
document.querySelector('.line').addEventListener("animationend",function(e){
  $('.line').children('canvas').css('display', 'inline-block');
  $('.line').removeClass(e.animationName);
});

$('#barbtn').on('change', function(val){
  $('.bar').toggleClass('active').css('display', 'inline-block');
  if($('.bar').hasClass('active')) $('.bar').toggleClass('createGraph');
  else clearCanvas('.barcan');
});
document.querySelector('.bar').addEventListener("animationend",function(e){
  $('.bar').children('canvas').css('display', 'inline-block');
  $('.bar').removeClass(e.animationName);
});

$('#pibtn').on('change', function(val){
  $('.pi').toggleClass('active').css('display', 'inline-block');
  if($('.pi').hasClass('active')) $('.pi').toggleClass('createGraph');
  else clearCanvas('.pican');
});
document.querySelector('.pi').addEventListener("animationend",function(e){
  $('.pi').children('canvas').css('display', 'inline-block');
  $('.pi').removeClass(e.animationName);
});

  
