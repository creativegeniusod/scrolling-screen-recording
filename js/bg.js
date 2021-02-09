$( document ).ready(function() {
    console.log( "bg!" );
    var download_url, config = {};
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
    		var brkpoint = request.brkpoint;
    		/*Chrome.js*/
			var app = {};
			app.version = function () {return chrome.runtime.getManifest().version};
			app.homepage = function () {return chrome.runtime.getManifest().homepage_url};
			app.tab = {"open": function (url) {chrome.tabs.create({"url": url, "active": true})}};

			app.notifications = {
			  "create": function (title, message) {
			    var id = "screen-recorder-notification";
			    var options = {
			      "title": title,
			      "type": "basic",
			      "message": message,
			      "iconUrl": chrome.runtime.getURL("data/icons/64.png")
			    };
			    /*  */
			    chrome.notifications.create(id, options, function (e) {});
			  }
			};

			app.storage = (function () {
			  var objs = {};
			  window.setTimeout(function () {
			    chrome.storage.local.get(null, function (o) {
			      objs = o;
			      // var script = document.createElement("script");
			      // script.src = "js/common.js";
			      // document.body.appendChild(script);
			    });
			  }, 300);
			  /*  */
			  return {
			    "read": function (id) {return objs[id]},
			    "write": function (id, data) {
			      var tmp = {};
			      tmp[id] = data;
			      objs[id] = data;
			      chrome.storage.local.set(tmp, function () {});
			    }
			  }
			})();
			/*Chrome.js*/

			/*config.js*/
			// var config = {};

			config.welcome = {
			  get version () {return app.storage.read("version")},
			  set version (val) {app.storage.write("version", val)}
			};

			config.recorder = {
			  "id": null,
			  "stream": null,
			  "engine": null,
			  "switch": true,
			  "interval": null,
			  "stop": function () {
			    // app.icon(null);
			    config.recorder.engine.stop();
			    config.recorder.switch = true;
			    if (config.recorder.interval) window.clearInterval(config.recorder.interval);
			  },
			  "start": function () {
			    if (chrome.desktopCapture) {
			      chrome.desktopCapture.chooseDesktopMedia(["screen", "window", "tab"], null, function (streamId, options) {
			        if (navigator.mediaDevices) {
			          var audiotrack = "canRequestAudioTrack" in options ? options.canRequestAudioTrack : false;
			          navigator.mediaDevices.getUserMedia({
			           "audio": audiotrack,
			           "video": {
			             "minFrameRate": 15,
			             "mandatory": {
			               "chromeMediaSource": 'desktop',
			               "chromeMediaSourceId": streamId,
			               "maxWidth": window.screen.width,
			               "maxHeight": window.screen.height
			             }
			           }
			         }).then(function (e) {
			         	console.log("brkpoint: ", brkpoint);
			         	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
			         		console.log("tabs: ", tabs);
						    chrome.tabs.sendMessage(tabs[0].id, {message: "runAnimation", brkpoint:brkpoint});
						});
			            config.recorder.stream = e;
			            config.recorder.engine = new MediaRecorder(config.recorder.stream, {"mimeType": "video/webm;codecs=VP8"});
			            config.recorder.engine.addEventListener("dataavailable", function (e) {
			            download_url = URL.createObjectURL(e.data);
			              var tracks = config.recorder.stream.getTracks();
			              for (var i = 0; i < tracks.length; i++) tracks[i].stop();
			            });

			            config.recorder.engine.start();
			            if (config.recorder.interval) window.clearInterval(config.recorder.interval);
			            config.recorder.interval = window.setInterval(function () {
			              // app.icon(config.recorder.switch ? "ON" : "OFF");
			              config.recorder.switch = !config.recorder.switch;
			            }, 500);
			          }).catch(function (e) {});
			        } else app.notifications.create("Screen Recorder", "Error! mediaDevices API is not available!");
			      });
			    } else app.notifications.create("Screen Recorder", "Error! desktopCapture API is not available!");
			  }
			};
		    /*config.js*/

		    /*common.js*/
    		var recording = config.recorder.engine && config.recorder.engine.state !== "inactive";
  			recording ? config.recorder.stop() : config.recorder.start();
    		/*common.js*/
	    } else if (request.message == "stop"){
	    	var recording = config.recorder.engine && config.recorder.engine.state !== "inactive";
  			recording ? config.recorder.stop() : config.recorder.start();
	  	} else if (request.message == "download"){
	  		var date = (new Date()).toString().slice(0, 24);
			var filename = "Video-" + date.replace(/ /g, '-').replace(/:/g, '-') + ".webm";
			console.log(download_url);
	  		chrome.downloads.download({"url": download_url, "filename": filename}, function (id) {console.log(id);config.recorder.id = id});
	  	}
	  }
	);
});