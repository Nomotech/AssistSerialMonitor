let mapFlag = false;
let canvas = $('.mapcan').get(0);
let ctx = canvas.getContext('2d');
let bgcanvas = $('.mapbg').get(0);
let bgctx = bgcanvas.getContext('2d');
let width = canvas.width;
let height = canvas.height;
let center = {x:width/2,y:height/2}
let span = 20;
let zoom = 1.0;
let preZoom = zoom;

let createMap = function(){
  let ease;
  let easetime = 100;
  let easeoffset = 20;
  let time = easetime + easeoffset * Math.ceil(canvas.width/span);
  for(let t = 0 ; t < time ;t++){
    setTimeout(function(){
      clearCanvas('.mapbg');
      for(let i = 0; i <= canvas.width/span/2; i++){
        let i_ = canvas.width/span - i;
        i_ = i;
        if(t < i_ * easeoffset) ease = 0;
        else if(t < i_ * easeoffset + easetime) ease = easeInOutExpo((t - i_ * easeoffset)/easetime);
        else ease = 1;
        let stroke = (i == 0) ? "rgba(0,100,255,1.0)" : "rgba(100,210,255,0.6)";
        drawLine(bgctx, {x:canvas.width/2 + i * span ,y:0}, {x:canvas.width/2 + i * span,y:canvas.height * ease}, 1, stroke);
        drawLine(bgctx, {x:canvas.width/2 - i * span ,y:0}, {x:canvas.width/2 - i * span,y:canvas.height * ease}, 1, stroke);
      }
      for(let i = 0; i <= canvas.height/span/2; i++){
        let i_ = canvas.width/span - i;
        i_ = i;
        if(t < i_ * easeoffset) ease = 0;
        else if(t < i_ * easeoffset + easetime) ease = easeInOutExpo((t - i_ * easeoffset)/easetime);
        else ease = 1;
        let stroke = (i == 0) ? "rgba(0,100,255,1.0)" : "rgba(100,210,255,0.6)";
        drawLine(bgctx, {x : 0, y: canvas.height/2 + i * span}, {x : canvas.width * ease, y : canvas.height/2 + i * span}, 1, stroke);
        drawLine(bgctx, {x : 0, y: canvas.height/2 - i * span}, {x : canvas.width * ease, y : canvas.height/2 - i * span}, 1, stroke);
      }
    }, 100);
  }
  mapFlag = true;
  animationMap();
}

let drawMap = function(){
  console.log("drawMap");
  clearCanvas('.mapbg');
  for(let i = 0; i <= canvas.width/span/2; i++){
    let stroke = (i == 0) ? "rgba(0,100,255,1.0)" : "rgba(100,210,255,0.1)";
    drawLine(bgctx, {x:center.x + i * span ,y:0}, {x:center.x + i * span,y:canvas.height}, 1, stroke);
    drawLine(bgctx, {x:center.x - i * span ,y:0}, {x:center.x - i * span,y:canvas.height}, 1, stroke);
  }
  for(let i = 0; i <= canvas.height/span/2; i++){
    let stroke = (i == 0) ? "rgba(0,100,255,1.0)" : "rgba(100,210,255,0.1)";
    drawLine(bgctx, {x : 0, y: center.x + i * span}, {x : width, y : center.y + i * span}, 1, stroke);
    drawLine(bgctx, {x : 0, y: center.x - i * span}, {x : width, y : center.y - i * span}, 1, stroke);
  }
}

// 45 * Math.PI / 180 
let drawTarget = function(t){
  let r = 20;
  ctx.fillStyle = t.fill;
  ctx.strokeStyle = t.stroke;
  ctx.beginPath();
  ctx.moveTo(center.x + t.x + r * Math.cos(90 * Math.PI / 180 + t.t)  , center.y - t.y - r * Math.sin(90 * Math.PI / 180 + t.t));
  ctx.lineTo(center.x + t.x + r * Math.cos(230 * Math.PI / 180 + t.t) , center.y - t.y - r * Math.sin(230 * Math.PI / 180 + t.t));
  ctx.lineTo(center.x + t.x + r * Math.cos(310 * Math.PI / 180 + t.t) , center.y - t.y - r * Math.sin(310 * Math.PI / 180 + t.t));
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
}

class Target {
  constructor(s,f) {
    this.stroke = s;
    this.fill = f;
  }
  setColor(s,f) {
    this.stroke = s;
    this.fill = f;
  }
  updatePos(x,y,t) {
    this.x = x;
    this.y = y;
    this.t = t;
  }
}

let mapDataUpload = function(str){
  let val;
  val = str.match(/r:(.+):(.+):(.+)/);
  if(val) targetList[0].updatePos(Number(val[1]),Number(val[2]),Number(val[3]));
  val = str.match(/b:(.+):(.+):(.+)/);
  if(val) targetList[1].updatePos(Number(val[1]),Number(val[2]),Number(val[3]));
  val = str.match(/y:(.+):(.+):(.+)/);
  if(val) targetList[2].updatePos(Number(val[1]),Number(val[2]),Number(val[3]));
  val = str.match(/g:(.+):(.+):(.+)/);
  if(val) targetList[3].updatePos(Number(val[1]),Number(val[2]),Number(val[3]));

}

let i = 0;
let update = function(){
  preZoom = zoom;
  // for(let t of targetList){

  // }
  i+=0.01;
  //targetList[0].updatePos(100 * Math.cos(90 * Math.PI / 180),100 * Math.sin(90 * Math.PI / 180),i);
//  targetList[1].updatePos(100 * Math.cos(i),100 * Math.sin(i),i);
}

$('#mapbtn').on('change', function(val){
  $('.map').toggleClass('active').css('display', 'block');
  if($('.map').hasClass('active')){
    $('.map').toggleClass('createGraph');
  } else {
    clearCanvas('.mapbg');
    clearCanvas('.mapcan');
    mapFlag = false;
  }
});

document.querySelector('.map').addEventListener("animationend",function(e){
  $('.map').children('canvas').css('display', 'inline-block');
  $('.map').removeClass(e.animationName);
  createMap();
});


let rotate = 0;
$('#maprotate').click(function(){
  // degという変数を0から360まで3秒かけて変化させる。
  $({deg:rotate}).animate({deg:rotate + 90}, {
    duration:100,
    // 途中経過
    progress:function() {
      $('.mapcanvas').css({
        'transform-origin': `${width/2 + 10}px ${height/2 + 10}px`,
        transform:`rotate(${this.deg}deg)`
      });
    },
    // complete animation
    complete:function() {
      rotate += 90;
      $('.mapcanvas').css({
        transform:'rotate(' + rotate + 'deg)'
      });
    }
  });
});

let targetList = [];
targetList.push(new Target("rgba(255,80,80,1.0)","rgba(255,80,80,0.5)"));
targetList.push(new Target("rgba(0,100,255,1.0)","rgba(0,100,255,0.5)"));
targetList.push(new Target("rgba(255,200,80,1.0)","rgba(255,200,80,0.5)"));
targetList.push(new Target("rgba(100,255,120,1.0)","rgba(100,255,120,0.5)"));
console.log(targetList)
function animationMap() {
  if(mapFlag) {
    
    requestAnimationFrame(animationMap);
    update();
    clearCanvas('.mapcan');
    for(let t of targetList) drawTarget(t);
    // drawTarget(100,100,0);
    // drawTarget(100 * Math.cos(90 * Math.PI / 180),100 * Math.sin(90 * Math.PI / 180),i);
    // drawTarget(100 * Math.cos(i),100 * Math.sin(i),i);
    if(preZoom!=zoom) drawMap();
  } 
}

function no_scroll(){
  
}

let scroll_event = 'onwheel' in document ? 'wheel' : 'onmousewheel' in document ? 'mousewheel' : 'DOMMouseScroll';
$('.mapcanvas').on(scroll_event,function(e){e.preventDefault();});