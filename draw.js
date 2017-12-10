function drawCircle(cx,cy,r,stroke,fill,radStart,radEnd,ctx) {
  if (stroke == null) stroke="rgba(0,0,0,1)";
  if (fill == null) fill="rgba(0,0,0,0)";
  if (radStart == null) radStart=0;
  if (radEnd == null) radEnd=Math.PI*2;
  if (ctx == null) ctx=canvas.getContext('2d');


  ctx.beginPath();
  ctx.fillStyle = fill;
  ctx.strokeStyle = stroke;
  ctx.arc(cx, cy,r,radStart,radEnd,false);
  ctx.stroke();
  ctx.fill();
}

function drawLine(ctx, s, e, w, stroke) {
  if (stroke == null) stroke="rgba(0,0,0,1)";
  if (ctx == null) ctx=canvas.getContext('2d');
  ctx.strokeStyle = stroke;
  ctx.lineWidth = w;
  ctx.beginPath();
  ctx.moveTo(s.x, s.y);
  ctx.lineTo(e.x, e.y);
  ctx.closePath();
  ctx.stroke();
}

function drawText(x,y,text,stroke,fill,font,baseline,ctx){
  if (stroke == null) stroke="rgba(0,0,0,1)";
  if (fill == null) fill="rgba(0,0,0,0)";
  if (ctx == null) ctx=canvas.getContext('2d');
  if (font == null) font = "28px 'Monotype Corsiva'";
  ctx.fillStyle = fill;
  ctx.strokeStyle = stroke;
  ctx.font = font;
  ctx.textBaseline = "middle";
  ctx.fillText(text,x,y);
}