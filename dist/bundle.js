/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

var stylesInDom = {};

var	memoize = function (fn) {
	var memo;

	return function () {
		if (typeof memo === "undefined") memo = fn.apply(this, arguments);
		return memo;
	};
};

var isOldIE = memoize(function () {
	// Test for IE <= 9 as proposed by Browserhacks
	// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
	// Tests for existence of standard globals is to allow style-loader
	// to operate correctly into non-standard environments
	// @see https://github.com/webpack-contrib/style-loader/issues/177
	return window && document && document.all && !window.atob;
});

var getElement = (function (fn) {
	var memo = {};

	return function(selector) {
		if (typeof memo[selector] === "undefined") {
			memo[selector] = fn.call(this, selector);
		}

		return memo[selector]
	};
})(function (target) {
	return document.querySelector(target)
});

var singleton = null;
var	singletonCounter = 0;
var	stylesInsertedAtTop = [];

var	fixUrls = __webpack_require__(5);

module.exports = function(list, options) {
	if (typeof DEBUG !== "undefined" && DEBUG) {
		if (typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};

	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (!options.singleton) options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
	if (!options.insertInto) options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (!options.insertAt) options.insertAt = "bottom";

	var styles = listToStyles(list, options);

	addStylesToDom(styles, options);

	return function update (newList) {
		var mayRemove = [];

		for (var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];

			domStyle.refs--;
			mayRemove.push(domStyle);
		}

		if(newList) {
			var newStyles = listToStyles(newList, options);
			addStylesToDom(newStyles, options);
		}

		for (var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];

			if(domStyle.refs === 0) {
				for (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j]();

				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom (styles, options) {
	for (var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];

		if(domStyle) {
			domStyle.refs++;

			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}

			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];

			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}

			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles (list, options) {
	var styles = [];
	var newStyles = {};

	for (var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = options.base ? item[0] + options.base : item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};

		if(!newStyles[id]) styles.push(newStyles[id] = {id: id, parts: [part]});
		else newStyles[id].parts.push(part);
	}

	return styles;
}

function insertStyleElement (options, style) {
	var target = getElement(options.insertInto)

	if (!target) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}

	var lastStyleElementInsertedAtTop = stylesInsertedAtTop[stylesInsertedAtTop.length - 1];

	if (options.insertAt === "top") {
		if (!lastStyleElementInsertedAtTop) {
			target.insertBefore(style, target.firstChild);
		} else if (lastStyleElementInsertedAtTop.nextSibling) {
			target.insertBefore(style, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			target.appendChild(style);
		}
		stylesInsertedAtTop.push(style);
	} else if (options.insertAt === "bottom") {
		target.appendChild(style);
	} else {
		throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
	}
}

function removeStyleElement (style) {
	if (style.parentNode === null) return false;
	style.parentNode.removeChild(style);

	var idx = stylesInsertedAtTop.indexOf(style);
	if(idx >= 0) {
		stylesInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement (options) {
	var style = document.createElement("style");

	options.attrs.type = "text/css";

	addAttrs(style, options.attrs);
	insertStyleElement(options, style);

	return style;
}

function createLinkElement (options) {
	var link = document.createElement("link");

	options.attrs.type = "text/css";
	options.attrs.rel = "stylesheet";

	addAttrs(link, options.attrs);
	insertStyleElement(options, link);

	return link;
}

function addAttrs (el, attrs) {
	Object.keys(attrs).forEach(function (key) {
		el.setAttribute(key, attrs[key]);
	});
}

function addStyle (obj, options) {
	var style, update, remove, result;

	// If a transform function was defined, run it on the css
	if (options.transform && obj.css) {
	    result = options.transform(obj.css);

	    if (result) {
	    	// If transform returns a value, use that instead of the original css.
	    	// This allows running runtime transformations on the css.
	    	obj.css = result;
	    } else {
	    	// If the transform function returns a falsy value, don't add this css.
	    	// This allows conditional loading of css
	    	return function() {
	    		// noop
	    	};
	    }
	}

	if (options.singleton) {
		var styleIndex = singletonCounter++;

		style = singleton || (singleton = createStyleElement(options));

		update = applyToSingletonTag.bind(null, style, styleIndex, false);
		remove = applyToSingletonTag.bind(null, style, styleIndex, true);

	} else if (
		obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function"
	) {
		style = createLinkElement(options);
		update = updateLink.bind(null, style, options);
		remove = function () {
			removeStyleElement(style);

			if(style.href) URL.revokeObjectURL(style.href);
		};
	} else {
		style = createStyleElement(options);
		update = applyToTag.bind(null, style);
		remove = function () {
			removeStyleElement(style);
		};
	}

	update(obj);

	return function updateStyle (newObj) {
		if (newObj) {
			if (
				newObj.css === obj.css &&
				newObj.media === obj.media &&
				newObj.sourceMap === obj.sourceMap
			) {
				return;
			}

			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;

		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag (style, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (style.styleSheet) {
		style.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = style.childNodes;

		if (childNodes[index]) style.removeChild(childNodes[index]);

		if (childNodes.length) {
			style.insertBefore(cssNode, childNodes[index]);
		} else {
			style.appendChild(cssNode);
		}
	}
}

function applyToTag (style, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		style.setAttribute("media", media)
	}

	if(style.styleSheet) {
		style.styleSheet.cssText = css;
	} else {
		while(style.firstChild) {
			style.removeChild(style.firstChild);
		}

		style.appendChild(document.createTextNode(css));
	}
}

function updateLink (link, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/*
		If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
		and there is no publicPath defined then lets turn convertToAbsoluteUrls
		on by default.  Otherwise default to the convertToAbsoluteUrls option
		directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls) {
		css = fixUrls(css);
	}

	if (sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = link.href;

	link.href = URL.createObjectURL(blob);

	if(oldSrc) URL.revokeObjectURL(oldSrc);
}


/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__css_reset_css__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__css_reset_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__css_reset_css__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__css_index_css__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__css_index_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__css_index_css__);


__webpack_require__(8);

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(4);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../node_modules/css-loader/index.js!./reset.css", function() {
			var newContent = require("!!../../node_modules/css-loader/index.js!./reset.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, "/*** \r\n *** reset \r\n***/\r\nhtml, body, div, span, applet, object, iframe,\r\nh1, h2, h3, h4, h5, h6, p, blockquote, pre,\r\na, abbr, acronym, address, big, cite, code,\r\ndel, dfn, em, img, ins, kbd, q, s, samp,\r\nsmall, strike, strong, sub, sup, tt, var,\r\nb, u, i, center,\r\ndl, dt, dd, ol, ul, li,\r\nfieldset, form, label, legend,\r\ntable, caption, tbody, tfoot, thead, tr, th, td,\r\narticle, aside, canvas, details, embed, \r\nfigure, figcaption, footer, header, hgroup, \r\nmenu, nav, output, ruby, section, summary,\r\ntime, mark, audio, video {\r\n\tmargin: 0;\r\n\tpadding: 0;\r\n\tborder: 0;\r\n\tfont-size: 100%;\r\n\tfont-family: 'microsoft yahei',Arial,sans-serif;\r\n\t/*font: inherit;*/\r\n\tvertical-align: baseline;\r\n}\r\n/* HTML5 display-role reset for older browsers */\r\narticle, aside, details, figcaption, figure, \r\nfooter, header, hgroup, menu, nav, section {\r\n\tdisplay: block;\r\n}\r\nbody {\r\n\tline-height: 1;\r\n}\r\nol, ul {\r\n\tlist-style: none;\r\n}\r\nblockquote, q {\r\n\tquotes: none;\r\n}\r\nblockquote:before, blockquote:after,\r\nq:before, q:after {\r\n\tcontent: '';\r\n\tcontent: none;\r\n}\r\ntable {\r\n\tborder-collapse: collapse;\r\n\tborder-spacing: 0;\r\n}", ""]);

// exports


/***/ }),
/* 5 */
/***/ (function(module, exports) {


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
  // get current location
  var location = typeof window !== "undefined" && window.location;

  if (!location) {
    throw new Error("fixUrls requires window.location");
  }

	// blank or null?
	if (!css || typeof css !== "string") {
	  return css;
  }

  var baseUrl = location.protocol + "//" + location.host;
  var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	/*
	This regular expression is just a way to recursively match brackets within
	a string.

	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
	   (  = Start a capturing group
	     (?:  = Start a non-capturing group
	         [^)(]  = Match anything that isn't a parentheses
	         |  = OR
	         \(  = Match a start parentheses
	             (?:  = Start another non-capturing groups
	                 [^)(]+  = Match anything that isn't a parentheses
	                 |  = OR
	                 \(  = Match a start parentheses
	                     [^)(]*  = Match anything that isn't a parentheses
	                 \)  = Match a end parentheses
	             )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
	 \)  = Match a close parens

	 /gi  = Get all matches, not the first.  Be case insensitive.
	 */
	var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl
			.trim()
			.replace(/^"(.*)"$/, function(o, $1){ return $1; })
			.replace(/^'(.*)'$/, function(o, $1){ return $1; });

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(unquotedOrigUrl)) {
		  return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
		  	//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(7);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../node_modules/css-loader/index.js!./index.css", function() {
			var newContent = require("!!../../node_modules/css-loader/index.js!./index.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, "\r\nhtml body{font-family: 'microsoft yahei',Arial,sans-serif;}\r\n.layout-body{display:flex;}\r\n.layout-body .wp-drag{flex:2;height:100vh;border-right:1px solid #CDCDCD;display:flex;justify-content:center;align-items:center;box-sizing:border-box;padding:24px;}\r\n.layout-body .wp-menu{flex:1;height:100vh;}\r\n\r\n.wp-drag .drag-main{width:100%;height:90vh;color:#CDCDCD;border:3px dashed;font-size:24px;text-align:center;line-height:90vh;}\r\n.wp-drag .drag-main.drop-hover{color:#000000;}\r\n\r\n.layout-body .wp-menu .menu-options{padding:20px;font-size:14px;}\r\n.menu-options ul li{margin-bottom:10px;}\r\n.menu-options input[type=checkbox]{vertical-align:-2px;}", ""]);

// exports


/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__hp_drag__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__hp_css_sprite__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__hp_handlefile__ = __webpack_require__(11);





// const fs = global.require('fs');
// const postcss = global.require('postcss');
const sprites = global.require('postcss-sprites');
const path = global.require('path');
const autoprefixer = global.require('autoprefixer');
const cssnano = global.require('cssnano');

(function () {

	Object(__WEBPACK_IMPORTED_MODULE_0__hp_drag__["a" /* default */])(function (info) {

		let isPc = false,
		    plugins = [autoprefixer, cssnano],
		    checkbox = document.querySelectorAll('input[type=checkbox]');

		for (let i = 0; i < checkbox.length; i++) {
			if (checkbox[i].checked) {
				let index;
				switch (checkbox[i].value) {
					case 'pc-module':
						isPc = true;
						break;
					case 'no-picnano':
						console.log('no-picnano');
						break;
					case 'no-autoprefixer':
						index = plugins.indexOf(autoprefixer);
						if (index) {
							plugins.splice(index, 1);
						}
						break;
					case 'no-cssnano':
						index = plugins.indexOf(cssnano);
						if (index) {
							plugins.splice(index, 1);
						}
						break;
					default:
						break;
				}
			}
		}
		console.log(info);
		let pathObj = path.parse(info[0].path);

		if (/css/.test(pathObj.ext)) {
			// 传入 css 文件

			let basePath = pathObj.dir.split(path.sep).slice(0, -1).join(path.sep);
			let opts = Object(__WEBPACK_IMPORTED_MODULE_1__hp_css_sprite__["a" /* default */])(basePath, isPc);
			plugins.push(sprites(opts));

			Object(__WEBPACK_IMPORTED_MODULE_2__hp_handlefile__["a" /* handleCss */])(info[0].path, plugins);
		} else if (/html/.test(pathObj.ext)) {
			// 传入 html 文件

			Object(__WEBPACK_IMPORTED_MODULE_2__hp_handlefile__["b" /* handleHtml */])(info[0].path);
		} else {

			Object(__WEBPACK_IMPORTED_MODULE_2__hp_handlefile__["c" /* handleImage */])(info);
		}
	});
})();

/**
* 创建本地文件夹
*
* @param {string} basePath
*/
// function mkidrLocal(basePath) {
// 	fs.exists(path.join(basePath, '/dist/'), function(data) {
// 		if(!data) {
// 			fs.mkdir(path.join(basePath, '/dist/'), function(err){
// 				if(!err) {
// 					fs.mkdir(path.join(basePath, '/dist/img/'), function(err){
// 						if(err) console.log(err);
// 					});
// 					fs.mkdir(path.join(basePath, '/dist/css/'), function(err){
// 						if(err) console.log(err);
// 					});
// 				}
// 			});
// 		}
// 	});
// }

/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";


// const path = global.require('path');

/* harmony default export */ __webpack_exports__["a"] = (function (cb) {

	// 取消默认行为
	document.addEventListener('drop', function (e) {
		e.preventDefault();
	}, false);
	document.addEventListener('dragLeave', function (e) {
		e.preventDefault();
	}, false);
	document.addEventListener('dragenter', function (e) {
		e.preventDefault();
	}, false);
	document.addEventListener('dragover', function (e) {
		e.preventDefault();
	}, false);

	let dropZone = document.querySelector('.drag-main');

	dropZone.addEventListener('dragover', function (e) {
		e.preventDefault();
		this.classList.add('drop-hover');
	}, false);

	dropZone.addEventListener('dragleave', function (e) {
		e.preventDefault();
		this.classList.remove('drop-hover');
	}, false);

	dropZone.addEventListener('drop', function (e) {
		e.preventDefault();
		this.classList.remove('drop-hover');
		let fileInfo = e.dataTransfer.files;
		cb(fileInfo);
	}, false);
});

/**
* 处理文件信息
*
* @param {Object} fileInfo
*/
// function handleFile(fileInfo, cb) {
// 	cb();
// }

/***/ }),
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";


const postcss = global.require('postcss');
const path = global.require('path');

/* harmony default export */ __webpack_exports__["a"] = (function (basePath, isPc) {

	let opts = {
		stylesheetPath: path.join(basePath, '/dist/css/'),
		spritePath: './dist/img',
		basePath: basePath,
		spritesmith: {
			padding: 0
			// algorithm: 'top-down'
		},
		filterBy: function (image) {
			// console.log(image);
			if (!~image.url.indexOf('/slice/')) {
				return Promise.reject();
			}
			return Promise.resolve();
		},
		groupBy: function (image) {
			let name = /\/slice\/([0-9.A-Za-z]+)\//.exec(image.url);
			if (!name) {
				return Promise.reject(new Error('Not a shape image'));
			}
			return Promise.resolve(name[1]);
		},
		hooks: {
			onUpdateRule: function (rule, token, image) {
				['width', 'height'].forEach(function (prop) {
					let value = image.coords[prop];
					if (image.retina) {
						value /= image.ratio;
					}
					rule.insertAfter(rule.last, postcss.decl({
						prop: prop,
						value: value + 'px'
					}));
				});

				let backgroundSize, backgroundPosition;

				if (!isPc) {

					let backgroundSizeX = image.spriteWidth / image.coords.width * 100,
					    backgroundSizeY = image.spriteHeight / image.coords.height * 100,
					    backgroundPositionX = image.coords.x / (image.spriteWidth - image.coords.width) * 100,
					    backgroundPositionY = image.coords.y / (image.spriteHeight - image.coords.height) * 100;

					backgroundSizeX = isNaN(backgroundSizeX) ? 0 : backgroundSizeX;
					backgroundSizeY = isNaN(backgroundSizeY) ? 0 : backgroundSizeY;
					backgroundPositionX = isNaN(backgroundPositionX) ? 0 : backgroundPositionX;
					backgroundPositionY = isNaN(backgroundPositionY) ? 0 : backgroundPositionY;

					backgroundSize = postcss.decl({
						prop: 'background-size',
						value: backgroundSizeX + '% ' + backgroundSizeY + '%'
					});

					backgroundPosition = postcss.decl({
						prop: 'background-position',
						value: backgroundPositionX + '% ' + backgroundPositionY + '%'
					});
				} else {

					let backgroundPositionX = -image.coords.x,
					    backgroundPositionY = -image.coords.y;

					backgroundSize = postcss.decl({
						prop: 'background-size',
						value: 'auto'
					});

					backgroundPosition = postcss.decl({
						prop: 'background-position',
						value: backgroundPositionX + 'px ' + backgroundPositionY + 'px'
					});
				}

				let backgroundImage = postcss.decl({
					prop: 'background-image',
					value: 'url(' + image.spriteUrl + ')'
				});

				let backgroundRepeat = postcss.decl({
					prop: 'background-repeat',
					value: 'no-repeat'
				});

				rule.insertAfter(token, backgroundImage);
				rule.insertAfter(backgroundImage, backgroundPosition);
				rule.insertAfter(backgroundPosition, backgroundSize);
				rule.insertAfter(backgroundPosition, backgroundRepeat);
			},
			onSaveSpritesheet: function (opts, spritesheet) {
				let filenameChunks = spritesheet.groups.concat(spritesheet.extension);
				if (filenameChunks.length > 1) return path.join(basePath, opts.spritePath, 'spr-' + filenameChunks[0] + '.' + filenameChunks[1]);else return path.join(basePath, opts.spritePath, 'spr' + '.' + filenameChunks[0]);
			}
		}
	};

	return opts;
});

/***/ }),
/* 11 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return handleCss; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return handleHtml; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return handleImage; });


const fs = global.require('fs');
const path = global.require('path');
const postcss = global.require('postcss');


/**
* 操作css
*
* @param {string} stylesheetPath
*/
function handleCss(stylesheetPath, plugins) {

	let pathObj = path.parse(stylesheetPath);
	let basePath = pathObj.dir.split(path.sep).slice(0, -1).join(path.sep);
	existsFloder(basePath, path.join(basePath, '/dist/css/'));
	fs.readFile(stylesheetPath, 'utf-8', function (err, css) {
		postcss(plugins).process(css, { from: stylesheetPath, to: basePath + '/dist/css/' + pathObj.base }).then(result => {
			fs.writeFile(path.join(basePath, '/dist/css/', pathObj.base), result.css, function (err) {
				if (err) {
					console.error(err);
				} else {
					alert('success');
				}
				if (result.map) fs.writeFileSync(basePath + '/dist/css/' + pathObj.base + '.map', result.map);
			});
		});
	});
}

/**
* 操作html
*
* @param {string} htmlPath
*/
function handleHtml(htmlPath) {
	let pathObj = path.parse(htmlPath);
	let basePath = pathObj.dir;
	existsFloder(basePath, htmlPath);
	fs.readFile(htmlPath, function (err, data) {
		if (err) {
			console.error(err);
		} else {
			let html = data;
			fs.writeFile(basePath + '/dist/' + pathObj.base, html.toString(), function (err) {
				if (err) {
					console.error(err);
				} else {
					alert('success');
				}
			});
		}
	});
}

/**
* 操作图片
*
* @param {Array} image
*/
function handleImage(image) {
	let pathObj = path.parse(image[0].path);
	let basePath = pathObj.dir.split(path.sep).slice(0, -1).join(path.sep),
	    outputPath = pathObj.dir.split(path.sep);
	outputPath.splice(-1, 0, 'dist');
	outputPath = outputPath.join(path.sep);
	// 创建本地文件夹
	existsFloder(basePath, outputPath);
	for (let i = 0; i < image.length; i++) {
		let input = fs.createReadStream(image[i].path),
		    output = fs.createWriteStream(outputPath + path.sep + image[i].name);
		input.on('data', function (d) {
			output.write(d);
		});
		input.on('error', function (err) {
			throw err;
		});
		input.on('end', function () {
			output.end();
		});
	}
}

/**
* 判断文件夹是否存在
*
*@param {string} basePath
*@param {string} url
*/
function existsFloder(basePath, url) {

	fs.exists(path.join(basePath, '/dist/'), function (ext) {
		if (!ext) {
			fs.mkdir(path.join(basePath, '/dist/'), function (err) {
				if (!err) {
					fs.exists(url, function (ext) {
						if (!ext) {
							fs.mkdir(url, function (err) {
								if (err) console.error(err);
							});
						}
					});
				}
			});
		} else {
			fs.exists(url, function (ext) {
				if (!ext) {
					fs.mkdir(url, function (err) {
						if (err) console.error(err);
					});
				}
			});
		}
	});
}

/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgOWI4ZjI5MDBhMGU4NjE2ZGUyYTQiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvbGliL2Nzcy1iYXNlLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvbGliL2FkZFN0eWxlcy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2Nzcy9yZXNldC5jc3M/NzRkYyIsIndlYnBhY2s6Ly8vLi9zcmMvY3NzL3Jlc2V0LmNzcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2xpYi91cmxzLmpzIiwid2VicGFjazovLy8uL3NyYy9jc3MvaW5kZXguY3NzPzllMzQiLCJ3ZWJwYWNrOi8vLy4vc3JjL2Nzcy9pbmRleC5jc3MiLCJ3ZWJwYWNrOi8vLy4vc3JjL2pzL21haW4uanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2pzL2hwLWRyYWcuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2pzL2hwLWNzcy1zcHJpdGUuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2pzL2hwLWhhbmRsZWZpbGUuanMiXSwibmFtZXMiOlsicmVxdWlyZSIsInNwcml0ZXMiLCJnbG9iYWwiLCJwYXRoIiwiYXV0b3ByZWZpeGVyIiwiY3NzbmFubyIsImRyYWdEcm9wIiwiaW5mbyIsImlzUGMiLCJwbHVnaW5zIiwiY2hlY2tib3giLCJkb2N1bWVudCIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJpIiwibGVuZ3RoIiwiY2hlY2tlZCIsImluZGV4IiwidmFsdWUiLCJjb25zb2xlIiwibG9nIiwiaW5kZXhPZiIsInNwbGljZSIsInBhdGhPYmoiLCJwYXJzZSIsInRlc3QiLCJleHQiLCJiYXNlUGF0aCIsImRpciIsInNwbGl0Iiwic2VwIiwic2xpY2UiLCJqb2luIiwib3B0cyIsInNwcml0ZUNzcyIsInB1c2giLCJoYW5kbGVDc3MiLCJoYW5kbGVIdG1sIiwiaGFuZGxlSW1hZ2UiLCJjYiIsImFkZEV2ZW50TGlzdGVuZXIiLCJlIiwicHJldmVudERlZmF1bHQiLCJkcm9wWm9uZSIsInF1ZXJ5U2VsZWN0b3IiLCJjbGFzc0xpc3QiLCJhZGQiLCJyZW1vdmUiLCJmaWxlSW5mbyIsImRhdGFUcmFuc2ZlciIsImZpbGVzIiwicG9zdGNzcyIsInN0eWxlc2hlZXRQYXRoIiwic3ByaXRlUGF0aCIsInNwcml0ZXNtaXRoIiwicGFkZGluZyIsImZpbHRlckJ5IiwiaW1hZ2UiLCJ1cmwiLCJQcm9taXNlIiwicmVqZWN0IiwicmVzb2x2ZSIsImdyb3VwQnkiLCJuYW1lIiwiZXhlYyIsIkVycm9yIiwiaG9va3MiLCJvblVwZGF0ZVJ1bGUiLCJydWxlIiwidG9rZW4iLCJmb3JFYWNoIiwicHJvcCIsImNvb3JkcyIsInJldGluYSIsInJhdGlvIiwiaW5zZXJ0QWZ0ZXIiLCJsYXN0IiwiZGVjbCIsImJhY2tncm91bmRTaXplIiwiYmFja2dyb3VuZFBvc2l0aW9uIiwiYmFja2dyb3VuZFNpemVYIiwic3ByaXRlV2lkdGgiLCJ3aWR0aCIsImJhY2tncm91bmRTaXplWSIsInNwcml0ZUhlaWdodCIsImhlaWdodCIsImJhY2tncm91bmRQb3NpdGlvblgiLCJ4IiwiYmFja2dyb3VuZFBvc2l0aW9uWSIsInkiLCJpc05hTiIsImJhY2tncm91bmRJbWFnZSIsInNwcml0ZVVybCIsImJhY2tncm91bmRSZXBlYXQiLCJvblNhdmVTcHJpdGVzaGVldCIsInNwcml0ZXNoZWV0IiwiZmlsZW5hbWVDaHVua3MiLCJncm91cHMiLCJjb25jYXQiLCJleHRlbnNpb24iLCJmcyIsImV4aXN0c0Zsb2RlciIsInJlYWRGaWxlIiwiZXJyIiwiY3NzIiwicHJvY2VzcyIsImZyb20iLCJ0byIsImJhc2UiLCJ0aGVuIiwicmVzdWx0Iiwid3JpdGVGaWxlIiwiZXJyb3IiLCJhbGVydCIsIm1hcCIsIndyaXRlRmlsZVN5bmMiLCJodG1sUGF0aCIsImRhdGEiLCJodG1sIiwidG9TdHJpbmciLCJvdXRwdXRQYXRoIiwiaW5wdXQiLCJjcmVhdGVSZWFkU3RyZWFtIiwib3V0cHV0IiwiY3JlYXRlV3JpdGVTdHJlYW0iLCJvbiIsImQiLCJ3cml0ZSIsImVuZCIsImV4aXN0cyIsIm1rZGlyIl0sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4REFBc0QsK0RBQStEOztBQUVySDtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7QUM3REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1DQUFtQyxnQkFBZ0I7QUFDbkQsSUFBSTtBQUNKO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQixpQkFBaUI7QUFDakM7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZLG9CQUFvQjtBQUNoQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvREFBb0QsY0FBYzs7QUFFbEU7QUFDQTs7Ozs7OztBQzNFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQSxpQkFBaUIsbUJBQW1CO0FBQ3BDO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGlCQUFpQixzQkFBc0I7QUFDdkM7O0FBRUE7QUFDQSxtQkFBbUIsMkJBQTJCOztBQUU5QztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsZ0JBQWdCLG1CQUFtQjtBQUNuQztBQUNBOztBQUVBO0FBQ0E7O0FBRUEsaUJBQWlCLDJCQUEyQjtBQUM1QztBQUNBOztBQUVBLFFBQVEsdUJBQXVCO0FBQy9CO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7O0FBRUEsaUJBQWlCLHVCQUF1QjtBQUN4QztBQUNBOztBQUVBLDJCQUEyQjtBQUMzQjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBLGdCQUFnQixpQkFBaUI7QUFDakM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWM7O0FBRWQsa0RBQWtELHNCQUFzQjtBQUN4RTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx1REFBdUQ7QUFDdkQ7O0FBRUEsNkJBQTZCLG1CQUFtQjs7QUFFaEQ7O0FBRUE7O0FBRUE7QUFDQTs7Ozs7Ozs7Ozs7OztBQ2hXQTtBQUNBO0FBQ0EsbUJBQUFBLENBQVEsQ0FBUixFOzs7Ozs7QUNGQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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LFVBQVNoQyxHQUFULEVBQWE7QUFDM0IsUUFBRyxDQUFDQSxHQUFKLEVBQVE7QUFDUDBFLFFBQUc4QixLQUFILENBQVN4RSxHQUFULEVBQWMsVUFBUzZDLEdBQVQsRUFBYTtBQUMxQixVQUFHQSxHQUFILEVBQVFwRixRQUFRNkYsS0FBUixDQUFjVCxHQUFkO0FBQ1IsTUFGRDtBQUdBO0FBQ0QsSUFORDtBQU9BO0FBQ0QsRUF0QkQ7QUF3QkEsQyIsImZpbGUiOiJidW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSAyKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCA5YjhmMjkwMGEwZTg2MTZkZTJhNCIsIi8qXG5cdE1JVCBMaWNlbnNlIGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwXG5cdEF1dGhvciBUb2JpYXMgS29wcGVycyBAc29rcmFcbiovXG4vLyBjc3MgYmFzZSBjb2RlLCBpbmplY3RlZCBieSB0aGUgY3NzLWxvYWRlclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbih1c2VTb3VyY2VNYXApIHtcblx0dmFyIGxpc3QgPSBbXTtcblxuXHQvLyByZXR1cm4gdGhlIGxpc3Qgb2YgbW9kdWxlcyBhcyBjc3Mgc3RyaW5nXG5cdGxpc3QudG9TdHJpbmcgPSBmdW5jdGlvbiB0b1N0cmluZygpIHtcblx0XHRyZXR1cm4gdGhpcy5tYXAoZnVuY3Rpb24gKGl0ZW0pIHtcblx0XHRcdHZhciBjb250ZW50ID0gY3NzV2l0aE1hcHBpbmdUb1N0cmluZyhpdGVtLCB1c2VTb3VyY2VNYXApO1xuXHRcdFx0aWYoaXRlbVsyXSkge1xuXHRcdFx0XHRyZXR1cm4gXCJAbWVkaWEgXCIgKyBpdGVtWzJdICsgXCJ7XCIgKyBjb250ZW50ICsgXCJ9XCI7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRyZXR1cm4gY29udGVudDtcblx0XHRcdH1cblx0XHR9KS5qb2luKFwiXCIpO1xuXHR9O1xuXG5cdC8vIGltcG9ydCBhIGxpc3Qgb2YgbW9kdWxlcyBpbnRvIHRoZSBsaXN0XG5cdGxpc3QuaSA9IGZ1bmN0aW9uKG1vZHVsZXMsIG1lZGlhUXVlcnkpIHtcblx0XHRpZih0eXBlb2YgbW9kdWxlcyA9PT0gXCJzdHJpbmdcIilcblx0XHRcdG1vZHVsZXMgPSBbW251bGwsIG1vZHVsZXMsIFwiXCJdXTtcblx0XHR2YXIgYWxyZWFkeUltcG9ydGVkTW9kdWxlcyA9IHt9O1xuXHRcdGZvcih2YXIgaSA9IDA7IGkgPCB0aGlzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHR2YXIgaWQgPSB0aGlzW2ldWzBdO1xuXHRcdFx0aWYodHlwZW9mIGlkID09PSBcIm51bWJlclwiKVxuXHRcdFx0XHRhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzW2lkXSA9IHRydWU7XG5cdFx0fVxuXHRcdGZvcihpID0gMDsgaSA8IG1vZHVsZXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdHZhciBpdGVtID0gbW9kdWxlc1tpXTtcblx0XHRcdC8vIHNraXAgYWxyZWFkeSBpbXBvcnRlZCBtb2R1bGVcblx0XHRcdC8vIHRoaXMgaW1wbGVtZW50YXRpb24gaXMgbm90IDEwMCUgcGVyZmVjdCBmb3Igd2VpcmQgbWVkaWEgcXVlcnkgY29tYmluYXRpb25zXG5cdFx0XHQvLyAgd2hlbiBhIG1vZHVsZSBpcyBpbXBvcnRlZCBtdWx0aXBsZSB0aW1lcyB3aXRoIGRpZmZlcmVudCBtZWRpYSBxdWVyaWVzLlxuXHRcdFx0Ly8gIEkgaG9wZSB0aGlzIHdpbGwgbmV2ZXIgb2NjdXIgKEhleSB0aGlzIHdheSB3ZSBoYXZlIHNtYWxsZXIgYnVuZGxlcylcblx0XHRcdGlmKHR5cGVvZiBpdGVtWzBdICE9PSBcIm51bWJlclwiIHx8ICFhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzW2l0ZW1bMF1dKSB7XG5cdFx0XHRcdGlmKG1lZGlhUXVlcnkgJiYgIWl0ZW1bMl0pIHtcblx0XHRcdFx0XHRpdGVtWzJdID0gbWVkaWFRdWVyeTtcblx0XHRcdFx0fSBlbHNlIGlmKG1lZGlhUXVlcnkpIHtcblx0XHRcdFx0XHRpdGVtWzJdID0gXCIoXCIgKyBpdGVtWzJdICsgXCIpIGFuZCAoXCIgKyBtZWRpYVF1ZXJ5ICsgXCIpXCI7XG5cdFx0XHRcdH1cblx0XHRcdFx0bGlzdC5wdXNoKGl0ZW0pO1xuXHRcdFx0fVxuXHRcdH1cblx0fTtcblx0cmV0dXJuIGxpc3Q7XG59O1xuXG5mdW5jdGlvbiBjc3NXaXRoTWFwcGluZ1RvU3RyaW5nKGl0ZW0sIHVzZVNvdXJjZU1hcCkge1xuXHR2YXIgY29udGVudCA9IGl0ZW1bMV0gfHwgJyc7XG5cdHZhciBjc3NNYXBwaW5nID0gaXRlbVszXTtcblx0aWYgKCFjc3NNYXBwaW5nKSB7XG5cdFx0cmV0dXJuIGNvbnRlbnQ7XG5cdH1cblxuXHRpZiAodXNlU291cmNlTWFwICYmIHR5cGVvZiBidG9hID09PSAnZnVuY3Rpb24nKSB7XG5cdFx0dmFyIHNvdXJjZU1hcHBpbmcgPSB0b0NvbW1lbnQoY3NzTWFwcGluZyk7XG5cdFx0dmFyIHNvdXJjZVVSTHMgPSBjc3NNYXBwaW5nLnNvdXJjZXMubWFwKGZ1bmN0aW9uIChzb3VyY2UpIHtcblx0XHRcdHJldHVybiAnLyojIHNvdXJjZVVSTD0nICsgY3NzTWFwcGluZy5zb3VyY2VSb290ICsgc291cmNlICsgJyAqLydcblx0XHR9KTtcblxuXHRcdHJldHVybiBbY29udGVudF0uY29uY2F0KHNvdXJjZVVSTHMpLmNvbmNhdChbc291cmNlTWFwcGluZ10pLmpvaW4oJ1xcbicpO1xuXHR9XG5cblx0cmV0dXJuIFtjb250ZW50XS5qb2luKCdcXG4nKTtcbn1cblxuLy8gQWRhcHRlZCBmcm9tIGNvbnZlcnQtc291cmNlLW1hcCAoTUlUKVxuZnVuY3Rpb24gdG9Db21tZW50KHNvdXJjZU1hcCkge1xuXHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW5kZWZcblx0dmFyIGJhc2U2NCA9IGJ0b2EodW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KEpTT04uc3RyaW5naWZ5KHNvdXJjZU1hcCkpKSk7XG5cdHZhciBkYXRhID0gJ3NvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LCcgKyBiYXNlNjQ7XG5cblx0cmV0dXJuICcvKiMgJyArIGRhdGEgKyAnICovJztcbn1cblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvbGliL2Nzcy1iYXNlLmpzXG4vLyBtb2R1bGUgaWQgPSAwXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8qXG5cdE1JVCBMaWNlbnNlIGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwXG5cdEF1dGhvciBUb2JpYXMgS29wcGVycyBAc29rcmFcbiovXG5cbnZhciBzdHlsZXNJbkRvbSA9IHt9O1xuXG52YXJcdG1lbW9pemUgPSBmdW5jdGlvbiAoZm4pIHtcblx0dmFyIG1lbW87XG5cblx0cmV0dXJuIGZ1bmN0aW9uICgpIHtcblx0XHRpZiAodHlwZW9mIG1lbW8gPT09IFwidW5kZWZpbmVkXCIpIG1lbW8gPSBmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuXHRcdHJldHVybiBtZW1vO1xuXHR9O1xufTtcblxudmFyIGlzT2xkSUUgPSBtZW1vaXplKGZ1bmN0aW9uICgpIHtcblx0Ly8gVGVzdCBmb3IgSUUgPD0gOSBhcyBwcm9wb3NlZCBieSBCcm93c2VyaGFja3Ncblx0Ly8gQHNlZSBodHRwOi8vYnJvd3NlcmhhY2tzLmNvbS8jaGFjay1lNzFkODY5MmY2NTMzNDE3M2ZlZTcxNWMyMjJjYjgwNVxuXHQvLyBUZXN0cyBmb3IgZXhpc3RlbmNlIG9mIHN0YW5kYXJkIGdsb2JhbHMgaXMgdG8gYWxsb3cgc3R5bGUtbG9hZGVyXG5cdC8vIHRvIG9wZXJhdGUgY29ycmVjdGx5IGludG8gbm9uLXN0YW5kYXJkIGVudmlyb25tZW50c1xuXHQvLyBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS93ZWJwYWNrLWNvbnRyaWIvc3R5bGUtbG9hZGVyL2lzc3Vlcy8xNzdcblx0cmV0dXJuIHdpbmRvdyAmJiBkb2N1bWVudCAmJiBkb2N1bWVudC5hbGwgJiYgIXdpbmRvdy5hdG9iO1xufSk7XG5cbnZhciBnZXRFbGVtZW50ID0gKGZ1bmN0aW9uIChmbikge1xuXHR2YXIgbWVtbyA9IHt9O1xuXG5cdHJldHVybiBmdW5jdGlvbihzZWxlY3Rvcikge1xuXHRcdGlmICh0eXBlb2YgbWVtb1tzZWxlY3Rvcl0gPT09IFwidW5kZWZpbmVkXCIpIHtcblx0XHRcdG1lbW9bc2VsZWN0b3JdID0gZm4uY2FsbCh0aGlzLCBzZWxlY3Rvcik7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIG1lbW9bc2VsZWN0b3JdXG5cdH07XG59KShmdW5jdGlvbiAodGFyZ2V0KSB7XG5cdHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHRhcmdldClcbn0pO1xuXG52YXIgc2luZ2xldG9uID0gbnVsbDtcbnZhclx0c2luZ2xldG9uQ291bnRlciA9IDA7XG52YXJcdHN0eWxlc0luc2VydGVkQXRUb3AgPSBbXTtcblxudmFyXHRmaXhVcmxzID0gcmVxdWlyZShcIi4vdXJsc1wiKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihsaXN0LCBvcHRpb25zKSB7XG5cdGlmICh0eXBlb2YgREVCVUcgIT09IFwidW5kZWZpbmVkXCIgJiYgREVCVUcpIHtcblx0XHRpZiAodHlwZW9mIGRvY3VtZW50ICE9PSBcIm9iamVjdFwiKSB0aHJvdyBuZXcgRXJyb3IoXCJUaGUgc3R5bGUtbG9hZGVyIGNhbm5vdCBiZSB1c2VkIGluIGEgbm9uLWJyb3dzZXIgZW52aXJvbm1lbnRcIik7XG5cdH1cblxuXHRvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuXHRvcHRpb25zLmF0dHJzID0gdHlwZW9mIG9wdGlvbnMuYXR0cnMgPT09IFwib2JqZWN0XCIgPyBvcHRpb25zLmF0dHJzIDoge307XG5cblx0Ly8gRm9yY2Ugc2luZ2xlLXRhZyBzb2x1dGlvbiBvbiBJRTYtOSwgd2hpY2ggaGFzIGEgaGFyZCBsaW1pdCBvbiB0aGUgIyBvZiA8c3R5bGU+XG5cdC8vIHRhZ3MgaXQgd2lsbCBhbGxvdyBvbiBhIHBhZ2Vcblx0aWYgKCFvcHRpb25zLnNpbmdsZXRvbikgb3B0aW9ucy5zaW5nbGV0b24gPSBpc09sZElFKCk7XG5cblx0Ly8gQnkgZGVmYXVsdCwgYWRkIDxzdHlsZT4gdGFncyB0byB0aGUgPGhlYWQ+IGVsZW1lbnRcblx0aWYgKCFvcHRpb25zLmluc2VydEludG8pIG9wdGlvbnMuaW5zZXJ0SW50byA9IFwiaGVhZFwiO1xuXG5cdC8vIEJ5IGRlZmF1bHQsIGFkZCA8c3R5bGU+IHRhZ3MgdG8gdGhlIGJvdHRvbSBvZiB0aGUgdGFyZ2V0XG5cdGlmICghb3B0aW9ucy5pbnNlcnRBdCkgb3B0aW9ucy5pbnNlcnRBdCA9IFwiYm90dG9tXCI7XG5cblx0dmFyIHN0eWxlcyA9IGxpc3RUb1N0eWxlcyhsaXN0LCBvcHRpb25zKTtcblxuXHRhZGRTdHlsZXNUb0RvbShzdHlsZXMsIG9wdGlvbnMpO1xuXG5cdHJldHVybiBmdW5jdGlvbiB1cGRhdGUgKG5ld0xpc3QpIHtcblx0XHR2YXIgbWF5UmVtb3ZlID0gW107XG5cblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHN0eWxlcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0dmFyIGl0ZW0gPSBzdHlsZXNbaV07XG5cdFx0XHR2YXIgZG9tU3R5bGUgPSBzdHlsZXNJbkRvbVtpdGVtLmlkXTtcblxuXHRcdFx0ZG9tU3R5bGUucmVmcy0tO1xuXHRcdFx0bWF5UmVtb3ZlLnB1c2goZG9tU3R5bGUpO1xuXHRcdH1cblxuXHRcdGlmKG5ld0xpc3QpIHtcblx0XHRcdHZhciBuZXdTdHlsZXMgPSBsaXN0VG9TdHlsZXMobmV3TGlzdCwgb3B0aW9ucyk7XG5cdFx0XHRhZGRTdHlsZXNUb0RvbShuZXdTdHlsZXMsIG9wdGlvbnMpO1xuXHRcdH1cblxuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgbWF5UmVtb3ZlLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHR2YXIgZG9tU3R5bGUgPSBtYXlSZW1vdmVbaV07XG5cblx0XHRcdGlmKGRvbVN0eWxlLnJlZnMgPT09IDApIHtcblx0XHRcdFx0Zm9yICh2YXIgaiA9IDA7IGogPCBkb21TdHlsZS5wYXJ0cy5sZW5ndGg7IGorKykgZG9tU3R5bGUucGFydHNbal0oKTtcblxuXHRcdFx0XHRkZWxldGUgc3R5bGVzSW5Eb21bZG9tU3R5bGUuaWRdO1xuXHRcdFx0fVxuXHRcdH1cblx0fTtcbn07XG5cbmZ1bmN0aW9uIGFkZFN0eWxlc1RvRG9tIChzdHlsZXMsIG9wdGlvbnMpIHtcblx0Zm9yICh2YXIgaSA9IDA7IGkgPCBzdHlsZXMubGVuZ3RoOyBpKyspIHtcblx0XHR2YXIgaXRlbSA9IHN0eWxlc1tpXTtcblx0XHR2YXIgZG9tU3R5bGUgPSBzdHlsZXNJbkRvbVtpdGVtLmlkXTtcblxuXHRcdGlmKGRvbVN0eWxlKSB7XG5cdFx0XHRkb21TdHlsZS5yZWZzKys7XG5cblx0XHRcdGZvcih2YXIgaiA9IDA7IGogPCBkb21TdHlsZS5wYXJ0cy5sZW5ndGg7IGorKykge1xuXHRcdFx0XHRkb21TdHlsZS5wYXJ0c1tqXShpdGVtLnBhcnRzW2pdKTtcblx0XHRcdH1cblxuXHRcdFx0Zm9yKDsgaiA8IGl0ZW0ucGFydHMubGVuZ3RoOyBqKyspIHtcblx0XHRcdFx0ZG9tU3R5bGUucGFydHMucHVzaChhZGRTdHlsZShpdGVtLnBhcnRzW2pdLCBvcHRpb25zKSk7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdHZhciBwYXJ0cyA9IFtdO1xuXG5cdFx0XHRmb3IodmFyIGogPSAwOyBqIDwgaXRlbS5wYXJ0cy5sZW5ndGg7IGorKykge1xuXHRcdFx0XHRwYXJ0cy5wdXNoKGFkZFN0eWxlKGl0ZW0ucGFydHNbal0sIG9wdGlvbnMpKTtcblx0XHRcdH1cblxuXHRcdFx0c3R5bGVzSW5Eb21baXRlbS5pZF0gPSB7aWQ6IGl0ZW0uaWQsIHJlZnM6IDEsIHBhcnRzOiBwYXJ0c307XG5cdFx0fVxuXHR9XG59XG5cbmZ1bmN0aW9uIGxpc3RUb1N0eWxlcyAobGlzdCwgb3B0aW9ucykge1xuXHR2YXIgc3R5bGVzID0gW107XG5cdHZhciBuZXdTdHlsZXMgPSB7fTtcblxuXHRmb3IgKHZhciBpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspIHtcblx0XHR2YXIgaXRlbSA9IGxpc3RbaV07XG5cdFx0dmFyIGlkID0gb3B0aW9ucy5iYXNlID8gaXRlbVswXSArIG9wdGlvbnMuYmFzZSA6IGl0ZW1bMF07XG5cdFx0dmFyIGNzcyA9IGl0ZW1bMV07XG5cdFx0dmFyIG1lZGlhID0gaXRlbVsyXTtcblx0XHR2YXIgc291cmNlTWFwID0gaXRlbVszXTtcblx0XHR2YXIgcGFydCA9IHtjc3M6IGNzcywgbWVkaWE6IG1lZGlhLCBzb3VyY2VNYXA6IHNvdXJjZU1hcH07XG5cblx0XHRpZighbmV3U3R5bGVzW2lkXSkgc3R5bGVzLnB1c2gobmV3U3R5bGVzW2lkXSA9IHtpZDogaWQsIHBhcnRzOiBbcGFydF19KTtcblx0XHRlbHNlIG5ld1N0eWxlc1tpZF0ucGFydHMucHVzaChwYXJ0KTtcblx0fVxuXG5cdHJldHVybiBzdHlsZXM7XG59XG5cbmZ1bmN0aW9uIGluc2VydFN0eWxlRWxlbWVudCAob3B0aW9ucywgc3R5bGUpIHtcblx0dmFyIHRhcmdldCA9IGdldEVsZW1lbnQob3B0aW9ucy5pbnNlcnRJbnRvKVxuXG5cdGlmICghdGFyZ2V0KSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiQ291bGRuJ3QgZmluZCBhIHN0eWxlIHRhcmdldC4gVGhpcyBwcm9iYWJseSBtZWFucyB0aGF0IHRoZSB2YWx1ZSBmb3IgdGhlICdpbnNlcnRJbnRvJyBwYXJhbWV0ZXIgaXMgaW52YWxpZC5cIik7XG5cdH1cblxuXHR2YXIgbGFzdFN0eWxlRWxlbWVudEluc2VydGVkQXRUb3AgPSBzdHlsZXNJbnNlcnRlZEF0VG9wW3N0eWxlc0luc2VydGVkQXRUb3AubGVuZ3RoIC0gMV07XG5cblx0aWYgKG9wdGlvbnMuaW5zZXJ0QXQgPT09IFwidG9wXCIpIHtcblx0XHRpZiAoIWxhc3RTdHlsZUVsZW1lbnRJbnNlcnRlZEF0VG9wKSB7XG5cdFx0XHR0YXJnZXQuaW5zZXJ0QmVmb3JlKHN0eWxlLCB0YXJnZXQuZmlyc3RDaGlsZCk7XG5cdFx0fSBlbHNlIGlmIChsYXN0U3R5bGVFbGVtZW50SW5zZXJ0ZWRBdFRvcC5uZXh0U2libGluZykge1xuXHRcdFx0dGFyZ2V0Lmluc2VydEJlZm9yZShzdHlsZSwgbGFzdFN0eWxlRWxlbWVudEluc2VydGVkQXRUb3AubmV4dFNpYmxpbmcpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR0YXJnZXQuYXBwZW5kQ2hpbGQoc3R5bGUpO1xuXHRcdH1cblx0XHRzdHlsZXNJbnNlcnRlZEF0VG9wLnB1c2goc3R5bGUpO1xuXHR9IGVsc2UgaWYgKG9wdGlvbnMuaW5zZXJ0QXQgPT09IFwiYm90dG9tXCIpIHtcblx0XHR0YXJnZXQuYXBwZW5kQ2hpbGQoc3R5bGUpO1xuXHR9IGVsc2Uge1xuXHRcdHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgdmFsdWUgZm9yIHBhcmFtZXRlciAnaW5zZXJ0QXQnLiBNdXN0IGJlICd0b3AnIG9yICdib3R0b20nLlwiKTtcblx0fVxufVxuXG5mdW5jdGlvbiByZW1vdmVTdHlsZUVsZW1lbnQgKHN0eWxlKSB7XG5cdGlmIChzdHlsZS5wYXJlbnROb2RlID09PSBudWxsKSByZXR1cm4gZmFsc2U7XG5cdHN0eWxlLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoc3R5bGUpO1xuXG5cdHZhciBpZHggPSBzdHlsZXNJbnNlcnRlZEF0VG9wLmluZGV4T2Yoc3R5bGUpO1xuXHRpZihpZHggPj0gMCkge1xuXHRcdHN0eWxlc0luc2VydGVkQXRUb3Auc3BsaWNlKGlkeCwgMSk7XG5cdH1cbn1cblxuZnVuY3Rpb24gY3JlYXRlU3R5bGVFbGVtZW50IChvcHRpb25zKSB7XG5cdHZhciBzdHlsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzdHlsZVwiKTtcblxuXHRvcHRpb25zLmF0dHJzLnR5cGUgPSBcInRleHQvY3NzXCI7XG5cblx0YWRkQXR0cnMoc3R5bGUsIG9wdGlvbnMuYXR0cnMpO1xuXHRpbnNlcnRTdHlsZUVsZW1lbnQob3B0aW9ucywgc3R5bGUpO1xuXG5cdHJldHVybiBzdHlsZTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlTGlua0VsZW1lbnQgKG9wdGlvbnMpIHtcblx0dmFyIGxpbmsgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwibGlua1wiKTtcblxuXHRvcHRpb25zLmF0dHJzLnR5cGUgPSBcInRleHQvY3NzXCI7XG5cdG9wdGlvbnMuYXR0cnMucmVsID0gXCJzdHlsZXNoZWV0XCI7XG5cblx0YWRkQXR0cnMobGluaywgb3B0aW9ucy5hdHRycyk7XG5cdGluc2VydFN0eWxlRWxlbWVudChvcHRpb25zLCBsaW5rKTtcblxuXHRyZXR1cm4gbGluaztcbn1cblxuZnVuY3Rpb24gYWRkQXR0cnMgKGVsLCBhdHRycykge1xuXHRPYmplY3Qua2V5cyhhdHRycykuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG5cdFx0ZWwuc2V0QXR0cmlidXRlKGtleSwgYXR0cnNba2V5XSk7XG5cdH0pO1xufVxuXG5mdW5jdGlvbiBhZGRTdHlsZSAob2JqLCBvcHRpb25zKSB7XG5cdHZhciBzdHlsZSwgdXBkYXRlLCByZW1vdmUsIHJlc3VsdDtcblxuXHQvLyBJZiBhIHRyYW5zZm9ybSBmdW5jdGlvbiB3YXMgZGVmaW5lZCwgcnVuIGl0IG9uIHRoZSBjc3Ncblx0aWYgKG9wdGlvbnMudHJhbnNmb3JtICYmIG9iai5jc3MpIHtcblx0ICAgIHJlc3VsdCA9IG9wdGlvbnMudHJhbnNmb3JtKG9iai5jc3MpO1xuXG5cdCAgICBpZiAocmVzdWx0KSB7XG5cdCAgICBcdC8vIElmIHRyYW5zZm9ybSByZXR1cm5zIGEgdmFsdWUsIHVzZSB0aGF0IGluc3RlYWQgb2YgdGhlIG9yaWdpbmFsIGNzcy5cblx0ICAgIFx0Ly8gVGhpcyBhbGxvd3MgcnVubmluZyBydW50aW1lIHRyYW5zZm9ybWF0aW9ucyBvbiB0aGUgY3NzLlxuXHQgICAgXHRvYmouY3NzID0gcmVzdWx0O1xuXHQgICAgfSBlbHNlIHtcblx0ICAgIFx0Ly8gSWYgdGhlIHRyYW5zZm9ybSBmdW5jdGlvbiByZXR1cm5zIGEgZmFsc3kgdmFsdWUsIGRvbid0IGFkZCB0aGlzIGNzcy5cblx0ICAgIFx0Ly8gVGhpcyBhbGxvd3MgY29uZGl0aW9uYWwgbG9hZGluZyBvZiBjc3Ncblx0ICAgIFx0cmV0dXJuIGZ1bmN0aW9uKCkge1xuXHQgICAgXHRcdC8vIG5vb3Bcblx0ICAgIFx0fTtcblx0ICAgIH1cblx0fVxuXG5cdGlmIChvcHRpb25zLnNpbmdsZXRvbikge1xuXHRcdHZhciBzdHlsZUluZGV4ID0gc2luZ2xldG9uQ291bnRlcisrO1xuXG5cdFx0c3R5bGUgPSBzaW5nbGV0b24gfHwgKHNpbmdsZXRvbiA9IGNyZWF0ZVN0eWxlRWxlbWVudChvcHRpb25zKSk7XG5cblx0XHR1cGRhdGUgPSBhcHBseVRvU2luZ2xldG9uVGFnLmJpbmQobnVsbCwgc3R5bGUsIHN0eWxlSW5kZXgsIGZhbHNlKTtcblx0XHRyZW1vdmUgPSBhcHBseVRvU2luZ2xldG9uVGFnLmJpbmQobnVsbCwgc3R5bGUsIHN0eWxlSW5kZXgsIHRydWUpO1xuXG5cdH0gZWxzZSBpZiAoXG5cdFx0b2JqLnNvdXJjZU1hcCAmJlxuXHRcdHR5cGVvZiBVUkwgPT09IFwiZnVuY3Rpb25cIiAmJlxuXHRcdHR5cGVvZiBVUkwuY3JlYXRlT2JqZWN0VVJMID09PSBcImZ1bmN0aW9uXCIgJiZcblx0XHR0eXBlb2YgVVJMLnJldm9rZU9iamVjdFVSTCA9PT0gXCJmdW5jdGlvblwiICYmXG5cdFx0dHlwZW9mIEJsb2IgPT09IFwiZnVuY3Rpb25cIiAmJlxuXHRcdHR5cGVvZiBidG9hID09PSBcImZ1bmN0aW9uXCJcblx0KSB7XG5cdFx0c3R5bGUgPSBjcmVhdGVMaW5rRWxlbWVudChvcHRpb25zKTtcblx0XHR1cGRhdGUgPSB1cGRhdGVMaW5rLmJpbmQobnVsbCwgc3R5bGUsIG9wdGlvbnMpO1xuXHRcdHJlbW92ZSA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdHJlbW92ZVN0eWxlRWxlbWVudChzdHlsZSk7XG5cblx0XHRcdGlmKHN0eWxlLmhyZWYpIFVSTC5yZXZva2VPYmplY3RVUkwoc3R5bGUuaHJlZik7XG5cdFx0fTtcblx0fSBlbHNlIHtcblx0XHRzdHlsZSA9IGNyZWF0ZVN0eWxlRWxlbWVudChvcHRpb25zKTtcblx0XHR1cGRhdGUgPSBhcHBseVRvVGFnLmJpbmQobnVsbCwgc3R5bGUpO1xuXHRcdHJlbW92ZSA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdHJlbW92ZVN0eWxlRWxlbWVudChzdHlsZSk7XG5cdFx0fTtcblx0fVxuXG5cdHVwZGF0ZShvYmopO1xuXG5cdHJldHVybiBmdW5jdGlvbiB1cGRhdGVTdHlsZSAobmV3T2JqKSB7XG5cdFx0aWYgKG5ld09iaikge1xuXHRcdFx0aWYgKFxuXHRcdFx0XHRuZXdPYmouY3NzID09PSBvYmouY3NzICYmXG5cdFx0XHRcdG5ld09iai5tZWRpYSA9PT0gb2JqLm1lZGlhICYmXG5cdFx0XHRcdG5ld09iai5zb3VyY2VNYXAgPT09IG9iai5zb3VyY2VNYXBcblx0XHRcdCkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdHVwZGF0ZShvYmogPSBuZXdPYmopO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZW1vdmUoKTtcblx0XHR9XG5cdH07XG59XG5cbnZhciByZXBsYWNlVGV4dCA9IChmdW5jdGlvbiAoKSB7XG5cdHZhciB0ZXh0U3RvcmUgPSBbXTtcblxuXHRyZXR1cm4gZnVuY3Rpb24gKGluZGV4LCByZXBsYWNlbWVudCkge1xuXHRcdHRleHRTdG9yZVtpbmRleF0gPSByZXBsYWNlbWVudDtcblxuXHRcdHJldHVybiB0ZXh0U3RvcmUuZmlsdGVyKEJvb2xlYW4pLmpvaW4oJ1xcbicpO1xuXHR9O1xufSkoKTtcblxuZnVuY3Rpb24gYXBwbHlUb1NpbmdsZXRvblRhZyAoc3R5bGUsIGluZGV4LCByZW1vdmUsIG9iaikge1xuXHR2YXIgY3NzID0gcmVtb3ZlID8gXCJcIiA6IG9iai5jc3M7XG5cblx0aWYgKHN0eWxlLnN0eWxlU2hlZXQpIHtcblx0XHRzdHlsZS5zdHlsZVNoZWV0LmNzc1RleHQgPSByZXBsYWNlVGV4dChpbmRleCwgY3NzKTtcblx0fSBlbHNlIHtcblx0XHR2YXIgY3NzTm9kZSA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGNzcyk7XG5cdFx0dmFyIGNoaWxkTm9kZXMgPSBzdHlsZS5jaGlsZE5vZGVzO1xuXG5cdFx0aWYgKGNoaWxkTm9kZXNbaW5kZXhdKSBzdHlsZS5yZW1vdmVDaGlsZChjaGlsZE5vZGVzW2luZGV4XSk7XG5cblx0XHRpZiAoY2hpbGROb2Rlcy5sZW5ndGgpIHtcblx0XHRcdHN0eWxlLmluc2VydEJlZm9yZShjc3NOb2RlLCBjaGlsZE5vZGVzW2luZGV4XSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHN0eWxlLmFwcGVuZENoaWxkKGNzc05vZGUpO1xuXHRcdH1cblx0fVxufVxuXG5mdW5jdGlvbiBhcHBseVRvVGFnIChzdHlsZSwgb2JqKSB7XG5cdHZhciBjc3MgPSBvYmouY3NzO1xuXHR2YXIgbWVkaWEgPSBvYmoubWVkaWE7XG5cblx0aWYobWVkaWEpIHtcblx0XHRzdHlsZS5zZXRBdHRyaWJ1dGUoXCJtZWRpYVwiLCBtZWRpYSlcblx0fVxuXG5cdGlmKHN0eWxlLnN0eWxlU2hlZXQpIHtcblx0XHRzdHlsZS5zdHlsZVNoZWV0LmNzc1RleHQgPSBjc3M7XG5cdH0gZWxzZSB7XG5cdFx0d2hpbGUoc3R5bGUuZmlyc3RDaGlsZCkge1xuXHRcdFx0c3R5bGUucmVtb3ZlQ2hpbGQoc3R5bGUuZmlyc3RDaGlsZCk7XG5cdFx0fVxuXG5cdFx0c3R5bGUuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoY3NzKSk7XG5cdH1cbn1cblxuZnVuY3Rpb24gdXBkYXRlTGluayAobGluaywgb3B0aW9ucywgb2JqKSB7XG5cdHZhciBjc3MgPSBvYmouY3NzO1xuXHR2YXIgc291cmNlTWFwID0gb2JqLnNvdXJjZU1hcDtcblxuXHQvKlxuXHRcdElmIGNvbnZlcnRUb0Fic29sdXRlVXJscyBpc24ndCBkZWZpbmVkLCBidXQgc291cmNlbWFwcyBhcmUgZW5hYmxlZFxuXHRcdGFuZCB0aGVyZSBpcyBubyBwdWJsaWNQYXRoIGRlZmluZWQgdGhlbiBsZXRzIHR1cm4gY29udmVydFRvQWJzb2x1dGVVcmxzXG5cdFx0b24gYnkgZGVmYXVsdC4gIE90aGVyd2lzZSBkZWZhdWx0IHRvIHRoZSBjb252ZXJ0VG9BYnNvbHV0ZVVybHMgb3B0aW9uXG5cdFx0ZGlyZWN0bHlcblx0Ki9cblx0dmFyIGF1dG9GaXhVcmxzID0gb3B0aW9ucy5jb252ZXJ0VG9BYnNvbHV0ZVVybHMgPT09IHVuZGVmaW5lZCAmJiBzb3VyY2VNYXA7XG5cblx0aWYgKG9wdGlvbnMuY29udmVydFRvQWJzb2x1dGVVcmxzIHx8IGF1dG9GaXhVcmxzKSB7XG5cdFx0Y3NzID0gZml4VXJscyhjc3MpO1xuXHR9XG5cblx0aWYgKHNvdXJjZU1hcCkge1xuXHRcdC8vIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9hLzI2NjAzODc1XG5cdFx0Y3NzICs9IFwiXFxuLyojIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxcIiArIGJ0b2EodW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KEpTT04uc3RyaW5naWZ5KHNvdXJjZU1hcCkpKSkgKyBcIiAqL1wiO1xuXHR9XG5cblx0dmFyIGJsb2IgPSBuZXcgQmxvYihbY3NzXSwgeyB0eXBlOiBcInRleHQvY3NzXCIgfSk7XG5cblx0dmFyIG9sZFNyYyA9IGxpbmsuaHJlZjtcblxuXHRsaW5rLmhyZWYgPSBVUkwuY3JlYXRlT2JqZWN0VVJMKGJsb2IpO1xuXG5cdGlmKG9sZFNyYykgVVJMLnJldm9rZU9iamVjdFVSTChvbGRTcmMpO1xufVxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2xpYi9hZGRTdHlsZXMuanNcbi8vIG1vZHVsZSBpZCA9IDFcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0ICcuL2Nzcy9yZXNldC5jc3MnO1xyXG5pbXBvcnQgJy4vY3NzL2luZGV4LmNzcyc7XHJcbnJlcXVpcmUoJy4vanMvbWFpbi5qcycpO1xyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvaW5kZXguanMiLCIvLyBzdHlsZS1sb2FkZXI6IEFkZHMgc29tZSBjc3MgdG8gdGhlIERPTSBieSBhZGRpbmcgYSA8c3R5bGU+IHRhZ1xuXG4vLyBsb2FkIHRoZSBzdHlsZXNcbnZhciBjb250ZW50ID0gcmVxdWlyZShcIiEhLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanMhLi9yZXNldC5jc3NcIik7XG5pZih0eXBlb2YgY29udGVudCA9PT0gJ3N0cmluZycpIGNvbnRlbnQgPSBbW21vZHVsZS5pZCwgY29udGVudCwgJyddXTtcbi8vIFByZXBhcmUgY3NzVHJhbnNmb3JtYXRpb25cbnZhciB0cmFuc2Zvcm07XG5cbnZhciBvcHRpb25zID0ge31cbm9wdGlvbnMudHJhbnNmb3JtID0gdHJhbnNmb3JtXG4vLyBhZGQgdGhlIHN0eWxlcyB0byB0aGUgRE9NXG52YXIgdXBkYXRlID0gcmVxdWlyZShcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2xpYi9hZGRTdHlsZXMuanNcIikoY29udGVudCwgb3B0aW9ucyk7XG5pZihjb250ZW50LmxvY2FscykgbW9kdWxlLmV4cG9ydHMgPSBjb250ZW50LmxvY2Fscztcbi8vIEhvdCBNb2R1bGUgUmVwbGFjZW1lbnRcbmlmKG1vZHVsZS5ob3QpIHtcblx0Ly8gV2hlbiB0aGUgc3R5bGVzIGNoYW5nZSwgdXBkYXRlIHRoZSA8c3R5bGU+IHRhZ3Ncblx0aWYoIWNvbnRlbnQubG9jYWxzKSB7XG5cdFx0bW9kdWxlLmhvdC5hY2NlcHQoXCIhIS4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2luZGV4LmpzIS4vcmVzZXQuY3NzXCIsIGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIG5ld0NvbnRlbnQgPSByZXF1aXJlKFwiISEuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcyEuL3Jlc2V0LmNzc1wiKTtcblx0XHRcdGlmKHR5cGVvZiBuZXdDb250ZW50ID09PSAnc3RyaW5nJykgbmV3Q29udGVudCA9IFtbbW9kdWxlLmlkLCBuZXdDb250ZW50LCAnJ11dO1xuXHRcdFx0dXBkYXRlKG5ld0NvbnRlbnQpO1xuXHRcdH0pO1xuXHR9XG5cdC8vIFdoZW4gdGhlIG1vZHVsZSBpcyBkaXNwb3NlZCwgcmVtb3ZlIHRoZSA8c3R5bGU+IHRhZ3Ncblx0bW9kdWxlLmhvdC5kaXNwb3NlKGZ1bmN0aW9uKCkgeyB1cGRhdGUoKTsgfSk7XG59XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvY3NzL3Jlc2V0LmNzc1xuLy8gbW9kdWxlIGlkID0gM1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJleHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvbGliL2Nzcy1iYXNlLmpzXCIpKHVuZGVmaW5lZCk7XG4vLyBpbXBvcnRzXG5cblxuLy8gbW9kdWxlXG5leHBvcnRzLnB1c2goW21vZHVsZS5pZCwgXCIvKioqIFxcclxcbiAqKiogcmVzZXQgXFxyXFxuKioqL1xcclxcbmh0bWwsIGJvZHksIGRpdiwgc3BhbiwgYXBwbGV0LCBvYmplY3QsIGlmcmFtZSxcXHJcXG5oMSwgaDIsIGgzLCBoNCwgaDUsIGg2LCBwLCBibG9ja3F1b3RlLCBwcmUsXFxyXFxuYSwgYWJiciwgYWNyb255bSwgYWRkcmVzcywgYmlnLCBjaXRlLCBjb2RlLFxcclxcbmRlbCwgZGZuLCBlbSwgaW1nLCBpbnMsIGtiZCwgcSwgcywgc2FtcCxcXHJcXG5zbWFsbCwgc3RyaWtlLCBzdHJvbmcsIHN1Yiwgc3VwLCB0dCwgdmFyLFxcclxcbmIsIHUsIGksIGNlbnRlcixcXHJcXG5kbCwgZHQsIGRkLCBvbCwgdWwsIGxpLFxcclxcbmZpZWxkc2V0LCBmb3JtLCBsYWJlbCwgbGVnZW5kLFxcclxcbnRhYmxlLCBjYXB0aW9uLCB0Ym9keSwgdGZvb3QsIHRoZWFkLCB0ciwgdGgsIHRkLFxcclxcbmFydGljbGUsIGFzaWRlLCBjYW52YXMsIGRldGFpbHMsIGVtYmVkLCBcXHJcXG5maWd1cmUsIGZpZ2NhcHRpb24sIGZvb3RlciwgaGVhZGVyLCBoZ3JvdXAsIFxcclxcbm1lbnUsIG5hdiwgb3V0cHV0LCBydWJ5LCBzZWN0aW9uLCBzdW1tYXJ5LFxcclxcbnRpbWUsIG1hcmssIGF1ZGlvLCB2aWRlbyB7XFxyXFxuXFx0bWFyZ2luOiAwO1xcclxcblxcdHBhZGRpbmc6IDA7XFxyXFxuXFx0Ym9yZGVyOiAwO1xcclxcblxcdGZvbnQtc2l6ZTogMTAwJTtcXHJcXG5cXHRmb250LWZhbWlseTogJ21pY3Jvc29mdCB5YWhlaScsQXJpYWwsc2Fucy1zZXJpZjtcXHJcXG5cXHQvKmZvbnQ6IGluaGVyaXQ7Ki9cXHJcXG5cXHR2ZXJ0aWNhbC1hbGlnbjogYmFzZWxpbmU7XFxyXFxufVxcclxcbi8qIEhUTUw1IGRpc3BsYXktcm9sZSByZXNldCBmb3Igb2xkZXIgYnJvd3NlcnMgKi9cXHJcXG5hcnRpY2xlLCBhc2lkZSwgZGV0YWlscywgZmlnY2FwdGlvbiwgZmlndXJlLCBcXHJcXG5mb290ZXIsIGhlYWRlciwgaGdyb3VwLCBtZW51LCBuYXYsIHNlY3Rpb24ge1xcclxcblxcdGRpc3BsYXk6IGJsb2NrO1xcclxcbn1cXHJcXG5ib2R5IHtcXHJcXG5cXHRsaW5lLWhlaWdodDogMTtcXHJcXG59XFxyXFxub2wsIHVsIHtcXHJcXG5cXHRsaXN0LXN0eWxlOiBub25lO1xcclxcbn1cXHJcXG5ibG9ja3F1b3RlLCBxIHtcXHJcXG5cXHRxdW90ZXM6IG5vbmU7XFxyXFxufVxcclxcbmJsb2NrcXVvdGU6YmVmb3JlLCBibG9ja3F1b3RlOmFmdGVyLFxcclxcbnE6YmVmb3JlLCBxOmFmdGVyIHtcXHJcXG5cXHRjb250ZW50OiAnJztcXHJcXG5cXHRjb250ZW50OiBub25lO1xcclxcbn1cXHJcXG50YWJsZSB7XFxyXFxuXFx0Ym9yZGVyLWNvbGxhcHNlOiBjb2xsYXBzZTtcXHJcXG5cXHRib3JkZXItc3BhY2luZzogMDtcXHJcXG59XCIsIFwiXCJdKTtcblxuLy8gZXhwb3J0c1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlciEuL3NyYy9jc3MvcmVzZXQuY3NzXG4vLyBtb2R1bGUgaWQgPSA0XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIlxuLyoqXG4gKiBXaGVuIHNvdXJjZSBtYXBzIGFyZSBlbmFibGVkLCBgc3R5bGUtbG9hZGVyYCB1c2VzIGEgbGluayBlbGVtZW50IHdpdGggYSBkYXRhLXVyaSB0b1xuICogZW1iZWQgdGhlIGNzcyBvbiB0aGUgcGFnZS4gVGhpcyBicmVha3MgYWxsIHJlbGF0aXZlIHVybHMgYmVjYXVzZSBub3cgdGhleSBhcmUgcmVsYXRpdmUgdG8gYVxuICogYnVuZGxlIGluc3RlYWQgb2YgdGhlIGN1cnJlbnQgcGFnZS5cbiAqXG4gKiBPbmUgc29sdXRpb24gaXMgdG8gb25seSB1c2UgZnVsbCB1cmxzLCBidXQgdGhhdCBtYXkgYmUgaW1wb3NzaWJsZS5cbiAqXG4gKiBJbnN0ZWFkLCB0aGlzIGZ1bmN0aW9uIFwiZml4ZXNcIiB0aGUgcmVsYXRpdmUgdXJscyB0byBiZSBhYnNvbHV0ZSBhY2NvcmRpbmcgdG8gdGhlIGN1cnJlbnQgcGFnZSBsb2NhdGlvbi5cbiAqXG4gKiBBIHJ1ZGltZW50YXJ5IHRlc3Qgc3VpdGUgaXMgbG9jYXRlZCBhdCBgdGVzdC9maXhVcmxzLmpzYCBhbmQgY2FuIGJlIHJ1biB2aWEgdGhlIGBucG0gdGVzdGAgY29tbWFuZC5cbiAqXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoY3NzKSB7XG4gIC8vIGdldCBjdXJyZW50IGxvY2F0aW9uXG4gIHZhciBsb2NhdGlvbiA9IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgJiYgd2luZG93LmxvY2F0aW9uO1xuXG4gIGlmICghbG9jYXRpb24pIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJmaXhVcmxzIHJlcXVpcmVzIHdpbmRvdy5sb2NhdGlvblwiKTtcbiAgfVxuXG5cdC8vIGJsYW5rIG9yIG51bGw/XG5cdGlmICghY3NzIHx8IHR5cGVvZiBjc3MgIT09IFwic3RyaW5nXCIpIHtcblx0ICByZXR1cm4gY3NzO1xuICB9XG5cbiAgdmFyIGJhc2VVcmwgPSBsb2NhdGlvbi5wcm90b2NvbCArIFwiLy9cIiArIGxvY2F0aW9uLmhvc3Q7XG4gIHZhciBjdXJyZW50RGlyID0gYmFzZVVybCArIGxvY2F0aW9uLnBhdGhuYW1lLnJlcGxhY2UoL1xcL1teXFwvXSokLywgXCIvXCIpO1xuXG5cdC8vIGNvbnZlcnQgZWFjaCB1cmwoLi4uKVxuXHQvKlxuXHRUaGlzIHJlZ3VsYXIgZXhwcmVzc2lvbiBpcyBqdXN0IGEgd2F5IHRvIHJlY3Vyc2l2ZWx5IG1hdGNoIGJyYWNrZXRzIHdpdGhpblxuXHRhIHN0cmluZy5cblxuXHQgL3VybFxccypcXCggID0gTWF0Y2ggb24gdGhlIHdvcmQgXCJ1cmxcIiB3aXRoIGFueSB3aGl0ZXNwYWNlIGFmdGVyIGl0IGFuZCB0aGVuIGEgcGFyZW5zXG5cdCAgICggID0gU3RhcnQgYSBjYXB0dXJpbmcgZ3JvdXBcblx0ICAgICAoPzogID0gU3RhcnQgYSBub24tY2FwdHVyaW5nIGdyb3VwXG5cdCAgICAgICAgIFteKShdICA9IE1hdGNoIGFueXRoaW5nIHRoYXQgaXNuJ3QgYSBwYXJlbnRoZXNlc1xuXHQgICAgICAgICB8ICA9IE9SXG5cdCAgICAgICAgIFxcKCAgPSBNYXRjaCBhIHN0YXJ0IHBhcmVudGhlc2VzXG5cdCAgICAgICAgICAgICAoPzogID0gU3RhcnQgYW5vdGhlciBub24tY2FwdHVyaW5nIGdyb3Vwc1xuXHQgICAgICAgICAgICAgICAgIFteKShdKyAgPSBNYXRjaCBhbnl0aGluZyB0aGF0IGlzbid0IGEgcGFyZW50aGVzZXNcblx0ICAgICAgICAgICAgICAgICB8ICA9IE9SXG5cdCAgICAgICAgICAgICAgICAgXFwoICA9IE1hdGNoIGEgc3RhcnQgcGFyZW50aGVzZXNcblx0ICAgICAgICAgICAgICAgICAgICAgW14pKF0qICA9IE1hdGNoIGFueXRoaW5nIHRoYXQgaXNuJ3QgYSBwYXJlbnRoZXNlc1xuXHQgICAgICAgICAgICAgICAgIFxcKSAgPSBNYXRjaCBhIGVuZCBwYXJlbnRoZXNlc1xuXHQgICAgICAgICAgICAgKSAgPSBFbmQgR3JvdXBcbiAgICAgICAgICAgICAgKlxcKSA9IE1hdGNoIGFueXRoaW5nIGFuZCB0aGVuIGEgY2xvc2UgcGFyZW5zXG4gICAgICAgICAgKSAgPSBDbG9zZSBub24tY2FwdHVyaW5nIGdyb3VwXG4gICAgICAgICAgKiAgPSBNYXRjaCBhbnl0aGluZ1xuICAgICAgICkgID0gQ2xvc2UgY2FwdHVyaW5nIGdyb3VwXG5cdCBcXCkgID0gTWF0Y2ggYSBjbG9zZSBwYXJlbnNcblxuXHQgL2dpICA9IEdldCBhbGwgbWF0Y2hlcywgbm90IHRoZSBmaXJzdC4gIEJlIGNhc2UgaW5zZW5zaXRpdmUuXG5cdCAqL1xuXHR2YXIgZml4ZWRDc3MgPSBjc3MucmVwbGFjZSgvdXJsXFxzKlxcKCgoPzpbXikoXXxcXCgoPzpbXikoXSt8XFwoW14pKF0qXFwpKSpcXCkpKilcXCkvZ2ksIGZ1bmN0aW9uKGZ1bGxNYXRjaCwgb3JpZ1VybCkge1xuXHRcdC8vIHN0cmlwIHF1b3RlcyAoaWYgdGhleSBleGlzdClcblx0XHR2YXIgdW5xdW90ZWRPcmlnVXJsID0gb3JpZ1VybFxuXHRcdFx0LnRyaW0oKVxuXHRcdFx0LnJlcGxhY2UoL15cIiguKilcIiQvLCBmdW5jdGlvbihvLCAkMSl7IHJldHVybiAkMTsgfSlcblx0XHRcdC5yZXBsYWNlKC9eJyguKiknJC8sIGZ1bmN0aW9uKG8sICQxKXsgcmV0dXJuICQxOyB9KTtcblxuXHRcdC8vIGFscmVhZHkgYSBmdWxsIHVybD8gbm8gY2hhbmdlXG5cdFx0aWYgKC9eKCN8ZGF0YTp8aHR0cDpcXC9cXC98aHR0cHM6XFwvXFwvfGZpbGU6XFwvXFwvXFwvKS9pLnRlc3QodW5xdW90ZWRPcmlnVXJsKSkge1xuXHRcdCAgcmV0dXJuIGZ1bGxNYXRjaDtcblx0XHR9XG5cblx0XHQvLyBjb252ZXJ0IHRoZSB1cmwgdG8gYSBmdWxsIHVybFxuXHRcdHZhciBuZXdVcmw7XG5cblx0XHRpZiAodW5xdW90ZWRPcmlnVXJsLmluZGV4T2YoXCIvL1wiKSA9PT0gMCkge1xuXHRcdCAgXHQvL1RPRE86IHNob3VsZCB3ZSBhZGQgcHJvdG9jb2w/XG5cdFx0XHRuZXdVcmwgPSB1bnF1b3RlZE9yaWdVcmw7XG5cdFx0fSBlbHNlIGlmICh1bnF1b3RlZE9yaWdVcmwuaW5kZXhPZihcIi9cIikgPT09IDApIHtcblx0XHRcdC8vIHBhdGggc2hvdWxkIGJlIHJlbGF0aXZlIHRvIHRoZSBiYXNlIHVybFxuXHRcdFx0bmV3VXJsID0gYmFzZVVybCArIHVucXVvdGVkT3JpZ1VybDsgLy8gYWxyZWFkeSBzdGFydHMgd2l0aCAnLydcblx0XHR9IGVsc2Uge1xuXHRcdFx0Ly8gcGF0aCBzaG91bGQgYmUgcmVsYXRpdmUgdG8gY3VycmVudCBkaXJlY3Rvcnlcblx0XHRcdG5ld1VybCA9IGN1cnJlbnREaXIgKyB1bnF1b3RlZE9yaWdVcmwucmVwbGFjZSgvXlxcLlxcLy8sIFwiXCIpOyAvLyBTdHJpcCBsZWFkaW5nICcuLydcblx0XHR9XG5cblx0XHQvLyBzZW5kIGJhY2sgdGhlIGZpeGVkIHVybCguLi4pXG5cdFx0cmV0dXJuIFwidXJsKFwiICsgSlNPTi5zdHJpbmdpZnkobmV3VXJsKSArIFwiKVwiO1xuXHR9KTtcblxuXHQvLyBzZW5kIGJhY2sgdGhlIGZpeGVkIGNzc1xuXHRyZXR1cm4gZml4ZWRDc3M7XG59O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2xpYi91cmxzLmpzXG4vLyBtb2R1bGUgaWQgPSA1XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8vIHN0eWxlLWxvYWRlcjogQWRkcyBzb21lIGNzcyB0byB0aGUgRE9NIGJ5IGFkZGluZyBhIDxzdHlsZT4gdGFnXG5cbi8vIGxvYWQgdGhlIHN0eWxlc1xudmFyIGNvbnRlbnQgPSByZXF1aXJlKFwiISEuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcyEuL2luZGV4LmNzc1wiKTtcbmlmKHR5cGVvZiBjb250ZW50ID09PSAnc3RyaW5nJykgY29udGVudCA9IFtbbW9kdWxlLmlkLCBjb250ZW50LCAnJ11dO1xuLy8gUHJlcGFyZSBjc3NUcmFuc2Zvcm1hdGlvblxudmFyIHRyYW5zZm9ybTtcblxudmFyIG9wdGlvbnMgPSB7fVxub3B0aW9ucy50cmFuc2Zvcm0gPSB0cmFuc2Zvcm1cbi8vIGFkZCB0aGUgc3R5bGVzIHRvIHRoZSBET01cbnZhciB1cGRhdGUgPSByZXF1aXJlKFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvbGliL2FkZFN0eWxlcy5qc1wiKShjb250ZW50LCBvcHRpb25zKTtcbmlmKGNvbnRlbnQubG9jYWxzKSBtb2R1bGUuZXhwb3J0cyA9IGNvbnRlbnQubG9jYWxzO1xuLy8gSG90IE1vZHVsZSBSZXBsYWNlbWVudFxuaWYobW9kdWxlLmhvdCkge1xuXHQvLyBXaGVuIHRoZSBzdHlsZXMgY2hhbmdlLCB1cGRhdGUgdGhlIDxzdHlsZT4gdGFnc1xuXHRpZighY29udGVudC5sb2NhbHMpIHtcblx0XHRtb2R1bGUuaG90LmFjY2VwdChcIiEhLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanMhLi9pbmRleC5jc3NcIiwgZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgbmV3Q29udGVudCA9IHJlcXVpcmUoXCIhIS4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2luZGV4LmpzIS4vaW5kZXguY3NzXCIpO1xuXHRcdFx0aWYodHlwZW9mIG5ld0NvbnRlbnQgPT09ICdzdHJpbmcnKSBuZXdDb250ZW50ID0gW1ttb2R1bGUuaWQsIG5ld0NvbnRlbnQsICcnXV07XG5cdFx0XHR1cGRhdGUobmV3Q29udGVudCk7XG5cdFx0fSk7XG5cdH1cblx0Ly8gV2hlbiB0aGUgbW9kdWxlIGlzIGRpc3Bvc2VkLCByZW1vdmUgdGhlIDxzdHlsZT4gdGFnc1xuXHRtb2R1bGUuaG90LmRpc3Bvc2UoZnVuY3Rpb24oKSB7IHVwZGF0ZSgpOyB9KTtcbn1cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9jc3MvaW5kZXguY3NzXG4vLyBtb2R1bGUgaWQgPSA2XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCIuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9saWIvY3NzLWJhc2UuanNcIikodW5kZWZpbmVkKTtcbi8vIGltcG9ydHNcblxuXG4vLyBtb2R1bGVcbmV4cG9ydHMucHVzaChbbW9kdWxlLmlkLCBcIlxcclxcbmh0bWwgYm9keXtmb250LWZhbWlseTogJ21pY3Jvc29mdCB5YWhlaScsQXJpYWwsc2Fucy1zZXJpZjt9XFxyXFxuLmxheW91dC1ib2R5e2Rpc3BsYXk6ZmxleDt9XFxyXFxuLmxheW91dC1ib2R5IC53cC1kcmFne2ZsZXg6MjtoZWlnaHQ6MTAwdmg7Ym9yZGVyLXJpZ2h0OjFweCBzb2xpZCAjQ0RDRENEO2Rpc3BsYXk6ZmxleDtqdXN0aWZ5LWNvbnRlbnQ6Y2VudGVyO2FsaWduLWl0ZW1zOmNlbnRlcjtib3gtc2l6aW5nOmJvcmRlci1ib3g7cGFkZGluZzoyNHB4O31cXHJcXG4ubGF5b3V0LWJvZHkgLndwLW1lbnV7ZmxleDoxO2hlaWdodDoxMDB2aDt9XFxyXFxuXFxyXFxuLndwLWRyYWcgLmRyYWctbWFpbnt3aWR0aDoxMDAlO2hlaWdodDo5MHZoO2NvbG9yOiNDRENEQ0Q7Ym9yZGVyOjNweCBkYXNoZWQ7Zm9udC1zaXplOjI0cHg7dGV4dC1hbGlnbjpjZW50ZXI7bGluZS1oZWlnaHQ6OTB2aDt9XFxyXFxuLndwLWRyYWcgLmRyYWctbWFpbi5kcm9wLWhvdmVye2NvbG9yOiMwMDAwMDA7fVxcclxcblxcclxcbi5sYXlvdXQtYm9keSAud3AtbWVudSAubWVudS1vcHRpb25ze3BhZGRpbmc6MjBweDtmb250LXNpemU6MTRweDt9XFxyXFxuLm1lbnUtb3B0aW9ucyB1bCBsaXttYXJnaW4tYm90dG9tOjEwcHg7fVxcclxcbi5tZW51LW9wdGlvbnMgaW5wdXRbdHlwZT1jaGVja2JveF17dmVydGljYWwtYWxpZ246LTJweDt9XCIsIFwiXCJdKTtcblxuLy8gZXhwb3J0c1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlciEuL3NyYy9jc3MvaW5kZXguY3NzXG4vLyBtb2R1bGUgaWQgPSA3XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmltcG9ydCBkcmFnRHJvcCBmcm9tICcuL2hwLWRyYWcnO1xyXG5pbXBvcnQgc3ByaXRlQ3NzIGZyb20gJy4vaHAtY3NzLXNwcml0ZSc7XHJcbmltcG9ydCB7IGhhbmRsZUNzcywgaGFuZGxlSHRtbCwgaGFuZGxlSW1hZ2UgfSBmcm9tICcuL2hwLWhhbmRsZWZpbGUnO1xyXG4vLyBjb25zdCBmcyA9IGdsb2JhbC5yZXF1aXJlKCdmcycpO1xyXG4vLyBjb25zdCBwb3N0Y3NzID0gZ2xvYmFsLnJlcXVpcmUoJ3Bvc3Rjc3MnKTtcclxuY29uc3Qgc3ByaXRlcyA9IGdsb2JhbC5yZXF1aXJlKCdwb3N0Y3NzLXNwcml0ZXMnKTtcclxuY29uc3QgcGF0aCA9IGdsb2JhbC5yZXF1aXJlKCdwYXRoJyk7XHJcbmNvbnN0IGF1dG9wcmVmaXhlciA9IGdsb2JhbC5yZXF1aXJlKCdhdXRvcHJlZml4ZXInKTtcclxuY29uc3QgY3NzbmFubyA9IGdsb2JhbC5yZXF1aXJlKCdjc3NuYW5vJyk7XHJcblxyXG4oZnVuY3Rpb24oKXtcclxuXHJcblx0ZHJhZ0Ryb3AoZnVuY3Rpb24oaW5mbyl7XHJcblxyXG5cdFx0bGV0IGlzUGMgPSBmYWxzZSxcclxuXHRcdFx0cGx1Z2lucyA9IFsgYXV0b3ByZWZpeGVyLCBjc3NuYW5vIF0sXHJcblx0XHRcdGNoZWNrYm94ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnaW5wdXRbdHlwZT1jaGVja2JveF0nKTtcclxuXHJcblx0XHRmb3IobGV0IGkgPSAwOyBpIDwgY2hlY2tib3gubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0aWYoY2hlY2tib3hbaV0uY2hlY2tlZCkge1xyXG5cdFx0XHRcdGxldCBpbmRleDtcclxuXHRcdFx0XHRzd2l0Y2goY2hlY2tib3hbaV0udmFsdWUpIHtcclxuXHRcdFx0XHRjYXNlICdwYy1tb2R1bGUnOlxyXG5cdFx0XHRcdFx0aXNQYyA9IHRydWU7XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRjYXNlICduby1waWNuYW5vJzpcclxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKCduby1waWNuYW5vJyk7XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRjYXNlICduby1hdXRvcHJlZml4ZXInOlxyXG5cdFx0XHRcdFx0aW5kZXggPSBwbHVnaW5zLmluZGV4T2YoYXV0b3ByZWZpeGVyKTtcclxuXHRcdFx0XHRcdGlmKGluZGV4KXtcclxuXHRcdFx0XHRcdFx0cGx1Z2lucy5zcGxpY2UoaW5kZXgsIDEpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0Y2FzZSAnbm8tY3NzbmFubyc6XHJcblx0XHRcdFx0XHRpbmRleCA9IHBsdWdpbnMuaW5kZXhPZihjc3NuYW5vKTtcclxuXHRcdFx0XHRcdGlmKGluZGV4KXtcclxuXHRcdFx0XHRcdFx0cGx1Z2lucy5zcGxpY2UoaW5kZXgsIDEpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0ZGVmYXVsdDpcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0Y29uc29sZS5sb2coaW5mbyk7XHJcblx0XHRsZXQgcGF0aE9iaiA9IHBhdGgucGFyc2UoaW5mb1swXS5wYXRoKTtcclxuXHJcblx0XHRpZigvY3NzLy50ZXN0KHBhdGhPYmouZXh0KSkge1x0Ly8g5Lyg5YWlIGNzcyDmlofku7ZcclxuXHJcblx0XHRcdGxldCBiYXNlUGF0aCA9IHBhdGhPYmouZGlyLnNwbGl0KHBhdGguc2VwKS5zbGljZSgwLC0xKS5qb2luKHBhdGguc2VwKTtcclxuXHRcdFx0bGV0IG9wdHMgPSBzcHJpdGVDc3MoYmFzZVBhdGgsIGlzUGMpO1xyXG5cdFx0XHRwbHVnaW5zLnB1c2goc3ByaXRlcyhvcHRzKSk7XHJcblxyXG5cdFx0XHRoYW5kbGVDc3MoaW5mb1swXS5wYXRoLCBwbHVnaW5zKTtcclxuXHJcblx0XHR9ZWxzZSBpZigvaHRtbC8udGVzdChwYXRoT2JqLmV4dCkpIHtcdC8vIOS8oOWFpSBodG1sIOaWh+S7tlxyXG5cclxuXHRcdFx0aGFuZGxlSHRtbChpbmZvWzBdLnBhdGgpO1xyXG5cclxuXHRcdH1lbHNlIHtcclxuXHJcblx0XHRcdGhhbmRsZUltYWdlKGluZm8pO1xyXG5cclxuXHRcdH1cclxuXHRcdFxyXG5cdH0pO1xyXG5cclxufSkoKTtcclxuXHJcbi8qKlxyXG4qIOWIm+W7uuacrOWcsOaWh+S7tuWkuVxyXG4qXHJcbiogQHBhcmFtIHtzdHJpbmd9IGJhc2VQYXRoXHJcbiovXHJcbi8vIGZ1bmN0aW9uIG1raWRyTG9jYWwoYmFzZVBhdGgpIHtcclxuLy8gXHRmcy5leGlzdHMocGF0aC5qb2luKGJhc2VQYXRoLCAnL2Rpc3QvJyksIGZ1bmN0aW9uKGRhdGEpIHtcclxuLy8gXHRcdGlmKCFkYXRhKSB7XHJcbi8vIFx0XHRcdGZzLm1rZGlyKHBhdGguam9pbihiYXNlUGF0aCwgJy9kaXN0LycpLCBmdW5jdGlvbihlcnIpe1xyXG4vLyBcdFx0XHRcdGlmKCFlcnIpIHtcclxuLy8gXHRcdFx0XHRcdGZzLm1rZGlyKHBhdGguam9pbihiYXNlUGF0aCwgJy9kaXN0L2ltZy8nKSwgZnVuY3Rpb24oZXJyKXtcclxuLy8gXHRcdFx0XHRcdFx0aWYoZXJyKSBjb25zb2xlLmxvZyhlcnIpO1xyXG4vLyBcdFx0XHRcdFx0fSk7XHJcbi8vIFx0XHRcdFx0XHRmcy5ta2RpcihwYXRoLmpvaW4oYmFzZVBhdGgsICcvZGlzdC9jc3MvJyksIGZ1bmN0aW9uKGVycil7XHJcbi8vIFx0XHRcdFx0XHRcdGlmKGVycikgY29uc29sZS5sb2coZXJyKTtcclxuLy8gXHRcdFx0XHRcdH0pO1xyXG4vLyBcdFx0XHRcdH1cclxuLy8gXHRcdFx0fSk7XHJcbi8vIFx0XHR9XHJcbi8vIFx0fSk7XHJcbi8vIH1cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvanMvbWFpbi5qcyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbi8vIGNvbnN0IHBhdGggPSBnbG9iYWwucmVxdWlyZSgncGF0aCcpO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oY2IpIHtcclxuXHJcblx0Ly8g5Y+W5raI6buY6K6k6KGM5Li6XHJcblx0ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignZHJvcCcsIGZ1bmN0aW9uKGUpe1xyXG5cdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdH0sIGZhbHNlKTtcclxuXHRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdkcmFnTGVhdmUnLCBmdW5jdGlvbihlKXtcclxuXHRcdGUucHJldmVudERlZmF1bHQoKTtcclxuXHR9LCBmYWxzZSk7XHJcblx0ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignZHJhZ2VudGVyJywgZnVuY3Rpb24oZSl7XHJcblx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0fSwgZmFsc2UpO1xyXG5cdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2RyYWdvdmVyJywgZnVuY3Rpb24oZSl7XHJcblx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0fSwgZmFsc2UpO1xyXG5cclxuXHRsZXQgZHJvcFpvbmUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZHJhZy1tYWluJyk7XHJcblxyXG5cdGRyb3Bab25lLmFkZEV2ZW50TGlzdGVuZXIoJ2RyYWdvdmVyJywgZnVuY3Rpb24oZSl7XHJcblx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHR0aGlzLmNsYXNzTGlzdC5hZGQoJ2Ryb3AtaG92ZXInKTtcclxuXHR9LCBmYWxzZSk7XHJcblxyXG5cdGRyb3Bab25lLmFkZEV2ZW50TGlzdGVuZXIoJ2RyYWdsZWF2ZScsIGZ1bmN0aW9uKGUpe1xyXG5cdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0dGhpcy5jbGFzc0xpc3QucmVtb3ZlKCdkcm9wLWhvdmVyJyk7XHJcblx0fSwgZmFsc2UpO1xyXG5cclxuXHRkcm9wWm9uZS5hZGRFdmVudExpc3RlbmVyKCdkcm9wJywgZnVuY3Rpb24oZSl7XHJcblx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHR0aGlzLmNsYXNzTGlzdC5yZW1vdmUoJ2Ryb3AtaG92ZXInKTtcclxuXHRcdGxldCBmaWxlSW5mbyA9IGUuZGF0YVRyYW5zZmVyLmZpbGVzO1xyXG5cdFx0Y2IoZmlsZUluZm8pO1xyXG5cdH0sIGZhbHNlKTtcclxuXHJcbn1cclxuXHJcbi8qKlxyXG4qIOWkhOeQhuaWh+S7tuS/oeaBr1xyXG4qXHJcbiogQHBhcmFtIHtPYmplY3R9IGZpbGVJbmZvXHJcbiovXHJcbi8vIGZ1bmN0aW9uIGhhbmRsZUZpbGUoZmlsZUluZm8sIGNiKSB7XHJcbi8vIFx0Y2IoKTtcclxuLy8gfVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9qcy9ocC1kcmFnLmpzIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuY29uc3QgcG9zdGNzcyA9IGdsb2JhbC5yZXF1aXJlKCdwb3N0Y3NzJyk7XHJcbmNvbnN0IHBhdGggPSBnbG9iYWwucmVxdWlyZSgncGF0aCcpO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oYmFzZVBhdGgsIGlzUGMpIHtcclxuXHJcblx0bGV0IG9wdHMgPSB7XHJcblx0XHRzdHlsZXNoZWV0UGF0aDogcGF0aC5qb2luKGJhc2VQYXRoLCAnL2Rpc3QvY3NzLycpLFxyXG5cdFx0c3ByaXRlUGF0aDogJy4vZGlzdC9pbWcnLFxyXG5cdFx0YmFzZVBhdGg6IGJhc2VQYXRoLFxyXG5cdFx0c3ByaXRlc21pdGg6IHtcclxuXHRcdFx0cGFkZGluZzogMCxcclxuXHRcdFx0Ly8gYWxnb3JpdGhtOiAndG9wLWRvd24nXHJcblx0XHR9LFxyXG5cdFx0ZmlsdGVyQnk6IGZ1bmN0aW9uKGltYWdlKSB7XHJcblx0XHRcdC8vIGNvbnNvbGUubG9nKGltYWdlKTtcclxuXHRcdFx0aWYoIX5pbWFnZS51cmwuaW5kZXhPZignL3NsaWNlLycpKSB7XHJcblx0XHRcdFx0cmV0dXJuIFByb21pc2UucmVqZWN0KCk7XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xyXG5cdFx0fSxcclxuXHRcdGdyb3VwQnk6IGZ1bmN0aW9uKGltYWdlKSB7XHJcblx0XHRcdGxldCBuYW1lID0gL1xcL3NsaWNlXFwvKFswLTkuQS1aYS16XSspXFwvLy5leGVjKGltYWdlLnVybCk7XHJcblx0XHRcdGlmKCFuYW1lKXtcclxuXHRcdFx0XHRyZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKCdOb3QgYSBzaGFwZSBpbWFnZScpKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gUHJvbWlzZS5yZXNvbHZlKG5hbWVbMV0pO1xyXG5cdFx0fSxcclxuXHRcdGhvb2tzOiB7XHJcblx0XHRcdG9uVXBkYXRlUnVsZTogZnVuY3Rpb24ocnVsZSwgdG9rZW4sIGltYWdlKSB7XHJcblx0XHRcdFx0Wyd3aWR0aCcsICdoZWlnaHQnXS5mb3JFYWNoKGZ1bmN0aW9uKHByb3Ape1xyXG5cdFx0XHRcdFx0bGV0IHZhbHVlID0gaW1hZ2UuY29vcmRzW3Byb3BdO1xyXG5cdFx0XHRcdFx0aWYoaW1hZ2UucmV0aW5hKSB7XHJcblx0XHRcdFx0XHRcdHZhbHVlIC89IGltYWdlLnJhdGlvO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0cnVsZS5pbnNlcnRBZnRlcihydWxlLmxhc3QsIHBvc3Rjc3MuZGVjbCh7XHJcblx0XHRcdFx0XHRcdHByb3A6IHByb3AsXHJcblx0XHRcdFx0XHRcdHZhbHVlOiB2YWx1ZSArICdweCdcclxuXHRcdFx0XHRcdH0pKTtcclxuXHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdFx0bGV0IGJhY2tncm91bmRTaXplLCBiYWNrZ3JvdW5kUG9zaXRpb247XHJcblxyXG5cdFx0XHRcdGlmKCFpc1BjKSB7XHJcblxyXG5cdFx0XHRcdFx0bGV0IGJhY2tncm91bmRTaXplWCA9IChpbWFnZS5zcHJpdGVXaWR0aCAvIGltYWdlLmNvb3Jkcy53aWR0aCkgKiAxMDAsXHJcblx0XHRcdFx0XHRcdGJhY2tncm91bmRTaXplWSA9IChpbWFnZS5zcHJpdGVIZWlnaHQgLyBpbWFnZS5jb29yZHMuaGVpZ2h0KSAqIDEwMCxcclxuXHRcdFx0XHRcdFx0YmFja2dyb3VuZFBvc2l0aW9uWCA9IChpbWFnZS5jb29yZHMueCAvIChpbWFnZS5zcHJpdGVXaWR0aCAtIGltYWdlLmNvb3Jkcy53aWR0aCkpICogMTAwLFxyXG5cdFx0XHRcdFx0XHRiYWNrZ3JvdW5kUG9zaXRpb25ZID0gKGltYWdlLmNvb3Jkcy55IC8gKGltYWdlLnNwcml0ZUhlaWdodCAtIGltYWdlLmNvb3Jkcy5oZWlnaHQpKSAqIDEwMDtcclxuXHJcblx0XHRcdFx0XHRiYWNrZ3JvdW5kU2l6ZVggPSBpc05hTihiYWNrZ3JvdW5kU2l6ZVgpID8gMCA6IGJhY2tncm91bmRTaXplWDtcclxuXHRcdFx0XHRcdGJhY2tncm91bmRTaXplWSA9IGlzTmFOKGJhY2tncm91bmRTaXplWSkgPyAwIDogYmFja2dyb3VuZFNpemVZO1xyXG5cdFx0XHRcdFx0YmFja2dyb3VuZFBvc2l0aW9uWCA9IGlzTmFOKGJhY2tncm91bmRQb3NpdGlvblgpID8gMCA6IGJhY2tncm91bmRQb3NpdGlvblg7XHJcblx0XHRcdFx0XHRiYWNrZ3JvdW5kUG9zaXRpb25ZID0gaXNOYU4oYmFja2dyb3VuZFBvc2l0aW9uWSkgPyAwIDogYmFja2dyb3VuZFBvc2l0aW9uWTtcclxuXHJcblx0XHRcdFx0XHRiYWNrZ3JvdW5kU2l6ZSA9IHBvc3Rjc3MuZGVjbCh7XHJcblx0XHRcdFx0XHRcdHByb3A6ICdiYWNrZ3JvdW5kLXNpemUnLFxyXG5cdFx0XHRcdFx0XHR2YWx1ZTogYmFja2dyb3VuZFNpemVYICsgJyUgJyArIGJhY2tncm91bmRTaXplWSArICclJ1xyXG5cdFx0XHRcdFx0fSk7XHJcblxyXG5cdFx0XHRcdFx0YmFja2dyb3VuZFBvc2l0aW9uID0gcG9zdGNzcy5kZWNsKHtcclxuXHRcdFx0XHRcdFx0cHJvcDogJ2JhY2tncm91bmQtcG9zaXRpb24nLFxyXG5cdFx0XHRcdFx0XHR2YWx1ZTogYmFja2dyb3VuZFBvc2l0aW9uWCArICclICcgKyBiYWNrZ3JvdW5kUG9zaXRpb25ZICsgJyUnXHJcblx0XHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdFx0fWVsc2Uge1xyXG5cclxuXHRcdFx0XHRcdGxldCBiYWNrZ3JvdW5kUG9zaXRpb25YID0gLWltYWdlLmNvb3Jkcy54LFxyXG5cdFx0XHRcdFx0XHRiYWNrZ3JvdW5kUG9zaXRpb25ZID0gLWltYWdlLmNvb3Jkcy55O1xyXG5cclxuXHRcdFx0XHRcdGJhY2tncm91bmRTaXplID0gcG9zdGNzcy5kZWNsKHtcclxuXHRcdFx0XHRcdFx0cHJvcDogJ2JhY2tncm91bmQtc2l6ZScsXHJcblx0XHRcdFx0XHRcdHZhbHVlOiAnYXV0bydcclxuXHRcdFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0XHRcdGJhY2tncm91bmRQb3NpdGlvbiA9IHBvc3Rjc3MuZGVjbCh7XHJcblx0XHRcdFx0XHRcdHByb3A6ICdiYWNrZ3JvdW5kLXBvc2l0aW9uJyxcclxuXHRcdFx0XHRcdFx0dmFsdWU6IGJhY2tncm91bmRQb3NpdGlvblggKyAncHggJyArIGJhY2tncm91bmRQb3NpdGlvblkgKyAncHgnXHJcblx0XHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRsZXQgYmFja2dyb3VuZEltYWdlID0gcG9zdGNzcy5kZWNsKHtcclxuXHRcdFx0XHRcdHByb3A6ICdiYWNrZ3JvdW5kLWltYWdlJyxcclxuXHRcdFx0XHRcdHZhbHVlOiAndXJsKCcgKyBpbWFnZS5zcHJpdGVVcmwgKyAnKSdcclxuXHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdFx0bGV0IGJhY2tncm91bmRSZXBlYXQgPSBwb3N0Y3NzLmRlY2woe1xyXG5cdFx0XHRcdFx0cHJvcDogJ2JhY2tncm91bmQtcmVwZWF0JyxcclxuXHRcdFx0XHRcdHZhbHVlOiAnbm8tcmVwZWF0J1xyXG5cdFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0XHRydWxlLmluc2VydEFmdGVyKHRva2VuLCBiYWNrZ3JvdW5kSW1hZ2UpO1xyXG5cdFx0XHRcdHJ1bGUuaW5zZXJ0QWZ0ZXIoYmFja2dyb3VuZEltYWdlLCBiYWNrZ3JvdW5kUG9zaXRpb24pO1xyXG5cdFx0XHRcdHJ1bGUuaW5zZXJ0QWZ0ZXIoYmFja2dyb3VuZFBvc2l0aW9uLCBiYWNrZ3JvdW5kU2l6ZSk7XHJcblx0XHRcdFx0cnVsZS5pbnNlcnRBZnRlcihiYWNrZ3JvdW5kUG9zaXRpb24sIGJhY2tncm91bmRSZXBlYXQpO1xyXG5cclxuXHRcdFx0XHRcclxuXHRcdFx0fSxcclxuXHRcdFx0b25TYXZlU3ByaXRlc2hlZXQ6IGZ1bmN0aW9uKG9wdHMsIHNwcml0ZXNoZWV0KSB7XHJcblx0XHRcdFx0bGV0IGZpbGVuYW1lQ2h1bmtzID0gc3ByaXRlc2hlZXQuZ3JvdXBzLmNvbmNhdChzcHJpdGVzaGVldC5leHRlbnNpb24pO1xyXG5cdFx0XHRcdGlmKGZpbGVuYW1lQ2h1bmtzLmxlbmd0aCA+IDEpXHJcblx0XHRcdFx0XHRyZXR1cm4gcGF0aC5qb2luKGJhc2VQYXRoLCBvcHRzLnNwcml0ZVBhdGgsICdzcHItJyArIGZpbGVuYW1lQ2h1bmtzWzBdICsgJy4nICsgZmlsZW5hbWVDaHVua3NbMV0pO1xyXG5cdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdHJldHVybiBwYXRoLmpvaW4oYmFzZVBhdGgsIG9wdHMuc3ByaXRlUGF0aCwgJ3NwcicgKyAnLicgKyBmaWxlbmFtZUNodW5rc1swXSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9O1xyXG5cclxuXHRyZXR1cm4gb3B0cztcclxuXHRcclxufVxyXG5cclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2pzL2hwLWNzcy1zcHJpdGUuanMiLCIndXNlIHN0cmljdCc7XHJcblxyXG5jb25zdCBmcyA9IGdsb2JhbC5yZXF1aXJlKCdmcycpO1xyXG5jb25zdCBwYXRoID0gZ2xvYmFsLnJlcXVpcmUoJ3BhdGgnKTtcclxuY29uc3QgcG9zdGNzcyA9IGdsb2JhbC5yZXF1aXJlKCdwb3N0Y3NzJyk7XHJcblxyXG5leHBvcnQgeyBoYW5kbGVDc3MsIGhhbmRsZUh0bWwsIGhhbmRsZUltYWdlIH07XHJcbi8qKlxyXG4qIOaTjeS9nGNzc1xyXG4qXHJcbiogQHBhcmFtIHtzdHJpbmd9IHN0eWxlc2hlZXRQYXRoXHJcbiovXHJcbmZ1bmN0aW9uIGhhbmRsZUNzcyhzdHlsZXNoZWV0UGF0aCwgcGx1Z2lucykge1xyXG5cclxuXHRsZXQgcGF0aE9iaiA9IHBhdGgucGFyc2Uoc3R5bGVzaGVldFBhdGgpO1xyXG5cdGxldCBiYXNlUGF0aCA9IHBhdGhPYmouZGlyLnNwbGl0KHBhdGguc2VwKS5zbGljZSgwLC0xKS5qb2luKHBhdGguc2VwKTtcclxuXHRleGlzdHNGbG9kZXIoYmFzZVBhdGgsIHBhdGguam9pbihiYXNlUGF0aCwgJy9kaXN0L2Nzcy8nKSk7XHJcblx0ZnMucmVhZEZpbGUoc3R5bGVzaGVldFBhdGgsICd1dGYtOCcsIGZ1bmN0aW9uKGVyciwgY3NzKXtcclxuXHRcdHBvc3Rjc3MocGx1Z2lucylcclxuXHRcdFx0LnByb2Nlc3MoY3NzLCB7IGZyb206IHN0eWxlc2hlZXRQYXRoLCB0bzogYmFzZVBhdGggKyAnL2Rpc3QvY3NzLycgKyBwYXRoT2JqLmJhc2UgfSlcclxuXHRcdFx0LnRoZW4ocmVzdWx0ID0+IHtcclxuXHRcdFx0XHRmcy53cml0ZUZpbGUocGF0aC5qb2luKGJhc2VQYXRoLCAnL2Rpc3QvY3NzLycsIHBhdGhPYmouYmFzZSksIHJlc3VsdC5jc3MsIGZ1bmN0aW9uKGVycil7XHJcblx0XHRcdFx0XHRpZihlcnIpIHtcclxuXHRcdFx0XHRcdFx0Y29uc29sZS5lcnJvcihlcnIpO1xyXG5cdFx0XHRcdFx0fWVsc2Uge1xyXG5cdFx0XHRcdFx0XHRhbGVydCgnc3VjY2VzcycpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0aWYocmVzdWx0Lm1hcClcclxuXHRcdFx0XHRcdFx0ZnMud3JpdGVGaWxlU3luYyhiYXNlUGF0aCArICcvZGlzdC9jc3MvJyArIHBhdGhPYmouYmFzZSArICcubWFwJywgcmVzdWx0Lm1hcCk7XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH0pO1xyXG5cdH0pO1xyXG5cclxufVxyXG5cclxuLyoqXHJcbiog5pON5L2caHRtbFxyXG4qXHJcbiogQHBhcmFtIHtzdHJpbmd9IGh0bWxQYXRoXHJcbiovXHJcbmZ1bmN0aW9uIGhhbmRsZUh0bWwoaHRtbFBhdGgpIHtcclxuXHRsZXQgcGF0aE9iaiA9IHBhdGgucGFyc2UoaHRtbFBhdGgpO1xyXG5cdGxldCBiYXNlUGF0aCA9IHBhdGhPYmouZGlyO1xyXG5cdGV4aXN0c0Zsb2RlcihiYXNlUGF0aCwgaHRtbFBhdGgpO1xyXG5cdGZzLnJlYWRGaWxlKGh0bWxQYXRoLCBmdW5jdGlvbihlcnIsIGRhdGEpe1xyXG5cdFx0aWYoZXJyKXtcclxuXHRcdFx0Y29uc29sZS5lcnJvcihlcnIpO1xyXG5cdFx0fWVsc2Uge1xyXG5cdFx0XHRsZXQgaHRtbCA9IGRhdGE7XHJcblx0XHRcdGZzLndyaXRlRmlsZShiYXNlUGF0aCArICcvZGlzdC8nICsgcGF0aE9iai5iYXNlLCBodG1sLnRvU3RyaW5nKCksIGZ1bmN0aW9uKGVycil7XHJcblx0XHRcdFx0aWYoZXJyKXtcclxuXHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IoZXJyKTtcclxuXHRcdFx0XHR9ZWxzZSB7XHJcblx0XHRcdFx0XHRhbGVydCgnc3VjY2VzcycpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblx0fSk7XHJcbn1cclxuXHJcbi8qKlxyXG4qIOaTjeS9nOWbvueJh1xyXG4qXHJcbiogQHBhcmFtIHtBcnJheX0gaW1hZ2VcclxuKi9cclxuZnVuY3Rpb24gaGFuZGxlSW1hZ2UoaW1hZ2UpIHtcclxuXHRsZXQgcGF0aE9iaiA9IHBhdGgucGFyc2UoaW1hZ2VbMF0ucGF0aCk7XHJcblx0bGV0IGJhc2VQYXRoID0gcGF0aE9iai5kaXIuc3BsaXQocGF0aC5zZXApLnNsaWNlKDAsLTEpLmpvaW4ocGF0aC5zZXApLFxyXG5cdFx0b3V0cHV0UGF0aCA9IHBhdGhPYmouZGlyLnNwbGl0KHBhdGguc2VwKTtcclxuXHRvdXRwdXRQYXRoLnNwbGljZSgtMSwgMCwgJ2Rpc3QnKTtcclxuXHRvdXRwdXRQYXRoID0gb3V0cHV0UGF0aC5qb2luKHBhdGguc2VwKTtcclxuXHQvLyDliJvlu7rmnKzlnLDmlofku7blpLlcclxuXHRleGlzdHNGbG9kZXIoYmFzZVBhdGgsIG91dHB1dFBhdGgpO1xyXG5cdGZvcihsZXQgaSA9IDA7IGkgPCBpbWFnZS5sZW5ndGg7IGkrKykge1xyXG5cdFx0bGV0IGlucHV0ID0gZnMuY3JlYXRlUmVhZFN0cmVhbShpbWFnZVtpXS5wYXRoKSxcclxuXHRcdFx0b3V0cHV0ID0gZnMuY3JlYXRlV3JpdGVTdHJlYW0ob3V0cHV0UGF0aCArIHBhdGguc2VwICsgaW1hZ2VbaV0ubmFtZSk7XHJcblx0XHRpbnB1dC5vbignZGF0YScsIGZ1bmN0aW9uKGQpIHtcclxuXHRcdFx0b3V0cHV0LndyaXRlKGQpO1xyXG5cdFx0fSk7XHJcblx0XHRpbnB1dC5vbignZXJyb3InLCBmdW5jdGlvbihlcnIpIHtcclxuXHRcdFx0dGhyb3cgZXJyO1xyXG5cdFx0fSk7XHJcblx0XHRpbnB1dC5vbignZW5kJywgZnVuY3Rpb24oKSB7XHJcblx0XHRcdG91dHB1dC5lbmQoKTtcclxuXHRcdH0pO1xyXG5cdH1cclxufVxyXG5cclxuLyoqXHJcbiog5Yik5pat5paH5Lu25aS55piv5ZCm5a2Y5ZyoXHJcbipcclxuKkBwYXJhbSB7c3RyaW5nfSBiYXNlUGF0aFxyXG4qQHBhcmFtIHtzdHJpbmd9IHVybFxyXG4qL1xyXG5mdW5jdGlvbiBleGlzdHNGbG9kZXIoYmFzZVBhdGgsIHVybCkge1xyXG5cclxuXHRmcy5leGlzdHMocGF0aC5qb2luKGJhc2VQYXRoLCAnL2Rpc3QvJyksIGZ1bmN0aW9uKGV4dCl7XHJcblx0XHRpZighZXh0KSB7XHJcblx0XHRcdGZzLm1rZGlyKHBhdGguam9pbihiYXNlUGF0aCwgJy9kaXN0LycpLCBmdW5jdGlvbihlcnIpe1xyXG5cdFx0XHRcdGlmKCFlcnIpIHtcclxuXHRcdFx0XHRcdGZzLmV4aXN0cyh1cmwsIGZ1bmN0aW9uKGV4dCl7XHJcblx0XHRcdFx0XHRcdGlmKCFleHQpe1xyXG5cdFx0XHRcdFx0XHRcdGZzLm1rZGlyKHVybCwgZnVuY3Rpb24oZXJyKXtcclxuXHRcdFx0XHRcdFx0XHRcdGlmKGVycikgY29uc29sZS5lcnJvcihlcnIpO1xyXG5cdFx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cdFx0fWVsc2Uge1xyXG5cdFx0XHRmcy5leGlzdHModXJsLCBmdW5jdGlvbihleHQpe1xyXG5cdFx0XHRcdGlmKCFleHQpe1xyXG5cdFx0XHRcdFx0ZnMubWtkaXIodXJsLCBmdW5jdGlvbihlcnIpe1xyXG5cdFx0XHRcdFx0XHRpZihlcnIpIGNvbnNvbGUuZXJyb3IoZXJyKTtcclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblx0fSk7XHJcblxyXG59XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2pzL2hwLWhhbmRsZWZpbGUuanMiXSwic291cmNlUm9vdCI6IiJ9