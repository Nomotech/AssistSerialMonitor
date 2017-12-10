//Easingfunction-------------------------------------------------------------------------------
function easeInOutExpo(t){
    if( t < 0.5 ) {
        return (Math.pow( 2, 16 * t ) - 1) / 510;
    } else {
        return 1 - 0.5 * Math.pow( 2, -16 * (t - 0.5) );
    }
}

function easeInOutQuint(t){
    var t2;
    if( t < 0.5 ) {
        t2 = t * t;
        return 16 * t * t2 * t2;
    } else {
        t2 = (--t) * t;
        return 1 + 16 * t * t2 * t2;
    }
}

function easeInOutStair(t){
    var t2;
    if( t < 0.5 ) {
        t2 = 8*t*t*t - 1;
        return 1/2 * Math.pow(t2,1/3) + 1/2;
    } else {
        t2 = 8*t*t*t - 24*t*t + 24*t -7; 
        return 1/2 * Math.pow(t2,1/3) + 1/2;
    }
}

function easeInOutCir(t){
    if( t <= 0.5 ) {
        return 1/2 * (1-Math.sqrt(1-4*t*t));
    } else {
        return 1/2 * (1+Math.sqrt(-3*8*t-4*t*t));
    }
}

function easeOutExpo(t) {
    return 1 - Math.pow( 2, -8 * t );
}

function easeInExpo(t) {
    return (Math.pow( 2, 8 * t ) - 1) / 255;
}

function easeOutElastic(t) {
    var t2 = (t - 1) * (t - 1);
    return 1 - t2 * t2 * Math.cos( t * Math.PI * 2.0 );
}

function easeInOutElastic(t) {
    var t2;
    if( t < 0.45 ) {
        t2 = t * t;
        return 2 * t2 * t2 * Math.sin( t * Math.PI * 1 );
    } else if( t < 0.55 ) {
        return 0.5 + 0.75 * Math.sin( t * Math.PI * 4 );
    } else {
        t2 = (t - 1) * (t - 1);
        return 1 - 2 * t2 * t2 * Math.sin( t * Math.PI * 1 );
    }
}

//------------------------------------------------------------------------------------------
function ease(Easeing,Start_time,Easeing_time){
    if(t-Start_time<Easeing_time){
        if(Easeing =="easeInOutElastic")    return easeInOutElastic((t-Start_time)/Easeing_time);
        else if(Easeing == "easeInOutExpo") return easeInOutExpo((t-Start_time)/Easeing_time);
        else if(Easeing == "easeInExpo")    return easeInExpo((t-Start_time)/Easeing_time);
        else if(Easeing == "easeOutExpo")   return easeOutExpo((t-Start_time)/Easeing_time);

    }else{
        move_flag --;
        state ++;
        return 1;
    }
}

