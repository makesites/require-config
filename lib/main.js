
var package = require("require-package"),
	_ = require("underscore"),
	Config = require("./config"),
	Shim = require("./shim");


// Default parameters
var defaults = {
	cache : true,
	autoshim : true
};


var Main = function(options){
	options = options || {};
	// get the main config object
	var config = ( options.config ) ? options.config : {};
	// remove config from options
	delete options.config;
	// extend options
	this.options = _.extend( defaults, options);
	this.setup( config );
	//
	return this;
};

Main.prototype.setup = function( config ){
	// return the existing config if available
	config = config || this.config || {};
	// main containers
	var defaults = {
		baseUrl : "js/",
		paths : {},
		shim : {},
		deps : []
	};
	this.config = _.extend( defaults, config);
	// number of scripts loaded
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
	// accepted formats for script:
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
				if( this.options.autoshim ){
					this.shim( name );
				}
				// at the end always add the dependency
				this.config.deps.push( name );
				// increase the order
				this.order++;

			}
		}
	}
	// further processing?

};



// Generic set method
Main.prototype.set = function( obj ){
	//
	//this.config.deps.push( name );
	this.config = extend(this.config, obj);
};


Main.prototype.render = function( options ){
	// fallbacks
	options = options || {};
	// further processing?
	var config = new Config( this, options );
	return config;
};

// like 'render' but optimizing config for r.js
Main.prototype.build = function( options ){
	// fallbacks
	options = options || {};
	// further processing?
	var config = new Config( this, options );
	// adjustments
	// - remove callback
	delete config.callback;
	// - strip down paths to the first file
	for(var i in config.paths){
		if( config.paths[i] instanceof Array ) config.paths[i] = config.paths[i][0];
	}
	// - add name & output file (make option?)
	config.name = config.name || "main";
	config.out = config.out || "app.js";

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


function extend(target, source) {
	// if source is string
	for (var prop in source){
		if (prop in target){
			// extend only if it's an object
			if(typeof source[prop] == "string" ){
				// optionally entend the target?
				target[prop] = source[prop];
			} else {
				extend(target[prop], source[prop]);
			}
		} else {
			target[prop] = source[prop];
		}
	}
	return target;
}


var init = function(options){
	return new Main(options);
};


module.exports = init;
