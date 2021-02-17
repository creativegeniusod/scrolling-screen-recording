$( document ).ready(function() {
    var links = [], screenTop = [], userStop = false;
    var CORRECTION = 50;
	var DELAY_READING = 2000;
	var DELAY_SCROLLING = 500;
	var timerId = 0;
	var displayMediaOptions = {
	  video: {
	    cursor: "always"
	  },
	  audio: false
	};
	
	chrome.storage.local.get(['screenTop'], function(result) {
		if(result.screenTop != undefined && result.screenTop.length > 0){
			chrome.storage.local.set({screenTop: result.screenTop}, function() {
			  console.log('Value is set to ' + result.screenTop);
			  screenTop = result.screenTop;
			});
		}
	});

	/*$(document).keydown(function(e){
		console.log(e.which);
	    if(e.which == 27){
	        clickDetected();
	    }
	});*/
	// function focus(){
		document.addEventListener("keydown", function(event) {
			console.log(event.which);
		    if(event.keyCode === 27){
		       clickDetected();
		   }
		});
	// }

	document.onclick= function(event) {
	    clickDetected();
	};

	function clickDetected(){
		if($('.brkpoints').length > 0){
	    	if(!userStop){
	    		$('a').attr('style', 'cursor: auto !important');
		    	$('body').attr('style', 'cursor: auto !important');
	    		userStop = true;
		    	chrome.runtime.sendMessage({message: "stop"});
		    	setTimeout(function(){
		    		chrome.runtime.sendMessage({message: "clickDetect"});
		    	},1000);
		    }
	    }
	}

    chrome.runtime.onMessage.addListener(
	  function(request, sender, sendResponse) {
	    if (request.message == "focusContent"){
	    	console.log("focus");
	    	// window.focus();
	    }
	    if (request.message == "runAnimation"){
	    	userStop = false;
	    	$('a').attr('style', 'cursor: none !important');
	    	$('body').attr('style', 'cursor: none !important');
	      links = request.brkpoint;
	      delayLinks(0);
	    } else if (request.message == "screenTop"){
	    	var points = request.brkpoint;
	    	screenTop.push($(document).scrollTop());
        	chrome.storage.local.set({screenTop: screenTop}, function() {
			  console.log('Value is set to ' + screenTop);
			});
			chrome.storage.local.get(['screenTop'], function(result) {
				if(result.screenTop != undefined && result.screenTop.length > 0){
					for (var j = 0; j < points.length; j++) {
						var div = document.createElement("div");
						var id = points[j].split(' ');
						id = id[0]+id[1];
						div.innerText = points[j];
						if(document.getElementById(id) == null){
							var topvalue = result.screenTop[j];
							topvalue +='px';
							div.setAttribute('id', id);
							div.classList.add("brkpoints");
							$('body').append(div);
							div.style.top = topvalue;
						}
					}
				}
			});
	    } else if (request.message == "deleteAll"){
	    	chrome.storage.local.remove(['screenTop']);
	    	chrome.runtime.sendMessage({message: "refresh"});
	    } else if (request.message == "stopDetected"){
	    	userStop = true;
	    	setTimeout(function(){
	    		chrome.runtime.sendMessage({message: "clickDetect"});
	    	},1000);
	    }
	  }
	);

	function delayLinks( i ) {
		chrome.storage.local.get(['screenTop'], function(result) {
			if(result.screenTop != undefined && result.screenTop.length > 0){
				for (var j = 0; j < links.length; j++) {
					var div = document.createElement("div");
					var id = links[j].split(' ');
					id = id[0]+id[1];
					div.innerText = links[j];
					if(document.getElementById(id) == null){
						var topvalue = result.screenTop[j];
						topvalue +='px';
						div.setAttribute('id', id);
						div.classList.add("brkpoints");
						$('body').append(div);
						div.style.top = topvalue;
					}
				}
			}
		});

		$('.brkpoints').css('visibility', 'hidden');
		if(!userStop){
			if( i >= links.length ) i = 0;
			scrollToLink( links[i] );
			if((links.length-1) != i){
				var next = ( i == links.length - 1 ? 0 : i + 1);
				timerId = setTimeout(function() { delayLinks( next ) }, DELAY_READING )
			} else{
				setTimeout(function(){
					$('a').attr('style', 'cursor: auto !important');
		    		$('body').attr('style', 'cursor: auto !important');
		    		if(!userStop){
						chrome.runtime.sendMessage({message: "stop"});
						setTimeout(function(){
							chrome.runtime.sendMessage({message: "compelete"});
						}, 2000);
						userStop = true;
					} else{
						// userStop = false;
					}
				},2000);
			}
		} else{
			// userStop = false;
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
		  } 
		} else {
			alert("Add atleast one breakpoint.");
		}
	}
});