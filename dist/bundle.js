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
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__hp_css_sprite__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__hp_handlefile__ = __webpack_require__(11);





const sprites = global.require('postcss-sprites');
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

			let basePath = pathObj.dir.split(path.sep).slice(0, -1).join(path.sep);
			let opts = Object(__WEBPACK_IMPORTED_MODULE_1__hp_css_sprite__["a" /* default */])(basePath, mode.spriteMode);
			mode.plugins.unshift(sprites(opts));
			Object(__WEBPACK_IMPORTED_MODULE_2__hp_handlefile__["a" /* handleCss */])(file[0].path, mode.plugins);
		} else if (/html/.test(pathObj.ext)) {
			// 传入 html 文件

			Object(__WEBPACK_IMPORTED_MODULE_2__hp_handlefile__["b" /* handleHtml */])(file[0].path);
		} else {

			Object(__WEBPACK_IMPORTED_MODULE_2__hp_handlefile__["c" /* handleImage */])(file, mode.imgQuant);
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
							autoprefixer: false
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


const postcss = global.require('postcss');
const path = global.require('path');

/**
* 配置 sprite 信息
*
* @param {string} basePath
* @param {string} mode
*/
/* harmony default export */ __webpack_exports__["a"] = (function (basePath, mode) {

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
				// ['width', 'height'].forEach(function(prop){
				// 	let value = image.coords[prop];
				// 	if(image.retina) {
				// 		value /= image.ratio;
				// 	}
				// 	rule.insertAfter(rule.last, postcss.decl({
				// 		prop: prop,
				// 		value: value + 'px'
				// 	}));
				// });

				let backgroundSize, backgroundPosition;

				if (mode == 'pc') {

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
				} else if (mode == 'rem') {

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
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__hp_log__ = __webpack_require__(12);


const fs = global.require('fs');
const path = global.require('path');
const postcss = global.require('postcss');
const imagemin = global.require('imagemin');
const imageminJpegtran = global.require('imagemin-jpegtran');
const imageminPngquant = global.require('imagemin-pngquant');



/**
* 操作css
*
* @param {string} stylesheetPath
*/
function handleCss(stylesheetPath, plugins) {

	let pathObj = path.parse(stylesheetPath);
	let basePath = pathObj.dir.split(path.sep).slice(0, -1).join(path.sep);
	existsFloder(basePath, path.join(basePath, '/dist/css/'));
	Object(__WEBPACK_IMPORTED_MODULE_0__hp_log__["a" /* default */])(stylesheetPath);
	fs.readFile(stylesheetPath, 'utf-8', function (err, css) {
		postcss(plugins) // 处理css
		.process(css, { from: stylesheetPath, to: basePath + '/dist/css/' + pathObj.base }).then(result => {
			fs.writeFile(path.join(basePath, '/dist/css/', pathObj.base), result.css, function (err) {
				if (err) {
					Object(__WEBPACK_IMPORTED_MODULE_0__hp_log__["a" /* default */])(err.toString(), 'fail');
				} else {
					// 压缩雪碧图
					imagemin([path.join(basePath, '/dist/img/spr*.png')], path.join(basePath, '/dist/img/'), {
						plugins: [imageminJpegtran(), imageminPngquant({ quality: '65-80' })]
					}).then(() => {
						Object(__WEBPACK_IMPORTED_MODULE_0__hp_log__["a" /* default */])('success: ' + path.join(basePath, '/dist/css/', pathObj.base), 'success');
					});
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
			plugins: [imageminJpegtran(), imageminPngquant({ quality: '65-80' })]
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
/* 12 */
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

/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgYjc5MWI1ZTMyMGY1ODVjOWNkY2QiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvbGliL2Nzcy1iYXNlLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvbGliL2FkZFN0eWxlcy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2Nzcy9yZXNldC5jc3M/NzRkYyIsIndlYnBhY2s6Ly8vLi9zcmMvY3NzL3Jlc2V0LmNzcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2xpYi91cmxzLmpzIiwid2VicGFjazovLy8uL3NyYy9jc3MvaW5kZXguY3NzPzllMzQiLCJ3ZWJwYWNrOi8vLy4vc3JjL2Nzcy9pbmRleC5jc3MiLCJ3ZWJwYWNrOi8vLy4vc3JjL2pzL21haW4uanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2pzL2hwLWRyYWcuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2pzL2hwLWNzcy1zcHJpdGUuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2pzL2hwLWhhbmRsZWZpbGUuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2pzL2hwLWxvZy5qcyJdLCJuYW1lcyI6WyJyZXF1aXJlIiwic3ByaXRlcyIsImdsb2JhbCIsInBhdGgiLCJhdXRvcHJlZml4ZXIiLCJhdEltcG9ydCIsImNzc25hbm8iLCJjc3NuZXh0Iiwib3B0aW9ucyIsImxvY2FsU3RvcmFnZSIsImdldEl0ZW0iLCJzcGxpdCIsImZvckVhY2giLCJpbmRleCIsImRvY3VtZW50IiwicXVlcnlTZWxlY3RvckFsbCIsImNoZWNrZWQiLCJtb2RlIiwicGx1Z2luc0Fzc2VtYmxlIiwiYWRkRXZlbnRMaXN0ZW5lciIsImV2ZW50IiwidGFyZ2V0IiwiY2xhc3NOYW1lIiwiZHJhZ0Ryb3AiLCJmaWxlIiwicGF0aE9iaiIsInBhcnNlIiwidGVzdCIsImV4dCIsImJhc2VQYXRoIiwiZGlyIiwic2VwIiwic2xpY2UiLCJqb2luIiwib3B0cyIsInNwcml0ZUNzcyIsInNwcml0ZU1vZGUiLCJwbHVnaW5zIiwidW5zaGlmdCIsImhhbmRsZUNzcyIsImhhbmRsZUh0bWwiLCJoYW5kbGVJbWFnZSIsImltZ1F1YW50IiwiY2hlY2tib3giLCJpIiwibGVuZ3RoIiwicHVzaCIsInZhbHVlIiwiZmVhdHVyZXMiLCJzZXRJdGVtIiwiY2IiLCJlIiwicHJldmVudERlZmF1bHQiLCJkcm9wWm9uZSIsInF1ZXJ5U2VsZWN0b3IiLCJjbGFzc0xpc3QiLCJhZGQiLCJyZW1vdmUiLCJwIiwiaW5uZXJIVE1MIiwiZmlsZUluZm8iLCJkYXRhVHJhbnNmZXIiLCJmaWxlcyIsInBvc3Rjc3MiLCJzdHlsZXNoZWV0UGF0aCIsInNwcml0ZVBhdGgiLCJzcHJpdGVzbWl0aCIsInBhZGRpbmciLCJmaWx0ZXJCeSIsImltYWdlIiwidXJsIiwiaW5kZXhPZiIsIlByb21pc2UiLCJyZWplY3QiLCJyZXNvbHZlIiwiZ3JvdXBCeSIsIm5hbWUiLCJleGVjIiwiRXJyb3IiLCJob29rcyIsIm9uVXBkYXRlUnVsZSIsInJ1bGUiLCJ0b2tlbiIsImJhY2tncm91bmRTaXplIiwiYmFja2dyb3VuZFBvc2l0aW9uIiwiYmFja2dyb3VuZFBvc2l0aW9uWCIsImNvb3JkcyIsIngiLCJiYWNrZ3JvdW5kUG9zaXRpb25ZIiwieSIsImRlY2wiLCJwcm9wIiwic3ByaXRlV2lkdGgiLCJiYWNrZ3JvdW5kU2l6ZVgiLCJ3aWR0aCIsImJhY2tncm91bmRTaXplWSIsInNwcml0ZUhlaWdodCIsImhlaWdodCIsImlzTmFOIiwiYmFja2dyb3VuZEltYWdlIiwic3ByaXRlVXJsIiwiYmFja2dyb3VuZFJlcGVhdCIsImluc2VydEFmdGVyIiwib25TYXZlU3ByaXRlc2hlZXQiLCJzcHJpdGVzaGVldCIsImZpbGVuYW1lQ2h1bmtzIiwiZ3JvdXBzIiwiY29uY2F0IiwiZXh0ZW5zaW9uIiwiZnMiLCJpbWFnZW1pbiIsImltYWdlbWluSnBlZ3RyYW4iLCJpbWFnZW1pblBuZ3F1YW50IiwiZXhpc3RzRmxvZGVyIiwibG9nIiwicmVhZEZpbGUiLCJlcnIiLCJjc3MiLCJwcm9jZXNzIiwiZnJvbSIsInRvIiwiYmFzZSIsInRoZW4iLCJyZXN1bHQiLCJ3cml0ZUZpbGUiLCJ0b1N0cmluZyIsInF1YWxpdHkiLCJtYXAiLCJ3cml0ZUZpbGVTeW5jIiwiaHRtbFBhdGgiLCJkYXRhIiwiaHRtbCIsIm91dHB1dFBhdGgiLCJzcGxpY2UiLCJpbWFnZVBhdGgiLCJpbnB1dCIsImNyZWF0ZVJlYWRTdHJlYW0iLCJvdXRwdXQiLCJjcmVhdGVXcml0ZVN0cmVhbSIsIm9uIiwiZCIsIndyaXRlIiwiZW5kIiwiZXhpc3RzIiwibWtkaXIiLCJjb25zb2xlIiwiZXJyb3IiLCJ0eXBlIl0sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4REFBc0QsK0RBQStEOztBQUVySDtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7QUM3REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1DQUFtQyxnQkFBZ0I7QUFDbkQsSUFBSTtBQUNKO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQixpQkFBaUI7QUFDakM7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZLG9CQUFvQjtBQUNoQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvREFBb0QsY0FBYzs7QUFFbEU7QUFDQTs7Ozs7OztBQzNFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQSxpQkFBaUIsbUJBQW1CO0FBQ3BDO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGlCQUFpQixzQkFBc0I7QUFDdkM7O0FBRUE7QUFDQSxtQkFBbUIsMkJBQTJCOztBQUU5QztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsZ0JBQWdCLG1CQUFtQjtBQUNuQztBQUNBOztBQUVBO0FBQ0E7O0FBRUEsaUJBQWlCLDJCQUEyQjtBQUM1QztBQUNBOztBQUVBLFFBQVEsdUJBQXVCO0FBQy9CO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7O0FBRUEsaUJBQWlCLHVCQUF1QjtBQUN4QztBQUNBOztBQUVBLDJCQUEyQjtBQUMzQjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBLGdCQUFnQixpQkFBaUI7QUFDakM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWM7O0FBRWQsa0RBQWtELHNCQUFzQjtBQUN4RTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7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Q0QsTUFORDtBQU9BO0FBQ0QsSUFWRDtBQVdBLEdBWkQsTUFZTTtBQUNMUCxNQUFHa0MsTUFBSCxDQUFVekUsR0FBVixFQUFlLFVBQVMxQyxHQUFULEVBQWE7QUFDM0IsUUFBRyxDQUFDQSxHQUFKLEVBQVE7QUFDUGlGLFFBQUdtQyxLQUFILENBQVMxRSxHQUFULEVBQWMsVUFBUzhDLEdBQVQsRUFBYTtBQUMxQixVQUFHQSxHQUFILEVBQVE2QixRQUFRQyxLQUFSLENBQWM5QixHQUFkO0FBQ1IsTUFGRDtBQUdBO0FBQ0QsSUFORDtBQU9BO0FBQ0QsRUF0QkQ7QUF3QkEsQzs7Ozs7OztBQzFKRDs7QUFFQTs7Ozs7OztBQU1BLHlEQUFlLFVBQVNGLEdBQVQsRUFBY2lDLElBQWQsRUFBb0I7O0FBRWxDLEtBQUdBLFFBQVEsU0FBWCxFQUFzQjtBQUNyQnJJLFdBQVN3QyxhQUFULENBQXVCLGlCQUF2QixFQUEwQ0ssU0FBMUMsSUFBdUR1RCxHQUF2RDtBQUNBLEVBRkQsTUFFTSxJQUFHaUMsUUFBUSxNQUFYLEVBQW1CO0FBQ3hCckksV0FBU3dDLGFBQVQsQ0FBdUIsaUJBQXZCLEVBQTBDSyxTQUExQyxJQUF1RHVELEdBQXZEO0FBQ0EsRUFGSyxNQUVBO0FBQ0xwRyxXQUFTd0MsYUFBVCxDQUF1QixtQkFBdkIsRUFBNENLLFNBQTVDLElBQXlEdUQsR0FBekQ7QUFDQTtBQUVELEMiLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gMik7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgYjc5MWI1ZTMyMGY1ODVjOWNkY2QiLCIvKlxuXHRNSVQgTGljZW5zZSBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocFxuXHRBdXRob3IgVG9iaWFzIEtvcHBlcnMgQHNva3JhXG4qL1xuLy8gY3NzIGJhc2UgY29kZSwgaW5qZWN0ZWQgYnkgdGhlIGNzcy1sb2FkZXJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24odXNlU291cmNlTWFwKSB7XG5cdHZhciBsaXN0ID0gW107XG5cblx0Ly8gcmV0dXJuIHRoZSBsaXN0IG9mIG1vZHVsZXMgYXMgY3NzIHN0cmluZ1xuXHRsaXN0LnRvU3RyaW5nID0gZnVuY3Rpb24gdG9TdHJpbmcoKSB7XG5cdFx0cmV0dXJuIHRoaXMubWFwKGZ1bmN0aW9uIChpdGVtKSB7XG5cdFx0XHR2YXIgY29udGVudCA9IGNzc1dpdGhNYXBwaW5nVG9TdHJpbmcoaXRlbSwgdXNlU291cmNlTWFwKTtcblx0XHRcdGlmKGl0ZW1bMl0pIHtcblx0XHRcdFx0cmV0dXJuIFwiQG1lZGlhIFwiICsgaXRlbVsyXSArIFwie1wiICsgY29udGVudCArIFwifVwiO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cmV0dXJuIGNvbnRlbnQ7XG5cdFx0XHR9XG5cdFx0fSkuam9pbihcIlwiKTtcblx0fTtcblxuXHQvLyBpbXBvcnQgYSBsaXN0IG9mIG1vZHVsZXMgaW50byB0aGUgbGlzdFxuXHRsaXN0LmkgPSBmdW5jdGlvbihtb2R1bGVzLCBtZWRpYVF1ZXJ5KSB7XG5cdFx0aWYodHlwZW9mIG1vZHVsZXMgPT09IFwic3RyaW5nXCIpXG5cdFx0XHRtb2R1bGVzID0gW1tudWxsLCBtb2R1bGVzLCBcIlwiXV07XG5cdFx0dmFyIGFscmVhZHlJbXBvcnRlZE1vZHVsZXMgPSB7fTtcblx0XHRmb3IodmFyIGkgPSAwOyBpIDwgdGhpcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0dmFyIGlkID0gdGhpc1tpXVswXTtcblx0XHRcdGlmKHR5cGVvZiBpZCA9PT0gXCJudW1iZXJcIilcblx0XHRcdFx0YWxyZWFkeUltcG9ydGVkTW9kdWxlc1tpZF0gPSB0cnVlO1xuXHRcdH1cblx0XHRmb3IoaSA9IDA7IGkgPCBtb2R1bGVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHR2YXIgaXRlbSA9IG1vZHVsZXNbaV07XG5cdFx0XHQvLyBza2lwIGFscmVhZHkgaW1wb3J0ZWQgbW9kdWxlXG5cdFx0XHQvLyB0aGlzIGltcGxlbWVudGF0aW9uIGlzIG5vdCAxMDAlIHBlcmZlY3QgZm9yIHdlaXJkIG1lZGlhIHF1ZXJ5IGNvbWJpbmF0aW9uc1xuXHRcdFx0Ly8gIHdoZW4gYSBtb2R1bGUgaXMgaW1wb3J0ZWQgbXVsdGlwbGUgdGltZXMgd2l0aCBkaWZmZXJlbnQgbWVkaWEgcXVlcmllcy5cblx0XHRcdC8vICBJIGhvcGUgdGhpcyB3aWxsIG5ldmVyIG9jY3VyIChIZXkgdGhpcyB3YXkgd2UgaGF2ZSBzbWFsbGVyIGJ1bmRsZXMpXG5cdFx0XHRpZih0eXBlb2YgaXRlbVswXSAhPT0gXCJudW1iZXJcIiB8fCAhYWxyZWFkeUltcG9ydGVkTW9kdWxlc1tpdGVtWzBdXSkge1xuXHRcdFx0XHRpZihtZWRpYVF1ZXJ5ICYmICFpdGVtWzJdKSB7XG5cdFx0XHRcdFx0aXRlbVsyXSA9IG1lZGlhUXVlcnk7XG5cdFx0XHRcdH0gZWxzZSBpZihtZWRpYVF1ZXJ5KSB7XG5cdFx0XHRcdFx0aXRlbVsyXSA9IFwiKFwiICsgaXRlbVsyXSArIFwiKSBhbmQgKFwiICsgbWVkaWFRdWVyeSArIFwiKVwiO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGxpc3QucHVzaChpdGVtKTtcblx0XHRcdH1cblx0XHR9XG5cdH07XG5cdHJldHVybiBsaXN0O1xufTtcblxuZnVuY3Rpb24gY3NzV2l0aE1hcHBpbmdUb1N0cmluZyhpdGVtLCB1c2VTb3VyY2VNYXApIHtcblx0dmFyIGNvbnRlbnQgPSBpdGVtWzFdIHx8ICcnO1xuXHR2YXIgY3NzTWFwcGluZyA9IGl0ZW1bM107XG5cdGlmICghY3NzTWFwcGluZykge1xuXHRcdHJldHVybiBjb250ZW50O1xuXHR9XG5cblx0aWYgKHVzZVNvdXJjZU1hcCAmJiB0eXBlb2YgYnRvYSA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdHZhciBzb3VyY2VNYXBwaW5nID0gdG9Db21tZW50KGNzc01hcHBpbmcpO1xuXHRcdHZhciBzb3VyY2VVUkxzID0gY3NzTWFwcGluZy5zb3VyY2VzLm1hcChmdW5jdGlvbiAoc291cmNlKSB7XG5cdFx0XHRyZXR1cm4gJy8qIyBzb3VyY2VVUkw9JyArIGNzc01hcHBpbmcuc291cmNlUm9vdCArIHNvdXJjZSArICcgKi8nXG5cdFx0fSk7XG5cblx0XHRyZXR1cm4gW2NvbnRlbnRdLmNvbmNhdChzb3VyY2VVUkxzKS5jb25jYXQoW3NvdXJjZU1hcHBpbmddKS5qb2luKCdcXG4nKTtcblx0fVxuXG5cdHJldHVybiBbY29udGVudF0uam9pbignXFxuJyk7XG59XG5cbi8vIEFkYXB0ZWQgZnJvbSBjb252ZXJ0LXNvdXJjZS1tYXAgKE1JVClcbmZ1bmN0aW9uIHRvQ29tbWVudChzb3VyY2VNYXApIHtcblx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVuZGVmXG5cdHZhciBiYXNlNjQgPSBidG9hKHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChKU09OLnN0cmluZ2lmeShzb3VyY2VNYXApKSkpO1xuXHR2YXIgZGF0YSA9ICdzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCwnICsgYmFzZTY0O1xuXG5cdHJldHVybiAnLyojICcgKyBkYXRhICsgJyAqLyc7XG59XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2xpYi9jc3MtYmFzZS5qc1xuLy8gbW9kdWxlIGlkID0gMFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvKlxuXHRNSVQgTGljZW5zZSBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocFxuXHRBdXRob3IgVG9iaWFzIEtvcHBlcnMgQHNva3JhXG4qL1xuXG52YXIgc3R5bGVzSW5Eb20gPSB7fTtcblxudmFyXHRtZW1vaXplID0gZnVuY3Rpb24gKGZuKSB7XG5cdHZhciBtZW1vO1xuXG5cdHJldHVybiBmdW5jdGlvbiAoKSB7XG5cdFx0aWYgKHR5cGVvZiBtZW1vID09PSBcInVuZGVmaW5lZFwiKSBtZW1vID0gZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcblx0XHRyZXR1cm4gbWVtbztcblx0fTtcbn07XG5cbnZhciBpc09sZElFID0gbWVtb2l6ZShmdW5jdGlvbiAoKSB7XG5cdC8vIFRlc3QgZm9yIElFIDw9IDkgYXMgcHJvcG9zZWQgYnkgQnJvd3NlcmhhY2tzXG5cdC8vIEBzZWUgaHR0cDovL2Jyb3dzZXJoYWNrcy5jb20vI2hhY2stZTcxZDg2OTJmNjUzMzQxNzNmZWU3MTVjMjIyY2I4MDVcblx0Ly8gVGVzdHMgZm9yIGV4aXN0ZW5jZSBvZiBzdGFuZGFyZCBnbG9iYWxzIGlzIHRvIGFsbG93IHN0eWxlLWxvYWRlclxuXHQvLyB0byBvcGVyYXRlIGNvcnJlY3RseSBpbnRvIG5vbi1zdGFuZGFyZCBlbnZpcm9ubWVudHNcblx0Ly8gQHNlZSBodHRwczovL2dpdGh1Yi5jb20vd2VicGFjay1jb250cmliL3N0eWxlLWxvYWRlci9pc3N1ZXMvMTc3XG5cdHJldHVybiB3aW5kb3cgJiYgZG9jdW1lbnQgJiYgZG9jdW1lbnQuYWxsICYmICF3aW5kb3cuYXRvYjtcbn0pO1xuXG52YXIgZ2V0RWxlbWVudCA9IChmdW5jdGlvbiAoZm4pIHtcblx0dmFyIG1lbW8gPSB7fTtcblxuXHRyZXR1cm4gZnVuY3Rpb24oc2VsZWN0b3IpIHtcblx0XHRpZiAodHlwZW9mIG1lbW9bc2VsZWN0b3JdID09PSBcInVuZGVmaW5lZFwiKSB7XG5cdFx0XHRtZW1vW3NlbGVjdG9yXSA9IGZuLmNhbGwodGhpcywgc2VsZWN0b3IpO1xuXHRcdH1cblxuXHRcdHJldHVybiBtZW1vW3NlbGVjdG9yXVxuXHR9O1xufSkoZnVuY3Rpb24gKHRhcmdldCkge1xuXHRyZXR1cm4gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0YXJnZXQpXG59KTtcblxudmFyIHNpbmdsZXRvbiA9IG51bGw7XG52YXJcdHNpbmdsZXRvbkNvdW50ZXIgPSAwO1xudmFyXHRzdHlsZXNJbnNlcnRlZEF0VG9wID0gW107XG5cbnZhclx0Zml4VXJscyA9IHJlcXVpcmUoXCIuL3VybHNcIik7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24obGlzdCwgb3B0aW9ucykge1xuXHRpZiAodHlwZW9mIERFQlVHICE9PSBcInVuZGVmaW5lZFwiICYmIERFQlVHKSB7XG5cdFx0aWYgKHR5cGVvZiBkb2N1bWVudCAhPT0gXCJvYmplY3RcIikgdGhyb3cgbmV3IEVycm9yKFwiVGhlIHN0eWxlLWxvYWRlciBjYW5ub3QgYmUgdXNlZCBpbiBhIG5vbi1icm93c2VyIGVudmlyb25tZW50XCIpO1xuXHR9XG5cblx0b3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cblx0b3B0aW9ucy5hdHRycyA9IHR5cGVvZiBvcHRpb25zLmF0dHJzID09PSBcIm9iamVjdFwiID8gb3B0aW9ucy5hdHRycyA6IHt9O1xuXG5cdC8vIEZvcmNlIHNpbmdsZS10YWcgc29sdXRpb24gb24gSUU2LTksIHdoaWNoIGhhcyBhIGhhcmQgbGltaXQgb24gdGhlICMgb2YgPHN0eWxlPlxuXHQvLyB0YWdzIGl0IHdpbGwgYWxsb3cgb24gYSBwYWdlXG5cdGlmICghb3B0aW9ucy5zaW5nbGV0b24pIG9wdGlvbnMuc2luZ2xldG9uID0gaXNPbGRJRSgpO1xuXG5cdC8vIEJ5IGRlZmF1bHQsIGFkZCA8c3R5bGU+IHRhZ3MgdG8gdGhlIDxoZWFkPiBlbGVtZW50XG5cdGlmICghb3B0aW9ucy5pbnNlcnRJbnRvKSBvcHRpb25zLmluc2VydEludG8gPSBcImhlYWRcIjtcblxuXHQvLyBCeSBkZWZhdWx0LCBhZGQgPHN0eWxlPiB0YWdzIHRvIHRoZSBib3R0b20gb2YgdGhlIHRhcmdldFxuXHRpZiAoIW9wdGlvbnMuaW5zZXJ0QXQpIG9wdGlvbnMuaW5zZXJ0QXQgPSBcImJvdHRvbVwiO1xuXG5cdHZhciBzdHlsZXMgPSBsaXN0VG9TdHlsZXMobGlzdCwgb3B0aW9ucyk7XG5cblx0YWRkU3R5bGVzVG9Eb20oc3R5bGVzLCBvcHRpb25zKTtcblxuXHRyZXR1cm4gZnVuY3Rpb24gdXBkYXRlIChuZXdMaXN0KSB7XG5cdFx0dmFyIG1heVJlbW92ZSA9IFtdO1xuXG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBzdHlsZXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdHZhciBpdGVtID0gc3R5bGVzW2ldO1xuXHRcdFx0dmFyIGRvbVN0eWxlID0gc3R5bGVzSW5Eb21baXRlbS5pZF07XG5cblx0XHRcdGRvbVN0eWxlLnJlZnMtLTtcblx0XHRcdG1heVJlbW92ZS5wdXNoKGRvbVN0eWxlKTtcblx0XHR9XG5cblx0XHRpZihuZXdMaXN0KSB7XG5cdFx0XHR2YXIgbmV3U3R5bGVzID0gbGlzdFRvU3R5bGVzKG5ld0xpc3QsIG9wdGlvbnMpO1xuXHRcdFx0YWRkU3R5bGVzVG9Eb20obmV3U3R5bGVzLCBvcHRpb25zKTtcblx0XHR9XG5cblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IG1heVJlbW92ZS5sZW5ndGg7IGkrKykge1xuXHRcdFx0dmFyIGRvbVN0eWxlID0gbWF5UmVtb3ZlW2ldO1xuXG5cdFx0XHRpZihkb21TdHlsZS5yZWZzID09PSAwKSB7XG5cdFx0XHRcdGZvciAodmFyIGogPSAwOyBqIDwgZG9tU3R5bGUucGFydHMubGVuZ3RoOyBqKyspIGRvbVN0eWxlLnBhcnRzW2pdKCk7XG5cblx0XHRcdFx0ZGVsZXRlIHN0eWxlc0luRG9tW2RvbVN0eWxlLmlkXTtcblx0XHRcdH1cblx0XHR9XG5cdH07XG59O1xuXG5mdW5jdGlvbiBhZGRTdHlsZXNUb0RvbSAoc3R5bGVzLCBvcHRpb25zKSB7XG5cdGZvciAodmFyIGkgPSAwOyBpIDwgc3R5bGVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0dmFyIGl0ZW0gPSBzdHlsZXNbaV07XG5cdFx0dmFyIGRvbVN0eWxlID0gc3R5bGVzSW5Eb21baXRlbS5pZF07XG5cblx0XHRpZihkb21TdHlsZSkge1xuXHRcdFx0ZG9tU3R5bGUucmVmcysrO1xuXG5cdFx0XHRmb3IodmFyIGogPSAwOyBqIDwgZG9tU3R5bGUucGFydHMubGVuZ3RoOyBqKyspIHtcblx0XHRcdFx0ZG9tU3R5bGUucGFydHNbal0oaXRlbS5wYXJ0c1tqXSk7XG5cdFx0XHR9XG5cblx0XHRcdGZvcig7IGogPCBpdGVtLnBhcnRzLmxlbmd0aDsgaisrKSB7XG5cdFx0XHRcdGRvbVN0eWxlLnBhcnRzLnB1c2goYWRkU3R5bGUoaXRlbS5wYXJ0c1tqXSwgb3B0aW9ucykpO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cdFx0XHR2YXIgcGFydHMgPSBbXTtcblxuXHRcdFx0Zm9yKHZhciBqID0gMDsgaiA8IGl0ZW0ucGFydHMubGVuZ3RoOyBqKyspIHtcblx0XHRcdFx0cGFydHMucHVzaChhZGRTdHlsZShpdGVtLnBhcnRzW2pdLCBvcHRpb25zKSk7XG5cdFx0XHR9XG5cblx0XHRcdHN0eWxlc0luRG9tW2l0ZW0uaWRdID0ge2lkOiBpdGVtLmlkLCByZWZzOiAxLCBwYXJ0czogcGFydHN9O1xuXHRcdH1cblx0fVxufVxuXG5mdW5jdGlvbiBsaXN0VG9TdHlsZXMgKGxpc3QsIG9wdGlvbnMpIHtcblx0dmFyIHN0eWxlcyA9IFtdO1xuXHR2YXIgbmV3U3R5bGVzID0ge307XG5cblx0Zm9yICh2YXIgaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKSB7XG5cdFx0dmFyIGl0ZW0gPSBsaXN0W2ldO1xuXHRcdHZhciBpZCA9IG9wdGlvbnMuYmFzZSA/IGl0ZW1bMF0gKyBvcHRpb25zLmJhc2UgOiBpdGVtWzBdO1xuXHRcdHZhciBjc3MgPSBpdGVtWzFdO1xuXHRcdHZhciBtZWRpYSA9IGl0ZW1bMl07XG5cdFx0dmFyIHNvdXJjZU1hcCA9IGl0ZW1bM107XG5cdFx0dmFyIHBhcnQgPSB7Y3NzOiBjc3MsIG1lZGlhOiBtZWRpYSwgc291cmNlTWFwOiBzb3VyY2VNYXB9O1xuXG5cdFx0aWYoIW5ld1N0eWxlc1tpZF0pIHN0eWxlcy5wdXNoKG5ld1N0eWxlc1tpZF0gPSB7aWQ6IGlkLCBwYXJ0czogW3BhcnRdfSk7XG5cdFx0ZWxzZSBuZXdTdHlsZXNbaWRdLnBhcnRzLnB1c2gocGFydCk7XG5cdH1cblxuXHRyZXR1cm4gc3R5bGVzO1xufVxuXG5mdW5jdGlvbiBpbnNlcnRTdHlsZUVsZW1lbnQgKG9wdGlvbnMsIHN0eWxlKSB7XG5cdHZhciB0YXJnZXQgPSBnZXRFbGVtZW50KG9wdGlvbnMuaW5zZXJ0SW50bylcblxuXHRpZiAoIXRhcmdldCkge1xuXHRcdHRocm93IG5ldyBFcnJvcihcIkNvdWxkbid0IGZpbmQgYSBzdHlsZSB0YXJnZXQuIFRoaXMgcHJvYmFibHkgbWVhbnMgdGhhdCB0aGUgdmFsdWUgZm9yIHRoZSAnaW5zZXJ0SW50bycgcGFyYW1ldGVyIGlzIGludmFsaWQuXCIpO1xuXHR9XG5cblx0dmFyIGxhc3RTdHlsZUVsZW1lbnRJbnNlcnRlZEF0VG9wID0gc3R5bGVzSW5zZXJ0ZWRBdFRvcFtzdHlsZXNJbnNlcnRlZEF0VG9wLmxlbmd0aCAtIDFdO1xuXG5cdGlmIChvcHRpb25zLmluc2VydEF0ID09PSBcInRvcFwiKSB7XG5cdFx0aWYgKCFsYXN0U3R5bGVFbGVtZW50SW5zZXJ0ZWRBdFRvcCkge1xuXHRcdFx0dGFyZ2V0Lmluc2VydEJlZm9yZShzdHlsZSwgdGFyZ2V0LmZpcnN0Q2hpbGQpO1xuXHRcdH0gZWxzZSBpZiAobGFzdFN0eWxlRWxlbWVudEluc2VydGVkQXRUb3AubmV4dFNpYmxpbmcpIHtcblx0XHRcdHRhcmdldC5pbnNlcnRCZWZvcmUoc3R5bGUsIGxhc3RTdHlsZUVsZW1lbnRJbnNlcnRlZEF0VG9wLm5leHRTaWJsaW5nKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dGFyZ2V0LmFwcGVuZENoaWxkKHN0eWxlKTtcblx0XHR9XG5cdFx0c3R5bGVzSW5zZXJ0ZWRBdFRvcC5wdXNoKHN0eWxlKTtcblx0fSBlbHNlIGlmIChvcHRpb25zLmluc2VydEF0ID09PSBcImJvdHRvbVwiKSB7XG5cdFx0dGFyZ2V0LmFwcGVuZENoaWxkKHN0eWxlKTtcblx0fSBlbHNlIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIHZhbHVlIGZvciBwYXJhbWV0ZXIgJ2luc2VydEF0Jy4gTXVzdCBiZSAndG9wJyBvciAnYm90dG9tJy5cIik7XG5cdH1cbn1cblxuZnVuY3Rpb24gcmVtb3ZlU3R5bGVFbGVtZW50IChzdHlsZSkge1xuXHRpZiAoc3R5bGUucGFyZW50Tm9kZSA9PT0gbnVsbCkgcmV0dXJuIGZhbHNlO1xuXHRzdHlsZS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHN0eWxlKTtcblxuXHR2YXIgaWR4ID0gc3R5bGVzSW5zZXJ0ZWRBdFRvcC5pbmRleE9mKHN0eWxlKTtcblx0aWYoaWR4ID49IDApIHtcblx0XHRzdHlsZXNJbnNlcnRlZEF0VG9wLnNwbGljZShpZHgsIDEpO1xuXHR9XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZVN0eWxlRWxlbWVudCAob3B0aW9ucykge1xuXHR2YXIgc3R5bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3R5bGVcIik7XG5cblx0b3B0aW9ucy5hdHRycy50eXBlID0gXCJ0ZXh0L2Nzc1wiO1xuXG5cdGFkZEF0dHJzKHN0eWxlLCBvcHRpb25zLmF0dHJzKTtcblx0aW5zZXJ0U3R5bGVFbGVtZW50KG9wdGlvbnMsIHN0eWxlKTtcblxuXHRyZXR1cm4gc3R5bGU7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUxpbmtFbGVtZW50IChvcHRpb25zKSB7XG5cdHZhciBsaW5rID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImxpbmtcIik7XG5cblx0b3B0aW9ucy5hdHRycy50eXBlID0gXCJ0ZXh0L2Nzc1wiO1xuXHRvcHRpb25zLmF0dHJzLnJlbCA9IFwic3R5bGVzaGVldFwiO1xuXG5cdGFkZEF0dHJzKGxpbmssIG9wdGlvbnMuYXR0cnMpO1xuXHRpbnNlcnRTdHlsZUVsZW1lbnQob3B0aW9ucywgbGluayk7XG5cblx0cmV0dXJuIGxpbms7XG59XG5cbmZ1bmN0aW9uIGFkZEF0dHJzIChlbCwgYXR0cnMpIHtcblx0T2JqZWN0LmtleXMoYXR0cnMpLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuXHRcdGVsLnNldEF0dHJpYnV0ZShrZXksIGF0dHJzW2tleV0pO1xuXHR9KTtcbn1cblxuZnVuY3Rpb24gYWRkU3R5bGUgKG9iaiwgb3B0aW9ucykge1xuXHR2YXIgc3R5bGUsIHVwZGF0ZSwgcmVtb3ZlLCByZXN1bHQ7XG5cblx0Ly8gSWYgYSB0cmFuc2Zvcm0gZnVuY3Rpb24gd2FzIGRlZmluZWQsIHJ1biBpdCBvbiB0aGUgY3NzXG5cdGlmIChvcHRpb25zLnRyYW5zZm9ybSAmJiBvYmouY3NzKSB7XG5cdCAgICByZXN1bHQgPSBvcHRpb25zLnRyYW5zZm9ybShvYmouY3NzKTtcblxuXHQgICAgaWYgKHJlc3VsdCkge1xuXHQgICAgXHQvLyBJZiB0cmFuc2Zvcm0gcmV0dXJucyBhIHZhbHVlLCB1c2UgdGhhdCBpbnN0ZWFkIG9mIHRoZSBvcmlnaW5hbCBjc3MuXG5cdCAgICBcdC8vIFRoaXMgYWxsb3dzIHJ1bm5pbmcgcnVudGltZSB0cmFuc2Zvcm1hdGlvbnMgb24gdGhlIGNzcy5cblx0ICAgIFx0b2JqLmNzcyA9IHJlc3VsdDtcblx0ICAgIH0gZWxzZSB7XG5cdCAgICBcdC8vIElmIHRoZSB0cmFuc2Zvcm0gZnVuY3Rpb24gcmV0dXJucyBhIGZhbHN5IHZhbHVlLCBkb24ndCBhZGQgdGhpcyBjc3MuXG5cdCAgICBcdC8vIFRoaXMgYWxsb3dzIGNvbmRpdGlvbmFsIGxvYWRpbmcgb2YgY3NzXG5cdCAgICBcdHJldHVybiBmdW5jdGlvbigpIHtcblx0ICAgIFx0XHQvLyBub29wXG5cdCAgICBcdH07XG5cdCAgICB9XG5cdH1cblxuXHRpZiAob3B0aW9ucy5zaW5nbGV0b24pIHtcblx0XHR2YXIgc3R5bGVJbmRleCA9IHNpbmdsZXRvbkNvdW50ZXIrKztcblxuXHRcdHN0eWxlID0gc2luZ2xldG9uIHx8IChzaW5nbGV0b24gPSBjcmVhdGVTdHlsZUVsZW1lbnQob3B0aW9ucykpO1xuXG5cdFx0dXBkYXRlID0gYXBwbHlUb1NpbmdsZXRvblRhZy5iaW5kKG51bGwsIHN0eWxlLCBzdHlsZUluZGV4LCBmYWxzZSk7XG5cdFx0cmVtb3ZlID0gYXBwbHlUb1NpbmdsZXRvblRhZy5iaW5kKG51bGwsIHN0eWxlLCBzdHlsZUluZGV4LCB0cnVlKTtcblxuXHR9IGVsc2UgaWYgKFxuXHRcdG9iai5zb3VyY2VNYXAgJiZcblx0XHR0eXBlb2YgVVJMID09PSBcImZ1bmN0aW9uXCIgJiZcblx0XHR0eXBlb2YgVVJMLmNyZWF0ZU9iamVjdFVSTCA9PT0gXCJmdW5jdGlvblwiICYmXG5cdFx0dHlwZW9mIFVSTC5yZXZva2VPYmplY3RVUkwgPT09IFwiZnVuY3Rpb25cIiAmJlxuXHRcdHR5cGVvZiBCbG9iID09PSBcImZ1bmN0aW9uXCIgJiZcblx0XHR0eXBlb2YgYnRvYSA9PT0gXCJmdW5jdGlvblwiXG5cdCkge1xuXHRcdHN0eWxlID0gY3JlYXRlTGlua0VsZW1lbnQob3B0aW9ucyk7XG5cdFx0dXBkYXRlID0gdXBkYXRlTGluay5iaW5kKG51bGwsIHN0eWxlLCBvcHRpb25zKTtcblx0XHRyZW1vdmUgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHRyZW1vdmVTdHlsZUVsZW1lbnQoc3R5bGUpO1xuXG5cdFx0XHRpZihzdHlsZS5ocmVmKSBVUkwucmV2b2tlT2JqZWN0VVJMKHN0eWxlLmhyZWYpO1xuXHRcdH07XG5cdH0gZWxzZSB7XG5cdFx0c3R5bGUgPSBjcmVhdGVTdHlsZUVsZW1lbnQob3B0aW9ucyk7XG5cdFx0dXBkYXRlID0gYXBwbHlUb1RhZy5iaW5kKG51bGwsIHN0eWxlKTtcblx0XHRyZW1vdmUgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHRyZW1vdmVTdHlsZUVsZW1lbnQoc3R5bGUpO1xuXHRcdH07XG5cdH1cblxuXHR1cGRhdGUob2JqKTtcblxuXHRyZXR1cm4gZnVuY3Rpb24gdXBkYXRlU3R5bGUgKG5ld09iaikge1xuXHRcdGlmIChuZXdPYmopIHtcblx0XHRcdGlmIChcblx0XHRcdFx0bmV3T2JqLmNzcyA9PT0gb2JqLmNzcyAmJlxuXHRcdFx0XHRuZXdPYmoubWVkaWEgPT09IG9iai5tZWRpYSAmJlxuXHRcdFx0XHRuZXdPYmouc291cmNlTWFwID09PSBvYmouc291cmNlTWFwXG5cdFx0XHQpIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHR1cGRhdGUob2JqID0gbmV3T2JqKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0cmVtb3ZlKCk7XG5cdFx0fVxuXHR9O1xufVxuXG52YXIgcmVwbGFjZVRleHQgPSAoZnVuY3Rpb24gKCkge1xuXHR2YXIgdGV4dFN0b3JlID0gW107XG5cblx0cmV0dXJuIGZ1bmN0aW9uIChpbmRleCwgcmVwbGFjZW1lbnQpIHtcblx0XHR0ZXh0U3RvcmVbaW5kZXhdID0gcmVwbGFjZW1lbnQ7XG5cblx0XHRyZXR1cm4gdGV4dFN0b3JlLmZpbHRlcihCb29sZWFuKS5qb2luKCdcXG4nKTtcblx0fTtcbn0pKCk7XG5cbmZ1bmN0aW9uIGFwcGx5VG9TaW5nbGV0b25UYWcgKHN0eWxlLCBpbmRleCwgcmVtb3ZlLCBvYmopIHtcblx0dmFyIGNzcyA9IHJlbW92ZSA/IFwiXCIgOiBvYmouY3NzO1xuXG5cdGlmIChzdHlsZS5zdHlsZVNoZWV0KSB7XG5cdFx0c3R5bGUuc3R5bGVTaGVldC5jc3NUZXh0ID0gcmVwbGFjZVRleHQoaW5kZXgsIGNzcyk7XG5cdH0gZWxzZSB7XG5cdFx0dmFyIGNzc05vZGUgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShjc3MpO1xuXHRcdHZhciBjaGlsZE5vZGVzID0gc3R5bGUuY2hpbGROb2RlcztcblxuXHRcdGlmIChjaGlsZE5vZGVzW2luZGV4XSkgc3R5bGUucmVtb3ZlQ2hpbGQoY2hpbGROb2Rlc1tpbmRleF0pO1xuXG5cdFx0aWYgKGNoaWxkTm9kZXMubGVuZ3RoKSB7XG5cdFx0XHRzdHlsZS5pbnNlcnRCZWZvcmUoY3NzTm9kZSwgY2hpbGROb2Rlc1tpbmRleF0pO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRzdHlsZS5hcHBlbmRDaGlsZChjc3NOb2RlKTtcblx0XHR9XG5cdH1cbn1cblxuZnVuY3Rpb24gYXBwbHlUb1RhZyAoc3R5bGUsIG9iaikge1xuXHR2YXIgY3NzID0gb2JqLmNzcztcblx0dmFyIG1lZGlhID0gb2JqLm1lZGlhO1xuXG5cdGlmKG1lZGlhKSB7XG5cdFx0c3R5bGUuc2V0QXR0cmlidXRlKFwibWVkaWFcIiwgbWVkaWEpXG5cdH1cblxuXHRpZihzdHlsZS5zdHlsZVNoZWV0KSB7XG5cdFx0c3R5bGUuc3R5bGVTaGVldC5jc3NUZXh0ID0gY3NzO1xuXHR9IGVsc2Uge1xuXHRcdHdoaWxlKHN0eWxlLmZpcnN0Q2hpbGQpIHtcblx0XHRcdHN0eWxlLnJlbW92ZUNoaWxkKHN0eWxlLmZpcnN0Q2hpbGQpO1xuXHRcdH1cblxuXHRcdHN0eWxlLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGNzcykpO1xuXHR9XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZUxpbmsgKGxpbmssIG9wdGlvbnMsIG9iaikge1xuXHR2YXIgY3NzID0gb2JqLmNzcztcblx0dmFyIHNvdXJjZU1hcCA9IG9iai5zb3VyY2VNYXA7XG5cblx0Lypcblx0XHRJZiBjb252ZXJ0VG9BYnNvbHV0ZVVybHMgaXNuJ3QgZGVmaW5lZCwgYnV0IHNvdXJjZW1hcHMgYXJlIGVuYWJsZWRcblx0XHRhbmQgdGhlcmUgaXMgbm8gcHVibGljUGF0aCBkZWZpbmVkIHRoZW4gbGV0cyB0dXJuIGNvbnZlcnRUb0Fic29sdXRlVXJsc1xuXHRcdG9uIGJ5IGRlZmF1bHQuICBPdGhlcndpc2UgZGVmYXVsdCB0byB0aGUgY29udmVydFRvQWJzb2x1dGVVcmxzIG9wdGlvblxuXHRcdGRpcmVjdGx5XG5cdCovXG5cdHZhciBhdXRvRml4VXJscyA9IG9wdGlvbnMuY29udmVydFRvQWJzb2x1dGVVcmxzID09PSB1bmRlZmluZWQgJiYgc291cmNlTWFwO1xuXG5cdGlmIChvcHRpb25zLmNvbnZlcnRUb0Fic29sdXRlVXJscyB8fCBhdXRvRml4VXJscykge1xuXHRcdGNzcyA9IGZpeFVybHMoY3NzKTtcblx0fVxuXG5cdGlmIChzb3VyY2VNYXApIHtcblx0XHQvLyBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8yNjYwMzg3NVxuXHRcdGNzcyArPSBcIlxcbi8qIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsXCIgKyBidG9hKHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChKU09OLnN0cmluZ2lmeShzb3VyY2VNYXApKSkpICsgXCIgKi9cIjtcblx0fVxuXG5cdHZhciBibG9iID0gbmV3IEJsb2IoW2Nzc10sIHsgdHlwZTogXCJ0ZXh0L2Nzc1wiIH0pO1xuXG5cdHZhciBvbGRTcmMgPSBsaW5rLmhyZWY7XG5cblx0bGluay5ocmVmID0gVVJMLmNyZWF0ZU9iamVjdFVSTChibG9iKTtcblxuXHRpZihvbGRTcmMpIFVSTC5yZXZva2VPYmplY3RVUkwob2xkU3JjKTtcbn1cblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9saWIvYWRkU3R5bGVzLmpzXG4vLyBtb2R1bGUgaWQgPSAxXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCAnLi9jc3MvcmVzZXQuY3NzJztcclxuaW1wb3J0ICcuL2Nzcy9pbmRleC5jc3MnO1xyXG5yZXF1aXJlKCcuL2pzL21haW4uanMnKTtcclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2luZGV4LmpzIiwiLy8gc3R5bGUtbG9hZGVyOiBBZGRzIHNvbWUgY3NzIHRvIHRoZSBET00gYnkgYWRkaW5nIGEgPHN0eWxlPiB0YWdcblxuLy8gbG9hZCB0aGUgc3R5bGVzXG52YXIgY29udGVudCA9IHJlcXVpcmUoXCIhIS4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2luZGV4LmpzIS4vcmVzZXQuY3NzXCIpO1xuaWYodHlwZW9mIGNvbnRlbnQgPT09ICdzdHJpbmcnKSBjb250ZW50ID0gW1ttb2R1bGUuaWQsIGNvbnRlbnQsICcnXV07XG4vLyBQcmVwYXJlIGNzc1RyYW5zZm9ybWF0aW9uXG52YXIgdHJhbnNmb3JtO1xuXG52YXIgb3B0aW9ucyA9IHt9XG5vcHRpb25zLnRyYW5zZm9ybSA9IHRyYW5zZm9ybVxuLy8gYWRkIHRoZSBzdHlsZXMgdG8gdGhlIERPTVxudmFyIHVwZGF0ZSA9IHJlcXVpcmUoXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9saWIvYWRkU3R5bGVzLmpzXCIpKGNvbnRlbnQsIG9wdGlvbnMpO1xuaWYoY29udGVudC5sb2NhbHMpIG1vZHVsZS5leHBvcnRzID0gY29udGVudC5sb2NhbHM7XG4vLyBIb3QgTW9kdWxlIFJlcGxhY2VtZW50XG5pZihtb2R1bGUuaG90KSB7XG5cdC8vIFdoZW4gdGhlIHN0eWxlcyBjaGFuZ2UsIHVwZGF0ZSB0aGUgPHN0eWxlPiB0YWdzXG5cdGlmKCFjb250ZW50LmxvY2Fscykge1xuXHRcdG1vZHVsZS5ob3QuYWNjZXB0KFwiISEuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcyEuL3Jlc2V0LmNzc1wiLCBmdW5jdGlvbigpIHtcblx0XHRcdHZhciBuZXdDb250ZW50ID0gcmVxdWlyZShcIiEhLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanMhLi9yZXNldC5jc3NcIik7XG5cdFx0XHRpZih0eXBlb2YgbmV3Q29udGVudCA9PT0gJ3N0cmluZycpIG5ld0NvbnRlbnQgPSBbW21vZHVsZS5pZCwgbmV3Q29udGVudCwgJyddXTtcblx0XHRcdHVwZGF0ZShuZXdDb250ZW50KTtcblx0XHR9KTtcblx0fVxuXHQvLyBXaGVuIHRoZSBtb2R1bGUgaXMgZGlzcG9zZWQsIHJlbW92ZSB0aGUgPHN0eWxlPiB0YWdzXG5cdG1vZHVsZS5ob3QuZGlzcG9zZShmdW5jdGlvbigpIHsgdXBkYXRlKCk7IH0pO1xufVxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2Nzcy9yZXNldC5jc3Ncbi8vIG1vZHVsZSBpZCA9IDNcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIi4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2xpYi9jc3MtYmFzZS5qc1wiKSh1bmRlZmluZWQpO1xuLy8gaW1wb3J0c1xuXG5cbi8vIG1vZHVsZVxuZXhwb3J0cy5wdXNoKFttb2R1bGUuaWQsIFwiLyoqKiBcXHJcXG4gKioqIHJlc2V0IFxcclxcbioqKi9cXHJcXG5odG1sLCBib2R5LCBkaXYsIHNwYW4sIGFwcGxldCwgb2JqZWN0LCBpZnJhbWUsXFxyXFxuaDEsIGgyLCBoMywgaDQsIGg1LCBoNiwgcCwgYmxvY2txdW90ZSwgcHJlLFxcclxcbmEsIGFiYnIsIGFjcm9ueW0sIGFkZHJlc3MsIGJpZywgY2l0ZSwgY29kZSxcXHJcXG5kZWwsIGRmbiwgZW0sIGltZywgaW5zLCBrYmQsIHEsIHMsIHNhbXAsXFxyXFxuc21hbGwsIHN0cmlrZSwgc3Ryb25nLCBzdWIsIHN1cCwgdHQsIHZhcixcXHJcXG5iLCB1LCBpLCBjZW50ZXIsXFxyXFxuZGwsIGR0LCBkZCwgb2wsIHVsLCBsaSxcXHJcXG5maWVsZHNldCwgZm9ybSwgbGFiZWwsIGxlZ2VuZCxcXHJcXG50YWJsZSwgY2FwdGlvbiwgdGJvZHksIHRmb290LCB0aGVhZCwgdHIsIHRoLCB0ZCxcXHJcXG5hcnRpY2xlLCBhc2lkZSwgY2FudmFzLCBkZXRhaWxzLCBlbWJlZCwgXFxyXFxuZmlndXJlLCBmaWdjYXB0aW9uLCBmb290ZXIsIGhlYWRlciwgaGdyb3VwLCBcXHJcXG5tZW51LCBuYXYsIG91dHB1dCwgcnVieSwgc2VjdGlvbiwgc3VtbWFyeSxcXHJcXG50aW1lLCBtYXJrLCBhdWRpbywgdmlkZW8ge1xcclxcblxcdG1hcmdpbjogMDtcXHJcXG5cXHRwYWRkaW5nOiAwO1xcclxcblxcdGJvcmRlcjogMDtcXHJcXG5cXHRmb250LXNpemU6IDEwMCU7XFxyXFxuXFx0Zm9udC1mYW1pbHk6ICdtaWNyb3NvZnQgeWFoZWknLEFyaWFsLHNhbnMtc2VyaWY7XFxyXFxuXFx0Lypmb250OiBpbmhlcml0OyovXFxyXFxuXFx0dmVydGljYWwtYWxpZ246IGJhc2VsaW5lO1xcclxcbn1cXHJcXG4vKiBIVE1MNSBkaXNwbGF5LXJvbGUgcmVzZXQgZm9yIG9sZGVyIGJyb3dzZXJzICovXFxyXFxuYXJ0aWNsZSwgYXNpZGUsIGRldGFpbHMsIGZpZ2NhcHRpb24sIGZpZ3VyZSwgXFxyXFxuZm9vdGVyLCBoZWFkZXIsIGhncm91cCwgbWVudSwgbmF2LCBzZWN0aW9uIHtcXHJcXG5cXHRkaXNwbGF5OiBibG9jaztcXHJcXG59XFxyXFxuYm9keSB7XFxyXFxuXFx0bGluZS1oZWlnaHQ6IDE7XFxyXFxufVxcclxcbm9sLCB1bCB7XFxyXFxuXFx0bGlzdC1zdHlsZTogbm9uZTtcXHJcXG59XFxyXFxuYmxvY2txdW90ZSwgcSB7XFxyXFxuXFx0cXVvdGVzOiBub25lO1xcclxcbn1cXHJcXG5ibG9ja3F1b3RlOmJlZm9yZSwgYmxvY2txdW90ZTphZnRlcixcXHJcXG5xOmJlZm9yZSwgcTphZnRlciB7XFxyXFxuXFx0Y29udGVudDogJyc7XFxyXFxuXFx0Y29udGVudDogbm9uZTtcXHJcXG59XFxyXFxudGFibGUge1xcclxcblxcdGJvcmRlci1jb2xsYXBzZTogY29sbGFwc2U7XFxyXFxuXFx0Ym9yZGVyLXNwYWNpbmc6IDA7XFxyXFxufVwiLCBcIlwiXSk7XG5cbi8vIGV4cG9ydHNcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIhLi9zcmMvY3NzL3Jlc2V0LmNzc1xuLy8gbW9kdWxlIGlkID0gNFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJcbi8qKlxuICogV2hlbiBzb3VyY2UgbWFwcyBhcmUgZW5hYmxlZCwgYHN0eWxlLWxvYWRlcmAgdXNlcyBhIGxpbmsgZWxlbWVudCB3aXRoIGEgZGF0YS11cmkgdG9cbiAqIGVtYmVkIHRoZSBjc3Mgb24gdGhlIHBhZ2UuIFRoaXMgYnJlYWtzIGFsbCByZWxhdGl2ZSB1cmxzIGJlY2F1c2Ugbm93IHRoZXkgYXJlIHJlbGF0aXZlIHRvIGFcbiAqIGJ1bmRsZSBpbnN0ZWFkIG9mIHRoZSBjdXJyZW50IHBhZ2UuXG4gKlxuICogT25lIHNvbHV0aW9uIGlzIHRvIG9ubHkgdXNlIGZ1bGwgdXJscywgYnV0IHRoYXQgbWF5IGJlIGltcG9zc2libGUuXG4gKlxuICogSW5zdGVhZCwgdGhpcyBmdW5jdGlvbiBcImZpeGVzXCIgdGhlIHJlbGF0aXZlIHVybHMgdG8gYmUgYWJzb2x1dGUgYWNjb3JkaW5nIHRvIHRoZSBjdXJyZW50IHBhZ2UgbG9jYXRpb24uXG4gKlxuICogQSBydWRpbWVudGFyeSB0ZXN0IHN1aXRlIGlzIGxvY2F0ZWQgYXQgYHRlc3QvZml4VXJscy5qc2AgYW5kIGNhbiBiZSBydW4gdmlhIHRoZSBgbnBtIHRlc3RgIGNvbW1hbmQuXG4gKlxuICovXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGNzcykge1xuICAvLyBnZXQgY3VycmVudCBsb2NhdGlvblxuICB2YXIgbG9jYXRpb24gPSB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiICYmIHdpbmRvdy5sb2NhdGlvbjtcblxuICBpZiAoIWxvY2F0aW9uKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiZml4VXJscyByZXF1aXJlcyB3aW5kb3cubG9jYXRpb25cIik7XG4gIH1cblxuXHQvLyBibGFuayBvciBudWxsP1xuXHRpZiAoIWNzcyB8fCB0eXBlb2YgY3NzICE9PSBcInN0cmluZ1wiKSB7XG5cdCAgcmV0dXJuIGNzcztcbiAgfVxuXG4gIHZhciBiYXNlVXJsID0gbG9jYXRpb24ucHJvdG9jb2wgKyBcIi8vXCIgKyBsb2NhdGlvbi5ob3N0O1xuICB2YXIgY3VycmVudERpciA9IGJhc2VVcmwgKyBsb2NhdGlvbi5wYXRobmFtZS5yZXBsYWNlKC9cXC9bXlxcL10qJC8sIFwiL1wiKTtcblxuXHQvLyBjb252ZXJ0IGVhY2ggdXJsKC4uLilcblx0Lypcblx0VGhpcyByZWd1bGFyIGV4cHJlc3Npb24gaXMganVzdCBhIHdheSB0byByZWN1cnNpdmVseSBtYXRjaCBicmFja2V0cyB3aXRoaW5cblx0YSBzdHJpbmcuXG5cblx0IC91cmxcXHMqXFwoICA9IE1hdGNoIG9uIHRoZSB3b3JkIFwidXJsXCIgd2l0aCBhbnkgd2hpdGVzcGFjZSBhZnRlciBpdCBhbmQgdGhlbiBhIHBhcmVuc1xuXHQgICAoICA9IFN0YXJ0IGEgY2FwdHVyaW5nIGdyb3VwXG5cdCAgICAgKD86ICA9IFN0YXJ0IGEgbm9uLWNhcHR1cmluZyBncm91cFxuXHQgICAgICAgICBbXikoXSAgPSBNYXRjaCBhbnl0aGluZyB0aGF0IGlzbid0IGEgcGFyZW50aGVzZXNcblx0ICAgICAgICAgfCAgPSBPUlxuXHQgICAgICAgICBcXCggID0gTWF0Y2ggYSBzdGFydCBwYXJlbnRoZXNlc1xuXHQgICAgICAgICAgICAgKD86ICA9IFN0YXJ0IGFub3RoZXIgbm9uLWNhcHR1cmluZyBncm91cHNcblx0ICAgICAgICAgICAgICAgICBbXikoXSsgID0gTWF0Y2ggYW55dGhpbmcgdGhhdCBpc24ndCBhIHBhcmVudGhlc2VzXG5cdCAgICAgICAgICAgICAgICAgfCAgPSBPUlxuXHQgICAgICAgICAgICAgICAgIFxcKCAgPSBNYXRjaCBhIHN0YXJ0IHBhcmVudGhlc2VzXG5cdCAgICAgICAgICAgICAgICAgICAgIFteKShdKiAgPSBNYXRjaCBhbnl0aGluZyB0aGF0IGlzbid0IGEgcGFyZW50aGVzZXNcblx0ICAgICAgICAgICAgICAgICBcXCkgID0gTWF0Y2ggYSBlbmQgcGFyZW50aGVzZXNcblx0ICAgICAgICAgICAgICkgID0gRW5kIEdyb3VwXG4gICAgICAgICAgICAgICpcXCkgPSBNYXRjaCBhbnl0aGluZyBhbmQgdGhlbiBhIGNsb3NlIHBhcmVuc1xuICAgICAgICAgICkgID0gQ2xvc2Ugbm9uLWNhcHR1cmluZyBncm91cFxuICAgICAgICAgICogID0gTWF0Y2ggYW55dGhpbmdcbiAgICAgICApICA9IENsb3NlIGNhcHR1cmluZyBncm91cFxuXHQgXFwpICA9IE1hdGNoIGEgY2xvc2UgcGFyZW5zXG5cblx0IC9naSAgPSBHZXQgYWxsIG1hdGNoZXMsIG5vdCB0aGUgZmlyc3QuICBCZSBjYXNlIGluc2Vuc2l0aXZlLlxuXHQgKi9cblx0dmFyIGZpeGVkQ3NzID0gY3NzLnJlcGxhY2UoL3VybFxccypcXCgoKD86W14pKF18XFwoKD86W14pKF0rfFxcKFteKShdKlxcKSkqXFwpKSopXFwpL2dpLCBmdW5jdGlvbihmdWxsTWF0Y2gsIG9yaWdVcmwpIHtcblx0XHQvLyBzdHJpcCBxdW90ZXMgKGlmIHRoZXkgZXhpc3QpXG5cdFx0dmFyIHVucXVvdGVkT3JpZ1VybCA9IG9yaWdVcmxcblx0XHRcdC50cmltKClcblx0XHRcdC5yZXBsYWNlKC9eXCIoLiopXCIkLywgZnVuY3Rpb24obywgJDEpeyByZXR1cm4gJDE7IH0pXG5cdFx0XHQucmVwbGFjZSgvXicoLiopJyQvLCBmdW5jdGlvbihvLCAkMSl7IHJldHVybiAkMTsgfSk7XG5cblx0XHQvLyBhbHJlYWR5IGEgZnVsbCB1cmw/IG5vIGNoYW5nZVxuXHRcdGlmICgvXigjfGRhdGE6fGh0dHA6XFwvXFwvfGh0dHBzOlxcL1xcL3xmaWxlOlxcL1xcL1xcLykvaS50ZXN0KHVucXVvdGVkT3JpZ1VybCkpIHtcblx0XHQgIHJldHVybiBmdWxsTWF0Y2g7XG5cdFx0fVxuXG5cdFx0Ly8gY29udmVydCB0aGUgdXJsIHRvIGEgZnVsbCB1cmxcblx0XHR2YXIgbmV3VXJsO1xuXG5cdFx0aWYgKHVucXVvdGVkT3JpZ1VybC5pbmRleE9mKFwiLy9cIikgPT09IDApIHtcblx0XHQgIFx0Ly9UT0RPOiBzaG91bGQgd2UgYWRkIHByb3RvY29sP1xuXHRcdFx0bmV3VXJsID0gdW5xdW90ZWRPcmlnVXJsO1xuXHRcdH0gZWxzZSBpZiAodW5xdW90ZWRPcmlnVXJsLmluZGV4T2YoXCIvXCIpID09PSAwKSB7XG5cdFx0XHQvLyBwYXRoIHNob3VsZCBiZSByZWxhdGl2ZSB0byB0aGUgYmFzZSB1cmxcblx0XHRcdG5ld1VybCA9IGJhc2VVcmwgKyB1bnF1b3RlZE9yaWdVcmw7IC8vIGFscmVhZHkgc3RhcnRzIHdpdGggJy8nXG5cdFx0fSBlbHNlIHtcblx0XHRcdC8vIHBhdGggc2hvdWxkIGJlIHJlbGF0aXZlIHRvIGN1cnJlbnQgZGlyZWN0b3J5XG5cdFx0XHRuZXdVcmwgPSBjdXJyZW50RGlyICsgdW5xdW90ZWRPcmlnVXJsLnJlcGxhY2UoL15cXC5cXC8vLCBcIlwiKTsgLy8gU3RyaXAgbGVhZGluZyAnLi8nXG5cdFx0fVxuXG5cdFx0Ly8gc2VuZCBiYWNrIHRoZSBmaXhlZCB1cmwoLi4uKVxuXHRcdHJldHVybiBcInVybChcIiArIEpTT04uc3RyaW5naWZ5KG5ld1VybCkgKyBcIilcIjtcblx0fSk7XG5cblx0Ly8gc2VuZCBiYWNrIHRoZSBmaXhlZCBjc3Ncblx0cmV0dXJuIGZpeGVkQ3NzO1xufTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9saWIvdXJscy5qc1xuLy8gbW9kdWxlIGlkID0gNVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvLyBzdHlsZS1sb2FkZXI6IEFkZHMgc29tZSBjc3MgdG8gdGhlIERPTSBieSBhZGRpbmcgYSA8c3R5bGU+IHRhZ1xuXG4vLyBsb2FkIHRoZSBzdHlsZXNcbnZhciBjb250ZW50ID0gcmVxdWlyZShcIiEhLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanMhLi9pbmRleC5jc3NcIik7XG5pZih0eXBlb2YgY29udGVudCA9PT0gJ3N0cmluZycpIGNvbnRlbnQgPSBbW21vZHVsZS5pZCwgY29udGVudCwgJyddXTtcbi8vIFByZXBhcmUgY3NzVHJhbnNmb3JtYXRpb25cbnZhciB0cmFuc2Zvcm07XG5cbnZhciBvcHRpb25zID0ge31cbm9wdGlvbnMudHJhbnNmb3JtID0gdHJhbnNmb3JtXG4vLyBhZGQgdGhlIHN0eWxlcyB0byB0aGUgRE9NXG52YXIgdXBkYXRlID0gcmVxdWlyZShcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2xpYi9hZGRTdHlsZXMuanNcIikoY29udGVudCwgb3B0aW9ucyk7XG5pZihjb250ZW50LmxvY2FscykgbW9kdWxlLmV4cG9ydHMgPSBjb250ZW50LmxvY2Fscztcbi8vIEhvdCBNb2R1bGUgUmVwbGFjZW1lbnRcbmlmKG1vZHVsZS5ob3QpIHtcblx0Ly8gV2hlbiB0aGUgc3R5bGVzIGNoYW5nZSwgdXBkYXRlIHRoZSA8c3R5bGU+IHRhZ3Ncblx0aWYoIWNvbnRlbnQubG9jYWxzKSB7XG5cdFx0bW9kdWxlLmhvdC5hY2NlcHQoXCIhIS4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2luZGV4LmpzIS4vaW5kZXguY3NzXCIsIGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIG5ld0NvbnRlbnQgPSByZXF1aXJlKFwiISEuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcyEuL2luZGV4LmNzc1wiKTtcblx0XHRcdGlmKHR5cGVvZiBuZXdDb250ZW50ID09PSAnc3RyaW5nJykgbmV3Q29udGVudCA9IFtbbW9kdWxlLmlkLCBuZXdDb250ZW50LCAnJ11dO1xuXHRcdFx0dXBkYXRlKG5ld0NvbnRlbnQpO1xuXHRcdH0pO1xuXHR9XG5cdC8vIFdoZW4gdGhlIG1vZHVsZSBpcyBkaXNwb3NlZCwgcmVtb3ZlIHRoZSA8c3R5bGU+IHRhZ3Ncblx0bW9kdWxlLmhvdC5kaXNwb3NlKGZ1bmN0aW9uKCkgeyB1cGRhdGUoKTsgfSk7XG59XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvY3NzL2luZGV4LmNzc1xuLy8gbW9kdWxlIGlkID0gNlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJleHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvbGliL2Nzcy1iYXNlLmpzXCIpKHVuZGVmaW5lZCk7XG4vLyBpbXBvcnRzXG5cblxuLy8gbW9kdWxlXG5leHBvcnRzLnB1c2goW21vZHVsZS5pZCwgXCJcXHJcXG5odG1sIGJvZHl7Zm9udC1mYW1pbHk6ICdtaWNyb3NvZnQgeWFoZWknLEFyaWFsLHNhbnMtc2VyaWY7fVxcclxcbi5sYXlvdXQtYm9keXtkaXNwbGF5OmZsZXg7fVxcclxcbi5sYXlvdXQtYm9keSAud3AtZHJhZ3tmbGV4OjI7aGVpZ2h0OjEwMHZoO2JvcmRlci1yaWdodDoxcHggc29saWQgI0NEQ0RDRDtib3gtc2l6aW5nOmJvcmRlci1ib3g7cGFkZGluZzoyNHB4O3Bvc2l0aW9uOiByZWxhdGl2ZTt9XFxyXFxuLmxheW91dC1ib2R5IC53cC1tZW51e2ZsZXg6MTtoZWlnaHQ6MTAwdmg7fVxcclxcblxcclxcbi53cC1kcmFnIC5kcmFnLW1haW57d2lkdGg6NTAlO2hlaWdodDo1MHZoO2NvbG9yOiNDRENEQ0Q7Ym9yZGVyOjNweCBkYXNoZWQ7Zm9udC1zaXplOjI0cHg7dGV4dC1hbGlnbjpjZW50ZXI7bGluZS1oZWlnaHQ6NTB2aDtwb3NpdGlvbjphYnNvbHV0ZTtsZWZ0OjUwJTt0b3A6NTAlO3RyYW5zZm9ybTp0cmFuc2xhdGUoLTUwJSwgLTUwJSk7b3BhY2l0eTowO31cXHJcXG4ud3AtZHJhZyAuZHJhZy1tYWluLmRyb3AtaG92ZXJ7b3BhY2l0eToxO31cXHJcXG5cXHJcXG4uZHJhZy1sb2cgcHtmb250LXdlaWdodDpub3JtYWw7Zm9udC1zaXplOjE0cHg7bGluZS1oZWlnaHQ6MS41O31cXHJcXG4uZHJhZy1sb2cgLnN1Y2N7Y29sb3I6IzQ1QkY1NTt9XFxyXFxuLmRyYWctbG9nIC5mYWlse2NvbG9yOiNGMjIyMzM7fVxcclxcblxcclxcbi5sYXlvdXQtYm9keSAud3AtbWVudSAubWVudS1vcHRpb25ze3BhZGRpbmc6MjBweDtmb250LXNpemU6MTRweDtoZWlnaHQ6NjB2aDtib3JkZXItYm90dG9tOjFweCBzb2xpZCAjQ0RDRENEO2JveC1zaXppbmc6Ym9yZGVyLWJveDt9XFxyXFxuLm1lbnUtb3B0aW9ucyB1bCBsaXttYXJnaW4tYm90dG9tOjEwcHg7fVxcclxcbmlucHV0W3R5cGU9Y2hlY2tib3hde3ZlcnRpY2FsLWFsaWduOi0ycHg7fVxcclxcblxcclxcbi5sYXlvdXQtYm9keSAud3AtbWVudSAubWVudS1hZGRyZXNze3BhZGRpbmc6MTBweCAyMHB4O2ZvbnQtc2l6ZToxNHB4O2hlaWdodDo0MHZoO2JveC1zaXppbmc6IGJvcmRlci1ib3g7fVxcclxcbi5tZW51LWFkZHJlc3MgaDN7Zm9udC1zaXplOjE0cHg7Zm9udC13ZWlnaHQ6bm9ybWFsO21hcmdpbi1ib3R0b206MTBweDttYXJnaW4tbGVmdDotMTBweDt9XCIsIFwiXCJdKTtcblxuLy8gZXhwb3J0c1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlciEuL3NyYy9jc3MvaW5kZXguY3NzXG4vLyBtb2R1bGUgaWQgPSA3XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmltcG9ydCBkcmFnRHJvcCBmcm9tICcuL2hwLWRyYWcnO1xyXG5pbXBvcnQgc3ByaXRlQ3NzIGZyb20gJy4vaHAtY3NzLXNwcml0ZSc7XHJcbmltcG9ydCB7IGhhbmRsZUNzcywgaGFuZGxlSHRtbCwgaGFuZGxlSW1hZ2UgfSBmcm9tICcuL2hwLWhhbmRsZWZpbGUnO1xyXG5jb25zdCBzcHJpdGVzID0gZ2xvYmFsLnJlcXVpcmUoJ3Bvc3Rjc3Mtc3ByaXRlcycpO1xyXG5jb25zdCBwYXRoID0gZ2xvYmFsLnJlcXVpcmUoJ3BhdGgnKTtcclxuY29uc3QgYXV0b3ByZWZpeGVyID0gZ2xvYmFsLnJlcXVpcmUoJ2F1dG9wcmVmaXhlcicpO1xyXG5jb25zdCBhdEltcG9ydCA9IGdsb2JhbC5yZXF1aXJlKCdwb3N0Y3NzLWltcG9ydCcpO1xyXG5jb25zdCBjc3NuYW5vID0gZ2xvYmFsLnJlcXVpcmUoJ2Nzc25hbm8nKTtcclxuY29uc3QgY3NzbmV4dCA9IGdsb2JhbC5yZXF1aXJlKCdwb3N0Y3NzLWNzc25leHQnKTtcclxuXHJcbihmdW5jdGlvbigpe1xyXG5cclxuXHQvLyDojrflj5bnlKjmiLfmiYDpgInpgInpoblcclxuXHRsZXQgb3B0aW9ucyA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdvcHRpb25zJyk7XHJcblx0aWYob3B0aW9ucykge1xyXG5cdFx0b3B0aW9ucy5zcGxpdCgnLCcpLmZvckVhY2goZnVuY3Rpb24oaW5kZXgpIHtcclxuXHRcdFx0ZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLm9wdGlvbicpW2luZGV4XS5jaGVja2VkID0gdHJ1ZTtcclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblx0bGV0IG1vZGUgPSBwbHVnaW5zQXNzZW1ibGUoKTtcclxuXHJcblx0ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbihldmVudCl7XHJcblx0XHRpZihldmVudC50YXJnZXQuY2xhc3NOYW1lID09ICdvcHRpb24nKSB7XHJcblx0XHRcdG1vZGUgPSBwbHVnaW5zQXNzZW1ibGUoKTtcclxuXHRcdH1cclxuXHR9KTtcclxuXHJcblx0Ly8g5aSE55CG5ouW5ou95LqL5Lu2XHJcblx0ZHJhZ0Ryb3AoZnVuY3Rpb24oZmlsZSl7XHJcblxyXG5cdFx0XHJcblx0XHRsZXQgcGF0aE9iaiA9IHBhdGgucGFyc2UoZmlsZVswXS5wYXRoKTtcclxuXHJcblx0XHRpZigvY3NzLy50ZXN0KHBhdGhPYmouZXh0KSkge1x0Ly8g5Lyg5YWlIGNzcyDmlofku7ZcclxuXHJcblx0XHRcdGxldCBiYXNlUGF0aCA9IHBhdGhPYmouZGlyLnNwbGl0KHBhdGguc2VwKS5zbGljZSgwLC0xKS5qb2luKHBhdGguc2VwKTtcclxuXHRcdFx0bGV0IG9wdHMgPSBzcHJpdGVDc3MoYmFzZVBhdGgsIG1vZGUuc3ByaXRlTW9kZSk7XHJcblx0XHRcdG1vZGUucGx1Z2lucy51bnNoaWZ0KHNwcml0ZXMob3B0cykpO1xyXG5cdFx0XHRoYW5kbGVDc3MoZmlsZVswXS5wYXRoLCBtb2RlLnBsdWdpbnMpO1xyXG5cclxuXHRcdH1lbHNlIGlmKC9odG1sLy50ZXN0KHBhdGhPYmouZXh0KSkge1x0Ly8g5Lyg5YWlIGh0bWwg5paH5Lu2XHJcblxyXG5cdFx0XHRoYW5kbGVIdG1sKGZpbGVbMF0ucGF0aCk7XHJcblxyXG5cdFx0fWVsc2Uge1xyXG5cclxuXHRcdFx0aGFuZGxlSW1hZ2UoZmlsZSwgbW9kZS5pbWdRdWFudCk7XHJcblxyXG5cdFx0fVxyXG5cdFx0XHJcblx0fSk7XHJcblxyXG59KSgpO1xyXG5cclxuLyoqXHJcbiog5oyJ6ZyA6YWN572u5o+S5Lu2LOW5tuS/neWtmOeUqOaIt+aJgOmAiemAiemhuVxyXG4qXHJcbiovXHJcbmZ1bmN0aW9uIHBsdWdpbnNBc3NlbWJsZSgpIHtcclxuXHJcblx0bGV0IGNoZWNrYm94ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLm1lbnUtb3B0aW9ucyAub3B0aW9uJyk7XHJcblx0bGV0IG1vZGUgPSB7XHJcblx0XHRzcHJpdGVNb2RlOiAncGMnLFxyXG5cdFx0aW1nUXVhbnQ6IGZhbHNlLFxyXG5cdFx0cGx1Z2luczogW11cclxuXHR9O1xyXG5cdGxldCBvcHRpb25zID0gW107XHJcblx0Zm9yKGxldCBpID0gMDsgaSA8IGNoZWNrYm94Lmxlbmd0aDsgaSsrKSB7XHJcblx0XHRpZihjaGVja2JveFtpXS5jaGVja2VkKSB7XHJcblx0XHRcdG9wdGlvbnMucHVzaChpKTtcclxuXHRcdFx0c3dpdGNoKGNoZWNrYm94W2ldLnZhbHVlKSB7XHJcblx0XHRcdGNhc2UgJ3BjJzpcclxuXHRcdFx0XHRtb2RlLnNwcml0ZU1vZGUgPSAncGMnO1xyXG5cdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRjYXNlICdyZW0nOlxyXG5cdFx0XHRcdG1vZGUuc3ByaXRlTW9kZSA9ICdyZW0nO1xyXG5cdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRjYXNlICdwaWNuYW5vJzpcclxuXHRcdFx0XHRtb2RlLmltZ1F1YW50ID0gdHJ1ZTtcclxuXHRcdFx0XHRicmVhaztcclxuXHRcdFx0Y2FzZSAnY3NzbmV4dCc6XHJcblx0XHRcdFx0bW9kZS5wbHVnaW5zLnB1c2goY3NzbmV4dCh7XHJcblx0XHRcdFx0XHRmZWF0dXJlczoge1xyXG5cdFx0XHRcdFx0XHRhdXRvcHJlZml4ZXI6IGZhbHNlXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSkpO1xyXG5cdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRjYXNlICdhdXRvcHJlZml4ZXInOlxyXG5cdFx0XHRcdG1vZGUucGx1Z2lucy5wdXNoKGF1dG9wcmVmaXhlcignbGFzdCA2IHZlcnNpb25zJykpO1xyXG5cdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRjYXNlICdAaW1wb3J0JzpcclxuXHRcdFx0XHRtb2RlLnBsdWdpbnMucHVzaChhdEltcG9ydCk7XHJcblx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdGNhc2UgJ2Nzc25hbm8nOlxyXG5cdFx0XHRcdG1vZGUucGx1Z2lucy5wdXNoKGNzc25hbm8pO1xyXG5cdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRkZWZhdWx0OlxyXG5cdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cdGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdvcHRpb25zJywgb3B0aW9ucyk7XHJcblx0cmV0dXJuIG1vZGU7XHJcblxyXG59XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2pzL21haW4uanMiLCIndXNlIHN0cmljdCc7XHJcblxyXG4vLyBjb25zdCBwYXRoID0gZ2xvYmFsLnJlcXVpcmUoJ3BhdGgnKTtcclxuLyoqXHJcbiog5aSE55CG5ouW5ou95LqL5Lu2XHJcbipcclxuKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYlxyXG4qL1xyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihjYikge1xyXG5cclxuXHQvLyDlj5bmtojpu5jorqTooYzkuLpcclxuXHRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdkcm9wJywgZnVuY3Rpb24oZSl7XHJcblx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0fSwgZmFsc2UpO1xyXG5cdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2RyYWdMZWF2ZScsIGZ1bmN0aW9uKGUpe1xyXG5cdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdH0sIGZhbHNlKTtcclxuXHRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdkcmFnZW50ZXInLCBmdW5jdGlvbihlKXtcclxuXHRcdGUucHJldmVudERlZmF1bHQoKTtcclxuXHR9LCBmYWxzZSk7XHJcblx0ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignZHJhZ292ZXInLCBmdW5jdGlvbihlKXtcclxuXHRcdGUucHJldmVudERlZmF1bHQoKTtcclxuXHR9LCBmYWxzZSk7XHJcblxyXG5cdGxldCBkcm9wWm9uZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5kcmFnLW1haW4nKTtcclxuXHJcblx0ZHJvcFpvbmUuYWRkRXZlbnRMaXN0ZW5lcignZHJhZ292ZXInLCBmdW5jdGlvbihlKXtcclxuXHRcdGUucHJldmVudERlZmF1bHQoKTtcclxuXHRcdHRoaXMuY2xhc3NMaXN0LmFkZCgnZHJvcC1ob3ZlcicpO1xyXG5cdH0sIGZhbHNlKTtcclxuXHJcblx0ZHJvcFpvbmUuYWRkRXZlbnRMaXN0ZW5lcignZHJhZ2xlYXZlJywgZnVuY3Rpb24oZSl7XHJcblx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHQvLyB0aGlzLmNsYXNzTGlzdC5yZW1vdmUoJ2Ryb3AtaG92ZXInKTtcclxuXHR9LCBmYWxzZSk7XHJcblxyXG5cdGRyb3Bab25lLmFkZEV2ZW50TGlzdGVuZXIoJ2Ryb3AnLCBmdW5jdGlvbihlKXtcclxuXHRcdGUucHJldmVudERlZmF1bHQoKTtcclxuXHRcdHRoaXMuY2xhc3NMaXN0LnJlbW92ZSgnZHJvcC1ob3ZlcicpO1xyXG5cdFx0bGV0IHAgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuZHJhZy1sb2cgcCcpO1xyXG5cdFx0Zm9yKGxldCBpID0gMDsgaSA8IHAubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0cFtpXS5pbm5lckhUTUwgPSAnJztcclxuXHRcdH1cclxuXHRcdGxldCBmaWxlSW5mbyA9IGUuZGF0YVRyYW5zZmVyLmZpbGVzO1xyXG5cdFx0Y2IoZmlsZUluZm8pO1xyXG5cdH0sIGZhbHNlKTtcclxuXHJcbn1cclxuXHJcbi8qKlxyXG4qIOWkhOeQhuaWh+S7tuS/oeaBr1xyXG4qXHJcbiogQHBhcmFtIHtPYmplY3R9IGZpbGVJbmZvXHJcbiovXHJcbi8vIGZ1bmN0aW9uIGhhbmRsZUZpbGUoZmlsZUluZm8sIGNiKSB7XHJcbi8vIFx0Y2IoKTtcclxuLy8gfVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9qcy9ocC1kcmFnLmpzIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuY29uc3QgcG9zdGNzcyA9IGdsb2JhbC5yZXF1aXJlKCdwb3N0Y3NzJyk7XHJcbmNvbnN0IHBhdGggPSBnbG9iYWwucmVxdWlyZSgncGF0aCcpO1xyXG5cclxuXHJcbi8qKlxyXG4qIOmFjee9riBzcHJpdGUg5L+h5oGvXHJcbipcclxuKiBAcGFyYW0ge3N0cmluZ30gYmFzZVBhdGhcclxuKiBAcGFyYW0ge3N0cmluZ30gbW9kZVxyXG4qL1xyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihiYXNlUGF0aCwgbW9kZSkge1xyXG5cclxuXHRsZXQgb3B0cyA9IHtcclxuXHRcdHN0eWxlc2hlZXRQYXRoOiBwYXRoLmpvaW4oYmFzZVBhdGgsICcvZGlzdC9jc3MvJyksXHJcblx0XHRzcHJpdGVQYXRoOiAnLi9kaXN0L2ltZycsXHJcblx0XHRiYXNlUGF0aDogYmFzZVBhdGgsXHJcblx0XHRzcHJpdGVzbWl0aDoge1xyXG5cdFx0XHRwYWRkaW5nOiAwLFxyXG5cdFx0XHQvLyBhbGdvcml0aG06ICd0b3AtZG93bidcclxuXHRcdH0sXHJcblx0XHRmaWx0ZXJCeTogZnVuY3Rpb24oaW1hZ2UpIHtcclxuXHRcdFx0Ly8gY29uc29sZS5sb2coaW1hZ2UpO1xyXG5cdFx0XHRpZighfmltYWdlLnVybC5pbmRleE9mKCcvc2xpY2UvJykpIHtcclxuXHRcdFx0XHRyZXR1cm4gUHJvbWlzZS5yZWplY3QoKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XHJcblx0XHR9LFxyXG5cdFx0Z3JvdXBCeTogZnVuY3Rpb24oaW1hZ2UpIHtcclxuXHRcdFx0bGV0IG5hbWUgPSAvXFwvc2xpY2VcXC8oWzAtOS5BLVphLXpdKylcXC8vLmV4ZWMoaW1hZ2UudXJsKTtcclxuXHRcdFx0aWYoIW5hbWUpe1xyXG5cdFx0XHRcdHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoJ05vdCBhIHNoYXBlIGltYWdlJykpO1xyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiBQcm9taXNlLnJlc29sdmUobmFtZVsxXSk7XHJcblx0XHR9LFxyXG5cdFx0aG9va3M6IHtcclxuXHRcdFx0b25VcGRhdGVSdWxlOiBmdW5jdGlvbihydWxlLCB0b2tlbiwgaW1hZ2UpIHtcclxuXHRcdFx0XHQvLyBbJ3dpZHRoJywgJ2hlaWdodCddLmZvckVhY2goZnVuY3Rpb24ocHJvcCl7XHJcblx0XHRcdFx0Ly8gXHRsZXQgdmFsdWUgPSBpbWFnZS5jb29yZHNbcHJvcF07XHJcblx0XHRcdFx0Ly8gXHRpZihpbWFnZS5yZXRpbmEpIHtcclxuXHRcdFx0XHQvLyBcdFx0dmFsdWUgLz0gaW1hZ2UucmF0aW87XHJcblx0XHRcdFx0Ly8gXHR9XHJcblx0XHRcdFx0Ly8gXHRydWxlLmluc2VydEFmdGVyKHJ1bGUubGFzdCwgcG9zdGNzcy5kZWNsKHtcclxuXHRcdFx0XHQvLyBcdFx0cHJvcDogcHJvcCxcclxuXHRcdFx0XHQvLyBcdFx0dmFsdWU6IHZhbHVlICsgJ3B4J1xyXG5cdFx0XHRcdC8vIFx0fSkpO1xyXG5cdFx0XHRcdC8vIH0pO1xyXG5cclxuXHRcdFx0XHRsZXQgYmFja2dyb3VuZFNpemUsIGJhY2tncm91bmRQb3NpdGlvbjtcclxuXHJcblx0XHRcdFx0aWYobW9kZSA9PSAncGMnKSB7XHJcblxyXG5cdFx0XHRcdFx0bGV0IGJhY2tncm91bmRQb3NpdGlvblggPSAtaW1hZ2UuY29vcmRzLngsXHJcblx0XHRcdFx0XHRcdGJhY2tncm91bmRQb3NpdGlvblkgPSAtaW1hZ2UuY29vcmRzLnk7XHJcblxyXG5cdFx0XHRcdFx0YmFja2dyb3VuZFNpemUgPSBwb3N0Y3NzLmRlY2woe1xyXG5cdFx0XHRcdFx0XHRwcm9wOiAnYmFja2dyb3VuZC1zaXplJyxcclxuXHRcdFx0XHRcdFx0dmFsdWU6ICdhdXRvJ1xyXG5cdFx0XHRcdFx0fSk7XHJcblxyXG5cdFx0XHRcdFx0YmFja2dyb3VuZFBvc2l0aW9uID0gcG9zdGNzcy5kZWNsKHtcclxuXHRcdFx0XHRcdFx0cHJvcDogJ2JhY2tncm91bmQtcG9zaXRpb24nLFxyXG5cdFx0XHRcdFx0XHR2YWx1ZTogYmFja2dyb3VuZFBvc2l0aW9uWCArICdweCAnICsgYmFja2dyb3VuZFBvc2l0aW9uWSArICdweCdcclxuXHRcdFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0XHR9ZWxzZSBpZihtb2RlID09ICdyZW0nKSB7XHJcblxyXG5cdFx0XHRcdFx0bGV0IGJhY2tncm91bmRQb3NpdGlvblggPSAtKGltYWdlLmNvb3Jkcy54IC8gMTAwKSxcclxuXHRcdFx0XHRcdFx0YmFja2dyb3VuZFBvc2l0aW9uWSA9IC0oaW1hZ2UuY29vcmRzLnkgLyAxMDApO1xyXG5cclxuXHRcdFx0XHRcdGJhY2tncm91bmRTaXplID0gcG9zdGNzcy5kZWNsKHtcclxuXHRcdFx0XHRcdFx0cHJvcDogJ2JhY2tncm91bmQtc2l6ZScsXHJcblx0XHRcdFx0XHRcdHZhbHVlOiAoaW1hZ2Uuc3ByaXRlV2lkdGggLyAxMDApICsgJ3JlbSAnICsgJ2F1dG8nXHJcblx0XHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdFx0XHRiYWNrZ3JvdW5kUG9zaXRpb24gPSBwb3N0Y3NzLmRlY2woe1xyXG5cdFx0XHRcdFx0XHRwcm9wOiAnYmFja2dyb3VuZC1wb3NpdGlvbicsXHJcblx0XHRcdFx0XHRcdHZhbHVlOiBiYWNrZ3JvdW5kUG9zaXRpb25YICsgJ3JlbSAnICsgYmFja2dyb3VuZFBvc2l0aW9uWSArICdyZW0nXHJcblx0XHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdFx0fWVsc2Uge1xyXG5cclxuXHRcdFx0XHRcdGxldCBiYWNrZ3JvdW5kU2l6ZVggPSAoaW1hZ2Uuc3ByaXRlV2lkdGggLyBpbWFnZS5jb29yZHMud2lkdGgpICogMTAwLFxyXG5cdFx0XHRcdFx0XHRiYWNrZ3JvdW5kU2l6ZVkgPSAoaW1hZ2Uuc3ByaXRlSGVpZ2h0IC8gaW1hZ2UuY29vcmRzLmhlaWdodCkgKiAxMDAsXHJcblx0XHRcdFx0XHRcdGJhY2tncm91bmRQb3NpdGlvblggPSAoaW1hZ2UuY29vcmRzLnggLyAoaW1hZ2Uuc3ByaXRlV2lkdGggLSBpbWFnZS5jb29yZHMud2lkdGgpKSAqIDEwMCxcclxuXHRcdFx0XHRcdFx0YmFja2dyb3VuZFBvc2l0aW9uWSA9IChpbWFnZS5jb29yZHMueSAvIChpbWFnZS5zcHJpdGVIZWlnaHQgLSBpbWFnZS5jb29yZHMuaGVpZ2h0KSkgKiAxMDA7XHJcblxyXG5cdFx0XHRcdFx0YmFja2dyb3VuZFNpemVYID0gaXNOYU4oYmFja2dyb3VuZFNpemVYKSA/IDAgOiBiYWNrZ3JvdW5kU2l6ZVg7XHJcblx0XHRcdFx0XHRiYWNrZ3JvdW5kU2l6ZVkgPSBpc05hTihiYWNrZ3JvdW5kU2l6ZVkpID8gMCA6IGJhY2tncm91bmRTaXplWTtcclxuXHRcdFx0XHRcdGJhY2tncm91bmRQb3NpdGlvblggPSBpc05hTihiYWNrZ3JvdW5kUG9zaXRpb25YKSA/IDAgOiBiYWNrZ3JvdW5kUG9zaXRpb25YO1xyXG5cdFx0XHRcdFx0YmFja2dyb3VuZFBvc2l0aW9uWSA9IGlzTmFOKGJhY2tncm91bmRQb3NpdGlvblkpID8gMCA6IGJhY2tncm91bmRQb3NpdGlvblk7XHJcblxyXG5cdFx0XHRcdFx0YmFja2dyb3VuZFNpemUgPSBwb3N0Y3NzLmRlY2woe1xyXG5cdFx0XHRcdFx0XHRwcm9wOiAnYmFja2dyb3VuZC1zaXplJyxcclxuXHRcdFx0XHRcdFx0dmFsdWU6IGJhY2tncm91bmRTaXplWCArICclICcgKyBiYWNrZ3JvdW5kU2l6ZVkgKyAnJSdcclxuXHRcdFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0XHRcdGJhY2tncm91bmRQb3NpdGlvbiA9IHBvc3Rjc3MuZGVjbCh7XHJcblx0XHRcdFx0XHRcdHByb3A6ICdiYWNrZ3JvdW5kLXBvc2l0aW9uJyxcclxuXHRcdFx0XHRcdFx0dmFsdWU6IGJhY2tncm91bmRQb3NpdGlvblggKyAnJSAnICsgYmFja2dyb3VuZFBvc2l0aW9uWSArICclJ1xyXG5cdFx0XHRcdFx0fSk7XHJcblxyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0bGV0IGJhY2tncm91bmRJbWFnZSA9IHBvc3Rjc3MuZGVjbCh7XHJcblx0XHRcdFx0XHRwcm9wOiAnYmFja2dyb3VuZC1pbWFnZScsXHJcblx0XHRcdFx0XHR2YWx1ZTogJ3VybCgnICsgaW1hZ2Uuc3ByaXRlVXJsICsgJyknXHJcblx0XHRcdFx0fSk7XHJcblxyXG5cdFx0XHRcdGxldCBiYWNrZ3JvdW5kUmVwZWF0ID0gcG9zdGNzcy5kZWNsKHtcclxuXHRcdFx0XHRcdHByb3A6ICdiYWNrZ3JvdW5kLXJlcGVhdCcsXHJcblx0XHRcdFx0XHR2YWx1ZTogJ25vLXJlcGVhdCdcclxuXHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdFx0cnVsZS5pbnNlcnRBZnRlcih0b2tlbiwgYmFja2dyb3VuZEltYWdlKTtcclxuXHRcdFx0XHRydWxlLmluc2VydEFmdGVyKGJhY2tncm91bmRJbWFnZSwgYmFja2dyb3VuZFBvc2l0aW9uKTtcclxuXHRcdFx0XHRydWxlLmluc2VydEFmdGVyKGJhY2tncm91bmRQb3NpdGlvbiwgYmFja2dyb3VuZFNpemUpO1xyXG5cdFx0XHRcdHJ1bGUuaW5zZXJ0QWZ0ZXIoYmFja2dyb3VuZFBvc2l0aW9uLCBiYWNrZ3JvdW5kUmVwZWF0KTtcclxuXHJcblx0XHRcdFx0XHJcblx0XHRcdH0sXHJcblx0XHRcdG9uU2F2ZVNwcml0ZXNoZWV0OiBmdW5jdGlvbihvcHRzLCBzcHJpdGVzaGVldCkge1xyXG5cdFx0XHRcdGxldCBmaWxlbmFtZUNodW5rcyA9IHNwcml0ZXNoZWV0Lmdyb3Vwcy5jb25jYXQoc3ByaXRlc2hlZXQuZXh0ZW5zaW9uKTtcclxuXHRcdFx0XHRpZihmaWxlbmFtZUNodW5rcy5sZW5ndGggPiAxKVxyXG5cdFx0XHRcdFx0cmV0dXJuIHBhdGguam9pbihiYXNlUGF0aCwgb3B0cy5zcHJpdGVQYXRoLCAnc3ByLScgKyBmaWxlbmFtZUNodW5rc1swXSArICcuJyArIGZpbGVuYW1lQ2h1bmtzWzFdKTtcclxuXHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRyZXR1cm4gcGF0aC5qb2luKGJhc2VQYXRoLCBvcHRzLnNwcml0ZVBhdGgsICdzcHInICsgJy4nICsgZmlsZW5hbWVDaHVua3NbMF0pO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fTtcclxuXHJcblx0cmV0dXJuIG9wdHM7XHJcblx0XHJcbn1cclxuXHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9qcy9ocC1jc3Mtc3ByaXRlLmpzIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuY29uc3QgZnMgPSBnbG9iYWwucmVxdWlyZSgnZnMnKTtcclxuY29uc3QgcGF0aCA9IGdsb2JhbC5yZXF1aXJlKCdwYXRoJyk7XHJcbmNvbnN0IHBvc3Rjc3MgPSBnbG9iYWwucmVxdWlyZSgncG9zdGNzcycpO1xyXG5jb25zdCBpbWFnZW1pbiA9IGdsb2JhbC5yZXF1aXJlKCdpbWFnZW1pbicpO1xyXG5jb25zdCBpbWFnZW1pbkpwZWd0cmFuID0gZ2xvYmFsLnJlcXVpcmUoJ2ltYWdlbWluLWpwZWd0cmFuJyk7XHJcbmNvbnN0IGltYWdlbWluUG5ncXVhbnQgPSBnbG9iYWwucmVxdWlyZSgnaW1hZ2VtaW4tcG5ncXVhbnQnKTtcclxuaW1wb3J0IGxvZyBmcm9tICcuL2hwLWxvZyc7XHJcblxyXG5leHBvcnQgeyBoYW5kbGVDc3MsIGhhbmRsZUh0bWwsIGhhbmRsZUltYWdlIH07XHJcbi8qKlxyXG4qIOaTjeS9nGNzc1xyXG4qXHJcbiogQHBhcmFtIHtzdHJpbmd9IHN0eWxlc2hlZXRQYXRoXHJcbiovXHJcbmZ1bmN0aW9uIGhhbmRsZUNzcyhzdHlsZXNoZWV0UGF0aCwgcGx1Z2lucykge1xyXG5cclxuXHRsZXQgcGF0aE9iaiA9IHBhdGgucGFyc2Uoc3R5bGVzaGVldFBhdGgpO1xyXG5cdGxldCBiYXNlUGF0aCA9IHBhdGhPYmouZGlyLnNwbGl0KHBhdGguc2VwKS5zbGljZSgwLC0xKS5qb2luKHBhdGguc2VwKTtcclxuXHRleGlzdHNGbG9kZXIoYmFzZVBhdGgsIHBhdGguam9pbihiYXNlUGF0aCwgJy9kaXN0L2Nzcy8nKSk7XHJcblx0bG9nKHN0eWxlc2hlZXRQYXRoKTtcclxuXHRmcy5yZWFkRmlsZShzdHlsZXNoZWV0UGF0aCwgJ3V0Zi04JywgZnVuY3Rpb24oZXJyLCBjc3Mpe1xyXG5cdFx0cG9zdGNzcyhwbHVnaW5zKVx0Ly8g5aSE55CGY3NzXHJcblx0XHRcdC5wcm9jZXNzKGNzcywgeyBmcm9tOiBzdHlsZXNoZWV0UGF0aCwgdG86IGJhc2VQYXRoICsgJy9kaXN0L2Nzcy8nICsgcGF0aE9iai5iYXNlIH0pXHJcblx0XHRcdC50aGVuKHJlc3VsdCA9PiB7XHJcblx0XHRcdFx0ZnMud3JpdGVGaWxlKHBhdGguam9pbihiYXNlUGF0aCwgJy9kaXN0L2Nzcy8nLCBwYXRoT2JqLmJhc2UpLCByZXN1bHQuY3NzLCBmdW5jdGlvbihlcnIpe1xyXG5cdFx0XHRcdFx0aWYoZXJyKSB7XHJcblx0XHRcdFx0XHRcdGxvZyhlcnIudG9TdHJpbmcoKSwgJ2ZhaWwnKTtcclxuXHRcdFx0XHRcdH1lbHNlIHtcclxuXHRcdFx0XHRcdFx0Ly8g5Y6L57yp6Zuq56Kn5Zu+XHJcblx0XHRcdFx0XHRcdGltYWdlbWluKFtwYXRoLmpvaW4oYmFzZVBhdGgsICcvZGlzdC9pbWcvc3ByKi5wbmcnKV0scGF0aC5qb2luKGJhc2VQYXRoLCAnL2Rpc3QvaW1nLycpLCB7XHJcblx0XHRcdFx0XHRcdFx0cGx1Z2luczogW1xyXG5cdFx0XHRcdFx0XHRcdFx0aW1hZ2VtaW5KcGVndHJhbigpLFxyXG5cdFx0XHRcdFx0XHRcdFx0aW1hZ2VtaW5QbmdxdWFudCh7cXVhbGl0eTogJzY1LTgwJ30pXHJcblx0XHRcdFx0XHRcdFx0XVxyXG5cdFx0XHRcdFx0XHR9KS50aGVuKCgpID0+IHtcclxuXHRcdFx0XHRcdFx0XHRsb2coJ3N1Y2Nlc3M6ICcgKyBwYXRoLmpvaW4oYmFzZVBhdGgsICcvZGlzdC9jc3MvJywgcGF0aE9iai5iYXNlKSwgJ3N1Y2Nlc3MnKTtcclxuXHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRpZihyZXN1bHQubWFwKVxyXG5cdFx0XHRcdFx0XHRmcy53cml0ZUZpbGVTeW5jKGJhc2VQYXRoICsgJy9kaXN0L2Nzcy8nICsgcGF0aE9iai5iYXNlICsgJy5tYXAnLCByZXN1bHQubWFwKTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fSk7XHJcblx0fSk7XHJcblxyXG59XHJcblxyXG4vKipcclxuKiDmk43kvZxodG1sXHJcbipcclxuKiBAcGFyYW0ge3N0cmluZ30gaHRtbFBhdGhcclxuKi9cclxuZnVuY3Rpb24gaGFuZGxlSHRtbChodG1sUGF0aCkge1xyXG5cdGxldCBwYXRoT2JqID0gcGF0aC5wYXJzZShodG1sUGF0aCk7XHJcblx0bGV0IGJhc2VQYXRoID0gcGF0aE9iai5kaXI7XHJcblx0ZXhpc3RzRmxvZGVyKGJhc2VQYXRoLCBodG1sUGF0aCk7XHJcblx0bG9nKGh0bWxQYXRoKTtcclxuXHRmcy5yZWFkRmlsZShodG1sUGF0aCwgZnVuY3Rpb24oZXJyLCBkYXRhKXtcclxuXHRcdGlmKGVycil7XHJcblx0XHRcdGxvZyhlcnIudG9TdHJpbmcoKSwgJ2ZhaWwnKTtcclxuXHRcdH1lbHNlIHtcclxuXHRcdFx0bGV0IGh0bWwgPSBkYXRhO1xyXG5cdFx0XHRmcy53cml0ZUZpbGUocGF0aC5qb2luKGJhc2VQYXRoLCAnL2Rpc3QvJywgcGF0aE9iai5iYXNlKSwgaHRtbC50b1N0cmluZygpLCBmdW5jdGlvbihlcnIpe1xyXG5cdFx0XHRcdGlmKGVycil7XHJcblx0XHRcdFx0XHRsb2coZXJyLnRvU3RyaW5nKCksICdmYWlsJyk7XHJcblx0XHRcdFx0fWVsc2Uge1xyXG5cdFx0XHRcdFx0bG9nKCdzdWNjZXNzOiAnICsgcGF0aC5qb2luKGJhc2VQYXRoLCAnL2Rpc3QvJywgcGF0aE9iai5iYXNlKSwgJ3N1Y2Nlc3MnKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cdH0pO1xyXG59XHJcblxyXG4vKipcclxuKiDmk43kvZzlm77niYdcclxuKlxyXG4qIEBwYXJhbSB7QXJyYXl9IGltYWdlXHJcbiovXHJcbmZ1bmN0aW9uIGhhbmRsZUltYWdlKGltYWdlLCBpbWdRdWFudCkge1xyXG5cdGxldCBwYXRoT2JqID0gcGF0aC5wYXJzZShpbWFnZVswXS5wYXRoKTtcclxuXHRsZXQgYmFzZVBhdGggPSBwYXRoT2JqLmRpci5zcGxpdChwYXRoLnNlcCkuc2xpY2UoMCwtMSkuam9pbihwYXRoLnNlcCksXHJcblx0XHRvdXRwdXRQYXRoID0gcGF0aE9iai5kaXIuc3BsaXQocGF0aC5zZXApO1xyXG5cdG91dHB1dFBhdGguc3BsaWNlKC0xLCAwLCAnZGlzdCcpO1xyXG5cdG91dHB1dFBhdGggPSBvdXRwdXRQYXRoLmpvaW4ocGF0aC5zZXApO1xyXG5cdC8vIOWIm+W7uuacrOWcsOaWh+S7tuWkuVxyXG5cdGV4aXN0c0Zsb2RlcihiYXNlUGF0aCwgb3V0cHV0UGF0aCk7XHJcblx0aWYoaW1nUXVhbnQpIHtcclxuXHRcdGxldCBpbWFnZVBhdGggPSBbXTtcclxuXHRcdGZvcihsZXQgaSA9IDA7IGkgPCBpbWFnZS5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRpbWFnZVBhdGgucHVzaChpbWFnZVtpXS5wYXRoKTtcclxuXHRcdH1cclxuXHRcdGltYWdlbWluKGltYWdlUGF0aCwgcGF0aC5qb2luKG91dHB1dFBhdGgpLCB7XHJcblx0XHRcdHBsdWdpbnM6IFtcclxuXHRcdFx0XHRpbWFnZW1pbkpwZWd0cmFuKCksXHJcblx0XHRcdFx0aW1hZ2VtaW5QbmdxdWFudCh7cXVhbGl0eTogJzY1LTgwJ30pXHJcblx0XHRcdF1cclxuXHRcdH0pLnRoZW4oKCkgPT4ge1xyXG5cdFx0XHRsb2coJ3N1Y2Nlc3MnLCAnc3VjY2VzcycpO1xyXG5cdFx0fSk7XHJcblx0fWVsc2Uge1xyXG5cdFx0Zm9yKGxldCBpID0gMDsgaSA8IGltYWdlLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdGxvZyhpbWFnZVtpXS5wYXRoKTtcclxuXHRcdFx0bG9nKCc8YnIvPicpO1xyXG5cdFx0XHRsZXQgaW5wdXQgPSBmcy5jcmVhdGVSZWFkU3RyZWFtKGltYWdlW2ldLnBhdGgpLFxyXG5cdFx0XHRcdG91dHB1dCA9IGZzLmNyZWF0ZVdyaXRlU3RyZWFtKHBhdGguam9pbihvdXRwdXRQYXRoLCBpbWFnZVtpXS5uYW1lKSk7XHJcblx0XHRcdGlucHV0Lm9uKCdkYXRhJywgZnVuY3Rpb24oZCkge1xyXG5cdFx0XHRcdG91dHB1dC53cml0ZShkKTtcclxuXHRcdFx0fSk7XHJcblx0XHRcdGlucHV0Lm9uKCdlcnJvcicsIGZ1bmN0aW9uKGVycikge1xyXG5cdFx0XHRcdHRocm93IGVycjtcclxuXHRcdFx0fSk7XHJcblx0XHRcdGlucHV0Lm9uKCdlbmQnLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRvdXRwdXQuZW5kKCk7XHJcblx0XHRcdFx0bG9nKHBhdGguam9pbihvdXRwdXRQYXRoLCBpbWFnZVtpXS5uYW1lKSwgJ3N1Y2Nlc3MnKTtcclxuXHRcdFx0XHRsb2coJzxici8+JywgJ3N1Y2Nlc3MnKTtcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblx0fVxyXG5cdFxyXG59XHJcblxyXG4vKipcclxuKiDliKTmlq3mlofku7blpLnmmK/lkKblrZjlnKhcclxuKlxyXG4qQHBhcmFtIHtzdHJpbmd9IGJhc2VQYXRoXHJcbipAcGFyYW0ge3N0cmluZ30gdXJsXHJcbiovXHJcbmZ1bmN0aW9uIGV4aXN0c0Zsb2RlcihiYXNlUGF0aCwgdXJsKSB7XHJcblxyXG5cdGZzLmV4aXN0cyhwYXRoLmpvaW4oYmFzZVBhdGgsICcvZGlzdC8nKSwgZnVuY3Rpb24oZXh0KXtcclxuXHRcdGlmKCFleHQpIHtcclxuXHRcdFx0ZnMubWtkaXIocGF0aC5qb2luKGJhc2VQYXRoLCAnL2Rpc3QvJyksIGZ1bmN0aW9uKGVycil7XHJcblx0XHRcdFx0aWYoIWVycikge1xyXG5cdFx0XHRcdFx0ZnMuZXhpc3RzKHVybCwgZnVuY3Rpb24oZXh0KXtcclxuXHRcdFx0XHRcdFx0aWYoIWV4dCl7XHJcblx0XHRcdFx0XHRcdFx0ZnMubWtkaXIodXJsLCBmdW5jdGlvbihlcnIpe1xyXG5cdFx0XHRcdFx0XHRcdFx0aWYoZXJyKSBjb25zb2xlLmVycm9yKGVycik7XHJcblx0XHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblx0XHR9ZWxzZSB7XHJcblx0XHRcdGZzLmV4aXN0cyh1cmwsIGZ1bmN0aW9uKGV4dCl7XHJcblx0XHRcdFx0aWYoIWV4dCl7XHJcblx0XHRcdFx0XHRmcy5ta2Rpcih1cmwsIGZ1bmN0aW9uKGVycil7XHJcblx0XHRcdFx0XHRcdGlmKGVycikgY29uc29sZS5lcnJvcihlcnIpO1xyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHR9KTtcclxuXHJcbn1cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvanMvaHAtaGFuZGxlZmlsZS5qcyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbi8qKlxyXG4qIOWxleekuuaWh+S7tuWkhOeQhui/h+eoi+S/oeaBr1xyXG4qXHJcbiogQHBhcmFtIHtzdHJpbmd9IGxvZ1xyXG4qIEBwYXJhbSB7c3RyaW5nfSB0eXBlXHJcbiovXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKGxvZywgdHlwZSkge1xyXG5cclxuXHRpZih0eXBlID09ICdzdWNjZXNzJykge1xyXG5cdFx0ZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmRyYWctbG9nIC5zdWNjJykuaW5uZXJIVE1MICs9IGxvZztcclxuXHR9ZWxzZSBpZih0eXBlID09ICdmYWlsJykge1xyXG5cdFx0ZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmRyYWctbG9nIC5mYWlsJykuaW5uZXJIVE1MICs9IGxvZztcclxuXHR9ZWxzZSB7XHJcblx0XHRkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZHJhZy1sb2cgLm5vcm1hbCcpLmlubmVySFRNTCArPSBsb2c7XHJcblx0fVxyXG5cclxufVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9qcy9ocC1sb2cuanMiXSwic291cmNlUm9vdCI6IiJ9