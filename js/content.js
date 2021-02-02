$( document ).ready(function() {
    console.log( "content!" );
    chrome.runtime.onMessage.addListener(
	  function(request, sender, sendResponse) {
	    if (request.message == "runAnimation"){
	      pageScroll();
	      console.log("84623846");
	    }

	    if (request.message == "showBrkPoint"){
	     	var div = document.createElement("div");
			div.innerText = 'brkInp';
			div.classList.add("breakPointt");
			$('body').prepend(div);
	    }
	  }
	);
    function pageScroll() {
    	console.log("scroll");
    	$("html, body").animate({
            scrollTop: $(
              'html, body').get(0).scrollHeight 
        }, 3000);
	}
});