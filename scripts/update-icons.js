#!/usr/bin/env node

// Load modules
var fs = require("fs");
var path = require("path");
var https = require("https");
var http = require("http");
var css = require("css");
var dataurl = require("dataurl");
var pqueue = require("./pqueue.js");

function print (data) {
	data = data || '';
	process.stdout.write(data);
}
function println (data) {
	data = data || '';
	process.stdout.write(data + '\n');
}

var pathToPackageRoot = '../';
var assetRootPath = '/packages/zodiase_mdl/';
var mergedCssFilePath = 'material-icons-nofont.css';
var finalCssFilePath = 'material-icons.css';
var packageFilePath = 'package.js';

var userAgents = [
	// OS X El Capitan - Chrome
	'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.80 Safari/537.36',
	// Windows 10 - Edge
	'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.10240',
	// OS X El Capitan - Safari
	'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_1) AppleWebKit/601.2.7 (KHTML, like Gecko) Version/9.0.1 Safari/601.2.7'
];

var httper = {
	'http': http,
	'https': https
};

var mergedAST = {
	type: 'stylesheet',
	stylesheet: {
		rules: []
	}
};

var assets = [];

var MatchDeclaration = function (rule, declaration) {
	var result = false;
	for (var dec of rule.declarations) {
		if (dec.type === 'declaration' && dec.property === declaration.property && dec.value === declaration.value) {
			result = true;
			break;
		}
	}
	return result;
};

var FindDeclaration = function (rule, propertyName) {
	var result = null;
	for (var dec of rule.declarations) {
		if (dec.type === 'declaration' && dec.property === propertyName) {
			result = dec;
		}
	}
	return result;
};

var FindDeclarationValue = function (rule, propertyName) {
	var result = null
	var dec = FindDeclaration(rule, propertyName);
	if (dec) result = dec.value;
	return result;
};

var FindFontFace = function (rules, fontFamily) {
	var result = null;
	var _fontFamily = null;
	for (var rule of rules) {
		if (rule.type !== 'font-face') continue;
		_fontFamily = FindDeclarationValue(rule, 'font-family');
		if (_fontFamily === null) continue;
		if (_fontFamily !== fontFamily) continue;
		result = rule;
	}
	return result;
};

var AddFontFace = function (stylesheet, fontFace) {
	// Find this font family name.
	var fontFamily = FindDeclarationValue(fontFace, 'font-family');
	// If font family not found, ignore this rule.
	if (fontFamily === null) return;
	//else
	
	// Font family found.
	println('Font family: ' + fontFamily);
	
	// Merge if a font face with the same font family exists.
	var mergingRule = FindFontFace(stylesheet.stylesheet.rules, fontFamily);
	if (mergingRule === null) {
		// Not merging.
		var fontFace_clone = JSON.parse(JSON.stringify(fontFace));
		stylesheet.stylesheet.rules.push(fontFace_clone);
	} else {
		// Merge declarations.
		var dec_clone = null;
		for (var dec of fontFace.declarations) {
			if (dec.type !== 'declaration') continue;
			if (dec.property === 'src') {
				var mergingDec = FindDeclaration(mergingRule, dec.property);
				var items = String(dec.value).split(',');
				var mergingItems = String(mergingDec.value).split(',');
				for (var item of items) {
					if (mergingItems.indexOf(item) > -1) continue;
					mergingItems.push(item);
				}
				mergingDec.value = mergingItems.join(',');
			} else {
				if (!MatchDeclaration(mergingRule, dec)) {
					dec_clone = JSON.parse(JSON.stringify(dec));
					mergingRule.declarations.push(dec_clone);
				}
			}
		}
	}
};

var FindRule = function (rules, selector) {
	var result = null;
	var _selector = null;
	for (var rule of rules) {
		if (rule.type !== 'rule') continue;
		if (!rule.selectors) continue;
		_selector = JSON.stringify(rule.selectors);
		if (_selector !== selector) continue;
		result = rule;
	}
	return result;
};

var AddRule = function (stylesheet, rule) {
	// If selectors not found, ignore this rule.
	if (!rule.selectors) return;
	//else
	var selector = JSON.stringify(rule.selectors);
	
	// selector found.
	println('Selector: ' + selector);
	
	// Merge if a font face with the same font family exists.
	var mergingRule = FindRule(stylesheet.stylesheet.rules, selector);
	if (mergingRule === null) {
		// Not merging.
		var rule_clone = JSON.parse(JSON.stringify(rule));
		stylesheet.stylesheet.rules.push(rule_clone);
	} else {
		// Merge declarations.
		var dec_clone = null;
		for (var dec of rule.declarations) {
			if (dec.type !== 'declaration') continue;
			if (!MatchDeclaration(mergingRule, dec)) {
				dec_clone = JSON.parse(JSON.stringify(dec));
				mergingRule.declarations.push(dec_clone);
			}
		}
	}
};

var mainQueue = pqueue([
	function DownloadCss_Start (queue, heap) {
  	println('Downloading CSS files with different user agents.');
		heap.index = 0;
		heap.options = {
			"hostname": "fonts.googleapis.com",
			"path": "/icon?family=Material+Icons",
			"headers": {
				"User-Agent": ""
			}
		};
	},
	function DownloadCss_Get (queue, heap) {
		if (heap.index >= userAgents.length) {
			delete heap.index;
			delete heap.options;
			queue.pc.goto(queue.pc.locate("DownloadCss_End"));
			return;
		}
		//else
		queue.pause();
		heap.options.headers['User-Agent'] = userAgents[heap.index];
		
		println('Downloading CSS file with user agent: ');
		println(heap.options.headers['User-Agent']);
		
		https.get(heap.options, function (response) {
			var allData = "";
			response.on('data', function(dataChunk) {
				// Append data
				allData += dataChunk;
			}).on("end", function () {
  			println('Download complete.');
				heap.rawData = allData;
				queue.resume();
			});
		}).on('error', function(e) {
			println(e);
			throw e;
		});
	},
	function DownloadCss_Loop (queue, heap) {
  	println('Merging CSS.');
		_ast = css.parse(heap.rawData);
		_ast.stylesheet.rules.forEach(function (rule, index) {
			println('Rule type: ' + rule.type);
			switch (rule.type) {
				case 'font-face':
					AddFontFace(mergedAST, rule);
					break;
				case 'rule':
					AddRule(mergedAST, rule);
					break;
			}
		});
		println('Merge complete.');
		
		heap.index++;
		queue.pc.goto(queue.pc.locate("DownloadCss_Get"));
	},
	function DownloadCss_End (queue, heap) {
  	println('Download CSS files complete.');
		heap.mergedCss = css.stringify(mergedAST);
	},
	function WriteCssFile (queue, heap) {
  	var filePath = path.resolve(__dirname, pathToPackageRoot, mergedCssFilePath);
		
		println('Writing merged CSS to file: ');
		println(filePath + '.');
		
		fs.writeFile(filePath, heap.mergedCss, {encoding: 'utf8'});
	},
	function DownloadUrls_Start (queue, heap) {
  	println('Downloading resources referenced by url.');
		heap.urls = {};
	},
	function DownloadUrls_Get (queue, heap) {
		var urlMatch = heap.mergedCss.match(/url\(((https|http)[^\(]*)\)/i);
		if (!urlMatch) {
			queue.pc.goto(queue.pc.locate("DownloadUrls_End"));
			return;
		}
		//else
		var segment = urlMatch[0];
		var url = urlMatch[1];
		var protocol = urlMatch[2];
		var basename = path.basename(url);
		var filePath = 'fonts/' + basename;
		
		assets.push(filePath);
		
		queue.pause();
		httper[protocol].get(url, function (response) {
  		var absFilePath = path.resolve(__dirname, pathToPackageRoot, filePath);
  		
  		println('Downloading font file ' + url);
  		println('to ' + absFilePath + '.');
  		
			var file = fs.createWriteStream(absFilePath);
			file.on('finish', function () {
  			
  			println('Download complete.');
  			
				heap.mergedCss = heap.mergedCss.replace(segment, 'url(' + filePath + ')');
				
				queue.resume();
			});
			
			response.on('data', function(dataChunk) {
				file.write(dataChunk);
			}).on("end", function () {
				file.end();
			});
		}).on('error', function(e) {
			println(e);
			throw e;
		});
	},
	function DownloadUrls_Loop (queue, heap) {
		queue.pc.goto(queue.pc.locate("DownloadUrls_Get"));
	},
	function DownloadUrls_End (queue, heap) {
  	println('Download resources complete.');
	},
	function WriteFinalCssFile (queue, heap) {
  	var filePath = path.resolve(__dirname, pathToPackageRoot, finalCssFilePath);
		
		println('Writing final CSS to file: ');
		println(filePath + '.');
		
		fs.writeFile(filePath, heap.mergedCss, {encoding: 'utf8'});
	},
	function AddAssetsToPackage (queue, heap) {
  	var filePath = path.resolve(__dirname, pathToPackageRoot, packageFilePath);
  	var packageFile = fs.readFileSync(filePath, {encoding: 'utf8'});
  	var assetList = JSON.stringify(assets);
  	packageFile = packageFile.replace(/\/\/\/>>>>ASSETS((.|\n)*?)\/\/\/<<<<ASSETS/g, '///>>>>ASSETS\n  assets = ' + assetList + ';\n///<<<<ASSETS');
  	fs.writeFileSync(filePath, packageFile, {encoding: 'utf8'});
	},
	pqueue.HALT
], "0").boot();
