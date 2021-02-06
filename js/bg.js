$( document ).ready(function() {
    console.log( "bg!" );
    chrome.runtime.onMessage.addListener(
	  function(request, sender, sendResponse) {
	    if (request.message == "changeIcon"){
    		chrome.browserAction.setIcon({
			  path : {
			    "16": "icons/facetime-button_16.png",
			    "24": "icons/facetime-button_24.png",
			    "32": "icons/facetime-button_32.png"
			  }
			});
	    }
	  }
	);
});