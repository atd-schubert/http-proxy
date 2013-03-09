# Modular HTTP-Proxy for node.js

## About

I build this node module mainly for developing apps and websites whitch use an foreign API. You can analyze the http traffic, save it to disk or change it on the fly.
You can change the behavior of the proxy-server quite easy by using different middlewares. A collection of middlewares I use often, I have added to this module.

## How to use this module

### Simple setup

This module only needs a minimum of setup. Here is an example how to make it work, without any setup of middlewares.

	var rp = require("./proxy.js"); // require module

	//# constants and variables
	var config = {
		port: 8080, // port to listen on
		host: { // host to proxy to
			hostname: "example.com",
			port: 80
		}
	}
		
	rp.config = config;
		
	rp.start();

### Same setup as the simple setup, but with manually defined middlewares
	
	var rp = require("./proxy.js");

	//# constants and variables
	var config = {
		port: 8080,
		host: {
			hostname: "example.com",
			port: 80
		}
	}
		
	rp.config = config;
	
	
	rp.middleware.requestOptions.clear(); // remove the default middlewares for making the request options
	rp.middleware.requestOptions.use(rp.middleware.requestOptions.collection.deleteHost); // this middleware you have to use because you address to the proxy and send as host the ip or hostname of the proxy. But you want to get the data of the other server / host.
	
	rp.middleware.request.clear(); // remove the default middlewares for the data in the request
	rp.middleware.request.use(rp.middleware.request.collection.pipeData); // pipe the post-request
	
	rp.middleware.response.clear(); // remove the default middlewares for response
	rp.middleware.response.use(rp.middleware.response.collection.pipeHeader); // this middleware take the header from the response of the request and pipe it to the response.
	rp.middleware.response.use(rp.middleware.response.collection.pipeData); // this middleware pipes the data from the response to the other response.


## List of middlewares
### RequestOptions-Collection
#### deleteHost
##### Path
{module}.middleware.requestOptions.collection.deleteHost
##### Description
This module delete the host in the request-header and must be used!

### Request-Collection
#### savePost
##### Path
{module}.middleware.request.collection.savePost(folder)
##### Description
This module saves the post-request to a file in a folder specified with the folder argument.

#### saveURL
##### Path
{module}.middleware.request.collection.saveURL(folder)
##### Description
This module saves the requested url to a file in a folder specified with the folder argument.

#### saveHeader
##### Path
{module}.middleware.request.collection.saveHeader(folder)
##### Description
This module saves the header of the request to a file in a folder specified with the folder argument.

#### displayRequest
##### Path
{module}.middleware.request.collection.displayRequest()
##### Description
This module displays as a log when starting a request.


### Response-Collection
#### pipeHeader
##### Path
{module}.middleware.response.collection.pipeHeader
##### Description
This module pipes the header.

#### saveData
##### Path
{module}.middleware.response.collection.saveData(folder)
##### Description
This module saves the response data to a file in a folder specified with the folder argument.

#### saveHeader
##### Path
{module}.middleware.response.collection.saveHeader(folder)
##### Description
This module saves the response header data to a file in a folder specified with the folder argument.

#### enableXSS
##### Path
{module}.middleware.response.collection.enableXSS
##### Description
This module changes the response header and adds "Access-Control-Allow-Origin: *" to the response header.

#### changeLocationHeader
##### Path
{module}.middleware.response.collection.changeLocationHeader(oldHostname, newHostname)
##### Description
This module changes the response header if there is a location parameter in the header. You can use it to deny a redirect.