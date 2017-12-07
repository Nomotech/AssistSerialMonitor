chrome.app.runtime.onLaunched.addListener(function(){
  chrome.app.window.create('index.html', {
    'bounds': {
      'width': 800,
      'height': 1000, 
      'top': 0,
      'left': 100
    }
  });
});