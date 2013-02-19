
# Require Config

A node module to refer to and output (on the server-side) the client side require.js config.

## Scope 

This library is created to accumulate all good efforts around describing an app's dependencies with a require.config object

...

## Install

```
npm install require-config
```

## Methods

### .deps( script )

Adds a new dependency. Accepted formats for _script_: 
* a string: 		"%SOURCE%"
* an object: 	{ "%NAME%" : "%SOURCE%" }
* an array: 	[{ "%NAME%" : "%SOURCE%" }, { "%NAME%" : "%SOURCE%" },...]


### .shim( name, options )

Setup shims for each javascript file. 

The _options_ is not mandatory and if a 'known' shim is found it will always override the options passed. 

In addition, if autoshim is enabled the shim will be enriched by including the previous script in the (individual) deps list. 


### .paths( name, script(s) )

Add a new path for a script (name). Usually automatically added with each dependency - can be called manually to include fallback script locations...


### .set( options )

A wilcard method to create any configuration options, not only in ```deps```, ```shim```,```paths```.


### .render()

Outputs the whole configuration in a JS object. Accepts no options (currently)


## Parameters

### cache

A boolean option to set (or not) a cache busting variable at the end of each script. In the require.js docs this is mentioned as [urlArgs](http://requirejs.org/docs/api.html#config-urlArgs).

Default is ***true***

### autoshim

A boolean option to attempt to automatically create shims for every file. The current implementation is vary basic, basically requiring the previous script in the deps of the each script. A short list of shims for popular js libs is included (in a static form) - more to be included in later releases. 
  
Default is ***true***


## Usage

```
// initiate lib
var r = require("require-config")({ cache : false });

// set base folder
r.set({ baseUrl : "/assets/js" });

// add some dependencies

// - as a plain string:
r.deps("//ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min");

// - or an object: 
r.deps("//ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min");

// finally render the js object
r.render()

```

While rendering a view you can output the config as a JSON: 
```
output +=  '<script type="text/javascript">var require = '+ JSON.stringify( r.render() ) +'</script>';
		
```

## Roadmap

* Read config from package.json (using require-package)

* Parse rendered view and include script tags in the configuration 


