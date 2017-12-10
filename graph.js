$('#mapbtn').on('change', function(val){
  $('.map').toggleClass('active').css('display', 'block');
  if($('.map').hasClass('active')) $('.map').toggleClass('createGraph');
  else clearCanvas('.mapcan');
});
document.querySelector('.map').addEventListener("animationend",function(e){
  $('.map').children('canvas').css('display', 'inline-block');
  $('.map').removeClass(e.animationName);
  createMap();
});

let createMap = function(){
  let canvas = $('.mapcan').get(0);
  let ctx = canvas.getContext('2d');
  /* 三角形を描く */
  ctx.beginPath();
  ctx.moveTo(50, 10);
  ctx.lineTo(90, 90);
  ctx.lineTo(10, 90);
  ctx.closePath();
  ctx.stroke();
  let span = 20;

  let draw = function(){
  }

  let ease;
  let easetime = 100;
  let easeoffset = 20;
  let time = easetime + easeoffset * Math.ceil(canvas.width/span);
  for(let t = 0 ; t < time ;t++){
    setTimeout(function(){
      for(let i = 0; i <= canvas.width/span/2; i++){
        let i_ = canvas.width/span - i;
        i_ = i;
        if(t < i_ * easeoffset) ease = 0;
        else if(t < i_ * easeoffset + easetime) ease = easeInOutExpo((t - i_ * easeoffset)/easetime);
        else ease = 1;
        drawLine(ctx, {x:canvas.width/2 + i * span ,y:0}, {x:canvas.width/2 + i * span,y:canvas.height * ease}, 1, '#660');
        drawLine(ctx, {x:canvas.width/2 - i * span ,y:0}, {x:canvas.width/2 - i * span,y:canvas.height * ease}, 1, '#660');
      }
      for(let i = 0; i <= canvas.height/span/2; i++){
        let i_ = canvas.width/span - i;
        i_ = i;
        if(t < i_ * easeoffset) ease = 0;
        else if(t < i_ * easeoffset + easetime) ease = easeInOutExpo((t - i_ * easeoffset)/easetime);
        else ease = 1;
        drawLine(ctx, {x : 0, y: canvas.height/2 + i * span}, {x : canvas.width * ease, y : canvas.height/2 + i * span}, 1, '#660');
        drawLine(ctx, {x : 0, y: canvas.height/2 - i * span}, {x : canvas.width * ease, y : canvas.height/2 - i * span}, 1, '#660');
      }
    }, 100);
  }
}

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

  
let clearCanvas = function(selector){
  console.log("clear" + selector);
  let canvas = $(selector).get(0);
  let ctx = canvas.getContext('2d');
  ctx.clearRect(0,0,canvas.width,canvas.height);
}