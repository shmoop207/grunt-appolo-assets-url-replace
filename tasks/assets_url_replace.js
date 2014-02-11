

'use strict';
var fs = require('fs'),
	path = require('path'),
	url = require('url');

module.exports = function(grunt) {

//var imgRegex = /url\s?\(['"]?(.*?)(?=['"]?\))/gi;

	var cssRegex = /url\s?\(['"]?(.*)(?=['"]?\))/gi;
	var htmlRegex = /src\s?\=['"]?(.*)['"]/gi;


  grunt.registerMultiTask('assetsUrlReplace', 'Grunt task to replace css urls with absolute path', function() {
   
  	

    var options = this.options({
      staticUrl: 'public',
      ext: ['.png', '.jpeg', '.jpg', '.gif']
    });

    this.files.forEach(function(f) {

	    f.src.forEach(function(filepath){
	   		 
	   		 var ext = path.extname(filepath);

   		 	if(ext == '.css') {

		   		 var css = fs.readFileSync(filepath).toString(),
		   		 match;

		   		while (match = cssRegex.exec(css)) {

		                var imagePath = match[1];

		                if (imagePath.indexOf("http://") == -1 && imagePath.indexOf(";base64") == -1 && options.ext.indexOf(path.extname(imagePath)) > -1 ) {
		                    css = css.replace(match[0], "url("+options.staticUrl + path.normalize('/'+ imagePath)+")");
		                }
		            }

		         grunt.file.write(filepath, css);
		         grunt.log.writeln('File "' + filepath + '" modified.');

   		 	} else if(ext == '.html' || ext == '.htm') {

   		 		var html = fs.readFileSync(filepath).toString(),
		   		 match;

		   		 while(match = htmlRegex.exec(html)) {
		   		 	var imagePath = match[1];

		   		 	console.log(match[0]);

		                if (imagePath.indexOf("http://") == -1 && imagePath.indexOf(";base64") == -1 && options.ext.indexOf(path.extname(imagePath)) > -1 ) {
		                    html = html.replace(match[0], 'src="'+options.staticUrl + path.normalize('/'+ imagePath)+'"');
		                }
		   		 }

		   		 grunt.file.write(filepath, html);
		         grunt.log.writeln('File "' + filepath + '" modified.');
   		 	}

	    });
	});
  });
};
