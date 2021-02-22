$( document ).ready(function() {
    var brkpoint = [], exist = false;

    chrome.runtime.onMessage.addListener(
      function(request, sender, sendResponse) {
        if (request.message == "compelete"){
            $('#myModal').show();
            $('#myModal').css('opacity', 1);
            $('.render-section').show();
            $('.delete-all-section').hide();
            $('.stopped-scroll-section').hide();
        } else if (request.message == "clickDetect"){
            $('#myModal').show();
            $('#myModal').css('opacity', 1);
            $('.render-section').hide();
            $('.delete-all-section').hide();
            $('.stopped-scroll-section').show();
        } else if (request.message == "checkPopup"){
            sendResponse('inPopup');
        }
    });

    $('#yes-download').click(function(){
        $('#myModal').hide();
        chrome.runtime.sendMessage({message: "download"});
    });

	chrome.storage.local.get(['breakPoint'], function(result) {
		if(result.breakPoint != undefined && result.breakPoint.length > 0){
			for (var i = 0; i < result.breakPoint.length; i++) {
    			brkpoint.push(result.breakPoint[i]);
    			var span = document.createElement("span");
    			var icon = document.createElement("i");
    			var brk = document.createElement("br");
    			span.innerText = result.breakPoint[i];
    			span.classList.add("savedBrkpoints");
    			icon.innerHTML = '&#10006';
    			icon.classList.add("cross-icon");
                brk.classList.add("break");
    			$('.points').append(span);
    			$('.points').append(icon);
    			$('.points').append(brk);
    			showBrkpoints();
    			deleteItem();
	    	}
		}
	});

	function showBrkpoints(){
		$('.savedBrkpoints').click(function(){
			chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
			    chrome.tabs.sendMessage(tabs[0].id, {message: "showBrkPoint"});
			});
		});
	}

	function deleteItem(){
		$('.cross-icon').click(function(){
			var value = $(this).prev()[0].innerText;
			brkpoint = brkpoint.filter(item => item !== value)
			$(this).prev().remove();
            $(this).next().remove();
			$(this).remove();
			chrome.storage.local.set({breakPoint: brkpoint}, function() {
			  console.log('Value is set to ' + brkpoint);
			});

            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                chrome.tabs.sendMessage(tabs[0].id, {message: "delete"});
            });
	    });
	}

    $('.close').click(function(){
    	$('#myModal').hide();
    });

    $('.no').click(function(){
    	$('#myModal').hide();4
    });

    $('#yes').click(function(){
        $('#myModal').hide();
    	chrome.storage.local.get(['breakPoint'], function(result) {
			if(result.breakPoint != undefined && result.breakPoint.length > 0){
				for (var i = 0; i < result.breakPoint.length; i++) {
	    			var value = result.breakPoint[i];
		    		brkpoint = brkpoint.filter(item => item !== value)
		    		$('.savedBrkpoints').remove();
		    		$('.cross-icon').remove();
                    $('.break').remove();
					chrome.storage.local.set({breakPoint: brkpoint}, function() {
					  console.log('Value is set to ' + brkpoint);
					});
		    	}
                chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                    chrome.tabs.sendMessage(tabs[0].id, {message: "deleteAll"});
                });
			} else{
                alert("No breakPoint to delete.");
            }
		});
    });

    $('#deleteAll').click(function(){
    	$('#myModal').show();
    	$('#myModal').css('opacity', 1);
    	$('.delete-all-section').show();
    	$('.render-section').hide();
    	$('.stopped-scroll-section').hide();
        /*chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {message: "deleteAll"});
        });*/
    });

    $('#breakPoint').click(function(){
    	var brkInp = 'BreakPoint 1';
    	for (var i = 0; i < brkpoint.length; i++) {
    		var j = i+2;
    		brkInp = 'BreakPoint '+j;
    		if(brkInp == brkpoint[i]){
    			exist = true;
    			j +=1; 
    			brkInp = 'BreakPoint '+j;
    		} else {
    			exist = false;
    		}
    	}
    	brkpoint.push(brkInp);
	    var span = document.createElement("span");
		var icon = document.createElement("i");
		var brk = document.createElement("br");
		span.innerText = brkInp;
		span.classList.add("savedBrkpoints");
		icon.innerHTML = '&#10006';
		icon.classList.add("cross-icon");
        brk.classList.add("break");
		$('.points').append(span);
		$('.points').append(icon);
		$('.points').append(brk);
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {message: "screenTop", brkpoint:brkpoint});
        });
		deleteItem();
	    chrome.storage.local.set({breakPoint: brkpoint}, function() {
		  console.log('Value is set to ' + brkpoint);
		});
    });

    $('#render').click(function(){
        chrome.runtime.sendMessage({message: "changeIcon", brkpoint:brkpoint});
        /*setTimeout(function(){

        },500);*/
        chrome.runtime.sendMessage({message: "focus"});
        /*chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {message: "focus", brkpoint:brkpoint});
        });*/
        window.close();
    });
});