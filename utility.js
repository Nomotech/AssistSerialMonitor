let getDateString = function(){
	let toDoubleDigits = function(num) {
	  num += "";
	  if (num.length === 1) num = "0" + num;
		return num;     
	};
	let now = new Date();
	let year = now.getFullYear();
	let mon = toDoubleDigits(now.getMonth()+1); //１を足す
	let day = toDoubleDigits(now.getDate());
	let hour = toDoubleDigits(now.getHours());
	let min = toDoubleDigits(now.getMinutes());
	let sec = toDoubleDigits(now.getSeconds());

	//let s = year + "年" + mon + "月" + day + "日" + hour + "時" + min + "分" + sec + "秒"; 
	let s = '' + year + mon + day + hour + min + sec; 
	return s;	
}
