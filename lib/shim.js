var _ = require("underscore");


var Shim = function(){
	
	var self = this;
	return function( name,  options ){
		// fallbacks
		options || (options= {});
		//
		if( this.options.auto.shim ){
			// auto-shim basic implementation: just require the last one in the deps list
			if( !options.deps ) options.deps = [ this.config.deps[ this.order-1 ] ] || [];
		}
		// 
		var shim = this.config.shim[ name ] || {};
		// lookup a 'known' shim - always has priority over any options passed
		var config = lib[name] || options;
		
		// output
		this.config.shim[ name ] = _.extend(shim, config);
		
	}
	
}

// NOTE: this is just a rasterized list of shims, feel free to add your own (popular) lib

var lib = {
	"backbone": {
		"deps": [
			"underscore",
			"jquery"
		],
		"exports": "Backbone"
	},
	"underscore": {
		"exports": "_"
	},
	"handlebars": {
		"exports": "Handlebars"
	}
	
}


module.exports = Shim;