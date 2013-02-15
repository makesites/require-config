
var package = require("require-package"),
	_ = require("underscore");


Main = function(){
	// the main config object
	this.config = {};
}

Main.prototype.set = function( options ){
	// 
	this.config = _.extend(this.config, options);
}

Main.prototype.render = function(){
	// further processing? 
	return this.config;
}

// broadcasting the 
Main.prototype.package = function(){
	return package( arguments );
};


var init = function(){
	return new Main( arguments );
};

module.exports = init;
