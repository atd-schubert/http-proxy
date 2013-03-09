(function(ex){
	'use strict';
	// Error handling
	if(!ex) throw new Error("Unable to export module proxy");

	//# requires
	var fs = require("fs"),
		http = require("http"),
		collection = require("./middlewareCollection");

	//# constants and variables
	var mws = {
		req: [],
		opts: [],
		res: []
	},
	conf = {};
	
	//# classes
	

	//# statics
	
	
	//# methods
	

	//# functions and objects
	var callMw = function(orginal, changed, mws){
		var i=0,
			next = function(){
				if(i<mws.length){
					mws[i++](orginal, changed, next);
				}
			};
		next();
	},
	mkRealRequest = function(opts, res){	
		return http.request(opts, function(realRes){
				callMw(realRes, res, mws.res);
			});
	},
	rp = function(req, res) {
		var opts = {
				host:conf.host.hostname,
				port:conf.host.port,
				path:req.url,
				headers:req.headers
			};
		// middleware.request
		
		callMw(req, opts, mws.opts); // Build opts
		
		callMw(req, mkRealRequest(opts, res), mws.req);

	}
	
	//# code for this scope

	//# export or making somethng global
	ex.__defineGetter__('config', function(){
		return conf;
	});
	ex.__defineSetter__('config', function(val){
		conf = val;
	});
	ex.middleware = {
		request: {
			use: function(mw){
				mws.req.push(mw);
			},
			clear: function(){
				mws.req = [];
			},
			collection: collection.request
		},
		requestOptions: {
			use: function(mw){
				mws.opts.push(mw);
			},
			clear: function(){
				mws.opts = [];
			},
			collection: collection.opts
		},
		response: {
			use: function(mw){
				mws.res.push(mw);
			},
			clear: function(){
				mws.res = [];
			},
			collection: collection.response
		},
	}
	ex.start = function() {
		if(!conf || !conf.port || !conf.host || !conf.host.hostname || !conf.host.port || !conf.outputDirectory) throw new Error("This module is not well configurated! Please add module.config!");
		console.log("");
		console.log("Starting report-proxy to "+conf.host.hostname+":"+conf.host.port);
		http.createServer(rp).listen(conf.port);
		console.log("Server is listening on port "+conf.port);
	}
	
	// default config
	
	ex.middleware.request.use(ex.middleware.request.collection.pipeData);
	
	ex.middleware.response.use(ex.middleware.response.collection.pipeHeader);
	ex.middleware.response.use(ex.middleware.response.collection.pipeData);
	
	ex.middleware.requestOptions.use(ex.middleware.requestOptions.collection.deleteHost);
	
})(exports);