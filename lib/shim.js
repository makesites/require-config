var _ = require("underscore");


var Shim = function(){
	
	var self = this;
	return function(name,  script, options ){
		var shim = this.config.shim[ name ] || {};
		var config = lib[name] || options;
		this.config.shim[ name ] = _.extend(shim, config);
		
		// further processing?
	}
	
}

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
	}
	
}


module.exports = Shim;