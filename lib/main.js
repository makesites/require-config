
var package = require("require-package"), 
	_ = require("underscore"), 
	Config = require("./config"),
	Shim = require("./shim");

var defaults = {
	client : "config/require.js", 
	cache : true,
	auto: {
		shim : true,
		paths : true
	}
	
};


var Main = function(app, options){
	options || ( options = {} );
	this.app = app;
	// the main config object
	this.options = _.extend( defaults, options);
	this.setup();
	// 
	return this;
};

Main.prototype.setup = function(){
	// main containers
	this.config = {
		baseUrl : "js/", 
		paths : {},
		shim : {},
		deps : []
	};
	// number of script loaded
	this.order = 0;
};

// Public interface
Main.prototype.paths = function( name, script){
	// create array if not already available
	this.config.paths[name] || (this.config.paths[name] = [] );
	this.config.paths[name].push( script );
	// further processing?
};

Main.prototype.shim = new Shim();

Main.prototype.deps = function( script ){
	// accepted formats for string: 
	// - string: "%SOURCE%"
	// - object: { "%NAME%" : "%SOURCE%" }
	// - array: [{ "%NAME%" : "%SOURCE%" }, { "%NAME%" : "%SOURCE%" },...]
	//
	if(typeof script == "string"){
		// generate name from filename
		// remove base URL
		var src = script.replace( new RegExp(this.config.baseUrl, "gi"), "");
		// remove .js extension (check first?)
		src = src.substring(0, src.length-3 );
		// get the filename
		var name = getFilename(src);
		// FIX: remove min suffix
		name = name.replace(/.min$|-min$/gi, "");
		// reset script var...
		script = {};
		script[name] = src;
		
	}
	
	var scripts = (script instanceof Array) ?  script : [script];
	
	// loop through scripts...
	for(var i in scripts){
		// for each script...
		for(var name in scripts[i]){
			//
			var src = scripts[i][name];
			// add only if the script doesn't already exist
			if( this.config.deps.indexOf( name ) == -1 ){
				// paths
				if( name != src ){
					this.paths( name, src );
				}
				// shim
				if( this.options.auto.shim ){
					// basic implementation: just require the last one in the deps list
					var deps = this.config.deps[ this.order-1 ] || "";
					this.shim( name, src, { deps : deps });
				}
				//
				this.config.deps.push( name );
			}
		}
	}
	// increase the order
	this.order++;
	// further processing?
	
};



// Generic set method
Main.prototype.set = function( obj ){
	// 
	this.config = _.extend(this.config, obj);
};


Main.prototype.render = function(){
	// further processing? 
	var config = new Config( this );
	return config;
};

// broadcasting the package module...
Main.prototype.package = function(){
	return package( arguments );
};

/*
Main.prototype.router = function(){
	// 
	var self = this;
	this.app.get( this.config.baseUrl + this.options.client, function(req, res){
		var config = new Config( self );
		res.send( JSON.stringify( config ) );
	});
};
*/

// Helpers

function getFilename( path ){
	return path.replace(/^.*[\\\/]/, '');
}


var init = function(app, options){
	return new Main(app, options);
};


module.exports = init;
