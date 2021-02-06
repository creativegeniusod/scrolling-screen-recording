$( document ).ready(function() {
    console.log( "content!" );
    var links = [];
    var CORRECTION = 50;
	var DELAY_READING = 2000;
	var DELAY_SCROLLING = 1500;
	var timerId = 0;

    chrome.runtime.onMessage.addListener(
	  function(request, sender, sendResponse) {
	    if (request.message == "runAnimation"){
	      links = request.brkpoint;
	      delayLinks(0);
	    }
	  }
	);

	function delayLinks( i ) {
		for (var j = 0; j < links.length; j++) {
			var div = document.createElement("div");
			var id = links[j].split(' ');
			var top = 41;
			top = 41+(100*j);
			var topvalue = top+"%";
			id = id[0]+id[1];
			div.innerText = links[j];
			if(document.getElementById(id) == null){
				div.setAttribute('id', id);
				$('body').append(div);
				div.style.top = topvalue;
			}
		}
		if( i >= links.length ) i = 0;
		scrollToLink( links[i] );
		if((links.length-1) != i){
			var next = ( i == links.length - 1 ? 0 : i + 1);
			timerId = setTimeout(function() { delayLinks( next ) }, DELAY_READING )
		}
	}

	function scrollToLink( link ) {
		if(link != undefined){
		  var id = link.split(' ');
		  id = id[0]+id[1];
		  selectLink = $('#'+id );
		  if ( selectLink.length ) {
		    var top = selectLink.offset().top - CORRECTION;
		    $('body,html').stop().animate({scrollTop: top}, DELAY_SCROLLING);
		  } else {
		    console.log('The link is not found: ' + id);
		  }
		} else {
			alert("Add atleast one breakpoint.");
		}
	}
});