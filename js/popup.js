$( document ).ready(function() {
    var brkpoint = [], exist = false;
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
			$(this).remove();
			chrome.storage.local.set({breakPoint: brkpoint}, function() {
			  console.log('Value is set to ' + brkpoint);
			});
	    });
	}

    $('.clear').click(function(){
    	$('.breakInputs').val('');
    });

    $('#deleteAll').click(function(){
    	chrome.storage.local.get(['breakPoint'], function(result) {
			if(result.breakPoint != undefined && result.breakPoint.length > 0){
				for (var i = 0; i < result.breakPoint.length; i++) {
	    			var value = result.breakPoint[i];
		    		brkpoint = brkpoint.filter(item => item !== value)
		    		$('.savedBrkpoints').remove();
		    		$('.cross-icon').remove();
					chrome.storage.local.set({breakPoint: brkpoint}, function() {
					  console.log('Value is set to ' + brkpoint);
					});
		    	}
			}
		});
    });

    $('#breakPoint').click(function(){
    	var brkInp = $('.breakInputs').val();
    	for (var i = 0; i < brkpoint.length; i++) {
    		if(brkInp == brkpoint[i]){
    			exist = true;
    		} else {
    			exist = false;
    		}
    	}
    	if(!exist){
	    	if(brkInp == ""){
	    		alert("Please enter any name.");
	    	} else{
		    	brkpoint.push(brkInp);
		    	$('.breakInputs').val('');
			    document.getElementById("breakPoint").disabled = true;
			    var span = document.createElement("span");
    			var icon = document.createElement("i");
    			var brk = document.createElement("br");
    			span.innerText = brkInp;
    			span.classList.add("savedBrkpoints");
    			icon.innerHTML = '&#10006';
    			icon.classList.add("cross-icon");
    			$('.points').append(span);
    			$('.points').append(icon);
    			$('.points').append(brk);
    			deleteItem();
			    chrome.storage.local.set({breakPoint: brkpoint}, function() {
				  console.log('Value is set to ' + brkpoint);
				});
	    	}
	    } else{
	    	alert("This breakPoint already exist.");
	    }
    });

    $(".breakInputs").keyup(function(){
	  document.getElementById("breakPoint").disabled = false;
	});

    $('#render').click(function(){
    	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		    chrome.tabs.sendMessage(tabs[0].id, {message: "runAnimation"});
		});
    });
});