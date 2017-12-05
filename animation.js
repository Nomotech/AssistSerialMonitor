
let endAnimation = function(selector){
	document.querySelector(selector).addEventListener("animationend",function(e){
	    $(selector).removeClass(e.animationName);
	});
}