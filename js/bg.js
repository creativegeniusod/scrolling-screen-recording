$( document ).ready(function() {
    console.log( "bg!" );
    chrome.runtime.onMessage.addListener(
	  function(request, sender, sendResponse) {
	    if (request.message == "bg"){
    		chrome.browserAction.setIcon({path: '/icons/ZonPay_logo.png'});
	    }
	  }
	);
});