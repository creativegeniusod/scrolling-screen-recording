$( document ).ready(function() {
    console.log( "content!" );
    var links = [];
    var CORRECTION = 50;
	var DELAY_READING = 4000;
	var DELAY_SCROLLING = 1500;
	var timerId = 0;
	// var links = [ '#section-start', '#section-green', '#section-blue', '#section-red', '#section-stop' ];
	// $('body').prepend(`<button id="deleteAll" type="button" class="btn btn-info btn-lg" data-toggle="modal" data-target="#myModal">Delete All Breakpoints</button><div class="container"><div class="modal fade" id="myModal" role="dialog"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal">&times;</button></div><div class="modal-body"><h3>Delete All Breakpoints?</h3><p>Are you sure you want to remove all breakpoints? You won't be able to go back.</p><div class=" yes-no-button"><button id="no">No</button><button id="yes">Yes,Delete</button></div></div></div></div></div></div>`);
    chrome.runtime.onMessage.addListener(
	  function(request, sender, sendResponse) {
	    if (request.message == "runAnimation"){
	      // pageScroll();
	      links = request.brkpoint;
	      console.log(links);
	      delayLinks(0);
	    }

	    /*if (request.message == "showBrkPoint"){
	     	var div = document.createElement("div");
			div.innerText = 'brkInp';
			div.classList.add("breakPointt");
			$('body').prepend(div);
	    }*/
	  }
	);

	function delayLinks( i ) {
		for (var i = 0; i < links.length; i++) {
			var div = document.createElement("div");
			var id = links[i].split(' ');
			id = id[0]+id[1];
			div.innerText = links[i];
			console.log($(div));
			$(div).css("position","absolute");
		    $(div).css("top", Math.max(0, (($(window).height() - $(div).outerHeight()) / 2) + $(window).scrollTop()) + "px");
		    $(div).css("left", Math.max(0, (($(window).width() - $(div).outerWidth()) / 2) + $(window).scrollLeft()) + "px");
		    console.log(div);

			// console.log(($( window ).height())/(links.length));

			if(document.getElementById(id) == null){
				div.setAttribute('id', id);
				$('body').append(div);
			}
		}
		if( i >= links.length ) i = 0;
		scrollToLink( links[i] );

		var next = ( i == links.length - 1 ? 0 : i + 1);
		timerId = setTimeout(function() { delayLinks( next ) }, DELAY_READING ); 
	}

	function scrollToLink( link ) {
		console.log(link);
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

    function pageScroll() {
    	console.log("scroll");
    	$("html, body").animate({
            scrollTop: $(
              'html, body').get(0).scrollHeight 
        }, 3000);
    	return false;
    	/*var supportsPassive = false;

		try {
		  window.addEventListener("test", null, Object.defineProperty({}, 'passive', {
		    get: function () { supportsPassive = true; } 
		  }));
		} catch(e) {}

        var wheelOpt = supportsPassive ? { passive: false } : false;
		var wheelEvent = 'onwheel' in document.createElement('div') ? 'wheel' : 'mousewheel';

        // setTimeout(function(){
        	console.log("before");
        	window.addEventListener('DOMMouseScroll', preventDefault, false); // older FF
			window.addEventListener(wheelEvent, preventDefault, wheelOpt); // modern desktop
			window.addEventListener('touchmove', preventDefault, wheelOpt); // mobile
			window.addEventListener('keydown', preventDefaultForScrollKeys, false);
			console.log("after");*/
        // },500);
	}

	function preventDefaultForScrollKeys(e) {
	  if (keys[e.keyCode]) {
	    preventDefault(e);
	    return false;
	  }
	}

	function preventDefault(e) {
	  e.preventDefault();
	}
});