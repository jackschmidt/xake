var Command = require('ronin').Command;
var fs = require('fs');
var files = require('../lib/files');

var IceCommand = module.exports = Command.extend({
    use: ['winston'],
    
    desc: 'Update a baked cake to be standalone, ready for xake serve',

    options: {
	base_url: {
            type: 'string',
	},
    },

    run: function (base_url) {
	var global = this.global;
	var winston = global.winston;
	if(!base_url) base_url = "http://ximera.osu.edu/";
	var head_append = (
	'<link href="' + base_url + 'public/stylesheets/base.css" rel="stylesheet" media="screen">\n' +
	'<link rel="stylesheet" href="//www.osu.edu/assets/fonts/webfonts.css">\n' +
	'<script type="text/javascript" src="' + base_url + 'node_modules/mathjax/MathJax.js?config=TeX-AMS_HTML&amp;amp;delayStartupUntil=configured"></script>\n' +
	'<script type="text/javascript" src="https://www.desmos.com/api/v0.7/calculator.js?apiKey=dcb31709b452b1cf9dc26972add0fda6"></script>\n' +
	'<script type="text/javascript" src="' + base_url + 'public/javascripts/main.min.js"></script>\n' +
	'<link rel="apple-touch-icon" sizes="114x114" href="' + base_url + 'public/images/icons/favicon-114x114.png">\n' +
	'<link rel="apple-touch-icon" sizes="72x72"   href="' + base_url + 'public/images/icons/favicon-72x72.png">\n' +
	'<link rel="apple-touch-icon" sizes="57x57"   href="' + base_url + 'public/images/icons/favicon-57x57.png">\n' +
	'<link rel="shortcut icon" type="image/x-icon" href="' + base_url + 'favicon.ico">\n' +
	'' )
	var body_prepend = (
	'<div class="row">\n' +
	'<div id="theActivity" class="col-md-offset-2 col-md-8 activity">\n' +
	'<div class="activity-content">\n' +
	''
	)
	var body_append = (
	'</div><!-- row -->\n' +
	'</div><!-- activity -->\n' +
	'</div><!-- activity-content -->\n' +
	'' );

	files.texFilesInRepository( global.repository, function( err, filenames ) {
		filenames.forEach( function(filename) {
			var htmlFilename = filename.replace(/\.tex$/,".html");
			var iceFilename = filename.replace(/\.tex$/,"-ice.html");
			var html = fs.readFileSync( htmlFilename, "UTF-8" );
			html = html.replace(new RegExp("</head>"),head_append + "</head>" );
			html = html.replace(new RegExp("<body>"),"<body" + body_prepend );
			html = html.replace(new RegExp("</body>"),body_append + "</body>" );
			html = html.replace(new RegExp("<script[^>]*/>","g"),"" );
			fs.writeFileSync( iceFilename, html );
			winston.info( htmlFilename + " iced to " + iceFilename );
		} );
		winston.info( "All html files are iced and ready to xake serve" );
	} );
    }
});
