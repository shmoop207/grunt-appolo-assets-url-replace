

'use strict';
var fs = require('fs'),
	path = require('path'),
	url = require('url');

module.exports = function(grunt) {

	var cssRegex = /url\s*\(\s*(['"]?)([^"'\)]*)\1\s*\)/gi;
	var htmlRegexSrc = /src\s?\=['"]?(.*)['"]/gi;
	var htmlRegexHref = /href\s?\=['"]?(.*)['"]/gi;

	String.prototype.startsWith = function(pattern) {
    	return this.lastIndexOf(pattern, 0) === 0;
  	}

  grunt.registerMultiTask('assetsurlreplace', 'Grunt task to replace assets urls with absolute path', function() {
   
  	

    var options = this.options({
      staticUrl: 'public',
      ext: ['.png', '.jpeg', '.jpg', '.gif', '.js', '.css']
    });

    this.files.forEach(function(f) {

	    f.src.forEach(function(filepath){
	   		 
	   		 var ext = path.extname(filepath);

   		 	if(ext == '.css') {

   		 		 var modified = false;
		   		 var css = fs.readFileSync(filepath).toString(),
		   		 match;

		   		while (match = cssRegex.exec(css)) {

		                var imagePath = match[2];

		                if (!imagePath.startsWith("http://") &&
		                	!imagePath.startsWith("https://") &&
		                	!imagePath.startsWith("//") &&
		                	imagePath.indexOf(";base64") == -1 &&
		                	options.ext.indexOf(path.extname(imagePath)) > -1 ) {
		                    css = css.replace(match[0], "url("+options.staticUrl + path.normalize('/'+ imagePath)+")");
		                    modified = true;
		                }
		            }

		         if(modified) {
		         	grunt.file.write(filepath, css);
		         	grunt.log.writeln('File "' + filepath + '" modified.');
		     	 }

   		 	} else if(ext == '.html' || ext == '.htm') {

   		 		var modified = false;
   		 		var html = fs.readFileSync(filepath).toString(),
		   		 match;

		   		 while(match = htmlRegexSrc.exec(html)) {
		   		 	var imagePath = match[1];

		                if (!imagePath.startsWith("http://") &&
		                	!imagePath.startsWith("https://") &&
		                	!imagePath.startsWith("//") &&
		                	imagePath.indexOf(";base64") == -1 &&
		                	options.ext.indexOf(path.extname(imagePath)) > -1 ) {
		                    html = html.replace(match[0], 'src="'+ options.staticUrl + path.normalize('/'+ imagePath)+'"');
		                    modified = true;
		                }
		   		 }

		   		 while(match = htmlRegexHref.exec(html)) {
		   		 	var imagePath = match[1];

		                if (!imagePath.startsWith("http://") &&
		                	!imagePath.startsWith("https://") &&
		                	!imagePath.startsWith("//") &&
		                	options.ext.indexOf(path.extname(imagePath)) > -1 ) {
		                    html = html.replace(match[0], 'href="'+ options.staticUrl + path.normalize('/'+ imagePath)+'"');
		                    modified = true;
		                }
		   		 }

		   		 if(modified) {
		   		 	grunt.file.write(filepath, html);
		         	grunt.log.writeln('File "' + filepath + '" modified.');
		   		 }
   		 	}

	    });
	});
  });
};
