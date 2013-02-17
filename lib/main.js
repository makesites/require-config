
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
	this.order++;
	// further processing?
	if(typeof script == "object"){
		// loop through them...
	} else {
		// remove base URL
		script = script.replace( new RegExp(this.config.baseUrl, "gi"), "");
		// remove .js extension
		script = script.substring(0, script.length-3 );
		// get the filename
		var name = getFilename(script);
		// FIX: remove min suffix
		name = name.replace(/.min$|-min$/gi, "");
		// add only if the script doesn't already exist
		if( this.config.deps.indexOf( name ) == -1 ){
			// paths
			if( name != script){
				this.paths(name, script);
			}
			// shim
			if( this.options.auto.shim ){
				this.shim(name, script, { deps : this.config.deps });
			}
			this.config.deps.push( name );
		}
		
	}
	
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
