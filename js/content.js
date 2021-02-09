$( document ).ready(function() {
    console.log( "content!" );
    var links = [], screenTop = [];
    var CORRECTION = 50;
	var DELAY_READING = 2000;
	var DELAY_SCROLLING = 1500;
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
			/*for (var j = 0; j < screenTop.length; j++) {
			}*/
		}
	});

	document.onclick= function(event) {
	    if (event===undefined) event= window.event;
	    var target= 'target' in event? event.target : event.srcElement;
	    if($('.brkpoints').length > 0){
	    	console.log("click detected");
	    	chrome.runtime.sendMessage({message: "clickDetect"});
	    }
	    // alert('clicked on '+target.tagName);
	};

    chrome.runtime.onMessage.addListener(
	  function(request, sender, sendResponse) {
	    if (request.message == "runAnimation"){
	      links = request.brkpoint;
	      delayLinks(0);
	    } else if (request.message == "screenTop"){
	    	screenTop.push($(document).scrollTop());
        	console.log("scrollTop: ", screenTop);
        	chrome.storage.local.set({screenTop: screenTop}, function() {
			  console.log('Value is set to ' + screenTop);
			});
	    } else if (request.message == "deleteAll"){
	    	chrome.storage.local.remove(['screenTop']);
	    } else if (request.message == "delete"){
	    	
	    }
	  }
	);

	function delayLinks( i ) {
		chrome.storage.local.get(['screenTop'], function(result) {
			if(result.screenTop != undefined && result.screenTop.length > 0){
				for (var j = 0; j < links.length; j++) {
					console.log(result.screenTop);
					var div = document.createElement("div");
					var id = links[j].split(' ');
					id = id[0]+id[1];
					div.innerText = links[j];
					if(document.getElementById(id) == null){
						var topvalue = result.screenTop[j];
						topvalue +='px'; 
						console.log("hjsbhdbsj");
						div.setAttribute('id', id);
						div.classList.add("brkpoints");
						$('body').append(div);
						div.style.top = topvalue;
					}
				}
			}
		});
		
		if( i >= links.length ) i = 0;
		scrollToLink( links[i] );
		if((links.length-1) != i){
			var next = ( i == links.length - 1 ? 0 : i + 1);
			timerId = setTimeout(function() { delayLinks( next ) }, DELAY_READING )
		} else{
			setTimeout(function(){
				console.log("compelete");
				chrome.runtime.sendMessage({message: "stop"});
				chrome.runtime.sendMessage({message: "compelete"});
			},2000);
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