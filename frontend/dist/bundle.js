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
exports.push([module.i, "\r\nhtml body{font-family: 'microsoft yahei',Arial,sans-serif;}\r\n.layout-body{display:flex;}\r\n.layout-body .wp-drag{flex:2;height:100vh;border-right:1px solid #CDCDCD;box-sizing:border-box;padding:24px;position: relative;}\r\n.layout-body .wp-menu{flex:1;height:100vh;}\r\n\r\n.wp-drag .drag-main{width:50%;height:50vh;color:#CDCDCD;border:3px dashed;font-size:24px;text-align:center;line-height:50vh;position:absolute;left:50%;top:50%;transform:translate(-50%, -50%);opacity:0;}\r\n.wp-drag .drag-main.drop-hover{opacity:1;}\r\n\r\n.drag-log p{font-weight:normal;font-size:14px;line-height:1.5;}\r\n.drag-log .succ{color:#45BF55;}\r\n.drag-log .fail{color:#F22233;}\r\n\r\n.layout-body .wp-menu .menu-options{padding:20px;font-size:14px;height:60vh;border-bottom:1px solid #CDCDCD;box-sizing:border-box;}\r\n.menu-options ul li{margin-bottom:10px;}\r\ninput[type=checkbox]{vertical-align:-2px;}\r\n\r\n.layout-body .wp-menu .menu-address{padding:10px 20px;font-size:14px;height:40vh;box-sizing: border-box;}\r\n.menu-address h3{font-size:14px;font-weight:normal;margin-bottom:10px;margin-left:-10px;}", ""]);

// exports


/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__hp_drag__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__hp_handlefile__ = __webpack_require__(10);




const path = global.require('path');
const autoprefixer = global.require('autoprefixer');
const atImport = global.require('postcss-import');
const cssnano = global.require('cssnano');
const cssnext = global.require('postcss-cssnext');

(function () {

	// 获取用户所选选项
	let options = localStorage.getItem('options');
	if (options) {
		options.split(',').forEach(function (index) {
			document.querySelectorAll('.option')[index].checked = true;
		});
	}

	let mode = pluginsAssemble();

	document.addEventListener('click', function (event) {
		if (event.target.className == 'option') {
			mode = pluginsAssemble();
		}
	});

	// 处理拖拽事件
	Object(__WEBPACK_IMPORTED_MODULE_0__hp_drag__["a" /* default */])(function (file) {

		let pathObj = path.parse(file[0].path);

		if (/css/.test(pathObj.ext)) {
			// 传入 css 文件

			Object(__WEBPACK_IMPORTED_MODULE_1__hp_handlefile__["a" /* handleCss */])(file[0].path, mode);
		} else if (/html/.test(pathObj.ext)) {
			// 传入 html 文件

			Object(__WEBPACK_IMPORTED_MODULE_1__hp_handlefile__["b" /* handleHtml */])(file[0].path);
		} else {

			Object(__WEBPACK_IMPORTED_MODULE_1__hp_handlefile__["c" /* handleImage */])(file, mode.imgQuant);
		}
	});
})();

/**
* 按需配置插件,并保存用户所选选项
*
*/
function pluginsAssemble() {

	let checkbox = document.querySelectorAll('.menu-options .option');
	let mode = {
		spriteMode: 'pc',
		imgQuant: false,
		plugins: []
	};
	let options = [];
	for (let i = 0; i < checkbox.length; i++) {
		if (checkbox[i].checked) {
			options.push(i);
			switch (checkbox[i].value) {
				case 'pc':
					mode.spriteMode = 'pc';
					break;
				case 'rem':
					mode.spriteMode = 'rem';
					break;
				case 'picnano':
					mode.imgQuant = true;
					break;
				case 'cssnext':
					mode.plugins.push(cssnext({
						features: {
							autoprefixer: false,
							rem: false
						}
					}));
					break;
				case 'autoprefixer':
					mode.plugins.push(autoprefixer('last 6 versions'));
					break;
				case '@import':
					mode.plugins.push(atImport);
					break;
				case 'cssnano':
					mode.plugins.push(cssnano);
					break;
				default:
					break;
			}
		}
	}
	localStorage.setItem('options', options);
	return mode;
}

/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";


// const path = global.require('path');
/**
* 处理拖拽事件
*
* @param {function} cb
*/

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
		// this.classList.remove('drop-hover');
	}, false);

	dropZone.addEventListener('drop', function (e) {
		e.preventDefault();
		this.classList.remove('drop-hover');
		let p = document.querySelectorAll('.drag-log p');
		for (let i = 0; i < p.length; i++) {
			p[i].innerHTML = '';
		}
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
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return handleCss; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return handleHtml; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return handleImage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__hp_log__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__hp_css_sprite__ = __webpack_require__(12);


const fs = global.require('fs');
const path = global.require('path');
const postcss = global.require('postcss');
const imagemin = global.require('imagemin');
const imageminMozjpeg = global.require('imagemin-mozjpeg');
const imageminPngquant = global.require('imagemin-pngquant');
const imageminGifsicle = global.require('imagemin-gifsicle');




/**
* 操作css
*
* @param {string} stylesheetPath
* @param {object} mode
*/
function handleCss(stylesheetPath, mode) {

	let pathObj = path.parse(stylesheetPath);
	let basePath = pathObj.dir.split(path.sep).slice(0, -1).join(path.sep);
	existsFloder(basePath, path.join(basePath, '/dist/css/'));
	Object(__WEBPACK_IMPORTED_MODULE_0__hp_log__["a" /* default */])(stylesheetPath);

	let promise = new Promise((resolve, reject) => {
		Object(__WEBPACK_IMPORTED_MODULE_1__hp_css_sprite__["a" /* default */])(stylesheetPath, mode, resolve, reject);
	});
	promise.then(css => {
		postcss(mode.plugins).process(css, { from: stylesheetPath, to: basePath + '/dist/css/' + pathObj.base }).then(result => {
			fs.writeFile(path.join(basePath, '/dist/css/', pathObj.base), result.css, function (err) {
				if (err) {
					Object(__WEBPACK_IMPORTED_MODULE_0__hp_log__["a" /* default */])(err.toString(), 'fail');
				} else {
					Object(__WEBPACK_IMPORTED_MODULE_0__hp_log__["a" /* default */])('success', 'success');
				}
				if (result.map) fs.writeFileSync(basePath + '/dist/css/' + pathObj.base + '.map', result.map);
			});
		});
	}, error => {
		Object(__WEBPACK_IMPORTED_MODULE_0__hp_log__["a" /* default */])(error.toString(), 'fail');
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
	Object(__WEBPACK_IMPORTED_MODULE_0__hp_log__["a" /* default */])(htmlPath);
	fs.readFile(htmlPath, function (err, data) {
		if (err) {
			Object(__WEBPACK_IMPORTED_MODULE_0__hp_log__["a" /* default */])(err.toString(), 'fail');
		} else {
			let html = data;
			fs.writeFile(path.join(basePath, '/dist/', pathObj.base), html.toString(), function (err) {
				if (err) {
					Object(__WEBPACK_IMPORTED_MODULE_0__hp_log__["a" /* default */])(err.toString(), 'fail');
				} else {
					Object(__WEBPACK_IMPORTED_MODULE_0__hp_log__["a" /* default */])('success: ' + path.join(basePath, '/dist/', pathObj.base), 'success');
				}
			});
		}
	});
}

/**
* 操作图片
*
* @param {Array} image
* @param {boolen} imgQuant
*/
function handleImage(image, imgQuant) {
	let pathObj = path.parse(image[0].path);
	let basePath = pathObj.dir.split(path.sep).slice(0, -1).join(path.sep),
	    outputPath = pathObj.dir.split(path.sep);
	outputPath.splice(-1, 0, 'dist');
	outputPath = outputPath.join(path.sep);
	// 创建本地文件夹
	existsFloder(basePath, outputPath);
	if (imgQuant) {
		let imagePath = [];
		for (let i = 0; i < image.length; i++) {
			imagePath.push(image[i].path);
		}
		imagemin(imagePath, path.join(outputPath), {
			plugins: [imageminMozjpeg({ quality: '85' }), imageminGifsicle(), imageminPngquant({ floyd: 1, quality: '60' })]
		}).then(() => {
			Object(__WEBPACK_IMPORTED_MODULE_0__hp_log__["a" /* default */])('success', 'success');
		});
	} else {
		for (let i = 0; i < image.length; i++) {
			Object(__WEBPACK_IMPORTED_MODULE_0__hp_log__["a" /* default */])(image[i].path);
			Object(__WEBPACK_IMPORTED_MODULE_0__hp_log__["a" /* default */])('<br/>');
			let input = fs.createReadStream(image[i].path),
			    output = fs.createWriteStream(path.join(outputPath, image[i].name));
			input.on('data', function (d) {
				output.write(d);
			});
			input.on('error', function (err) {
				throw err;
			});
			input.on('end', function () {
				output.end();
				Object(__WEBPACK_IMPORTED_MODULE_0__hp_log__["a" /* default */])(path.join(outputPath, image[i].name), 'success');
				Object(__WEBPACK_IMPORTED_MODULE_0__hp_log__["a" /* default */])('<br/>', 'success');
			});
		}
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

/***/ }),
/* 11 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";


/**
* 展示文件处理过程信息
*
* @param {string} log
* @param {string} type
*/

/* harmony default export */ __webpack_exports__["a"] = (function (log, type) {

	if (type == 'success') {
		document.querySelector('.drag-log .succ').innerHTML += log;
	} else if (type == 'fail') {
		document.querySelector('.drag-log .fail').innerHTML += log;
	} else {
		document.querySelector('.drag-log .normal').innerHTML += log;
	}
});

/***/ }),
/* 12 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";


const postcss = global.require('postcss');
const sprites = global.require('postcss-sprites');
const path = global.require('path');
const fs = global.require('fs');
const imagemin = global.require('imagemin');
const imageminPngquant = global.require('imagemin-pngquant');

/**
* 配置 sprite 信息
*
* @param {string} stylesheetPath
* @param {object} mode
* @param {function} cb
* @param {function} error
*/
/* harmony default export */ __webpack_exports__["a"] = (function (stylesheetPath, mode, cb, error) {

	let pathObj = path.parse(stylesheetPath);
	let basePath = pathObj.dir.split(path.sep).slice(0, -1).join(path.sep);
	let opts = {
		stylesheetPath: path.join(basePath, '/dist/css/'),
		spritePath: './dist/img',
		basePath: basePath,
		spritesmith: {
			padding: 10
			// algorithm: 'top-down'
		},
		filterBy: image => {
			// console.log(image);
			if (!~image.url.indexOf('/slice/')) {
				return Promise.reject();
			}
			return Promise.resolve();
		},
		groupBy: image => {
			let name = /\/slice\/([0-9.A-Za-z]+)\//.exec(image.url);
			if (!name) {
				return Promise.reject(new Error('Not a shape image'));
			}
			return Promise.resolve(name[1]);
		},
		hooks: {
			onUpdateRule: (rule, token, image) => {

				let backgroundSize, backgroundPosition;

				if (mode.spriteMode == 'pc') {

					let backgroundPositionX = -image.coords.x,
					    backgroundPositionY = -image.coords.y;

					// backgroundSize = postcss.decl({
					// 	prop: 'background-size',
					// 	value: 'auto'
					// });

					backgroundPosition = postcss.decl({
						prop: 'background-position',
						value: backgroundPositionX + 'px ' + backgroundPositionY + 'px'
					});
				} else if (mode.spriteMode == 'rem') {

					let backgroundPositionX = -(image.coords.x / 100),
					    backgroundPositionY = -(image.coords.y / 100);

					backgroundSize = postcss.decl({
						prop: 'background-size',
						value: image.spriteWidth / 100 + 'rem ' + 'auto'
					});

					backgroundPosition = postcss.decl({
						prop: 'background-position',
						value: backgroundPositionX + 'rem ' + backgroundPositionY + 'rem'
					});
				} else {

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
				if (mode.spriteMode != 'pc') rule.insertAfter(backgroundPosition, backgroundSize);
				rule.insertAfter(backgroundPosition, backgroundRepeat);
			},
			onSaveSpritesheet: (opts, spritesheet) => {
				let filenameChunks = spritesheet.groups.concat(spritesheet.extension);
				if (filenameChunks.length > 1) return path.join(basePath, opts.spritePath, 'spr-' + filenameChunks[0] + '.' + filenameChunks[1]);else return path.join(basePath, opts.spritePath, 'spr' + '.' + filenameChunks[0]);
			}
		}
	};

	fs.readFile(stylesheetPath, 'utf-8', (err, css) => {
		if (err) {
			error(err);
		} else {
			postcss([sprites(opts)]) // 处理雪碧图
			.process(css, { from: stylesheetPath, to: basePath + '/dist/css/' + pathObj.base }).then(result => {
				if (mode.imgQuant) {
					// 压缩雪碧图
					imagemin([path.join(basePath, '/dist/img/spr*.png')], path.join(basePath, '/dist/img/'), {
						plugins: [imageminPngquant({ quality: '70' })]
					}).then(() => {
						cb(result.css);
					});
				} else {
					cb(result.css);
				}
			});
		}
	});
});

/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgZjc1MGRhNTI3ZmMzYjFmMjgxYjMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvbGliL2Nzcy1iYXNlLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvbGliL2FkZFN0eWxlcy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2Nzcy9yZXNldC5jc3M/NzRkYyIsIndlYnBhY2s6Ly8vLi9zcmMvY3NzL3Jlc2V0LmNzcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2xpYi91cmxzLmpzIiwid2VicGFjazovLy8uL3NyYy9jc3MvaW5kZXguY3NzPzllMzQiLCJ3ZWJwYWNrOi8vLy4vc3JjL2Nzcy9pbmRleC5jc3MiLCJ3ZWJwYWNrOi8vLy4vc3JjL2pzL21haW4uanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2pzL2hwLWRyYWcuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2pzL2hwLWhhbmRsZWZpbGUuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2pzL2hwLWxvZy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvanMvaHAtY3NzLXNwcml0ZS5qcyJdLCJuYW1lcyI6WyJyZXF1aXJlIiwicGF0aCIsImdsb2JhbCIsImF1dG9wcmVmaXhlciIsImF0SW1wb3J0IiwiY3NzbmFubyIsImNzc25leHQiLCJvcHRpb25zIiwibG9jYWxTdG9yYWdlIiwiZ2V0SXRlbSIsInNwbGl0IiwiZm9yRWFjaCIsImluZGV4IiwiZG9jdW1lbnQiLCJxdWVyeVNlbGVjdG9yQWxsIiwiY2hlY2tlZCIsIm1vZGUiLCJwbHVnaW5zQXNzZW1ibGUiLCJhZGRFdmVudExpc3RlbmVyIiwiZXZlbnQiLCJ0YXJnZXQiLCJjbGFzc05hbWUiLCJkcmFnRHJvcCIsImZpbGUiLCJwYXRoT2JqIiwicGFyc2UiLCJ0ZXN0IiwiZXh0IiwiaGFuZGxlQ3NzIiwiaGFuZGxlSHRtbCIsImhhbmRsZUltYWdlIiwiaW1nUXVhbnQiLCJjaGVja2JveCIsInNwcml0ZU1vZGUiLCJwbHVnaW5zIiwiaSIsImxlbmd0aCIsInB1c2giLCJ2YWx1ZSIsImZlYXR1cmVzIiwicmVtIiwic2V0SXRlbSIsImNiIiwiZSIsInByZXZlbnREZWZhdWx0IiwiZHJvcFpvbmUiLCJxdWVyeVNlbGVjdG9yIiwiY2xhc3NMaXN0IiwiYWRkIiwicmVtb3ZlIiwicCIsImlubmVySFRNTCIsImZpbGVJbmZvIiwiZGF0YVRyYW5zZmVyIiwiZmlsZXMiLCJmcyIsInBvc3Rjc3MiLCJpbWFnZW1pbiIsImltYWdlbWluTW96anBlZyIsImltYWdlbWluUG5ncXVhbnQiLCJpbWFnZW1pbkdpZnNpY2xlIiwic3R5bGVzaGVldFBhdGgiLCJiYXNlUGF0aCIsImRpciIsInNlcCIsInNsaWNlIiwiam9pbiIsImV4aXN0c0Zsb2RlciIsImxvZyIsInByb21pc2UiLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsInNwcml0ZXMiLCJ0aGVuIiwiY3NzIiwicHJvY2VzcyIsImZyb20iLCJ0byIsImJhc2UiLCJyZXN1bHQiLCJ3cml0ZUZpbGUiLCJlcnIiLCJ0b1N0cmluZyIsIm1hcCIsIndyaXRlRmlsZVN5bmMiLCJlcnJvciIsImh0bWxQYXRoIiwicmVhZEZpbGUiLCJkYXRhIiwiaHRtbCIsImltYWdlIiwib3V0cHV0UGF0aCIsInNwbGljZSIsImltYWdlUGF0aCIsInF1YWxpdHkiLCJmbG95ZCIsImlucHV0IiwiY3JlYXRlUmVhZFN0cmVhbSIsIm91dHB1dCIsImNyZWF0ZVdyaXRlU3RyZWFtIiwibmFtZSIsIm9uIiwiZCIsIndyaXRlIiwiZW5kIiwidXJsIiwiZXhpc3RzIiwibWtkaXIiLCJjb25zb2xlIiwidHlwZSIsIm9wdHMiLCJzcHJpdGVQYXRoIiwic3ByaXRlc21pdGgiLCJwYWRkaW5nIiwiZmlsdGVyQnkiLCJpbmRleE9mIiwiZ3JvdXBCeSIsImV4ZWMiLCJFcnJvciIsImhvb2tzIiwib25VcGRhdGVSdWxlIiwicnVsZSIsInRva2VuIiwiYmFja2dyb3VuZFNpemUiLCJiYWNrZ3JvdW5kUG9zaXRpb24iLCJiYWNrZ3JvdW5kUG9zaXRpb25YIiwiY29vcmRzIiwieCIsImJhY2tncm91bmRQb3NpdGlvblkiLCJ5IiwiZGVjbCIsInByb3AiLCJzcHJpdGVXaWR0aCIsImJhY2tncm91bmRTaXplWCIsIndpZHRoIiwiYmFja2dyb3VuZFNpemVZIiwic3ByaXRlSGVpZ2h0IiwiaGVpZ2h0IiwiaXNOYU4iLCJiYWNrZ3JvdW5kSW1hZ2UiLCJzcHJpdGVVcmwiLCJiYWNrZ3JvdW5kUmVwZWF0IiwiaW5zZXJ0QWZ0ZXIiLCJvblNhdmVTcHJpdGVzaGVldCIsInNwcml0ZXNoZWV0IiwiZmlsZW5hbWVDaHVua3MiLCJncm91cHMiLCJjb25jYXQiLCJleHRlbnNpb24iXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhEQUFzRCwrREFBK0Q7O0FBRXJIO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7OztBQzdEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUNBQW1DLGdCQUFnQjtBQUNuRCxJQUFJO0FBQ0o7QUFDQTtBQUNBLEdBQUc7QUFDSDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCLGlCQUFpQjtBQUNqQztBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVksb0JBQW9CO0FBQ2hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9EQUFvRCxjQUFjOztBQUVsRTtBQUNBOzs7Ozs7O0FDM0VBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBLGlCQUFpQixtQkFBbUI7QUFDcEM7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsaUJBQWlCLHNCQUFzQjtBQUN2Qzs7QUFFQTtBQUNBLG1CQUFtQiwyQkFBMkI7O0FBRTlDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxnQkFBZ0IsbUJBQW1CO0FBQ25DO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQSxpQkFBaUIsMkJBQTJCO0FBQzVDO0FBQ0E7O0FBRUEsUUFBUSx1QkFBdUI7QUFDL0I7QUFDQTtBQUNBLEdBQUc7QUFDSDs7QUFFQSxpQkFBaUIsdUJBQXVCO0FBQ3hDO0FBQ0E7O0FBRUEsMkJBQTJCO0FBQzNCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsZ0JBQWdCLGlCQUFpQjtBQUNqQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYzs7QUFFZCxrREFBa0Qsc0JBQXNCO0FBQ3hFO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0EsRUFBRTtBQUNGO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUEsRUFBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBOztBQUVBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztB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dUQsSUFBOUQsRUFEZixFQUVFTCxJQUZGLENBRU9NLFVBQVU7QUFDZixRQUFHaEUsS0FBS2UsUUFBUixFQUFrQjtBQUNqQjtBQUNBMEIsY0FBUyxDQUFDeEQsS0FBS2lFLElBQUwsQ0FBVUosUUFBVixFQUFvQixvQkFBcEIsQ0FBRCxDQUFULEVBQXFEN0QsS0FBS2lFLElBQUwsQ0FBVUosUUFBVixFQUFvQixZQUFwQixDQUFyRCxFQUF3RjtBQUN2RjVCLGVBQVMsQ0FDUnlCLGlCQUFpQixFQUFDb0MsU0FBUyxJQUFWLEVBQWpCLENBRFE7QUFEOEUsTUFBeEYsRUFJR3JCLElBSkgsQ0FJUSxNQUFNO0FBQ2JoQyxTQUFHc0MsT0FBT0wsR0FBVjtBQUNBLE1BTkQ7QUFPQSxLQVRELE1BU007QUFDTGpDLFFBQUdzQyxPQUFPTCxHQUFWO0FBQ0E7QUFFRCxJQWhCRjtBQWlCQTtBQUNELEVBdEJEO0FBd0JBLEMiLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gMik7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgZjc1MGRhNTI3ZmMzYjFmMjgxYjMiLCIvKlxuXHRNSVQgTGljZW5zZSBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocFxuXHRBdXRob3IgVG9iaWFzIEtvcHBlcnMgQHNva3JhXG4qL1xuLy8gY3NzIGJhc2UgY29kZSwgaW5qZWN0ZWQgYnkgdGhlIGNzcy1sb2FkZXJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24odXNlU291cmNlTWFwKSB7XG5cdHZhciBsaXN0ID0gW107XG5cblx0Ly8gcmV0dXJuIHRoZSBsaXN0IG9mIG1vZHVsZXMgYXMgY3NzIHN0cmluZ1xuXHRsaXN0LnRvU3RyaW5nID0gZnVuY3Rpb24gdG9TdHJpbmcoKSB7XG5cdFx0cmV0dXJuIHRoaXMubWFwKGZ1bmN0aW9uIChpdGVtKSB7XG5cdFx0XHR2YXIgY29udGVudCA9IGNzc1dpdGhNYXBwaW5nVG9TdHJpbmcoaXRlbSwgdXNlU291cmNlTWFwKTtcblx0XHRcdGlmKGl0ZW1bMl0pIHtcblx0XHRcdFx0cmV0dXJuIFwiQG1lZGlhIFwiICsgaXRlbVsyXSArIFwie1wiICsgY29udGVudCArIFwifVwiO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cmV0dXJuIGNvbnRlbnQ7XG5cdFx0XHR9XG5cdFx0fSkuam9pbihcIlwiKTtcblx0fTtcblxuXHQvLyBpbXBvcnQgYSBsaXN0IG9mIG1vZHVsZXMgaW50byB0aGUgbGlzdFxuXHRsaXN0LmkgPSBmdW5jdGlvbihtb2R1bGVzLCBtZWRpYVF1ZXJ5KSB7XG5cdFx0aWYodHlwZW9mIG1vZHVsZXMgPT09IFwic3RyaW5nXCIpXG5cdFx0XHRtb2R1bGVzID0gW1tudWxsLCBtb2R1bGVzLCBcIlwiXV07XG5cdFx0dmFyIGFscmVhZHlJbXBvcnRlZE1vZHVsZXMgPSB7fTtcblx0XHRmb3IodmFyIGkgPSAwOyBpIDwgdGhpcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0dmFyIGlkID0gdGhpc1tpXVswXTtcblx0XHRcdGlmKHR5cGVvZiBpZCA9PT0gXCJudW1iZXJcIilcblx0XHRcdFx0YWxyZWFkeUltcG9ydGVkTW9kdWxlc1tpZF0gPSB0cnVlO1xuXHRcdH1cblx0XHRmb3IoaSA9IDA7IGkgPCBtb2R1bGVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHR2YXIgaXRlbSA9IG1vZHVsZXNbaV07XG5cdFx0XHQvLyBza2lwIGFscmVhZHkgaW1wb3J0ZWQgbW9kdWxlXG5cdFx0XHQvLyB0aGlzIGltcGxlbWVudGF0aW9uIGlzIG5vdCAxMDAlIHBlcmZlY3QgZm9yIHdlaXJkIG1lZGlhIHF1ZXJ5IGNvbWJpbmF0aW9uc1xuXHRcdFx0Ly8gIHdoZW4gYSBtb2R1bGUgaXMgaW1wb3J0ZWQgbXVsdGlwbGUgdGltZXMgd2l0aCBkaWZmZXJlbnQgbWVkaWEgcXVlcmllcy5cblx0XHRcdC8vICBJIGhvcGUgdGhpcyB3aWxsIG5ldmVyIG9jY3VyIChIZXkgdGhpcyB3YXkgd2UgaGF2ZSBzbWFsbGVyIGJ1bmRsZXMpXG5cdFx0XHRpZih0eXBlb2YgaXRlbVswXSAhPT0gXCJudW1iZXJcIiB8fCAhYWxyZWFkeUltcG9ydGVkTW9kdWxlc1tpdGVtWzBdXSkge1xuXHRcdFx0XHRpZihtZWRpYVF1ZXJ5ICYmICFpdGVtWzJdKSB7XG5cdFx0XHRcdFx0aXRlbVsyXSA9IG1lZGlhUXVlcnk7XG5cdFx0XHRcdH0gZWxzZSBpZihtZWRpYVF1ZXJ5KSB7XG5cdFx0XHRcdFx0aXRlbVsyXSA9IFwiKFwiICsgaXRlbVsyXSArIFwiKSBhbmQgKFwiICsgbWVkaWFRdWVyeSArIFwiKVwiO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGxpc3QucHVzaChpdGVtKTtcblx0XHRcdH1cblx0XHR9XG5cdH07XG5cdHJldHVybiBsaXN0O1xufTtcblxuZnVuY3Rpb24gY3NzV2l0aE1hcHBpbmdUb1N0cmluZyhpdGVtLCB1c2VTb3VyY2VNYXApIHtcblx0dmFyIGNvbnRlbnQgPSBpdGVtWzFdIHx8ICcnO1xuXHR2YXIgY3NzTWFwcGluZyA9IGl0ZW1bM107XG5cdGlmICghY3NzTWFwcGluZykge1xuXHRcdHJldHVybiBjb250ZW50O1xuXHR9XG5cblx0aWYgKHVzZVNvdXJjZU1hcCAmJiB0eXBlb2YgYnRvYSA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdHZhciBzb3VyY2VNYXBwaW5nID0gdG9Db21tZW50KGNzc01hcHBpbmcpO1xuXHRcdHZhciBzb3VyY2VVUkxzID0gY3NzTWFwcGluZy5zb3VyY2VzLm1hcChmdW5jdGlvbiAoc291cmNlKSB7XG5cdFx0XHRyZXR1cm4gJy8qIyBzb3VyY2VVUkw9JyArIGNzc01hcHBpbmcuc291cmNlUm9vdCArIHNvdXJjZSArICcgKi8nXG5cdFx0fSk7XG5cblx0XHRyZXR1cm4gW2NvbnRlbnRdLmNvbmNhdChzb3VyY2VVUkxzKS5jb25jYXQoW3NvdXJjZU1hcHBpbmddKS5qb2luKCdcXG4nKTtcblx0fVxuXG5cdHJldHVybiBbY29udGVudF0uam9pbignXFxuJyk7XG59XG5cbi8vIEFkYXB0ZWQgZnJvbSBjb252ZXJ0LXNvdXJjZS1tYXAgKE1JVClcbmZ1bmN0aW9uIHRvQ29tbWVudChzb3VyY2VNYXApIHtcblx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVuZGVmXG5cdHZhciBiYXNlNjQgPSBidG9hKHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChKU09OLnN0cmluZ2lmeShzb3VyY2VNYXApKSkpO1xuXHR2YXIgZGF0YSA9ICdzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCwnICsgYmFzZTY0O1xuXG5cdHJldHVybiAnLyojICcgKyBkYXRhICsgJyAqLyc7XG59XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2xpYi9jc3MtYmFzZS5qc1xuLy8gbW9kdWxlIGlkID0gMFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvKlxuXHRNSVQgTGljZW5zZSBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocFxuXHRBdXRob3IgVG9iaWFzIEtvcHBlcnMgQHNva3JhXG4qL1xuXG52YXIgc3R5bGVzSW5Eb20gPSB7fTtcblxudmFyXHRtZW1vaXplID0gZnVuY3Rpb24gKGZuKSB7XG5cdHZhciBtZW1vO1xuXG5cdHJldHVybiBmdW5jdGlvbiAoKSB7XG5cdFx0aWYgKHR5cGVvZiBtZW1vID09PSBcInVuZGVmaW5lZFwiKSBtZW1vID0gZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcblx0XHRyZXR1cm4gbWVtbztcblx0fTtcbn07XG5cbnZhciBpc09sZElFID0gbWVtb2l6ZShmdW5jdGlvbiAoKSB7XG5cdC8vIFRlc3QgZm9yIElFIDw9IDkgYXMgcHJvcG9zZWQgYnkgQnJvd3NlcmhhY2tzXG5cdC8vIEBzZWUgaHR0cDovL2Jyb3dzZXJoYWNrcy5jb20vI2hhY2stZTcxZDg2OTJmNjUzMzQxNzNmZWU3MTVjMjIyY2I4MDVcblx0Ly8gVGVzdHMgZm9yIGV4aXN0ZW5jZSBvZiBzdGFuZGFyZCBnbG9iYWxzIGlzIHRvIGFsbG93IHN0eWxlLWxvYWRlclxuXHQvLyB0byBvcGVyYXRlIGNvcnJlY3RseSBpbnRvIG5vbi1zdGFuZGFyZCBlbnZpcm9ubWVudHNcblx0Ly8gQHNlZSBodHRwczovL2dpdGh1Yi5jb20vd2VicGFjay1jb250cmliL3N0eWxlLWxvYWRlci9pc3N1ZXMvMTc3XG5cdHJldHVybiB3aW5kb3cgJiYgZG9jdW1lbnQgJiYgZG9jdW1lbnQuYWxsICYmICF3aW5kb3cuYXRvYjtcbn0pO1xuXG52YXIgZ2V0RWxlbWVudCA9IChmdW5jdGlvbiAoZm4pIHtcblx0dmFyIG1lbW8gPSB7fTtcblxuXHRyZXR1cm4gZnVuY3Rpb24oc2VsZWN0b3IpIHtcblx0XHRpZiAodHlwZW9mIG1lbW9bc2VsZWN0b3JdID09PSBcInVuZGVmaW5lZFwiKSB7XG5cdFx0XHRtZW1vW3NlbGVjdG9yXSA9IGZuLmNhbGwodGhpcywgc2VsZWN0b3IpO1xuXHRcdH1cblxuXHRcdHJldHVybiBtZW1vW3NlbGVjdG9yXVxuXHR9O1xufSkoZnVuY3Rpb24gKHRhcmdldCkge1xuXHRyZXR1cm4gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0YXJnZXQpXG59KTtcblxudmFyIHNpbmdsZXRvbiA9IG51bGw7XG52YXJcdHNpbmdsZXRvbkNvdW50ZXIgPSAwO1xudmFyXHRzdHlsZXNJbnNlcnRlZEF0VG9wID0gW107XG5cbnZhclx0Zml4VXJscyA9IHJlcXVpcmUoXCIuL3VybHNcIik7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24obGlzdCwgb3B0aW9ucykge1xuXHRpZiAodHlwZW9mIERFQlVHICE9PSBcInVuZGVmaW5lZFwiICYmIERFQlVHKSB7XG5cdFx0aWYgKHR5cGVvZiBkb2N1bWVudCAhPT0gXCJvYmplY3RcIikgdGhyb3cgbmV3IEVycm9yKFwiVGhlIHN0eWxlLWxvYWRlciBjYW5ub3QgYmUgdXNlZCBpbiBhIG5vbi1icm93c2VyIGVudmlyb25tZW50XCIpO1xuXHR9XG5cblx0b3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cblx0b3B0aW9ucy5hdHRycyA9IHR5cGVvZiBvcHRpb25zLmF0dHJzID09PSBcIm9iamVjdFwiID8gb3B0aW9ucy5hdHRycyA6IHt9O1xuXG5cdC8vIEZvcmNlIHNpbmdsZS10YWcgc29sdXRpb24gb24gSUU2LTksIHdoaWNoIGhhcyBhIGhhcmQgbGltaXQgb24gdGhlICMgb2YgPHN0eWxlPlxuXHQvLyB0YWdzIGl0IHdpbGwgYWxsb3cgb24gYSBwYWdlXG5cdGlmICghb3B0aW9ucy5zaW5nbGV0b24pIG9wdGlvbnMuc2luZ2xldG9uID0gaXNPbGRJRSgpO1xuXG5cdC8vIEJ5IGRlZmF1bHQsIGFkZCA8c3R5bGU+IHRhZ3MgdG8gdGhlIDxoZWFkPiBlbGVtZW50XG5cdGlmICghb3B0aW9ucy5pbnNlcnRJbnRvKSBvcHRpb25zLmluc2VydEludG8gPSBcImhlYWRcIjtcblxuXHQvLyBCeSBkZWZhdWx0LCBhZGQgPHN0eWxlPiB0YWdzIHRvIHRoZSBib3R0b20gb2YgdGhlIHRhcmdldFxuXHRpZiAoIW9wdGlvbnMuaW5zZXJ0QXQpIG9wdGlvbnMuaW5zZXJ0QXQgPSBcImJvdHRvbVwiO1xuXG5cdHZhciBzdHlsZXMgPSBsaXN0VG9TdHlsZXMobGlzdCwgb3B0aW9ucyk7XG5cblx0YWRkU3R5bGVzVG9Eb20oc3R5bGVzLCBvcHRpb25zKTtcblxuXHRyZXR1cm4gZnVuY3Rpb24gdXBkYXRlIChuZXdMaXN0KSB7XG5cdFx0dmFyIG1heVJlbW92ZSA9IFtdO1xuXG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBzdHlsZXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdHZhciBpdGVtID0gc3R5bGVzW2ldO1xuXHRcdFx0dmFyIGRvbVN0eWxlID0gc3R5bGVzSW5Eb21baXRlbS5pZF07XG5cblx0XHRcdGRvbVN0eWxlLnJlZnMtLTtcblx0XHRcdG1heVJlbW92ZS5wdXNoKGRvbVN0eWxlKTtcblx0XHR9XG5cblx0XHRpZihuZXdMaXN0KSB7XG5cdFx0XHR2YXIgbmV3U3R5bGVzID0gbGlzdFRvU3R5bGVzKG5ld0xpc3QsIG9wdGlvbnMpO1xuXHRcdFx0YWRkU3R5bGVzVG9Eb20obmV3U3R5bGVzLCBvcHRpb25zKTtcblx0XHR9XG5cblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IG1heVJlbW92ZS5sZW5ndGg7IGkrKykge1xuXHRcdFx0dmFyIGRvbVN0eWxlID0gbWF5UmVtb3ZlW2ldO1xuXG5cdFx0XHRpZihkb21TdHlsZS5yZWZzID09PSAwKSB7XG5cdFx0XHRcdGZvciAodmFyIGogPSAwOyBqIDwgZG9tU3R5bGUucGFydHMubGVuZ3RoOyBqKyspIGRvbVN0eWxlLnBhcnRzW2pdKCk7XG5cblx0XHRcdFx0ZGVsZXRlIHN0eWxlc0luRG9tW2RvbVN0eWxlLmlkXTtcblx0XHRcdH1cblx0XHR9XG5cdH07XG59O1xuXG5mdW5jdGlvbiBhZGRTdHlsZXNUb0RvbSAoc3R5bGVzLCBvcHRpb25zKSB7XG5cdGZvciAodmFyIGkgPSAwOyBpIDwgc3R5bGVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0dmFyIGl0ZW0gPSBzdHlsZXNbaV07XG5cdFx0dmFyIGRvbVN0eWxlID0gc3R5bGVzSW5Eb21baXRlbS5pZF07XG5cblx0XHRpZihkb21TdHlsZSkge1xuXHRcdFx0ZG9tU3R5bGUucmVmcysrO1xuXG5cdFx0XHRmb3IodmFyIGogPSAwOyBqIDwgZG9tU3R5bGUucGFydHMubGVuZ3RoOyBqKyspIHtcblx0XHRcdFx0ZG9tU3R5bGUucGFydHNbal0oaXRlbS5wYXJ0c1tqXSk7XG5cdFx0XHR9XG5cblx0XHRcdGZvcig7IGogPCBpdGVtLnBhcnRzLmxlbmd0aDsgaisrKSB7XG5cdFx0XHRcdGRvbVN0eWxlLnBhcnRzLnB1c2goYWRkU3R5bGUoaXRlbS5wYXJ0c1tqXSwgb3B0aW9ucykpO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cdFx0XHR2YXIgcGFydHMgPSBbXTtcblxuXHRcdFx0Zm9yKHZhciBqID0gMDsgaiA8IGl0ZW0ucGFydHMubGVuZ3RoOyBqKyspIHtcblx0XHRcdFx0cGFydHMucHVzaChhZGRTdHlsZShpdGVtLnBhcnRzW2pdLCBvcHRpb25zKSk7XG5cdFx0XHR9XG5cblx0XHRcdHN0eWxlc0luRG9tW2l0ZW0uaWRdID0ge2lkOiBpdGVtLmlkLCByZWZzOiAxLCBwYXJ0czogcGFydHN9O1xuXHRcdH1cblx0fVxufVxuXG5mdW5jdGlvbiBsaXN0VG9TdHlsZXMgKGxpc3QsIG9wdGlvbnMpIHtcblx0dmFyIHN0eWxlcyA9IFtdO1xuXHR2YXIgbmV3U3R5bGVzID0ge307XG5cblx0Zm9yICh2YXIgaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKSB7XG5cdFx0dmFyIGl0ZW0gPSBsaXN0W2ldO1xuXHRcdHZhciBpZCA9IG9wdGlvbnMuYmFzZSA/IGl0ZW1bMF0gKyBvcHRpb25zLmJhc2UgOiBpdGVtWzBdO1xuXHRcdHZhciBjc3MgPSBpdGVtWzFdO1xuXHRcdHZhciBtZWRpYSA9IGl0ZW1bMl07XG5cdFx0dmFyIHNvdXJjZU1hcCA9IGl0ZW1bM107XG5cdFx0dmFyIHBhcnQgPSB7Y3NzOiBjc3MsIG1lZGlhOiBtZWRpYSwgc291cmNlTWFwOiBzb3VyY2VNYXB9O1xuXG5cdFx0aWYoIW5ld1N0eWxlc1tpZF0pIHN0eWxlcy5wdXNoKG5ld1N0eWxlc1tpZF0gPSB7aWQ6IGlkLCBwYXJ0czogW3BhcnRdfSk7XG5cdFx0ZWxzZSBuZXdTdHlsZXNbaWRdLnBhcnRzLnB1c2gocGFydCk7XG5cdH1cblxuXHRyZXR1cm4gc3R5bGVzO1xufVxuXG5mdW5jdGlvbiBpbnNlcnRTdHlsZUVsZW1lbnQgKG9wdGlvbnMsIHN0eWxlKSB7XG5cdHZhciB0YXJnZXQgPSBnZXRFbGVtZW50KG9wdGlvbnMuaW5zZXJ0SW50bylcblxuXHRpZiAoIXRhcmdldCkge1xuXHRcdHRocm93IG5ldyBFcnJvcihcIkNvdWxkbid0IGZpbmQgYSBzdHlsZSB0YXJnZXQuIFRoaXMgcHJvYmFibHkgbWVhbnMgdGhhdCB0aGUgdmFsdWUgZm9yIHRoZSAnaW5zZXJ0SW50bycgcGFyYW1ldGVyIGlzIGludmFsaWQuXCIpO1xuXHR9XG5cblx0dmFyIGxhc3RTdHlsZUVsZW1lbnRJbnNlcnRlZEF0VG9wID0gc3R5bGVzSW5zZXJ0ZWRBdFRvcFtzdHlsZXNJbnNlcnRlZEF0VG9wLmxlbmd0aCAtIDFdO1xuXG5cdGlmIChvcHRpb25zLmluc2VydEF0ID09PSBcInRvcFwiKSB7XG5cdFx0aWYgKCFsYXN0U3R5bGVFbGVtZW50SW5zZXJ0ZWRBdFRvcCkge1xuXHRcdFx0dGFyZ2V0Lmluc2VydEJlZm9yZShzdHlsZSwgdGFyZ2V0LmZpcnN0Q2hpbGQpO1xuXHRcdH0gZWxzZSBpZiAobGFzdFN0eWxlRWxlbWVudEluc2VydGVkQXRUb3AubmV4dFNpYmxpbmcpIHtcblx0XHRcdHRhcmdldC5pbnNlcnRCZWZvcmUoc3R5bGUsIGxhc3RTdHlsZUVsZW1lbnRJbnNlcnRlZEF0VG9wLm5leHRTaWJsaW5nKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dGFyZ2V0LmFwcGVuZENoaWxkKHN0eWxlKTtcblx0XHR9XG5cdFx0c3R5bGVzSW5zZXJ0ZWRBdFRvcC5wdXNoKHN0eWxlKTtcblx0fSBlbHNlIGlmIChvcHRpb25zLmluc2VydEF0ID09PSBcImJvdHRvbVwiKSB7XG5cdFx0dGFyZ2V0LmFwcGVuZENoaWxkKHN0eWxlKTtcblx0fSBlbHNlIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIHZhbHVlIGZvciBwYXJhbWV0ZXIgJ2luc2VydEF0Jy4gTXVzdCBiZSAndG9wJyBvciAnYm90dG9tJy5cIik7XG5cdH1cbn1cblxuZnVuY3Rpb24gcmVtb3ZlU3R5bGVFbGVtZW50IChzdHlsZSkge1xuXHRpZiAoc3R5bGUucGFyZW50Tm9kZSA9PT0gbnVsbCkgcmV0dXJuIGZhbHNlO1xuXHRzdHlsZS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHN0eWxlKTtcblxuXHR2YXIgaWR4ID0gc3R5bGVzSW5zZXJ0ZWRBdFRvcC5pbmRleE9mKHN0eWxlKTtcblx0aWYoaWR4ID49IDApIHtcblx0XHRzdHlsZXNJbnNlcnRlZEF0VG9wLnNwbGljZShpZHgsIDEpO1xuXHR9XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZVN0eWxlRWxlbWVudCAob3B0aW9ucykge1xuXHR2YXIgc3R5bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3R5bGVcIik7XG5cblx0b3B0aW9ucy5hdHRycy50eXBlID0gXCJ0ZXh0L2Nzc1wiO1xuXG5cdGFkZEF0dHJzKHN0eWxlLCBvcHRpb25zLmF0dHJzKTtcblx0aW5zZXJ0U3R5bGVFbGVtZW50KG9wdGlvbnMsIHN0eWxlKTtcblxuXHRyZXR1cm4gc3R5bGU7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUxpbmtFbGVtZW50IChvcHRpb25zKSB7XG5cdHZhciBsaW5rID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImxpbmtcIik7XG5cblx0b3B0aW9ucy5hdHRycy50eXBlID0gXCJ0ZXh0L2Nzc1wiO1xuXHRvcHRpb25zLmF0dHJzLnJlbCA9IFwic3R5bGVzaGVldFwiO1xuXG5cdGFkZEF0dHJzKGxpbmssIG9wdGlvbnMuYXR0cnMpO1xuXHRpbnNlcnRTdHlsZUVsZW1lbnQob3B0aW9ucywgbGluayk7XG5cblx0cmV0dXJuIGxpbms7XG59XG5cbmZ1bmN0aW9uIGFkZEF0dHJzIChlbCwgYXR0cnMpIHtcblx0T2JqZWN0LmtleXMoYXR0cnMpLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuXHRcdGVsLnNldEF0dHJpYnV0ZShrZXksIGF0dHJzW2tleV0pO1xuXHR9KTtcbn1cblxuZnVuY3Rpb24gYWRkU3R5bGUgKG9iaiwgb3B0aW9ucykge1xuXHR2YXIgc3R5bGUsIHVwZGF0ZSwgcmVtb3ZlLCByZXN1bHQ7XG5cblx0Ly8gSWYgYSB0cmFuc2Zvcm0gZnVuY3Rpb24gd2FzIGRlZmluZWQsIHJ1biBpdCBvbiB0aGUgY3NzXG5cdGlmIChvcHRpb25zLnRyYW5zZm9ybSAmJiBvYmouY3NzKSB7XG5cdCAgICByZXN1bHQgPSBvcHRpb25zLnRyYW5zZm9ybShvYmouY3NzKTtcblxuXHQgICAgaWYgKHJlc3VsdCkge1xuXHQgICAgXHQvLyBJZiB0cmFuc2Zvcm0gcmV0dXJucyBhIHZhbHVlLCB1c2UgdGhhdCBpbnN0ZWFkIG9mIHRoZSBvcmlnaW5hbCBjc3MuXG5cdCAgICBcdC8vIFRoaXMgYWxsb3dzIHJ1bm5pbmcgcnVudGltZSB0cmFuc2Zvcm1hdGlvbnMgb24gdGhlIGNzcy5cblx0ICAgIFx0b2JqLmNzcyA9IHJlc3VsdDtcblx0ICAgIH0gZWxzZSB7XG5cdCAgICBcdC8vIElmIHRoZSB0cmFuc2Zvcm0gZnVuY3Rpb24gcmV0dXJucyBhIGZhbHN5IHZhbHVlLCBkb24ndCBhZGQgdGhpcyBjc3MuXG5cdCAgICBcdC8vIFRoaXMgYWxsb3dzIGNvbmRpdGlvbmFsIGxvYWRpbmcgb2YgY3NzXG5cdCAgICBcdHJldHVybiBmdW5jdGlvbigpIHtcblx0ICAgIFx0XHQvLyBub29wXG5cdCAgICBcdH07XG5cdCAgICB9XG5cdH1cblxuXHRpZiAob3B0aW9ucy5zaW5nbGV0b24pIHtcblx0XHR2YXIgc3R5bGVJbmRleCA9IHNpbmdsZXRvbkNvdW50ZXIrKztcblxuXHRcdHN0eWxlID0gc2luZ2xldG9uIHx8IChzaW5nbGV0b24gPSBjcmVhdGVTdHlsZUVsZW1lbnQob3B0aW9ucykpO1xuXG5cdFx0dXBkYXRlID0gYXBwbHlUb1NpbmdsZXRvblRhZy5iaW5kKG51bGwsIHN0eWxlLCBzdHlsZUluZGV4LCBmYWxzZSk7XG5cdFx0cmVtb3ZlID0gYXBwbHlUb1NpbmdsZXRvblRhZy5iaW5kKG51bGwsIHN0eWxlLCBzdHlsZUluZGV4LCB0cnVlKTtcblxuXHR9IGVsc2UgaWYgKFxuXHRcdG9iai5zb3VyY2VNYXAgJiZcblx0XHR0eXBlb2YgVVJMID09PSBcImZ1bmN0aW9uXCIgJiZcblx0XHR0eXBlb2YgVVJMLmNyZWF0ZU9iamVjdFVSTCA9PT0gXCJmdW5jdGlvblwiICYmXG5cdFx0dHlwZW9mIFVSTC5yZXZva2VPYmplY3RVUkwgPT09IFwiZnVuY3Rpb25cIiAmJlxuXHRcdHR5cGVvZiBCbG9iID09PSBcImZ1bmN0aW9uXCIgJiZcblx0XHR0eXBlb2YgYnRvYSA9PT0gXCJmdW5jdGlvblwiXG5cdCkge1xuXHRcdHN0eWxlID0gY3JlYXRlTGlua0VsZW1lbnQob3B0aW9ucyk7XG5cdFx0dXBkYXRlID0gdXBkYXRlTGluay5iaW5kKG51bGwsIHN0eWxlLCBvcHRpb25zKTtcblx0XHRyZW1vdmUgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHRyZW1vdmVTdHlsZUVsZW1lbnQoc3R5bGUpO1xuXG5cdFx0XHRpZihzdHlsZS5ocmVmKSBVUkwucmV2b2tlT2JqZWN0VVJMKHN0eWxlLmhyZWYpO1xuXHRcdH07XG5cdH0gZWxzZSB7XG5cdFx0c3R5bGUgPSBjcmVhdGVTdHlsZUVsZW1lbnQob3B0aW9ucyk7XG5cdFx0dXBkYXRlID0gYXBwbHlUb1RhZy5iaW5kKG51bGwsIHN0eWxlKTtcblx0XHRyZW1vdmUgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHRyZW1vdmVTdHlsZUVsZW1lbnQoc3R5bGUpO1xuXHRcdH07XG5cdH1cblxuXHR1cGRhdGUob2JqKTtcblxuXHRyZXR1cm4gZnVuY3Rpb24gdXBkYXRlU3R5bGUgKG5ld09iaikge1xuXHRcdGlmIChuZXdPYmopIHtcblx0XHRcdGlmIChcblx0XHRcdFx0bmV3T2JqLmNzcyA9PT0gb2JqLmNzcyAmJlxuXHRcdFx0XHRuZXdPYmoubWVkaWEgPT09IG9iai5tZWRpYSAmJlxuXHRcdFx0XHRuZXdPYmouc291cmNlTWFwID09PSBvYmouc291cmNlTWFwXG5cdFx0XHQpIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHR1cGRhdGUob2JqID0gbmV3T2JqKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0cmVtb3ZlKCk7XG5cdFx0fVxuXHR9O1xufVxuXG52YXIgcmVwbGFjZVRleHQgPSAoZnVuY3Rpb24gKCkge1xuXHR2YXIgdGV4dFN0b3JlID0gW107XG5cblx0cmV0dXJuIGZ1bmN0aW9uIChpbmRleCwgcmVwbGFjZW1lbnQpIHtcblx0XHR0ZXh0U3RvcmVbaW5kZXhdID0gcmVwbGFjZW1lbnQ7XG5cblx0XHRyZXR1cm4gdGV4dFN0b3JlLmZpbHRlcihCb29sZWFuKS5qb2luKCdcXG4nKTtcblx0fTtcbn0pKCk7XG5cbmZ1bmN0aW9uIGFwcGx5VG9TaW5nbGV0b25UYWcgKHN0eWxlLCBpbmRleCwgcmVtb3ZlLCBvYmopIHtcblx0dmFyIGNzcyA9IHJlbW92ZSA/IFwiXCIgOiBvYmouY3NzO1xuXG5cdGlmIChzdHlsZS5zdHlsZVNoZWV0KSB7XG5cdFx0c3R5bGUuc3R5bGVTaGVldC5jc3NUZXh0ID0gcmVwbGFjZVRleHQoaW5kZXgsIGNzcyk7XG5cdH0gZWxzZSB7XG5cdFx0dmFyIGNzc05vZGUgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShjc3MpO1xuXHRcdHZhciBjaGlsZE5vZGVzID0gc3R5bGUuY2hpbGROb2RlcztcblxuXHRcdGlmIChjaGlsZE5vZGVzW2luZGV4XSkgc3R5bGUucmVtb3ZlQ2hpbGQoY2hpbGROb2Rlc1tpbmRleF0pO1xuXG5cdFx0aWYgKGNoaWxkTm9kZXMubGVuZ3RoKSB7XG5cdFx0XHRzdHlsZS5pbnNlcnRCZWZvcmUoY3NzTm9kZSwgY2hpbGROb2Rlc1tpbmRleF0pO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRzdHlsZS5hcHBlbmRDaGlsZChjc3NOb2RlKTtcblx0XHR9XG5cdH1cbn1cblxuZnVuY3Rpb24gYXBwbHlUb1RhZyAoc3R5bGUsIG9iaikge1xuXHR2YXIgY3NzID0gb2JqLmNzcztcblx0dmFyIG1lZGlhID0gb2JqLm1lZGlhO1xuXG5cdGlmKG1lZGlhKSB7XG5cdFx0c3R5bGUuc2V0QXR0cmlidXRlKFwibWVkaWFcIiwgbWVkaWEpXG5cdH1cblxuXHRpZihzdHlsZS5zdHlsZVNoZWV0KSB7XG5cdFx0c3R5bGUuc3R5bGVTaGVldC5jc3NUZXh0ID0gY3NzO1xuXHR9IGVsc2Uge1xuXHRcdHdoaWxlKHN0eWxlLmZpcnN0Q2hpbGQpIHtcblx0XHRcdHN0eWxlLnJlbW92ZUNoaWxkKHN0eWxlLmZpcnN0Q2hpbGQpO1xuXHRcdH1cblxuXHRcdHN0eWxlLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGNzcykpO1xuXHR9XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZUxpbmsgKGxpbmssIG9wdGlvbnMsIG9iaikge1xuXHR2YXIgY3NzID0gb2JqLmNzcztcblx0dmFyIHNvdXJjZU1hcCA9IG9iai5zb3VyY2VNYXA7XG5cblx0Lypcblx0XHRJZiBjb252ZXJ0VG9BYnNvbHV0ZVVybHMgaXNuJ3QgZGVmaW5lZCwgYnV0IHNvdXJjZW1hcHMgYXJlIGVuYWJsZWRcblx0XHRhbmQgdGhlcmUgaXMgbm8gcHVibGljUGF0aCBkZWZpbmVkIHRoZW4gbGV0cyB0dXJuIGNvbnZlcnRUb0Fic29sdXRlVXJsc1xuXHRcdG9uIGJ5IGRlZmF1bHQuICBPdGhlcndpc2UgZGVmYXVsdCB0byB0aGUgY29udmVydFRvQWJzb2x1dGVVcmxzIG9wdGlvblxuXHRcdGRpcmVjdGx5XG5cdCovXG5cdHZhciBhdXRvRml4VXJscyA9IG9wdGlvbnMuY29udmVydFRvQWJzb2x1dGVVcmxzID09PSB1bmRlZmluZWQgJiYgc291cmNlTWFwO1xuXG5cdGlmIChvcHRpb25zLmNvbnZlcnRUb0Fic29sdXRlVXJscyB8fCBhdXRvRml4VXJscykge1xuXHRcdGNzcyA9IGZpeFVybHMoY3NzKTtcblx0fVxuXG5cdGlmIChzb3VyY2VNYXApIHtcblx0XHQvLyBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8yNjYwMzg3NVxuXHRcdGNzcyArPSBcIlxcbi8qIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsXCIgKyBidG9hKHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChKU09OLnN0cmluZ2lmeShzb3VyY2VNYXApKSkpICsgXCIgKi9cIjtcblx0fVxuXG5cdHZhciBibG9iID0gbmV3IEJsb2IoW2Nzc10sIHsgdHlwZTogXCJ0ZXh0L2Nzc1wiIH0pO1xuXG5cdHZhciBvbGRTcmMgPSBsaW5rLmhyZWY7XG5cblx0bGluay5ocmVmID0gVVJMLmNyZWF0ZU9iamVjdFVSTChibG9iKTtcblxuXHRpZihvbGRTcmMpIFVSTC5yZXZva2VPYmplY3RVUkwob2xkU3JjKTtcbn1cblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9saWIvYWRkU3R5bGVzLmpzXG4vLyBtb2R1bGUgaWQgPSAxXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCAnLi9jc3MvcmVzZXQuY3NzJztcclxuaW1wb3J0ICcuL2Nzcy9pbmRleC5jc3MnO1xyXG5yZXF1aXJlKCcuL2pzL21haW4uanMnKTtcclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2luZGV4LmpzIiwiLy8gc3R5bGUtbG9hZGVyOiBBZGRzIHNvbWUgY3NzIHRvIHRoZSBET00gYnkgYWRkaW5nIGEgPHN0eWxlPiB0YWdcblxuLy8gbG9hZCB0aGUgc3R5bGVzXG52YXIgY29udGVudCA9IHJlcXVpcmUoXCIhIS4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2luZGV4LmpzIS4vcmVzZXQuY3NzXCIpO1xuaWYodHlwZW9mIGNvbnRlbnQgPT09ICdzdHJpbmcnKSBjb250ZW50ID0gW1ttb2R1bGUuaWQsIGNvbnRlbnQsICcnXV07XG4vLyBQcmVwYXJlIGNzc1RyYW5zZm9ybWF0aW9uXG52YXIgdHJhbnNmb3JtO1xuXG52YXIgb3B0aW9ucyA9IHt9XG5vcHRpb25zLnRyYW5zZm9ybSA9IHRyYW5zZm9ybVxuLy8gYWRkIHRoZSBzdHlsZXMgdG8gdGhlIERPTVxudmFyIHVwZGF0ZSA9IHJlcXVpcmUoXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9saWIvYWRkU3R5bGVzLmpzXCIpKGNvbnRlbnQsIG9wdGlvbnMpO1xuaWYoY29udGVudC5sb2NhbHMpIG1vZHVsZS5leHBvcnRzID0gY29udGVudC5sb2NhbHM7XG4vLyBIb3QgTW9kdWxlIFJlcGxhY2VtZW50XG5pZihtb2R1bGUuaG90KSB7XG5cdC8vIFdoZW4gdGhlIHN0eWxlcyBjaGFuZ2UsIHVwZGF0ZSB0aGUgPHN0eWxlPiB0YWdzXG5cdGlmKCFjb250ZW50LmxvY2Fscykge1xuXHRcdG1vZHVsZS5ob3QuYWNjZXB0KFwiISEuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcyEuL3Jlc2V0LmNzc1wiLCBmdW5jdGlvbigpIHtcblx0XHRcdHZhciBuZXdDb250ZW50ID0gcmVxdWlyZShcIiEhLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanMhLi9yZXNldC5jc3NcIik7XG5cdFx0XHRpZih0eXBlb2YgbmV3Q29udGVudCA9PT0gJ3N0cmluZycpIG5ld0NvbnRlbnQgPSBbW21vZHVsZS5pZCwgbmV3Q29udGVudCwgJyddXTtcblx0XHRcdHVwZGF0ZShuZXdDb250ZW50KTtcblx0XHR9KTtcblx0fVxuXHQvLyBXaGVuIHRoZSBtb2R1bGUgaXMgZGlzcG9zZWQsIHJlbW92ZSB0aGUgPHN0eWxlPiB0YWdzXG5cdG1vZHVsZS5ob3QuZGlzcG9zZShmdW5jdGlvbigpIHsgdXBkYXRlKCk7IH0pO1xufVxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2Nzcy9yZXNldC5jc3Ncbi8vIG1vZHVsZSBpZCA9IDNcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIi4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2xpYi9jc3MtYmFzZS5qc1wiKSh1bmRlZmluZWQpO1xuLy8gaW1wb3J0c1xuXG5cbi8vIG1vZHVsZVxuZXhwb3J0cy5wdXNoKFttb2R1bGUuaWQsIFwiLyoqKiBcXHJcXG4gKioqIHJlc2V0IFxcclxcbioqKi9cXHJcXG5odG1sLCBib2R5LCBkaXYsIHNwYW4sIGFwcGxldCwgb2JqZWN0LCBpZnJhbWUsXFxyXFxuaDEsIGgyLCBoMywgaDQsIGg1LCBoNiwgcCwgYmxvY2txdW90ZSwgcHJlLFxcclxcbmEsIGFiYnIsIGFjcm9ueW0sIGFkZHJlc3MsIGJpZywgY2l0ZSwgY29kZSxcXHJcXG5kZWwsIGRmbiwgZW0sIGltZywgaW5zLCBrYmQsIHEsIHMsIHNhbXAsXFxyXFxuc21hbGwsIHN0cmlrZSwgc3Ryb25nLCBzdWIsIHN1cCwgdHQsIHZhcixcXHJcXG5iLCB1LCBpLCBjZW50ZXIsXFxyXFxuZGwsIGR0LCBkZCwgb2wsIHVsLCBsaSxcXHJcXG5maWVsZHNldCwgZm9ybSwgbGFiZWwsIGxlZ2VuZCxcXHJcXG50YWJsZSwgY2FwdGlvbiwgdGJvZHksIHRmb290LCB0aGVhZCwgdHIsIHRoLCB0ZCxcXHJcXG5hcnRpY2xlLCBhc2lkZSwgY2FudmFzLCBkZXRhaWxzLCBlbWJlZCwgXFxyXFxuZmlndXJlLCBmaWdjYXB0aW9uLCBmb290ZXIsIGhlYWRlciwgaGdyb3VwLCBcXHJcXG5tZW51LCBuYXYsIG91dHB1dCwgcnVieSwgc2VjdGlvbiwgc3VtbWFyeSxcXHJcXG50aW1lLCBtYXJrLCBhdWRpbywgdmlkZW8ge1xcclxcblxcdG1hcmdpbjogMDtcXHJcXG5cXHRwYWRkaW5nOiAwO1xcclxcblxcdGJvcmRlcjogMDtcXHJcXG5cXHRmb250LXNpemU6IDEwMCU7XFxyXFxuXFx0Zm9udC1mYW1pbHk6ICdtaWNyb3NvZnQgeWFoZWknLEFyaWFsLHNhbnMtc2VyaWY7XFxyXFxuXFx0Lypmb250OiBpbmhlcml0OyovXFxyXFxuXFx0dmVydGljYWwtYWxpZ246IGJhc2VsaW5lO1xcclxcbn1cXHJcXG4vKiBIVE1MNSBkaXNwbGF5LXJvbGUgcmVzZXQgZm9yIG9sZGVyIGJyb3dzZXJzICovXFxyXFxuYXJ0aWNsZSwgYXNpZGUsIGRldGFpbHMsIGZpZ2NhcHRpb24sIGZpZ3VyZSwgXFxyXFxuZm9vdGVyLCBoZWFkZXIsIGhncm91cCwgbWVudSwgbmF2LCBzZWN0aW9uIHtcXHJcXG5cXHRkaXNwbGF5OiBibG9jaztcXHJcXG59XFxyXFxuYm9keSB7XFxyXFxuXFx0bGluZS1oZWlnaHQ6IDE7XFxyXFxufVxcclxcbm9sLCB1bCB7XFxyXFxuXFx0bGlzdC1zdHlsZTogbm9uZTtcXHJcXG59XFxyXFxuYmxvY2txdW90ZSwgcSB7XFxyXFxuXFx0cXVvdGVzOiBub25lO1xcclxcbn1cXHJcXG5ibG9ja3F1b3RlOmJlZm9yZSwgYmxvY2txdW90ZTphZnRlcixcXHJcXG5xOmJlZm9yZSwgcTphZnRlciB7XFxyXFxuXFx0Y29udGVudDogJyc7XFxyXFxuXFx0Y29udGVudDogbm9uZTtcXHJcXG59XFxyXFxudGFibGUge1xcclxcblxcdGJvcmRlci1jb2xsYXBzZTogY29sbGFwc2U7XFxyXFxuXFx0Ym9yZGVyLXNwYWNpbmc6IDA7XFxyXFxufVwiLCBcIlwiXSk7XG5cbi8vIGV4cG9ydHNcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIhLi9zcmMvY3NzL3Jlc2V0LmNzc1xuLy8gbW9kdWxlIGlkID0gNFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJcbi8qKlxuICogV2hlbiBzb3VyY2UgbWFwcyBhcmUgZW5hYmxlZCwgYHN0eWxlLWxvYWRlcmAgdXNlcyBhIGxpbmsgZWxlbWVudCB3aXRoIGEgZGF0YS11cmkgdG9cbiAqIGVtYmVkIHRoZSBjc3Mgb24gdGhlIHBhZ2UuIFRoaXMgYnJlYWtzIGFsbCByZWxhdGl2ZSB1cmxzIGJlY2F1c2Ugbm93IHRoZXkgYXJlIHJlbGF0aXZlIHRvIGFcbiAqIGJ1bmRsZSBpbnN0ZWFkIG9mIHRoZSBjdXJyZW50IHBhZ2UuXG4gKlxuICogT25lIHNvbHV0aW9uIGlzIHRvIG9ubHkgdXNlIGZ1bGwgdXJscywgYnV0IHRoYXQgbWF5IGJlIGltcG9zc2libGUuXG4gKlxuICogSW5zdGVhZCwgdGhpcyBmdW5jdGlvbiBcImZpeGVzXCIgdGhlIHJlbGF0aXZlIHVybHMgdG8gYmUgYWJzb2x1dGUgYWNjb3JkaW5nIHRvIHRoZSBjdXJyZW50IHBhZ2UgbG9jYXRpb24uXG4gKlxuICogQSBydWRpbWVudGFyeSB0ZXN0IHN1aXRlIGlzIGxvY2F0ZWQgYXQgYHRlc3QvZml4VXJscy5qc2AgYW5kIGNhbiBiZSBydW4gdmlhIHRoZSBgbnBtIHRlc3RgIGNvbW1hbmQuXG4gKlxuICovXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGNzcykge1xuICAvLyBnZXQgY3VycmVudCBsb2NhdGlvblxuICB2YXIgbG9jYXRpb24gPSB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiICYmIHdpbmRvdy5sb2NhdGlvbjtcblxuICBpZiAoIWxvY2F0aW9uKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiZml4VXJscyByZXF1aXJlcyB3aW5kb3cubG9jYXRpb25cIik7XG4gIH1cblxuXHQvLyBibGFuayBvciBudWxsP1xuXHRpZiAoIWNzcyB8fCB0eXBlb2YgY3NzICE9PSBcInN0cmluZ1wiKSB7XG5cdCAgcmV0dXJuIGNzcztcbiAgfVxuXG4gIHZhciBiYXNlVXJsID0gbG9jYXRpb24ucHJvdG9jb2wgKyBcIi8vXCIgKyBsb2NhdGlvbi5ob3N0O1xuICB2YXIgY3VycmVudERpciA9IGJhc2VVcmwgKyBsb2NhdGlvbi5wYXRobmFtZS5yZXBsYWNlKC9cXC9bXlxcL10qJC8sIFwiL1wiKTtcblxuXHQvLyBjb252ZXJ0IGVhY2ggdXJsKC4uLilcblx0Lypcblx0VGhpcyByZWd1bGFyIGV4cHJlc3Npb24gaXMganVzdCBhIHdheSB0byByZWN1cnNpdmVseSBtYXRjaCBicmFja2V0cyB3aXRoaW5cblx0YSBzdHJpbmcuXG5cblx0IC91cmxcXHMqXFwoICA9IE1hdGNoIG9uIHRoZSB3b3JkIFwidXJsXCIgd2l0aCBhbnkgd2hpdGVzcGFjZSBhZnRlciBpdCBhbmQgdGhlbiBhIHBhcmVuc1xuXHQgICAoICA9IFN0YXJ0IGEgY2FwdHVyaW5nIGdyb3VwXG5cdCAgICAgKD86ICA9IFN0YXJ0IGEgbm9uLWNhcHR1cmluZyBncm91cFxuXHQgICAgICAgICBbXikoXSAgPSBNYXRjaCBhbnl0aGluZyB0aGF0IGlzbid0IGEgcGFyZW50aGVzZXNcblx0ICAgICAgICAgfCAgPSBPUlxuXHQgICAgICAgICBcXCggID0gTWF0Y2ggYSBzdGFydCBwYXJlbnRoZXNlc1xuXHQgICAgICAgICAgICAgKD86ICA9IFN0YXJ0IGFub3RoZXIgbm9uLWNhcHR1cmluZyBncm91cHNcblx0ICAgICAgICAgICAgICAgICBbXikoXSsgID0gTWF0Y2ggYW55dGhpbmcgdGhhdCBpc24ndCBhIHBhcmVudGhlc2VzXG5cdCAgICAgICAgICAgICAgICAgfCAgPSBPUlxuXHQgICAgICAgICAgICAgICAgIFxcKCAgPSBNYXRjaCBhIHN0YXJ0IHBhcmVudGhlc2VzXG5cdCAgICAgICAgICAgICAgICAgICAgIFteKShdKiAgPSBNYXRjaCBhbnl0aGluZyB0aGF0IGlzbid0IGEgcGFyZW50aGVzZXNcblx0ICAgICAgICAgICAgICAgICBcXCkgID0gTWF0Y2ggYSBlbmQgcGFyZW50aGVzZXNcblx0ICAgICAgICAgICAgICkgID0gRW5kIEdyb3VwXG4gICAgICAgICAgICAgICpcXCkgPSBNYXRjaCBhbnl0aGluZyBhbmQgdGhlbiBhIGNsb3NlIHBhcmVuc1xuICAgICAgICAgICkgID0gQ2xvc2Ugbm9uLWNhcHR1cmluZyBncm91cFxuICAgICAgICAgICogID0gTWF0Y2ggYW55dGhpbmdcbiAgICAgICApICA9IENsb3NlIGNhcHR1cmluZyBncm91cFxuXHQgXFwpICA9IE1hdGNoIGEgY2xvc2UgcGFyZW5zXG5cblx0IC9naSAgPSBHZXQgYWxsIG1hdGNoZXMsIG5vdCB0aGUgZmlyc3QuICBCZSBjYXNlIGluc2Vuc2l0aXZlLlxuXHQgKi9cblx0dmFyIGZpeGVkQ3NzID0gY3NzLnJlcGxhY2UoL3VybFxccypcXCgoKD86W14pKF18XFwoKD86W14pKF0rfFxcKFteKShdKlxcKSkqXFwpKSopXFwpL2dpLCBmdW5jdGlvbihmdWxsTWF0Y2gsIG9yaWdVcmwpIHtcblx0XHQvLyBzdHJpcCBxdW90ZXMgKGlmIHRoZXkgZXhpc3QpXG5cdFx0dmFyIHVucXVvdGVkT3JpZ1VybCA9IG9yaWdVcmxcblx0XHRcdC50cmltKClcblx0XHRcdC5yZXBsYWNlKC9eXCIoLiopXCIkLywgZnVuY3Rpb24obywgJDEpeyByZXR1cm4gJDE7IH0pXG5cdFx0XHQucmVwbGFjZSgvXicoLiopJyQvLCBmdW5jdGlvbihvLCAkMSl7IHJldHVybiAkMTsgfSk7XG5cblx0XHQvLyBhbHJlYWR5IGEgZnVsbCB1cmw/IG5vIGNoYW5nZVxuXHRcdGlmICgvXigjfGRhdGE6fGh0dHA6XFwvXFwvfGh0dHBzOlxcL1xcL3xmaWxlOlxcL1xcL1xcLykvaS50ZXN0KHVucXVvdGVkT3JpZ1VybCkpIHtcblx0XHQgIHJldHVybiBmdWxsTWF0Y2g7XG5cdFx0fVxuXG5cdFx0Ly8gY29udmVydCB0aGUgdXJsIHRvIGEgZnVsbCB1cmxcblx0XHR2YXIgbmV3VXJsO1xuXG5cdFx0aWYgKHVucXVvdGVkT3JpZ1VybC5pbmRleE9mKFwiLy9cIikgPT09IDApIHtcblx0XHQgIFx0Ly9UT0RPOiBzaG91bGQgd2UgYWRkIHByb3RvY29sP1xuXHRcdFx0bmV3VXJsID0gdW5xdW90ZWRPcmlnVXJsO1xuXHRcdH0gZWxzZSBpZiAodW5xdW90ZWRPcmlnVXJsLmluZGV4T2YoXCIvXCIpID09PSAwKSB7XG5cdFx0XHQvLyBwYXRoIHNob3VsZCBiZSByZWxhdGl2ZSB0byB0aGUgYmFzZSB1cmxcblx0XHRcdG5ld1VybCA9IGJhc2VVcmwgKyB1bnF1b3RlZE9yaWdVcmw7IC8vIGFscmVhZHkgc3RhcnRzIHdpdGggJy8nXG5cdFx0fSBlbHNlIHtcblx0XHRcdC8vIHBhdGggc2hvdWxkIGJlIHJlbGF0aXZlIHRvIGN1cnJlbnQgZGlyZWN0b3J5XG5cdFx0XHRuZXdVcmwgPSBjdXJyZW50RGlyICsgdW5xdW90ZWRPcmlnVXJsLnJlcGxhY2UoL15cXC5cXC8vLCBcIlwiKTsgLy8gU3RyaXAgbGVhZGluZyAnLi8nXG5cdFx0fVxuXG5cdFx0Ly8gc2VuZCBiYWNrIHRoZSBmaXhlZCB1cmwoLi4uKVxuXHRcdHJldHVybiBcInVybChcIiArIEpTT04uc3RyaW5naWZ5KG5ld1VybCkgKyBcIilcIjtcblx0fSk7XG5cblx0Ly8gc2VuZCBiYWNrIHRoZSBmaXhlZCBjc3Ncblx0cmV0dXJuIGZpeGVkQ3NzO1xufTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9saWIvdXJscy5qc1xuLy8gbW9kdWxlIGlkID0gNVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvLyBzdHlsZS1sb2FkZXI6IEFkZHMgc29tZSBjc3MgdG8gdGhlIERPTSBieSBhZGRpbmcgYSA8c3R5bGU+IHRhZ1xuXG4vLyBsb2FkIHRoZSBzdHlsZXNcbnZhciBjb250ZW50ID0gcmVxdWlyZShcIiEhLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanMhLi9pbmRleC5jc3NcIik7XG5pZih0eXBlb2YgY29udGVudCA9PT0gJ3N0cmluZycpIGNvbnRlbnQgPSBbW21vZHVsZS5pZCwgY29udGVudCwgJyddXTtcbi8vIFByZXBhcmUgY3NzVHJhbnNmb3JtYXRpb25cbnZhciB0cmFuc2Zvcm07XG5cbnZhciBvcHRpb25zID0ge31cbm9wdGlvbnMudHJhbnNmb3JtID0gdHJhbnNmb3JtXG4vLyBhZGQgdGhlIHN0eWxlcyB0byB0aGUgRE9NXG52YXIgdXBkYXRlID0gcmVxdWlyZShcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2xpYi9hZGRTdHlsZXMuanNcIikoY29udGVudCwgb3B0aW9ucyk7XG5pZihjb250ZW50LmxvY2FscykgbW9kdWxlLmV4cG9ydHMgPSBjb250ZW50LmxvY2Fscztcbi8vIEhvdCBNb2R1bGUgUmVwbGFjZW1lbnRcbmlmKG1vZHVsZS5ob3QpIHtcblx0Ly8gV2hlbiB0aGUgc3R5bGVzIGNoYW5nZSwgdXBkYXRlIHRoZSA8c3R5bGU+IHRhZ3Ncblx0aWYoIWNvbnRlbnQubG9jYWxzKSB7XG5cdFx0bW9kdWxlLmhvdC5hY2NlcHQoXCIhIS4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2luZGV4LmpzIS4vaW5kZXguY3NzXCIsIGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIG5ld0NvbnRlbnQgPSByZXF1aXJlKFwiISEuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcyEuL2luZGV4LmNzc1wiKTtcblx0XHRcdGlmKHR5cGVvZiBuZXdDb250ZW50ID09PSAnc3RyaW5nJykgbmV3Q29udGVudCA9IFtbbW9kdWxlLmlkLCBuZXdDb250ZW50LCAnJ11dO1xuXHRcdFx0dXBkYXRlKG5ld0NvbnRlbnQpO1xuXHRcdH0pO1xuXHR9XG5cdC8vIFdoZW4gdGhlIG1vZHVsZSBpcyBkaXNwb3NlZCwgcmVtb3ZlIHRoZSA8c3R5bGU+IHRhZ3Ncblx0bW9kdWxlLmhvdC5kaXNwb3NlKGZ1bmN0aW9uKCkgeyB1cGRhdGUoKTsgfSk7XG59XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvY3NzL2luZGV4LmNzc1xuLy8gbW9kdWxlIGlkID0gNlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJleHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvbGliL2Nzcy1iYXNlLmpzXCIpKHVuZGVmaW5lZCk7XG4vLyBpbXBvcnRzXG5cblxuLy8gbW9kdWxlXG5leHBvcnRzLnB1c2goW21vZHVsZS5pZCwgXCJcXHJcXG5odG1sIGJvZHl7Zm9udC1mYW1pbHk6ICdtaWNyb3NvZnQgeWFoZWknLEFyaWFsLHNhbnMtc2VyaWY7fVxcclxcbi5sYXlvdXQtYm9keXtkaXNwbGF5OmZsZXg7fVxcclxcbi5sYXlvdXQtYm9keSAud3AtZHJhZ3tmbGV4OjI7aGVpZ2h0OjEwMHZoO2JvcmRlci1yaWdodDoxcHggc29saWQgI0NEQ0RDRDtib3gtc2l6aW5nOmJvcmRlci1ib3g7cGFkZGluZzoyNHB4O3Bvc2l0aW9uOiByZWxhdGl2ZTt9XFxyXFxuLmxheW91dC1ib2R5IC53cC1tZW51e2ZsZXg6MTtoZWlnaHQ6MTAwdmg7fVxcclxcblxcclxcbi53cC1kcmFnIC5kcmFnLW1haW57d2lkdGg6NTAlO2hlaWdodDo1MHZoO2NvbG9yOiNDRENEQ0Q7Ym9yZGVyOjNweCBkYXNoZWQ7Zm9udC1zaXplOjI0cHg7dGV4dC1hbGlnbjpjZW50ZXI7bGluZS1oZWlnaHQ6NTB2aDtwb3NpdGlvbjphYnNvbHV0ZTtsZWZ0OjUwJTt0b3A6NTAlO3RyYW5zZm9ybTp0cmFuc2xhdGUoLTUwJSwgLTUwJSk7b3BhY2l0eTowO31cXHJcXG4ud3AtZHJhZyAuZHJhZy1tYWluLmRyb3AtaG92ZXJ7b3BhY2l0eToxO31cXHJcXG5cXHJcXG4uZHJhZy1sb2cgcHtmb250LXdlaWdodDpub3JtYWw7Zm9udC1zaXplOjE0cHg7bGluZS1oZWlnaHQ6MS41O31cXHJcXG4uZHJhZy1sb2cgLnN1Y2N7Y29sb3I6IzQ1QkY1NTt9XFxyXFxuLmRyYWctbG9nIC5mYWlse2NvbG9yOiNGMjIyMzM7fVxcclxcblxcclxcbi5sYXlvdXQtYm9keSAud3AtbWVudSAubWVudS1vcHRpb25ze3BhZGRpbmc6MjBweDtmb250LXNpemU6MTRweDtoZWlnaHQ6NjB2aDtib3JkZXItYm90dG9tOjFweCBzb2xpZCAjQ0RDRENEO2JveC1zaXppbmc6Ym9yZGVyLWJveDt9XFxyXFxuLm1lbnUtb3B0aW9ucyB1bCBsaXttYXJnaW4tYm90dG9tOjEwcHg7fVxcclxcbmlucHV0W3R5cGU9Y2hlY2tib3hde3ZlcnRpY2FsLWFsaWduOi0ycHg7fVxcclxcblxcclxcbi5sYXlvdXQtYm9keSAud3AtbWVudSAubWVudS1hZGRyZXNze3BhZGRpbmc6MTBweCAyMHB4O2ZvbnQtc2l6ZToxNHB4O2hlaWdodDo0MHZoO2JveC1zaXppbmc6IGJvcmRlci1ib3g7fVxcclxcbi5tZW51LWFkZHJlc3MgaDN7Zm9udC1zaXplOjE0cHg7Zm9udC13ZWlnaHQ6bm9ybWFsO21hcmdpbi1ib3R0b206MTBweDttYXJnaW4tbGVmdDotMTBweDt9XCIsIFwiXCJdKTtcblxuLy8gZXhwb3J0c1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlciEuL3NyYy9jc3MvaW5kZXguY3NzXG4vLyBtb2R1bGUgaWQgPSA3XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmltcG9ydCBkcmFnRHJvcCBmcm9tICcuL2hwLWRyYWcnO1xyXG5pbXBvcnQgeyBoYW5kbGVDc3MsIGhhbmRsZUh0bWwsIGhhbmRsZUltYWdlIH0gZnJvbSAnLi9ocC1oYW5kbGVmaWxlJztcclxuY29uc3QgcGF0aCA9IGdsb2JhbC5yZXF1aXJlKCdwYXRoJyk7XHJcbmNvbnN0IGF1dG9wcmVmaXhlciA9IGdsb2JhbC5yZXF1aXJlKCdhdXRvcHJlZml4ZXInKTtcclxuY29uc3QgYXRJbXBvcnQgPSBnbG9iYWwucmVxdWlyZSgncG9zdGNzcy1pbXBvcnQnKTtcclxuY29uc3QgY3NzbmFubyA9IGdsb2JhbC5yZXF1aXJlKCdjc3NuYW5vJyk7XHJcbmNvbnN0IGNzc25leHQgPSBnbG9iYWwucmVxdWlyZSgncG9zdGNzcy1jc3NuZXh0Jyk7XHJcblxyXG4oZnVuY3Rpb24oKXtcclxuXHJcblx0Ly8g6I635Y+W55So5oi35omA6YCJ6YCJ6aG5XHJcblx0bGV0IG9wdGlvbnMgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnb3B0aW9ucycpO1xyXG5cdGlmKG9wdGlvbnMpIHtcclxuXHRcdG9wdGlvbnMuc3BsaXQoJywnKS5mb3JFYWNoKGZ1bmN0aW9uKGluZGV4KSB7XHJcblx0XHRcdGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5vcHRpb24nKVtpbmRleF0uY2hlY2tlZCA9IHRydWU7XHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cdGxldCBtb2RlID0gcGx1Z2luc0Fzc2VtYmxlKCk7XHJcblxyXG5cdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oZXZlbnQpe1xyXG5cdFx0aWYoZXZlbnQudGFyZ2V0LmNsYXNzTmFtZSA9PSAnb3B0aW9uJykge1xyXG5cdFx0XHRtb2RlID0gcGx1Z2luc0Fzc2VtYmxlKCk7XHJcblx0XHR9XHJcblx0fSk7XHJcblxyXG5cdC8vIOWkhOeQhuaLluaLveS6i+S7tlxyXG5cdGRyYWdEcm9wKGZ1bmN0aW9uKGZpbGUpe1xyXG5cclxuXHRcdFxyXG5cdFx0bGV0IHBhdGhPYmogPSBwYXRoLnBhcnNlKGZpbGVbMF0ucGF0aCk7XHJcblxyXG5cdFx0aWYoL2Nzcy8udGVzdChwYXRoT2JqLmV4dCkpIHtcdC8vIOS8oOWFpSBjc3Mg5paH5Lu2XHJcblxyXG5cdFx0XHRoYW5kbGVDc3MoZmlsZVswXS5wYXRoLCBtb2RlKTtcclxuXHJcblx0XHR9ZWxzZSBpZigvaHRtbC8udGVzdChwYXRoT2JqLmV4dCkpIHtcdC8vIOS8oOWFpSBodG1sIOaWh+S7tlxyXG5cclxuXHRcdFx0aGFuZGxlSHRtbChmaWxlWzBdLnBhdGgpO1xyXG5cclxuXHRcdH1lbHNlIHtcclxuXHJcblx0XHRcdGhhbmRsZUltYWdlKGZpbGUsIG1vZGUuaW1nUXVhbnQpO1xyXG5cclxuXHRcdH1cclxuXHRcdFxyXG5cdH0pO1xyXG5cclxufSkoKTtcclxuXHJcbi8qKlxyXG4qIOaMiemcgOmFjee9ruaPkuS7tizlubbkv53lrZjnlKjmiLfmiYDpgInpgInpoblcclxuKlxyXG4qL1xyXG5mdW5jdGlvbiBwbHVnaW5zQXNzZW1ibGUoKSB7XHJcblxyXG5cdGxldCBjaGVja2JveCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5tZW51LW9wdGlvbnMgLm9wdGlvbicpO1xyXG5cdGxldCBtb2RlID0ge1xyXG5cdFx0c3ByaXRlTW9kZTogJ3BjJyxcclxuXHRcdGltZ1F1YW50OiBmYWxzZSxcclxuXHRcdHBsdWdpbnM6IFtdXHJcblx0fTtcclxuXHRsZXQgb3B0aW9ucyA9IFtdO1xyXG5cdGZvcihsZXQgaSA9IDA7IGkgPCBjaGVja2JveC5sZW5ndGg7IGkrKykge1xyXG5cdFx0aWYoY2hlY2tib3hbaV0uY2hlY2tlZCkge1xyXG5cdFx0XHRvcHRpb25zLnB1c2goaSk7XHJcblx0XHRcdHN3aXRjaChjaGVja2JveFtpXS52YWx1ZSkge1xyXG5cdFx0XHRjYXNlICdwYyc6XHJcblx0XHRcdFx0bW9kZS5zcHJpdGVNb2RlID0gJ3BjJztcclxuXHRcdFx0XHRicmVhaztcclxuXHRcdFx0Y2FzZSAncmVtJzpcclxuXHRcdFx0XHRtb2RlLnNwcml0ZU1vZGUgPSAncmVtJztcclxuXHRcdFx0XHRicmVhaztcclxuXHRcdFx0Y2FzZSAncGljbmFubyc6XHJcblx0XHRcdFx0bW9kZS5pbWdRdWFudCA9IHRydWU7XHJcblx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdGNhc2UgJ2Nzc25leHQnOlxyXG5cdFx0XHRcdG1vZGUucGx1Z2lucy5wdXNoKGNzc25leHQoe1xyXG5cdFx0XHRcdFx0ZmVhdHVyZXM6IHtcclxuXHRcdFx0XHRcdFx0YXV0b3ByZWZpeGVyOiBmYWxzZSxcclxuXHRcdFx0XHRcdFx0cmVtOiBmYWxzZVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0pKTtcclxuXHRcdFx0XHRicmVhaztcclxuXHRcdFx0Y2FzZSAnYXV0b3ByZWZpeGVyJzpcclxuXHRcdFx0XHRtb2RlLnBsdWdpbnMucHVzaChhdXRvcHJlZml4ZXIoJ2xhc3QgNiB2ZXJzaW9ucycpKTtcclxuXHRcdFx0XHRicmVhaztcclxuXHRcdFx0Y2FzZSAnQGltcG9ydCc6XHJcblx0XHRcdFx0bW9kZS5wbHVnaW5zLnB1c2goYXRJbXBvcnQpO1xyXG5cdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRjYXNlICdjc3NuYW5vJzpcclxuXHRcdFx0XHRtb2RlLnBsdWdpbnMucHVzaChjc3NuYW5vKTtcclxuXHRcdFx0XHRicmVhaztcclxuXHRcdFx0ZGVmYXVsdDpcclxuXHRcdFx0XHRicmVhaztcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxuXHRsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnb3B0aW9ucycsIG9wdGlvbnMpO1xyXG5cdHJldHVybiBtb2RlO1xyXG5cclxufVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9qcy9tYWluLmpzIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuLy8gY29uc3QgcGF0aCA9IGdsb2JhbC5yZXF1aXJlKCdwYXRoJyk7XHJcbi8qKlxyXG4qIOWkhOeQhuaLluaLveS6i+S7tlxyXG4qXHJcbiogQHBhcmFtIHtmdW5jdGlvbn0gY2JcclxuKi9cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oY2IpIHtcclxuXHJcblx0Ly8g5Y+W5raI6buY6K6k6KGM5Li6XHJcblx0ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignZHJvcCcsIGZ1bmN0aW9uKGUpe1xyXG5cdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdH0sIGZhbHNlKTtcclxuXHRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdkcmFnTGVhdmUnLCBmdW5jdGlvbihlKXtcclxuXHRcdGUucHJldmVudERlZmF1bHQoKTtcclxuXHR9LCBmYWxzZSk7XHJcblx0ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignZHJhZ2VudGVyJywgZnVuY3Rpb24oZSl7XHJcblx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0fSwgZmFsc2UpO1xyXG5cdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2RyYWdvdmVyJywgZnVuY3Rpb24oZSl7XHJcblx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0fSwgZmFsc2UpO1xyXG5cclxuXHRsZXQgZHJvcFpvbmUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZHJhZy1tYWluJyk7XHJcblxyXG5cdGRyb3Bab25lLmFkZEV2ZW50TGlzdGVuZXIoJ2RyYWdvdmVyJywgZnVuY3Rpb24oZSl7XHJcblx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHR0aGlzLmNsYXNzTGlzdC5hZGQoJ2Ryb3AtaG92ZXInKTtcclxuXHR9LCBmYWxzZSk7XHJcblxyXG5cdGRyb3Bab25lLmFkZEV2ZW50TGlzdGVuZXIoJ2RyYWdsZWF2ZScsIGZ1bmN0aW9uKGUpe1xyXG5cdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0Ly8gdGhpcy5jbGFzc0xpc3QucmVtb3ZlKCdkcm9wLWhvdmVyJyk7XHJcblx0fSwgZmFsc2UpO1xyXG5cclxuXHRkcm9wWm9uZS5hZGRFdmVudExpc3RlbmVyKCdkcm9wJywgZnVuY3Rpb24oZSl7XHJcblx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHR0aGlzLmNsYXNzTGlzdC5yZW1vdmUoJ2Ryb3AtaG92ZXInKTtcclxuXHRcdGxldCBwID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmRyYWctbG9nIHAnKTtcclxuXHRcdGZvcihsZXQgaSA9IDA7IGkgPCBwLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdHBbaV0uaW5uZXJIVE1MID0gJyc7XHJcblx0XHR9XHJcblx0XHRsZXQgZmlsZUluZm8gPSBlLmRhdGFUcmFuc2Zlci5maWxlcztcclxuXHRcdGNiKGZpbGVJbmZvKTtcclxuXHR9LCBmYWxzZSk7XHJcblxyXG59XHJcblxyXG4vKipcclxuKiDlpITnkIbmlofku7bkv6Hmga9cclxuKlxyXG4qIEBwYXJhbSB7T2JqZWN0fSBmaWxlSW5mb1xyXG4qL1xyXG4vLyBmdW5jdGlvbiBoYW5kbGVGaWxlKGZpbGVJbmZvLCBjYikge1xyXG4vLyBcdGNiKCk7XHJcbi8vIH1cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvanMvaHAtZHJhZy5qcyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmNvbnN0IGZzID0gZ2xvYmFsLnJlcXVpcmUoJ2ZzJyk7XHJcbmNvbnN0IHBhdGggPSBnbG9iYWwucmVxdWlyZSgncGF0aCcpO1xyXG5jb25zdCBwb3N0Y3NzID0gZ2xvYmFsLnJlcXVpcmUoJ3Bvc3Rjc3MnKTtcclxuY29uc3QgaW1hZ2VtaW4gPSBnbG9iYWwucmVxdWlyZSgnaW1hZ2VtaW4nKTtcclxuY29uc3QgaW1hZ2VtaW5Nb3pqcGVnID0gZ2xvYmFsLnJlcXVpcmUoJ2ltYWdlbWluLW1vempwZWcnKTtcclxuY29uc3QgaW1hZ2VtaW5QbmdxdWFudCA9IGdsb2JhbC5yZXF1aXJlKCdpbWFnZW1pbi1wbmdxdWFudCcpO1xyXG5jb25zdCBpbWFnZW1pbkdpZnNpY2xlID0gZ2xvYmFsLnJlcXVpcmUoJ2ltYWdlbWluLWdpZnNpY2xlJyk7XHJcbmltcG9ydCBsb2cgZnJvbSAnLi9ocC1sb2cnO1xyXG5pbXBvcnQgc3ByaXRlcyBmcm9tICcuL2hwLWNzcy1zcHJpdGUnO1xyXG5cclxuZXhwb3J0IHsgaGFuZGxlQ3NzLCBoYW5kbGVIdG1sLCBoYW5kbGVJbWFnZSB9O1xyXG4vKipcclxuKiDmk43kvZxjc3NcclxuKlxyXG4qIEBwYXJhbSB7c3RyaW5nfSBzdHlsZXNoZWV0UGF0aFxyXG4qIEBwYXJhbSB7b2JqZWN0fSBtb2RlXHJcbiovXHJcbmZ1bmN0aW9uIGhhbmRsZUNzcyhzdHlsZXNoZWV0UGF0aCwgbW9kZSkge1xyXG5cclxuXHRsZXQgcGF0aE9iaiA9IHBhdGgucGFyc2Uoc3R5bGVzaGVldFBhdGgpO1xyXG5cdGxldCBiYXNlUGF0aCA9IHBhdGhPYmouZGlyLnNwbGl0KHBhdGguc2VwKS5zbGljZSgwLC0xKS5qb2luKHBhdGguc2VwKTtcclxuXHRleGlzdHNGbG9kZXIoYmFzZVBhdGgsIHBhdGguam9pbihiYXNlUGF0aCwgJy9kaXN0L2Nzcy8nKSk7XHJcblx0bG9nKHN0eWxlc2hlZXRQYXRoKTtcclxuXHJcblx0bGV0IHByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcblx0XHRzcHJpdGVzKHN0eWxlc2hlZXRQYXRoLCBtb2RlLCByZXNvbHZlLCByZWplY3QpO1xyXG5cdH0pO1xyXG5cdHByb21pc2UudGhlbihjc3MgPT4ge1xyXG5cdFx0cG9zdGNzcyhtb2RlLnBsdWdpbnMpXHJcblx0XHRcdC5wcm9jZXNzKGNzcywgeyBmcm9tOiBzdHlsZXNoZWV0UGF0aCwgdG86IGJhc2VQYXRoICsgJy9kaXN0L2Nzcy8nICsgcGF0aE9iai5iYXNlIH0pXHJcblx0XHRcdC50aGVuKHJlc3VsdCA9PiB7XHJcblx0XHRcdFx0ZnMud3JpdGVGaWxlKHBhdGguam9pbihiYXNlUGF0aCwgJy9kaXN0L2Nzcy8nLCBwYXRoT2JqLmJhc2UpLCByZXN1bHQuY3NzLCBmdW5jdGlvbihlcnIpe1xyXG5cdFx0XHRcdFx0aWYoZXJyKSB7XHJcblx0XHRcdFx0XHRcdGxvZyhlcnIudG9TdHJpbmcoKSwgJ2ZhaWwnKTtcclxuXHRcdFx0XHRcdH1lbHNlIHtcclxuXHRcdFx0XHRcdFx0bG9nKCdzdWNjZXNzJywgJ3N1Y2Nlc3MnKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGlmKHJlc3VsdC5tYXApXHJcblx0XHRcdFx0XHRcdGZzLndyaXRlRmlsZVN5bmMoYmFzZVBhdGggKyAnL2Rpc3QvY3NzLycgKyBwYXRoT2JqLmJhc2UgKyAnLm1hcCcsIHJlc3VsdC5tYXApO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9KTtcclxuXHR9LCBlcnJvciA9PiB7XHJcblx0XHRsb2coZXJyb3IudG9TdHJpbmcoKSwgJ2ZhaWwnKTtcclxuXHR9KTtcclxufVxyXG5cclxuLyoqXHJcbiog5pON5L2caHRtbFxyXG4qXHJcbiogQHBhcmFtIHtzdHJpbmd9IGh0bWxQYXRoXHJcbiovXHJcbmZ1bmN0aW9uIGhhbmRsZUh0bWwoaHRtbFBhdGgpIHtcclxuXHRsZXQgcGF0aE9iaiA9IHBhdGgucGFyc2UoaHRtbFBhdGgpO1xyXG5cdGxldCBiYXNlUGF0aCA9IHBhdGhPYmouZGlyO1xyXG5cdGV4aXN0c0Zsb2RlcihiYXNlUGF0aCwgaHRtbFBhdGgpO1xyXG5cdGxvZyhodG1sUGF0aCk7XHJcblx0ZnMucmVhZEZpbGUoaHRtbFBhdGgsIGZ1bmN0aW9uKGVyciwgZGF0YSl7XHJcblx0XHRpZihlcnIpe1xyXG5cdFx0XHRsb2coZXJyLnRvU3RyaW5nKCksICdmYWlsJyk7XHJcblx0XHR9ZWxzZSB7XHJcblx0XHRcdGxldCBodG1sID0gZGF0YTtcclxuXHRcdFx0ZnMud3JpdGVGaWxlKHBhdGguam9pbihiYXNlUGF0aCwgJy9kaXN0LycsIHBhdGhPYmouYmFzZSksIGh0bWwudG9TdHJpbmcoKSwgZnVuY3Rpb24oZXJyKXtcclxuXHRcdFx0XHRpZihlcnIpe1xyXG5cdFx0XHRcdFx0bG9nKGVyci50b1N0cmluZygpLCAnZmFpbCcpO1xyXG5cdFx0XHRcdH1lbHNlIHtcclxuXHRcdFx0XHRcdGxvZygnc3VjY2VzczogJyArIHBhdGguam9pbihiYXNlUGF0aCwgJy9kaXN0LycsIHBhdGhPYmouYmFzZSksICdzdWNjZXNzJyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHR9KTtcclxufVxyXG5cclxuLyoqXHJcbiog5pON5L2c5Zu+54mHXHJcbipcclxuKiBAcGFyYW0ge0FycmF5fSBpbWFnZVxyXG4qIEBwYXJhbSB7Ym9vbGVufSBpbWdRdWFudFxyXG4qL1xyXG5mdW5jdGlvbiBoYW5kbGVJbWFnZShpbWFnZSwgaW1nUXVhbnQpIHtcclxuXHRsZXQgcGF0aE9iaiA9IHBhdGgucGFyc2UoaW1hZ2VbMF0ucGF0aCk7XHJcblx0bGV0IGJhc2VQYXRoID0gcGF0aE9iai5kaXIuc3BsaXQocGF0aC5zZXApLnNsaWNlKDAsLTEpLmpvaW4ocGF0aC5zZXApLFxyXG5cdFx0b3V0cHV0UGF0aCA9IHBhdGhPYmouZGlyLnNwbGl0KHBhdGguc2VwKTtcclxuXHRvdXRwdXRQYXRoLnNwbGljZSgtMSwgMCwgJ2Rpc3QnKTtcclxuXHRvdXRwdXRQYXRoID0gb3V0cHV0UGF0aC5qb2luKHBhdGguc2VwKTtcclxuXHQvLyDliJvlu7rmnKzlnLDmlofku7blpLlcclxuXHRleGlzdHNGbG9kZXIoYmFzZVBhdGgsIG91dHB1dFBhdGgpO1xyXG5cdGlmKGltZ1F1YW50KSB7XHJcblx0XHRsZXQgaW1hZ2VQYXRoID0gW107XHJcblx0XHRmb3IobGV0IGkgPSAwOyBpIDwgaW1hZ2UubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0aW1hZ2VQYXRoLnB1c2goaW1hZ2VbaV0ucGF0aCk7XHJcblx0XHR9XHJcblx0XHRpbWFnZW1pbihpbWFnZVBhdGgsIHBhdGguam9pbihvdXRwdXRQYXRoKSwge1xyXG5cdFx0XHRwbHVnaW5zOiBbXHJcblx0XHRcdFx0aW1hZ2VtaW5Nb3pqcGVnKHtxdWFsaXR5OiAnODUnfSksXHJcblx0XHRcdFx0aW1hZ2VtaW5HaWZzaWNsZSgpLFxyXG5cdFx0XHRcdGltYWdlbWluUG5ncXVhbnQoe2Zsb3lkOiAxLCBxdWFsaXR5OiAnNjAnfSlcclxuXHRcdFx0XVxyXG5cdFx0fSkudGhlbigoKSA9PiB7XHJcblx0XHRcdGxvZygnc3VjY2VzcycsICdzdWNjZXNzJyk7XHJcblx0XHR9KTtcclxuXHR9ZWxzZSB7XHJcblx0XHRmb3IobGV0IGkgPSAwOyBpIDwgaW1hZ2UubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0bG9nKGltYWdlW2ldLnBhdGgpO1xyXG5cdFx0XHRsb2coJzxici8+Jyk7XHJcblx0XHRcdGxldCBpbnB1dCA9IGZzLmNyZWF0ZVJlYWRTdHJlYW0oaW1hZ2VbaV0ucGF0aCksXHJcblx0XHRcdFx0b3V0cHV0ID0gZnMuY3JlYXRlV3JpdGVTdHJlYW0ocGF0aC5qb2luKG91dHB1dFBhdGgsIGltYWdlW2ldLm5hbWUpKTtcclxuXHRcdFx0aW5wdXQub24oJ2RhdGEnLCBmdW5jdGlvbihkKSB7XHJcblx0XHRcdFx0b3V0cHV0LndyaXRlKGQpO1xyXG5cdFx0XHR9KTtcclxuXHRcdFx0aW5wdXQub24oJ2Vycm9yJywgZnVuY3Rpb24oZXJyKSB7XHJcblx0XHRcdFx0dGhyb3cgZXJyO1xyXG5cdFx0XHR9KTtcclxuXHRcdFx0aW5wdXQub24oJ2VuZCcsIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdG91dHB1dC5lbmQoKTtcclxuXHRcdFx0XHRsb2cocGF0aC5qb2luKG91dHB1dFBhdGgsIGltYWdlW2ldLm5hbWUpLCAnc3VjY2VzcycpO1xyXG5cdFx0XHRcdGxvZygnPGJyLz4nLCAnc3VjY2VzcycpO1xyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHR9XHJcblx0XHJcbn1cclxuXHJcbi8qKlxyXG4qIOWIpOaWreaWh+S7tuWkueaYr+WQpuWtmOWcqFxyXG4qXHJcbipAcGFyYW0ge3N0cmluZ30gYmFzZVBhdGhcclxuKkBwYXJhbSB7c3RyaW5nfSB1cmxcclxuKi9cclxuZnVuY3Rpb24gZXhpc3RzRmxvZGVyKGJhc2VQYXRoLCB1cmwpIHtcclxuXHJcblx0ZnMuZXhpc3RzKHBhdGguam9pbihiYXNlUGF0aCwgJy9kaXN0LycpLCBmdW5jdGlvbihleHQpe1xyXG5cdFx0aWYoIWV4dCkge1xyXG5cdFx0XHRmcy5ta2RpcihwYXRoLmpvaW4oYmFzZVBhdGgsICcvZGlzdC8nKSwgZnVuY3Rpb24oZXJyKXtcclxuXHRcdFx0XHRpZighZXJyKSB7XHJcblx0XHRcdFx0XHRmcy5leGlzdHModXJsLCBmdW5jdGlvbihleHQpe1xyXG5cdFx0XHRcdFx0XHRpZighZXh0KXtcclxuXHRcdFx0XHRcdFx0XHRmcy5ta2Rpcih1cmwsIGZ1bmN0aW9uKGVycil7XHJcblx0XHRcdFx0XHRcdFx0XHRpZihlcnIpIGNvbnNvbGUuZXJyb3IoZXJyKTtcclxuXHRcdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHRcdH1lbHNlIHtcclxuXHRcdFx0ZnMuZXhpc3RzKHVybCwgZnVuY3Rpb24oZXh0KXtcclxuXHRcdFx0XHRpZighZXh0KXtcclxuXHRcdFx0XHRcdGZzLm1rZGlyKHVybCwgZnVuY3Rpb24oZXJyKXtcclxuXHRcdFx0XHRcdFx0aWYoZXJyKSBjb25zb2xlLmVycm9yKGVycik7XHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cdH0pO1xyXG5cclxufVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9qcy9ocC1oYW5kbGVmaWxlLmpzIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuLyoqXHJcbiog5bGV56S65paH5Lu25aSE55CG6L+H56iL5L+h5oGvXHJcbipcclxuKiBAcGFyYW0ge3N0cmluZ30gbG9nXHJcbiogQHBhcmFtIHtzdHJpbmd9IHR5cGVcclxuKi9cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24obG9nLCB0eXBlKSB7XHJcblxyXG5cdGlmKHR5cGUgPT0gJ3N1Y2Nlc3MnKSB7XHJcblx0XHRkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZHJhZy1sb2cgLnN1Y2MnKS5pbm5lckhUTUwgKz0gbG9nO1xyXG5cdH1lbHNlIGlmKHR5cGUgPT0gJ2ZhaWwnKSB7XHJcblx0XHRkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZHJhZy1sb2cgLmZhaWwnKS5pbm5lckhUTUwgKz0gbG9nO1xyXG5cdH1lbHNlIHtcclxuXHRcdGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5kcmFnLWxvZyAubm9ybWFsJykuaW5uZXJIVE1MICs9IGxvZztcclxuXHR9XHJcblxyXG59XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2pzL2hwLWxvZy5qcyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmNvbnN0IHBvc3Rjc3MgPSBnbG9iYWwucmVxdWlyZSgncG9zdGNzcycpO1xyXG5jb25zdCBzcHJpdGVzID0gZ2xvYmFsLnJlcXVpcmUoJ3Bvc3Rjc3Mtc3ByaXRlcycpO1xyXG5jb25zdCBwYXRoID0gZ2xvYmFsLnJlcXVpcmUoJ3BhdGgnKTtcclxuY29uc3QgZnMgPSBnbG9iYWwucmVxdWlyZSgnZnMnKTtcclxuY29uc3QgaW1hZ2VtaW4gPSBnbG9iYWwucmVxdWlyZSgnaW1hZ2VtaW4nKTtcclxuY29uc3QgaW1hZ2VtaW5QbmdxdWFudCA9IGdsb2JhbC5yZXF1aXJlKCdpbWFnZW1pbi1wbmdxdWFudCcpO1xyXG5cclxuXHJcbi8qKlxyXG4qIOmFjee9riBzcHJpdGUg5L+h5oGvXHJcbipcclxuKiBAcGFyYW0ge3N0cmluZ30gc3R5bGVzaGVldFBhdGhcclxuKiBAcGFyYW0ge29iamVjdH0gbW9kZVxyXG4qIEBwYXJhbSB7ZnVuY3Rpb259IGNiXHJcbiogQHBhcmFtIHtmdW5jdGlvbn0gZXJyb3JcclxuKi9cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oc3R5bGVzaGVldFBhdGgsIG1vZGUsIGNiLCBlcnJvcikge1xyXG5cclxuXHRsZXQgcGF0aE9iaiA9IHBhdGgucGFyc2Uoc3R5bGVzaGVldFBhdGgpO1xyXG5cdGxldCBiYXNlUGF0aCA9IHBhdGhPYmouZGlyLnNwbGl0KHBhdGguc2VwKS5zbGljZSgwLC0xKS5qb2luKHBhdGguc2VwKTtcclxuXHRsZXQgb3B0cyA9IHtcclxuXHRcdHN0eWxlc2hlZXRQYXRoOiBwYXRoLmpvaW4oYmFzZVBhdGgsICcvZGlzdC9jc3MvJyksXHJcblx0XHRzcHJpdGVQYXRoOiAnLi9kaXN0L2ltZycsXHJcblx0XHRiYXNlUGF0aDogYmFzZVBhdGgsXHJcblx0XHRzcHJpdGVzbWl0aDoge1xyXG5cdFx0XHRwYWRkaW5nOiAxMCxcclxuXHRcdFx0Ly8gYWxnb3JpdGhtOiAndG9wLWRvd24nXHJcblx0XHR9LFxyXG5cdFx0ZmlsdGVyQnk6IGltYWdlID0+IHtcclxuXHRcdFx0Ly8gY29uc29sZS5sb2coaW1hZ2UpO1xyXG5cdFx0XHRpZighfmltYWdlLnVybC5pbmRleE9mKCcvc2xpY2UvJykpIHtcclxuXHRcdFx0XHRyZXR1cm4gUHJvbWlzZS5yZWplY3QoKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XHJcblx0XHR9LFxyXG5cdFx0Z3JvdXBCeTogaW1hZ2UgPT4ge1xyXG5cdFx0XHRsZXQgbmFtZSA9IC9cXC9zbGljZVxcLyhbMC05LkEtWmEtel0rKVxcLy8uZXhlYyhpbWFnZS51cmwpO1xyXG5cdFx0XHRpZighbmFtZSl7XHJcblx0XHRcdFx0cmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcignTm90IGEgc2hhcGUgaW1hZ2UnKSk7XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIFByb21pc2UucmVzb2x2ZShuYW1lWzFdKTtcclxuXHRcdH0sXHJcblx0XHRob29rczoge1xyXG5cdFx0XHRvblVwZGF0ZVJ1bGU6IChydWxlLCB0b2tlbiwgaW1hZ2UpID0+IHtcclxuXHJcblx0XHRcdFx0bGV0IGJhY2tncm91bmRTaXplLCBiYWNrZ3JvdW5kUG9zaXRpb247XHJcblxyXG5cdFx0XHRcdGlmKG1vZGUuc3ByaXRlTW9kZSA9PSAncGMnKSB7XHJcblxyXG5cdFx0XHRcdFx0bGV0IGJhY2tncm91bmRQb3NpdGlvblggPSAtaW1hZ2UuY29vcmRzLngsXHJcblx0XHRcdFx0XHRcdGJhY2tncm91bmRQb3NpdGlvblkgPSAtaW1hZ2UuY29vcmRzLnk7XHJcblxyXG5cdFx0XHRcdFx0Ly8gYmFja2dyb3VuZFNpemUgPSBwb3N0Y3NzLmRlY2woe1xyXG5cdFx0XHRcdFx0Ly8gXHRwcm9wOiAnYmFja2dyb3VuZC1zaXplJyxcclxuXHRcdFx0XHRcdC8vIFx0dmFsdWU6ICdhdXRvJ1xyXG5cdFx0XHRcdFx0Ly8gfSk7XHJcblxyXG5cdFx0XHRcdFx0YmFja2dyb3VuZFBvc2l0aW9uID0gcG9zdGNzcy5kZWNsKHtcclxuXHRcdFx0XHRcdFx0cHJvcDogJ2JhY2tncm91bmQtcG9zaXRpb24nLFxyXG5cdFx0XHRcdFx0XHR2YWx1ZTogYmFja2dyb3VuZFBvc2l0aW9uWCArICdweCAnICsgYmFja2dyb3VuZFBvc2l0aW9uWSArICdweCdcclxuXHRcdFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0XHR9ZWxzZSBpZihtb2RlLnNwcml0ZU1vZGUgPT0gJ3JlbScpIHtcclxuXHJcblx0XHRcdFx0XHRsZXQgYmFja2dyb3VuZFBvc2l0aW9uWCA9IC0oaW1hZ2UuY29vcmRzLnggLyAxMDApLFxyXG5cdFx0XHRcdFx0XHRiYWNrZ3JvdW5kUG9zaXRpb25ZID0gLShpbWFnZS5jb29yZHMueSAvIDEwMCk7XHJcblxyXG5cdFx0XHRcdFx0YmFja2dyb3VuZFNpemUgPSBwb3N0Y3NzLmRlY2woe1xyXG5cdFx0XHRcdFx0XHRwcm9wOiAnYmFja2dyb3VuZC1zaXplJyxcclxuXHRcdFx0XHRcdFx0dmFsdWU6IChpbWFnZS5zcHJpdGVXaWR0aCAvIDEwMCkgKyAncmVtICcgKyAnYXV0bydcclxuXHRcdFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0XHRcdGJhY2tncm91bmRQb3NpdGlvbiA9IHBvc3Rjc3MuZGVjbCh7XHJcblx0XHRcdFx0XHRcdHByb3A6ICdiYWNrZ3JvdW5kLXBvc2l0aW9uJyxcclxuXHRcdFx0XHRcdFx0dmFsdWU6IGJhY2tncm91bmRQb3NpdGlvblggKyAncmVtICcgKyBiYWNrZ3JvdW5kUG9zaXRpb25ZICsgJ3JlbSdcclxuXHRcdFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0XHR9ZWxzZSB7XHJcblxyXG5cdFx0XHRcdFx0bGV0IGJhY2tncm91bmRTaXplWCA9IChpbWFnZS5zcHJpdGVXaWR0aCAvIGltYWdlLmNvb3Jkcy53aWR0aCkgKiAxMDAsXHJcblx0XHRcdFx0XHRcdGJhY2tncm91bmRTaXplWSA9IChpbWFnZS5zcHJpdGVIZWlnaHQgLyBpbWFnZS5jb29yZHMuaGVpZ2h0KSAqIDEwMCxcclxuXHRcdFx0XHRcdFx0YmFja2dyb3VuZFBvc2l0aW9uWCA9IChpbWFnZS5jb29yZHMueCAvIChpbWFnZS5zcHJpdGVXaWR0aCAtIGltYWdlLmNvb3Jkcy53aWR0aCkpICogMTAwLFxyXG5cdFx0XHRcdFx0XHRiYWNrZ3JvdW5kUG9zaXRpb25ZID0gKGltYWdlLmNvb3Jkcy55IC8gKGltYWdlLnNwcml0ZUhlaWdodCAtIGltYWdlLmNvb3Jkcy5oZWlnaHQpKSAqIDEwMDtcclxuXHJcblx0XHRcdFx0XHRiYWNrZ3JvdW5kU2l6ZVggPSBpc05hTihiYWNrZ3JvdW5kU2l6ZVgpID8gMCA6IGJhY2tncm91bmRTaXplWDtcclxuXHRcdFx0XHRcdGJhY2tncm91bmRTaXplWSA9IGlzTmFOKGJhY2tncm91bmRTaXplWSkgPyAwIDogYmFja2dyb3VuZFNpemVZO1xyXG5cdFx0XHRcdFx0YmFja2dyb3VuZFBvc2l0aW9uWCA9IGlzTmFOKGJhY2tncm91bmRQb3NpdGlvblgpID8gMCA6IGJhY2tncm91bmRQb3NpdGlvblg7XHJcblx0XHRcdFx0XHRiYWNrZ3JvdW5kUG9zaXRpb25ZID0gaXNOYU4oYmFja2dyb3VuZFBvc2l0aW9uWSkgPyAwIDogYmFja2dyb3VuZFBvc2l0aW9uWTtcclxuXHJcblx0XHRcdFx0XHRiYWNrZ3JvdW5kU2l6ZSA9IHBvc3Rjc3MuZGVjbCh7XHJcblx0XHRcdFx0XHRcdHByb3A6ICdiYWNrZ3JvdW5kLXNpemUnLFxyXG5cdFx0XHRcdFx0XHR2YWx1ZTogYmFja2dyb3VuZFNpemVYICsgJyUgJyArIGJhY2tncm91bmRTaXplWSArICclJ1xyXG5cdFx0XHRcdFx0fSk7XHJcblxyXG5cdFx0XHRcdFx0YmFja2dyb3VuZFBvc2l0aW9uID0gcG9zdGNzcy5kZWNsKHtcclxuXHRcdFx0XHRcdFx0cHJvcDogJ2JhY2tncm91bmQtcG9zaXRpb24nLFxyXG5cdFx0XHRcdFx0XHR2YWx1ZTogYmFja2dyb3VuZFBvc2l0aW9uWCArICclICcgKyBiYWNrZ3JvdW5kUG9zaXRpb25ZICsgJyUnXHJcblx0XHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRsZXQgYmFja2dyb3VuZEltYWdlID0gcG9zdGNzcy5kZWNsKHtcclxuXHRcdFx0XHRcdHByb3A6ICdiYWNrZ3JvdW5kLWltYWdlJyxcclxuXHRcdFx0XHRcdHZhbHVlOiAndXJsKCcgKyBpbWFnZS5zcHJpdGVVcmwgKyAnKSdcclxuXHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdFx0bGV0IGJhY2tncm91bmRSZXBlYXQgPSBwb3N0Y3NzLmRlY2woe1xyXG5cdFx0XHRcdFx0cHJvcDogJ2JhY2tncm91bmQtcmVwZWF0JyxcclxuXHRcdFx0XHRcdHZhbHVlOiAnbm8tcmVwZWF0J1xyXG5cdFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0XHRydWxlLmluc2VydEFmdGVyKHRva2VuLCBiYWNrZ3JvdW5kSW1hZ2UpO1xyXG5cdFx0XHRcdHJ1bGUuaW5zZXJ0QWZ0ZXIoYmFja2dyb3VuZEltYWdlLCBiYWNrZ3JvdW5kUG9zaXRpb24pO1xyXG5cdFx0XHRcdGlmKG1vZGUuc3ByaXRlTW9kZSAhPSAncGMnKVxyXG5cdFx0XHRcdFx0cnVsZS5pbnNlcnRBZnRlcihiYWNrZ3JvdW5kUG9zaXRpb24sIGJhY2tncm91bmRTaXplKTtcclxuXHRcdFx0XHRydWxlLmluc2VydEFmdGVyKGJhY2tncm91bmRQb3NpdGlvbiwgYmFja2dyb3VuZFJlcGVhdCk7XHJcblxyXG5cdFx0XHRcdFxyXG5cdFx0XHR9LFxyXG5cdFx0XHRvblNhdmVTcHJpdGVzaGVldDogKG9wdHMsIHNwcml0ZXNoZWV0KSA9PiB7XHJcblx0XHRcdFx0bGV0IGZpbGVuYW1lQ2h1bmtzID0gc3ByaXRlc2hlZXQuZ3JvdXBzLmNvbmNhdChzcHJpdGVzaGVldC5leHRlbnNpb24pO1xyXG5cdFx0XHRcdGlmKGZpbGVuYW1lQ2h1bmtzLmxlbmd0aCA+IDEpXHJcblx0XHRcdFx0XHRyZXR1cm4gcGF0aC5qb2luKGJhc2VQYXRoLCBvcHRzLnNwcml0ZVBhdGgsICdzcHItJyArIGZpbGVuYW1lQ2h1bmtzWzBdICsgJy4nICsgZmlsZW5hbWVDaHVua3NbMV0pO1xyXG5cdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdHJldHVybiBwYXRoLmpvaW4oYmFzZVBhdGgsIG9wdHMuc3ByaXRlUGF0aCwgJ3NwcicgKyAnLicgKyBmaWxlbmFtZUNodW5rc1swXSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9O1xyXG5cclxuXHRmcy5yZWFkRmlsZShzdHlsZXNoZWV0UGF0aCwgJ3V0Zi04JywgKGVyciwgY3NzKSA9PiB7XHJcblx0XHRpZihlcnIpIHtcclxuXHRcdFx0ZXJyb3IoZXJyKTtcclxuXHRcdH1lbHNlIHtcclxuXHRcdFx0cG9zdGNzcyhbc3ByaXRlcyhvcHRzKV0pXHQvLyDlpITnkIbpm6rnoqflm75cclxuXHRcdFx0XHQucHJvY2Vzcyhjc3MsIHsgZnJvbTogc3R5bGVzaGVldFBhdGgsIHRvOiBiYXNlUGF0aCArICcvZGlzdC9jc3MvJyArIHBhdGhPYmouYmFzZSB9KVxyXG5cdFx0XHRcdC50aGVuKHJlc3VsdCA9PiB7XHJcblx0XHRcdFx0XHRpZihtb2RlLmltZ1F1YW50KSB7XHJcblx0XHRcdFx0XHRcdC8vIOWOi+e8qembqueip+WbvlxyXG5cdFx0XHRcdFx0XHRpbWFnZW1pbihbcGF0aC5qb2luKGJhc2VQYXRoLCAnL2Rpc3QvaW1nL3NwcioucG5nJyldLHBhdGguam9pbihiYXNlUGF0aCwgJy9kaXN0L2ltZy8nKSwge1xyXG5cdFx0XHRcdFx0XHRcdHBsdWdpbnM6IFtcclxuXHRcdFx0XHRcdFx0XHRcdGltYWdlbWluUG5ncXVhbnQoe3F1YWxpdHk6ICc3MCd9KVxyXG5cdFx0XHRcdFx0XHRcdF1cclxuXHRcdFx0XHRcdFx0fSkudGhlbigoKSA9PiB7XHJcblx0XHRcdFx0XHRcdFx0Y2IocmVzdWx0LmNzcyk7XHJcblx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0fWVsc2Uge1xyXG5cdFx0XHRcdFx0XHRjYihyZXN1bHQuY3NzKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cdH0pO1xyXG5cdFxyXG59XHJcblxyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvanMvaHAtY3NzLXNwcml0ZS5qcyJdLCJzb3VyY2VSb290IjoiIn0=