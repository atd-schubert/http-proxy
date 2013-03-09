(function(ex){
	'use strict';
	// Error handling
	if(!ex) throw new Error("Unable to export module middleware collection for proxy");
	
	//# requires
	var fs = require("fs");

	ex.request = {};
	ex.response = {};
	ex.opts = {};
	
	ex.request.pipeData =
	ex.response.pipeData = function(original, changed, next){
		original.pipe(changed);
		next();
	};
	
	// REQUESTS
	ex.request.savePost = function(folder){
		var count = 0;
		return function(original, changed, next){
			var requestData = fs.createWriteStream(folder+"/"+count+"-requestPost.txt");
			original.pipe(requestData);
			count++;
			next();
		};
	};
	ex.request.saveURL = function(folder){
		var count = 0;
		return function(original, changed, next){
			fs.writeFile(folder+"/"+count+"-requestURL.txt", original.url);
			count++;
			next();
		};
	};
	ex.request.saveHeader = function(folder){
		var count = 0;
		return function(original, changed, next){
			var hash,
				reqHead = "";
			for(hash in original.headers) {
				reqHead += hash + ": "+original.headers[hash]+"\n";
			}
			fs.writeFile(folder+"/"+count+"-requestHeader.txt", reqHead);
			count++;
			next();
		};
	};
	ex.request.displayRequest = function(){
		var count = 0;
		return function(original, changed, next){
			console.log("Request "+count+" to "+original.url+" started...");
			count++;
			next();
		};
	};
	
	
	
	// RESPONSES
	ex.response.pipeHeader = function(original, changed, next) {
		changed.writeHead(original.statusCode, original.headers);
		next();
	};
	ex.response.saveData = function(folder){
		var count = 0;
		return function(original, changed, next){
			var responseData = fs.createWriteStream(folder+"/"+count+"-responseData.txt");
			original.pipe(responseData);
			count++;
			next();
		};
	};
	ex.response.saveHeader = function(folder) {
		var count = 0;
		return function(original, changed, next) {
			var head = "",
				hash;
			for (hash in original.headers) {
				head += hash+": "+original.headers[hash]+"\n";
			}
			fs.writeFile(folder+"/"+count+"-responseHeader.txt", head);
			next();
		};	
	};
	ex.response.enableXSS = function(original, changed, next){
		original.headers["Access-Control-Allow-Origin"] = "*";
		changed.writeHead(original.statusCode, original.headers);
		next();
	};
	ex.response.changeLocationHeader = function(oldHostname, newHostname){
		return function(original, changed, next){
			if(original.statusCode!==400 && original.headers.location) original.headers.location = original.headers.location.split("http://"+oldHostname).join("http://"+newHostname);;
			changed.writeHead(original.statusCode, original.headers);
			next();
		};
	};
	
	
	// OPTIONS
	ex.opts.deleteHost = function(res, opts, next){
		delete opts.headers.host;
		next();
	};
	
})(exports);