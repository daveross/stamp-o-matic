/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var StamperPure = __webpack_require__(1);
	var Events = __webpack_require__(2);
	var FontLoader = __webpack_require__(4);

	(function() {

	  var font_height_px = {
	      'Capture It': 46,
	      'Masterplan': 72,
	      'D Day Stencil': 72
	  };
	  var stamp_text = 'Your Text';
	  var stamp_font = 'Masterplan';
	  var rectangle_padding_px = 10;
	  var rectangle_line_width = 3;
	  var canvas = document.getElementById('preview');
	  var angle = -10.14;
	  var background_image_contents = '';
	  
	  function apply_stamp(canvas, font_height_px, text) {
	    
	    draw_stamp(text, font_height_px, function(stamp_canvas) {
	        
	      var ctx = canvas.getContext('2d');
	      ctx.save();

	      ctx.translate(
	        Math.round(canvas.width / 2),
	        Math.round(canvas.height / 2)
	      )
	      ctx.rotate((angle < 0 ? 360 - Math.abs(angle) : angle) * 0.017);

	      ctx.drawImage(stamp_canvas, Math.round(stamp_canvas.width / -2), Math.round(stamp_canvas.height / -2));
	      ctx.restore();
	      
	    });

	  }

	  function draw_stamp(text, font_height_px, callback) {

	    StamperPure.loadImage(document, 'texture.png', function(loader) {

	      var text_width,
	      temp_canvas = document.createElement('canvas'),
	      temp_ctx = temp_canvas.getContext('2d');

	      temp_canvas.width = '9999';
	      temp_canvas.height = '9999';

	      temp_ctx.textAlign = 'top left';
	      temp_ctx.font = 'normal normal ' + font_height_px + 'px' + ' "' + stamp_font + '"';
	      text_width = temp_ctx.measureText(text);

	      temp_canvas.width = text_width.width + (rectangle_padding_px * 2) + (rectangle_line_width * 2);
	      temp_canvas.height = font_height_px + (rectangle_padding_px * 2) + (rectangle_line_width * 2);
	      temp_ctx.font = 'normal normal ' + font_height_px + 'px' + ' "' + stamp_font + '"';
	      temp_ctx.fillStyle = '#ca2541';

	      temp_ctx.textBaseline = 'middle';
	      temp_ctx.fillText(
	        text,
	        Math.round((rectangle_padding_px * 2) - (rectangle_line_width)) - 1,
	        Math.round(font_height_px / 2 + rectangle_padding_px + rectangle_line_width)
	      );
	      
	      StamperPure.drawRectangleBorder(temp_canvas, rectangle_line_width, rectangle_padding_px, loader);

	      callback.apply(this, [temp_canvas]);

	    });
	  }

	  function render_canvas(canvas, font_height_px, stamp_text) {
	    StamperPure.clearCanvas(canvas);
	    if(background_image_contents) {
	        var image = new Image;
	        image.src = background_image_contents;
	        image.onload = function(e) {
	            var ctx = canvas.getContext('2d');
	            var scalingFactor = StamperPure.aspectRatioCorrection(true, image, canvas);
	            ctx.drawImage(image, 0, 0, image.width * scalingFactor, image.height * scalingFactor);
	        };
	    }
	    
	    apply_stamp(canvas, font_height_px, stamp_text);    
	  }
	  
	  var fontLoader = new FontLoader([stamp_font], {
	    'complete': function(error) {
	      canvas.addEventListener('draw', function() {
	          render_canvas(canvas, font_height_px[stamp_font] * StamperPure.getStampScalingFactor(document), document.getElementById('stamp_text').value)
	      });
	      canvas.dispatchEvent(new Event('draw'));
	    }
	  }, 3000);
	  fontLoader.loadFonts();
	  
	  function readSingleFile(e) {
	      var file = e.target.files[0];
	      if (!file) {
	          return;
	      }
	      var reader = new FileReader();
	      reader.onload = function (e) {
	          background_image_contents = e.target.result;
	          canvas.dispatchEvent(new Event('draw'));
	      };
	      reader.readAsDataURL(file);
	  }
	  
	  document.getElementById('background_image').addEventListener('change', readSingleFile, false);
	  
	  var inputs = document.querySelectorAll( 'input[type=file]' );
	    Array.prototype.forEach.call( inputs, function( input ) {
	        var label	 = input.nextElementSibling,
	            labelVal = label.innerHTML;

	        input.addEventListener( 'change', function( e ) {
	            var fileName = '';
	            if( this.files && this.files.length > 1 )
	                fileName = ( this.getAttribute( 'data-multiple-caption' ) || '' ).replace( '{count}', this.files.length );
	            else
	                fileName = e.target.value.split( '\\' ).pop();

	            if( fileName )
	                label.querySelector( 'span' ).innerHTML = fileName;
	            else
	                label.innerHTML = labelVal;
	        });
	    });
	}());


/***/ },
/* 1 */
/***/ function(module, exports) {

	/**
	 * Load an image into an <img> tag and call a callback when it's loaded
	 * @param object document window.document
	 * @param string image url
	 * @param function callback
	 * @return object image tag used to load the image
	 */
	exports.loadImage = function(document, image, callback) {
	    var loader = document.createElement('img');

	    loader.style.display = 'none';
	    loader.height = 1;
	    loader.width = 1;
	    loader.onload = function() {
	        callback.apply(this, [loader]);
	    }
	    loader.src = image;

	    return loader;
	};

	/**
	 * Clear a canvas by painting a white rectangle over it
	 * @param canvas canvas
	 * @return canvas
	 */
	exports.clearCanvas = function(canvas) {
	    var ctx = canvas.getContext('2d');

	    // Clear the canvas
	    ctx.fillStyle = '#ffffff';
	    ctx.fillRect(0, 0, canvas.width, canvas.height);
	    return canvas;
	};

	/**
	 * Calculate the scaling factor that needs to be applied to an image in order to fit it in a canvas.
	 * 
	 * @param bool preferFullWidth Fit to width with possible "space" above & below. If false, fits with space on left & right.
	 * @param object image <img> tag
	 * @param object canvas <canvas> tag
	 * @return float scaling factor to apply to the image in order to fit it in the given canvas 
	 */
	exports.aspectRatioCorrection = function(preferFullWidth, image, canvas) {

	    var scalingFactor;

	    var canvasWidth = canvas.width;
	    var canvasHeight = canvas.height;
	    var screenAspectRatio = canvasWidth / canvasHeight;

	    var imageWidth = image.width;
	    var imageHeight = image.height;
	    var imageAspectRatio = imageWidth / imageHeight;

	    if (preferFullWidth) {
	        if (screenAspectRatio > imageAspectRatio) {
	            scalingFactor = canvasWidth / imageWidth;
	        } else {
	            scalingFactor = canvasHeight / imageHeight;
	        }
	    } else {
	        if (screenAspectRatio > imageAspectRatio) {
	            scalingFactor = canvasHeight / imageHeight;
	        } else {
	            scalingFactor = canvasWidth / imageWidth;
	        }
	    }

	    return scalingFactor;

	}

	/**
	 * Get the selected scaling factor from the DOM or default to 1
	 * @param object document window.document
	 * @return integer
	 */
	exports.getStampScalingFactor = function(document) {
	    return parseInt(document.querySelectorAll('[name=stamp_size]:checked') && document.querySelectorAll('[name=stamp_size]:checked')[0].value) || 1
	}

	/**
	 * Draw the rectangular border
	 * @param object canvas <canvas> element
	 * @param integer lineWidth line width in px
	 * @param integer padding box padding in px
	 * @param object img <img> tag to use as a pattern
	 * @return <canvas> object
	 */
	exports.drawRectangleBorder = function(canvas, lineWidth, padding, img) {
	    var ctx = canvas.getContext('2d');
	    ctx.lineWidth = lineWidth;
	    if (img) {
	        ctx.strokeStyle = ctx.createPattern(img, 'repeat');
	    }

	    ctx.strokeRect(
	        Math.round(padding / 2),
	        Math.round(padding / 2),
	        canvas.width - padding,
	        canvas.height - padding
	    );

	    return canvas;
	}


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var download = __webpack_require__(3);

	var canvas = document.getElementById('preview');
	var stamp_size_inputs = document.querySelectorAll('[name=stamp_size]');

	window.addEventListener('resize', function() {
	    // Redraw the canvas on the next frame
	    requestAnimationFrame(function() {
	        canvas.dispatchEvent(new Event('draw'));
	    });
	});

	document.getElementById('stamp_text').addEventListener('keyup', function(e) {
	    canvas.dispatchEvent(new Event('draw'));
	});

	for (var input = stamp_size_inputs[0], i = 0; i < stamp_size_inputs.length; i += 1, input = stamp_size_inputs[i]) {
	    input.addEventListener('change', function(e) {
	        canvas.dispatchEvent(new Event('draw'));
	    });
	};

	document.getElementById('download_button').addEventListener('click', function() {
	    download(canvas.toDataURL('image/png'), 'stamp.png', 'image/png');
	});


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;
	//download.js v4.1, by dandavis; 2008-2015. [CCBY2] see http://danml.com/download.html for tests/usage
	// v1 landed a FF+Chrome compat way of downloading strings to local un-named files, upgraded to use a hidden frame and optional mime
	// v2 added named files via a[download], msSaveBlob, IE (10+) support, and window.URL support for larger+faster saves than dataURLs
	// v3 added dataURL and Blob Input, bind-toggle arity, and legacy dataURL fallback was improved with force-download mime and base64 support. 3.1 improved safari handling.
	// v4 adds AMD/UMD, commonJS, and plain browser support
	// v4.1 adds url download capability via solo URL argument (same domain/CORS only)
	// https://github.com/rndme/download

	(function (root, factory) {
		if (true) {
			// AMD. Register as an anonymous module.
			!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
		} else if (typeof exports === 'object') {
			// Node. Does not work with strict CommonJS, but
			// only CommonJS-like environments that support module.exports,
			// like Node.
			module.exports = factory();
		} else {
			// Browser globals (root is window)
			root.download = factory();
	  }
	}(this, function () {

		return function download(data, strFileName, strMimeType) {

			var self = window, // this script is only for browsers anyway...
				u = "application/octet-stream", // this default mime also triggers iframe downloads
				m = strMimeType || u,
				x = data,
				url = !strFileName && !strMimeType && x,
				D = document,
				a = D.createElement("a"),
				z = function(a){return String(a);},
				B = (self.Blob || self.MozBlob || self.WebKitBlob || z),
				fn = strFileName || "download",
				blob,
				fr,
				ajax;
				B= B.call ? B.bind(self) : Blob ;
		  

			if(String(this)==="true"){ //reverse arguments, allowing download.bind(true, "text/xml", "export.xml") to act as a callback
				x=[x, m];
				m=x[0];
				x=x[1];
			}


			if(url && url.length< 2048){ 
				fn = url.split("/").pop().split("?")[0];
				a.href = url; // assign href prop to temp anchor
			  	if(a.href.indexOf(url) !== -1){ // if the browser determines that it's a potentially valid url path:
	        		var ajax=new XMLHttpRequest();
	        		ajax.open( "GET", url, true);
	        		ajax.responseType = 'blob';
	        		ajax.onload= function(e){ 
					  download(e.target.response, fn, u);
					};
	        		ajax.send();
				    return ajax;
				} // end if valid url?
			} // end if url?



			//go ahead and download dataURLs right away
			if(/^data\:[\w+\-]+\/[\w+\-]+[,;]/.test(x)){
				return navigator.msSaveBlob ?  // IE10 can't do a[download], only Blobs:
					navigator.msSaveBlob(d2b(x), fn) :
					saver(x) ; // everyone else can save dataURLs un-processed
			}//end if dataURL passed?

			blob = x instanceof B ?
				x :
				new B([x], {type: m}) ;


			function d2b(u) {
				var p= u.split(/[:;,]/),
				t= p[1],
				dec= p[2] == "base64" ? atob : decodeURIComponent,
				bin= dec(p.pop()),
				mx= bin.length,
				i= 0,
				uia= new Uint8Array(mx);

				for(i;i<mx;++i) uia[i]= bin.charCodeAt(i);

				return new B([uia], {type: t});
			 }

			function saver(url, winMode){

				if ('download' in a) { //html5 A[download]
					a.href = url;
					a.setAttribute("download", fn);
					a.className = "download-js-link";
					a.innerHTML = "downloading...";
					D.body.appendChild(a);
					setTimeout(function() {
						a.click();
						D.body.removeChild(a);
						if(winMode===true){setTimeout(function(){ self.URL.revokeObjectURL(a.href);}, 250 );}
					}, 66);
					return true;
				}

				// handle non-a[download] safari as best we can:
				if(/(Version)\/(\d+)\.(\d+)(?:\.(\d+))?.*Safari\//.test(navigator.userAgent)) {
					url=url.replace(/^data:([\w\/\-\+]+)/, u);
					if(!window.open(url)){ // popup blocked, offer direct download:
						if(confirm("Displaying New Document\n\nUse Save As... to download, then click back to return to this page.")){ location.href=url; }
					}
					return true;
				}

				//do iframe dataURL download (old ch+FF):
				var f = D.createElement("iframe");
				D.body.appendChild(f);

				if(!winMode){ // force a mime that will download:
					url="data:"+url.replace(/^data:([\w\/\-\+]+)/, u);
				}
				f.src=url;
				setTimeout(function(){ D.body.removeChild(f); }, 333);

			}//end saver




			if (navigator.msSaveBlob) { // IE10+ : (has Blob, but not a[download] or URL)
				return navigator.msSaveBlob(blob, fn);
			}

			if(self.URL){ // simple fast and modern way using Blob and URL:
				saver(self.URL.createObjectURL(blob), true);
			}else{
				// handle non-Blob()+non-URL browsers:
				if(typeof blob === "string" || blob.constructor===z ){
					try{
						return saver( "data:" +  m   + ";base64,"  +  self.btoa(blob)  );
					}catch(y){
						return saver( "data:" +  m   + "," + encodeURIComponent(blob)  );
					}
				}

				// Blob but not URL:
				fr=new FileReader();
				fr.onload=function(e){
					saver(this.result);
				};
				fr.readAsDataURL(blob);
			}
			return true;
		}; /* end download() */
	}));


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/* globals define, exports, module */

	(function(root, definition) {
		if (true) {
			// AMD. Register as an anonymous module.
			!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = (definition), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
		} else if (typeof exports === 'object') {
			// Node. Does not work with strict CommonJS, but only CommonJS-like 
			// environments that support module.exports, like Node.
			module.exports = definition();
		} else {
			// Browser globals (root is window)
			root.FontLoader = definition();
		}
	}(window, function() {
		
		var isIE = /MSIE/i.test(navigator.userAgent),
			ieVer = null;
		
		// Get Internet Explorer version
		if (isIE) {
			var re, result;
			re = new RegExp("MSIE ([0-9]{1,}[.0-9]{0,})");
			result = re.exec(navigator.userAgent);
			if (result !== null) {
				ieVer = parseFloat(result[1]);
			}
		}

	    /**
	     * @typedef {Object} FontDescriptor
	     * @property {String} family
	     * @property {String} weight
	     * @property {String} style
	     */

		/**
		 * FontLoader detects when web fonts specified in the "fontFamiliesArray" array were loaded and rendered. Then it
		 * notifies the specified delegate object via "fontLoaded" and "complete" methods when specific or all fonts were
		 * loaded respectively. The use of this functions implies that the insertion of specified web fonts into the
		 * document is done elsewhere.
		 *
	     * The fonts parameter may be an array of strings specifying the font-families with optionally specified font
	     * variations using FVD notation or font descriptor objects of the following type:
	     * {
	     *     family: "fontFamily",
	     *     weight: 400,
	     *     style: 'normal'
	     * }
	     * Where styles may ne one of the following: normal, bold, italic or oblique. If only string is specified, the
	     * default used weight and style are 400 and 'normal' respectively.
	     *
		 * If all the specified fonts were loaded before the timeout was reached, the "complete" delegate method will be
	     * invoked with "null" error parameter. Otherwise, if timeout was reached before all specified fonts were loaded,
	     * the "complete" method will be invoked with an error object with two fields: the "message" string and the
	     * "notLoadedFonts" array of FontDescriptor objects of all the fonts that weren't loaded.
		 *
		 * @param {Array.<String|FontDescriptor>} fonts   Array of font-family strings or font descriptor objects.
		 * @param {Object}        delegate                Delegate object whose callback methods will be invoked in its own context.
		 * @param {Function}      [delegate.complete]     Called when all fonts were loaded or the timeout was reached.
		 * @param {Function}      [delegate.fontLoaded]   Called for each loaded font with its font-family string as its single parameter.
		 * @param {Number}        [timeout=3000]          Timeout in milliseconds. Pass "null" to disable timeout.
		 * @param {HTMLDocument}  [contextDocument]       The DOM tree context to use, if none provided then it will be the document.
		 * @constructor
		 */
		function FontLoader(fonts, delegate, timeout, contextDocument) {
			// Public
			this.delegate = delegate;
			this.timeout = (typeof timeout !== "undefined") ? timeout : 3000;

			// Private
	        this._fontsArray = this._parseFonts(fonts);
			this._testDiv = null;
			this._testContainer = null;
			this._adobeBlankSizeWatcher = null;
			this._sizeWatchers = [];
			this._timeoutId = null;
			this._intervalId = null;
			this._intervalDelay = 50;
			this._numberOfLoadedFonts = 0;
			this._numberOfFonts = this._fontsArray.length;
			this._fontsMap = {};
			this._finished = false;
			this._document = contextDocument || document;
		}

		FontLoader.useAdobeBlank = !isIE || ieVer >= 11.0;
		FontLoader.useResizeEvent = isIE && ieVer < 11.0 && typeof document.attachEvent !== "undefined";
		FontLoader.useIntervalChecking = window.opera || (isIE && ieVer < 11.0 && !FontLoader.useResizeEvent);
		FontLoader.referenceText = " !\"\\#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[]^_`abcdefghijklmnopqrstuvwxyz{|}~";
		FontLoader.referenceFontFamilies = FontLoader.useAdobeBlank ? ["AdobeBlank"] : ["serif", "cursive"];
	    FontLoader.adobeBlankFontFaceStyleId = "fontLoaderAdobeBlankFontFace";
	    FontLoader.adobeBlankReferenceSize = null;
		FontLoader.referenceFontFamilyVariationSizes = {};
		FontLoader.adobeBlankFontFaceRule = "@font-face{ font-family:AdobeBlank; src:url('data:font/opentype;base64,T1RUTwAKAIAAAwAgQ0ZGIM6ZbkwAAEPEAAAZM0RTSUcAAAABAABtAAAAAAhPUy8yAR6vMwAAARAAAABgY21hcDqI98oAACjEAAAa4GhlYWT+BQILAAAArAAAADZoaGVhCCID7wAAAOQAAAAkaG10eAPoAHwAAFz4AAAQBm1heHAIAVAAAAABCAAAAAZuYW1lD/tWxwAAAXAAACdScG9zdP+4ADIAAEOkAAAAIAABAAAAAQj1Snw1O18PPPUAAwPoAAAAAM2C2p8AAAAAzYLanwB8/4gDbANwAAAAAwACAAAAAAAAAAEAAANw/4gAyAPoAHwAfANsAAEAAAAAAAAAAAAAAAAAAAACAABQAAgBAAAABAAAAZAABQAAAooCWAAAAEsCigJYAAABXgAyANwAAAAAAAAAAAAAAAD3/67/+9///w/gAD8AAAAAQURCRQHAAAD//wNw/4gAyANwAHhgLwH/AAAAAAAAAAAAAAAgAAAAAAARANIAAQAAAAAAAQALAAAAAQAAAAAAAgAHAAsAAQAAAAAAAwAbABIAAQAAAAAABAALAAAAAQAAAAAABQA5AC0AAQAAAAAABgAKAGYAAwABBAkAAABuAHAAAwABBAkAAQAWAN4AAwABBAkAAgAOAPQAAwABBAkAAwA2AQIAAwABBAkABAAWAN4AAwABBAkABQByATgAAwABBAkABgAUAaoAAwABBAkACAA0Ab4AAwABBAkACwA0AfIAAwABBAkADSQSAiYAAwABBAkADgBIJjhBZG9iZSBCbGFua1JlZ3VsYXIxLjAzNTtBREJFO0Fkb2JlQmxhbms7QURPQkVWZXJzaW9uIDEuMDM1O1BTIDEuMDAzO2hvdGNvbnYgMS4wLjcwO21ha2VvdGYubGliMi41LjU5MDBBZG9iZUJsYW5rAKkAIAAyADAAMQAzACAAQQBkAG8AYgBlACAAUwB5AHMAdABlAG0AcwAgAEkAbgBjAG8AcgBwAG8AcgBhAHQAZQBkAC4AIABBAGwAbAAgAFIAaQBnAGgAdABzACAAUgBlAHMAZQByAHYAZQBkAC4AQQBkAG8AYgBlACAAQgBsAGEAbgBrAFIAZQBnAHUAbABhAHIAMQAuADAAMwA1ADsAQQBEAEIARQA7AEEAZABvAGIAZQBCAGwAYQBuAGsAOwBBAEQATwBCAEUAVgBlAHIAcwBpAG8AbgAgADEALgAwADMANQA7AFAAUwAgADEALgAwADAAMwA7AGgAbwB0AGMAbwBuAHYAIAAxAC4AMAAuADcAMAA7AG0AYQBrAGUAbwB0AGYALgBsAGkAYgAyAC4ANQAuADUAOQAwADAAQQBkAG8AYgBlAEIAbABhAG4AawBBAGQAbwBiAGUAIABTAHkAcwB0AGUAbQBzACAASQBuAGMAbwByAHAAbwByAGEAdABlAGQAaAB0AHQAcAA6AC8ALwB3AHcAdwAuAGEAZABvAGIAZQAuAGMAbwBtAC8AdAB5AHAAZQAvAEEAZABvAGIAZQAgAEIAbABhAG4AawAgAGkAcwAgAHIAZQBsAGUAYQBzAGUAZAAgAHUAbgBkAGUAcgAgAHQAaABlACAAUwBJAEwAIABPAHAAZQBuACAARgBvAG4AdAAgAEwAaQBjAGUAbgBzAGUAIAAtACAAcABsAGUAYQBzAGUAIAByAGUAYQBkACAAaQB0ACAAYwBhAHIAZQBmAHUAbABsAHkAIABhAG4AZAAgAGQAbwAgAG4AbwB0ACAAZABvAHcAbgBsAG8AYQBkACAAdABoAGUAIABmAG8AbgB0AHMAIAB1AG4AbABlAHMAcwAgAHkAbwB1ACAAYQBnAHIAZQBlACAAdABvACAAdABoAGUAIAB0AGgAZQAgAHQAZQByAG0AcwAgAG8AZgAgAHQAaABlACAAbABpAGMAZQBuAHMAZQA6AA0ACgANAAoAQwBvAHAAeQByAGkAZwBoAHQAIACpACAAMgAwADEAMwAgAEEAZABvAGIAZQAgAFMAeQBzAHQAZQBtAHMAIABJAG4AYwBvAHIAcABvAHIAYQB0AGUAZAAgACgAaAB0AHQAcAA6AC8ALwB3AHcAdwAuAGEAZABvAGIAZQAuAGMAbwBtAC8AKQAsACAAdwBpAHQAaAAgAFIAZQBzAGUAcgB2AGUAZAAgAEYAbwBuAHQAIABOAGEAbQBlACAAQQBkAG8AYgBlACAAQgBsAGEAbgBrAA0ACgANAAoAVABoAGkAcwAgAEYAbwBuAHQAIABTAG8AZgB0AHcAYQByAGUAIABpAHMAIABsAGkAYwBlAG4AcwBlAGQAIAB1AG4AZABlAHIAIAB0AGgAZQAgAFMASQBMACAATwBwAGUAbgAgAEYAbwBuAHQAIABMAGkAYwBlAG4AcwBlACwAIABWAGUAcgBzAGkAbwBuACAAMQAuADEALgANAAoADQAKAFQAaABpAHMAIABsAGkAYwBlAG4AcwBlACAAaQBzACAAYwBvAHAAaQBlAGQAIABiAGUAbABvAHcALAAgAGEAbgBkACAAaQBzACAAYQBsAHMAbwAgAGEAdgBhAGkAbABhAGIAbABlACAAdwBpAHQAaAAgAGEAIABGAEEAUQAgAGEAdAA6ACAAaAB0AHQAcAA6AC8ALwBzAGMAcgBpAHAAdABzAC4AcwBpAGwALgBvAHIAZwAvAE8ARgBMAA0ACgANAAoALQAtAC0ALQAtAC0ALQAtAC0ALQAtAC0ALQAtAC0ALQAtAC0ALQAtAC0ALQAtAC0ALQAtAC0ALQAtAC0ALQAtAC0ALQAtAC0ALQAtAC0ALQAtAC0ALQAtAC0ALQAtAC0ALQAtAC0ALQAtAC0ALQAtAC0ALQAtAA0ACgBTAEkATAAgAE8AUABFAE4AIABGAE8ATgBUACAATABJAEMARQBOAFMARQAgAFYAZQByAHMAaQBvAG4AIAAxAC4AMQAgAC0AIAAyADYAIABGAGUAYgByAHUAYQByAHkAIAAyADAAMAA3AA0ACgAtAC0ALQAtAC0ALQAtAC0ALQAtAC0ALQAtAC0ALQAtAC0ALQAtAC0ALQAtAC0ALQAtAC0ALQAtAC0ALQAtAC0ALQAtAC0ALQAtAC0ALQAtAC0ALQAtAC0ALQAtAC0ALQAtAC0ALQAtAC0ALQAtAC0ALQAtAC0ADQAKAA0ACgBQAFIARQBBAE0AQgBMAEUADQAKAFQAaABlACAAZwBvAGEAbABzACAAbwBmACAAdABoAGUAIABPAHAAZQBuACAARgBvAG4AdAAgAEwAaQBjAGUAbgBzAGUAIAAoAE8ARgBMACkAIABhAHIAZQAgAHQAbwAgAHMAdABpAG0AdQBsAGEAdABlACAAdwBvAHIAbABkAHcAaQBkAGUAIABkAGUAdgBlAGwAbwBwAG0AZQBuAHQAIABvAGYAIABjAG8AbABsAGEAYgBvAHIAYQB0AGkAdgBlACAAZgBvAG4AdAAgAHAAcgBvAGoAZQBjAHQAcwAsACAAdABvACAAcwB1AHAAcABvAHIAdAAgAHQAaABlACAAZgBvAG4AdAAgAGMAcgBlAGEAdABpAG8AbgAgAGUAZgBmAG8AcgB0AHMAIABvAGYAIABhAGMAYQBkAGUAbQBpAGMAIABhAG4AZAAgAGwAaQBuAGcAdQBpAHMAdABpAGMAIABjAG8AbQBtAHUAbgBpAHQAaQBlAHMALAAgAGEAbgBkACAAdABvACAAcAByAG8AdgBpAGQAZQAgAGEAIABmAHIAZQBlACAAYQBuAGQAIABvAHAAZQBuACAAZgByAGEAbQBlAHcAbwByAGsAIABpAG4AIAB3AGgAaQBjAGgAIABmAG8AbgB0AHMAIABtAGEAeQAgAGIAZQAgAHMAaABhAHIAZQBkACAAYQBuAGQAIABpAG0AcAByAG8AdgBlAGQAIABpAG4AIABwAGEAcgB0AG4AZQByAHMAaABpAHAAIAB3AGkAdABoACAAbwB0AGgAZQByAHMALgANAAoADQAKAFQAaABlACAATwBGAEwAIABhAGwAbABvAHcAcwAgAHQAaABlACAAbABpAGMAZQBuAHMAZQBkACAAZgBvAG4AdABzACAAdABvACAAYgBlACAAdQBzAGUAZAAsACAAcwB0AHUAZABpAGUAZAAsACAAbQBvAGQAaQBmAGkAZQBkACAAYQBuAGQAIAByAGUAZABpAHMAdAByAGkAYgB1AHQAZQBkACAAZgByAGUAZQBsAHkAIABhAHMAIABsAG8AbgBnACAAYQBzACAAdABoAGUAeQAgAGEAcgBlACAAbgBvAHQAIABzAG8AbABkACAAYgB5ACAAdABoAGUAbQBzAGUAbAB2AGUAcwAuACAAVABoAGUAIABmAG8AbgB0AHMALAAgAGkAbgBjAGwAdQBkAGkAbgBnACAAYQBuAHkAIABkAGUAcgBpAHYAYQB0AGkAdgBlACAAdwBvAHIAawBzACwAIABjAGEAbgAgAGIAZQAgAGIAdQBuAGQAbABlAGQALAAgAGUAbQBiAGUAZABkAGUAZAAsACAAcgBlAGQAaQBzAHQAcgBpAGIAdQB0AGUAZAAgAGEAbgBkAC8AbwByACAAcwBvAGwAZAAgAHcAaQB0AGgAIABhAG4AeQAgAHMAbwBmAHQAdwBhAHIAZQAgAHAAcgBvAHYAaQBkAGUAZAAgAHQAaABhAHQAIABhAG4AeQAgAHIAZQBzAGUAcgB2AGUAZAAgAG4AYQBtAGUAcwAgAGEAcgBlACAAbgBvAHQAIAB1AHMAZQBkACAAYgB5ACAAZABlAHIAaQB2AGEAdABpAHYAZQAgAHcAbwByAGsAcwAuACAAVABoAGUAIABmAG8AbgB0AHMAIABhAG4AZAAgAGQAZQByAGkAdgBhAHQAaQB2AGUAcwAsACAAaABvAHcAZQB2AGUAcgAsACAAYwBhAG4AbgBvAHQAIABiAGUAIAByAGUAbABlAGEAcwBlAGQAIAB1AG4AZABlAHIAIABhAG4AeQAgAG8AdABoAGUAcgAgAHQAeQBwAGUAIABvAGYAIABsAGkAYwBlAG4AcwBlAC4AIABUAGgAZQAgAHIAZQBxAHUAaQByAGUAbQBlAG4AdAAgAGYAbwByACAAZgBvAG4AdABzACAAdABvACAAcgBlAG0AYQBpAG4AIAB1AG4AZABlAHIAIAB0AGgAaQBzACAAbABpAGMAZQBuAHMAZQAgAGQAbwBlAHMAIABuAG8AdAAgAGEAcABwAGwAeQAgAHQAbwAgAGEAbgB5ACAAZABvAGMAdQBtAGUAbgB0ACAAYwByAGUAYQB0AGUAZAAgAHUAcwBpAG4AZwAgAHQAaABlACAAZgBvAG4AdABzACAAbwByACAAdABoAGUAaQByACAAZABlAHIAaQB2AGEAdABpAHYAZQBzAC4ADQAKAA0ACgBEAEUARgBJAE4ASQBUAEkATwBOAFMADQAKACIARgBvAG4AdAAgAFMAbwBmAHQAdwBhAHIAZQAiACAAcgBlAGYAZQByAHMAIAB0AG8AIAB0AGgAZQAgAHMAZQB0ACAAbwBmACAAZgBpAGwAZQBzACAAcgBlAGwAZQBhAHMAZQBkACAAYgB5ACAAdABoAGUAIABDAG8AcAB5AHIAaQBnAGgAdAAgAEgAbwBsAGQAZQByACgAcwApACAAdQBuAGQAZQByACAAdABoAGkAcwAgAGwAaQBjAGUAbgBzAGUAIABhAG4AZAAgAGMAbABlAGEAcgBsAHkAIABtAGEAcgBrAGUAZAAgAGEAcwAgAHMAdQBjAGgALgAgAFQAaABpAHMAIABtAGEAeQAgAGkAbgBjAGwAdQBkAGUAIABzAG8AdQByAGMAZQAgAGYAaQBsAGUAcwAsACAAYgB1AGkAbABkACAAcwBjAHIAaQBwAHQAcwAgAGEAbgBkACAAZABvAGMAdQBtAGUAbgB0AGEAdABpAG8AbgAuAA0ACgANAAoAIgBSAGUAcwBlAHIAdgBlAGQAIABGAG8AbgB0ACAATgBhAG0AZQAiACAAcgBlAGYAZQByAHMAIAB0AG8AIABhAG4AeQAgAG4AYQBtAGUAcwAgAHMAcABlAGMAaQBmAGkAZQBkACAAYQBzACAAcwB1AGMAaAAgAGEAZgB0AGUAcgAgAHQAaABlACAAYwBvAHAAeQByAGkAZwBoAHQAIABzAHQAYQB0AGUAbQBlAG4AdAAoAHMAKQAuAA0ACgANAAoAIgBPAHIAaQBnAGkAbgBhAGwAIABWAGUAcgBzAGkAbwBuACIAIAByAGUAZgBlAHIAcwAgAHQAbwAgAHQAaABlACAAYwBvAGwAbABlAGMAdABpAG8AbgAgAG8AZgAgAEYAbwBuAHQAIABTAG8AZgB0AHcAYQByAGUAIABjAG8AbQBwAG8AbgBlAG4AdABzACAAYQBzACAAZABpAHMAdAByAGkAYgB1AHQAZQBkACAAYgB5ACAAdABoAGUAIABDAG8AcAB5AHIAaQBnAGgAdAAgAEgAbwBsAGQAZQByACgAcwApAC4ADQAKAA0ACgAiAE0AbwBkAGkAZgBpAGUAZAAgAFYAZQByAHMAaQBvAG4AIgAgAHIAZQBmAGUAcgBzACAAdABvACAAYQBuAHkAIABkAGUAcgBpAHYAYQB0AGkAdgBlACAAbQBhAGQAZQAgAGIAeQAgAGEAZABkAGkAbgBnACAAdABvACwAIABkAGUAbABlAHQAaQBuAGcALAAgAG8AcgAgAHMAdQBiAHMAdABpAHQAdQB0AGkAbgBnACAALQAtACAAaQBuACAAcABhAHIAdAAgAG8AcgAgAGkAbgAgAHcAaABvAGwAZQAgAC0ALQAgAGEAbgB5ACAAbwBmACAAdABoAGUAIABjAG8AbQBwAG8AbgBlAG4AdABzACAAbwBmACAAdABoAGUAIABPAHIAaQBnAGkAbgBhAGwAIABWAGUAcgBzAGkAbwBuACwAIABiAHkAIABjAGgAYQBuAGcAaQBuAGcAIABmAG8AcgBtAGEAdABzACAAbwByACAAYgB5ACAAcABvAHIAdABpAG4AZwAgAHQAaABlACAARgBvAG4AdAAgAFMAbwBmAHQAdwBhAHIAZQAgAHQAbwAgAGEAIABuAGUAdwAgAGUAbgB2AGkAcgBvAG4AbQBlAG4AdAAuAA0ACgANAAoAIgBBAHUAdABoAG8AcgAiACAAcgBlAGYAZQByAHMAIAB0AG8AIABhAG4AeQAgAGQAZQBzAGkAZwBuAGUAcgAsACAAZQBuAGcAaQBuAGUAZQByACwAIABwAHIAbwBnAHIAYQBtAG0AZQByACwAIAB0AGUAYwBoAG4AaQBjAGEAbAAgAHcAcgBpAHQAZQByACAAbwByACAAbwB0AGgAZQByACAAcABlAHIAcwBvAG4AIAB3AGgAbwAgAGMAbwBuAHQAcgBpAGIAdQB0AGUAZAAgAHQAbwAgAHQAaABlACAARgBvAG4AdAAgAFMAbwBmAHQAdwBhAHIAZQAuAA0ACgANAAoAUABFAFIATQBJAFMAUwBJAE8ATgAgACYAIABDAE8ATgBEAEkAVABJAE8ATgBTAA0ACgBQAGUAcgBtAGkAcwBzAGkAbwBuACAAaQBzACAAaABlAHIAZQBiAHkAIABnAHIAYQBuAHQAZQBkACwAIABmAHIAZQBlACAAbwBmACAAYwBoAGEAcgBnAGUALAAgAHQAbwAgAGEAbgB5ACAAcABlAHIAcwBvAG4AIABvAGIAdABhAGkAbgBpAG4AZwAgAGEAIABjAG8AcAB5ACAAbwBmACAAdABoAGUAIABGAG8AbgB0ACAAUwBvAGYAdAB3AGEAcgBlACwAIAB0AG8AIAB1AHMAZQAsACAAcwB0AHUAZAB5ACwAIABjAG8AcAB5ACwAIABtAGUAcgBnAGUALAAgAGUAbQBiAGUAZAAsACAAbQBvAGQAaQBmAHkALAAgAHIAZQBkAGkAcwB0AHIAaQBiAHUAdABlACwAIABhAG4AZAAgAHMAZQBsAGwAIABtAG8AZABpAGYAaQBlAGQAIABhAG4AZAAgAHUAbgBtAG8AZABpAGYAaQBlAGQAIABjAG8AcABpAGUAcwAgAG8AZgAgAHQAaABlACAARgBvAG4AdAAgAFMAbwBmAHQAdwBhAHIAZQAsACAAcwB1AGIAagBlAGMAdAAgAHQAbwAgAHQAaABlACAAZgBvAGwAbABvAHcAaQBuAGcAIABjAG8AbgBkAGkAdABpAG8AbgBzADoADQAKAA0ACgAxACkAIABOAGUAaQB0AGgAZQByACAAdABoAGUAIABGAG8AbgB0ACAAUwBvAGYAdAB3AGEAcgBlACAAbgBvAHIAIABhAG4AeQAgAG8AZgAgAGkAdABzACAAaQBuAGQAaQB2AGkAZAB1AGEAbAAgAGMAbwBtAHAAbwBuAGUAbgB0AHMALAAgAGkAbgAgAE8AcgBpAGcAaQBuAGEAbAAgAG8AcgAgAE0AbwBkAGkAZgBpAGUAZAAgAFYAZQByAHMAaQBvAG4AcwAsACAAbQBhAHkAIABiAGUAIABzAG8AbABkACAAYgB5ACAAaQB0AHMAZQBsAGYALgANAAoADQAKADIAKQAgAE8AcgBpAGcAaQBuAGEAbAAgAG8AcgAgAE0AbwBkAGkAZgBpAGUAZAAgAFYAZQByAHMAaQBvAG4AcwAgAG8AZgAgAHQAaABlACAARgBvAG4AdAAgAFMAbwBmAHQAdwBhAHIAZQAgAG0AYQB5ACAAYgBlACAAYgB1AG4AZABsAGUAZAAsACAAcgBlAGQAaQBzAHQAcgBpAGIAdQB0AGUAZAAgAGEAbgBkAC8AbwByACAAcwBvAGwAZAAgAHcAaQB0AGgAIABhAG4AeQAgAHMAbwBmAHQAdwBhAHIAZQAsACAAcAByAG8AdgBpAGQAZQBkACAAdABoAGEAdAAgAGUAYQBjAGgAIABjAG8AcAB5ACAAYwBvAG4AdABhAGkAbgBzACAAdABoAGUAIABhAGIAbwB2AGUAIABjAG8AcAB5AHIAaQBnAGgAdAAgAG4AbwB0AGkAYwBlACAAYQBuAGQAIAB0AGgAaQBzACAAbABpAGMAZQBuAHMAZQAuACAAVABoAGUAcwBlACAAYwBhAG4AIABiAGUAIABpAG4AYwBsAHUAZABlAGQAIABlAGkAdABoAGUAcgAgAGEAcwAgAHMAdABhAG4AZAAtAGEAbABvAG4AZQAgAHQAZQB4AHQAIABmAGkAbABlAHMALAAgAGgAdQBtAGEAbgAtAHIAZQBhAGQAYQBiAGwAZQAgAGgAZQBhAGQAZQByAHMAIABvAHIAIABpAG4AIAB0AGgAZQAgAGEAcABwAHIAbwBwAHIAaQBhAHQAZQAgAG0AYQBjAGgAaQBuAGUALQByAGUAYQBkAGEAYgBsAGUAIABtAGUAdABhAGQAYQB0AGEAIABmAGkAZQBsAGQAcwAgAHcAaQB0AGgAaQBuACAAdABlAHgAdAAgAG8AcgAgAGIAaQBuAGEAcgB5ACAAZgBpAGwAZQBzACAAYQBzACAAbABvAG4AZwAgAGEAcwAgAHQAaABvAHMAZQAgAGYAaQBlAGwAZABzACAAYwBhAG4AIABiAGUAIABlAGEAcwBpAGwAeQAgAHYAaQBlAHcAZQBkACAAYgB5ACAAdABoAGUAIAB1AHMAZQByAC4ADQAKAA0ACgAzACkAIABOAG8AIABNAG8AZABpAGYAaQBlAGQAIABWAGUAcgBzAGkAbwBuACAAbwBmACAAdABoAGUAIABGAG8AbgB0ACAAUwBvAGYAdAB3AGEAcgBlACAAbQBhAHkAIAB1AHMAZQAgAHQAaABlACAAUgBlAHMAZQByAHYAZQBkACAARgBvAG4AdAAgAE4AYQBtAGUAKABzACkAIAB1AG4AbABlAHMAcwAgAGUAeABwAGwAaQBjAGkAdAAgAHcAcgBpAHQAdABlAG4AIABwAGUAcgBtAGkAcwBzAGkAbwBuACAAaQBzACAAZwByAGEAbgB0AGUAZAAgAGIAeQAgAHQAaABlACAAYwBvAHIAcgBlAHMAcABvAG4AZABpAG4AZwAgAEMAbwBwAHkAcgBpAGcAaAB0ACAASABvAGwAZABlAHIALgAgAFQAaABpAHMAIAByAGUAcwB0AHIAaQBjAHQAaQBvAG4AIABvAG4AbAB5ACAAYQBwAHAAbABpAGUAcwAgAHQAbwAgAHQAaABlACAAcAByAGkAbQBhAHIAeQAgAGYAbwBuAHQAIABuAGEAbQBlACAAYQBzACAAcAByAGUAcwBlAG4AdABlAGQAIAB0AG8AIAB0AGgAZQAgAHUAcwBlAHIAcwAuAA0ACgANAAoANAApACAAVABoAGUAIABuAGEAbQBlACgAcwApACAAbwBmACAAdABoAGUAIABDAG8AcAB5AHIAaQBnAGgAdAAgAEgAbwBsAGQAZQByACgAcwApACAAbwByACAAdABoAGUAIABBAHUAdABoAG8AcgAoAHMAKQAgAG8AZgAgAHQAaABlACAARgBvAG4AdAAgAFMAbwBmAHQAdwBhAHIAZQAgAHMAaABhAGwAbAAgAG4AbwB0ACAAYgBlACAAdQBzAGUAZAAgAHQAbwAgAHAAcgBvAG0AbwB0AGUALAAgAGUAbgBkAG8AcgBzAGUAIABvAHIAIABhAGQAdgBlAHIAdABpAHMAZQAgAGEAbgB5ACAATQBvAGQAaQBmAGkAZQBkACAAVgBlAHIAcwBpAG8AbgAsACAAZQB4AGMAZQBwAHQAIAB0AG8AIABhAGMAawBuAG8AdwBsAGUAZABnAGUAIAB0AGgAZQAgAGMAbwBuAHQAcgBpAGIAdQB0AGkAbwBuACgAcwApACAAbwBmACAAdABoAGUAIABDAG8AcAB5AHIAaQBnAGgAdAAgAEgAbwBsAGQAZQByACgAcwApACAAYQBuAGQAIAB0AGgAZQAgAEEAdQB0AGgAbwByACgAcwApACAAbwByACAAdwBpAHQAaAAgAHQAaABlAGkAcgAgAGUAeABwAGwAaQBjAGkAdAAgAHcAcgBpAHQAdABlAG4AIABwAGUAcgBtAGkAcwBzAGkAbwBuAC4ADQAKAA0ACgA1ACkAIABUAGgAZQAgAEYAbwBuAHQAIABTAG8AZgB0AHcAYQByAGUALAAgAG0AbwBkAGkAZgBpAGUAZAAgAG8AcgAgAHUAbgBtAG8AZABpAGYAaQBlAGQALAAgAGkAbgAgAHAAYQByAHQAIABvAHIAIABpAG4AIAB3AGgAbwBsAGUALAAgAG0AdQBzAHQAIABiAGUAIABkAGkAcwB0AHIAaQBiAHUAdABlAGQAIABlAG4AdABpAHIAZQBsAHkAIAB1AG4AZABlAHIAIAB0AGgAaQBzACAAbABpAGMAZQBuAHMAZQAsACAAYQBuAGQAIABtAHUAcwB0ACAAbgBvAHQAIABiAGUAIABkAGkAcwB0AHIAaQBiAHUAdABlAGQAIAB1AG4AZABlAHIAIABhAG4AeQAgAG8AdABoAGUAcgAgAGwAaQBjAGUAbgBzAGUALgAgAFQAaABlACAAcgBlAHEAdQBpAHIAZQBtAGUAbgB0ACAAZgBvAHIAIABmAG8AbgB0AHMAIAB0AG8AIAByAGUAbQBhAGkAbgAgAHUAbgBkAGUAcgAgAHQAaABpAHMAIABsAGkAYwBlAG4AcwBlACAAZABvAGUAcwAgAG4AbwB0ACAAYQBwAHAAbAB5ACAAdABvACAAYQBuAHkAIABkAG8AYwB1AG0AZQBuAHQAIABjAHIAZQBhAHQAZQBkACAAdQBzAGkAbgBnACAAdABoAGUAIABGAG8AbgB0ACAAUwBvAGYAdAB3AGEAcgBlAC4ADQAKAA0ACgBUAEUAUgBNAEkATgBBAFQASQBPAE4ADQAKAFQAaABpAHMAIABsAGkAYwBlAG4AcwBlACAAYgBlAGMAbwBtAGUAcwAgAG4AdQBsAGwAIABhAG4AZAAgAHYAbwBpAGQAIABpAGYAIABhAG4AeQAgAG8AZgAgAHQAaABlACAAYQBiAG8AdgBlACAAYwBvAG4AZABpAHQAaQBvAG4AcwAgAGEAcgBlACAAbgBvAHQAIABtAGUAdAAuAA0ACgANAAoARABJAFMAQwBMAEEASQBNAEUAUgANAAoAVABIAEUAIABGAE8ATgBUACAAUwBPAEYAVABXAEEAUgBFACAASQBTACAAUABSAE8AVgBJAEQARQBEACAAIgBBAFMAIABJAFMAIgAsACAAVwBJAFQASABPAFUAVAAgAFcAQQBSAFIAQQBOAFQAWQAgAE8ARgAgAEEATgBZACAASwBJAE4ARAAsACAARQBYAFAAUgBFAFMAUwAgAE8AUgAgAEkATQBQAEwASQBFAEQALAAgAEkATgBDAEwAVQBEAEkATgBHACAAQgBVAFQAIABOAE8AVAAgAEwASQBNAEkAVABFAEQAIABUAE8AIABBAE4AWQAgAFcAQQBSAFIAQQBOAFQASQBFAFMAIABPAEYAIABNAEUAUgBDAEgAQQBOAFQAQQBCAEkATABJAFQAWQAsACAARgBJAFQATgBFAFMAUwAgAEYATwBSACAAQQAgAFAAQQBSAFQASQBDAFUATABBAFIAIABQAFUAUgBQAE8AUwBFACAAQQBOAEQAIABOAE8ATgBJAE4ARgBSAEkATgBHAEUATQBFAE4AVAAgAE8ARgAgAEMATwBQAFkAUgBJAEcASABUACwAIABQAEEAVABFAE4AVAAsACAAVABSAEEARABFAE0AQQBSAEsALAAgAE8AUgAgAE8AVABIAEUAUgAgAFIASQBHAEgAVAAuACAASQBOACAATgBPACAARQBWAEUATgBUACAAUwBIAEEATABMACAAVABIAEUAIABDAE8AUABZAFIASQBHAEgAVAAgAEgATwBMAEQARQBSACAAQgBFACAATABJAEEAQgBMAEUAIABGAE8AUgAgAEEATgBZACAAQwBMAEEASQBNACwAIABEAEEATQBBAEcARQBTACAATwBSACAATwBUAEgARQBSACAATABJAEEAQgBJAEwASQBUAFkALAAgAEkATgBDAEwAVQBEAEkATgBHACAAQQBOAFkAIABHAEUATgBFAFIAQQBMACwAIABTAFAARQBDAEkAQQBMACwAIABJAE4ARABJAFIARQBDAFQALAAgAEkATgBDAEkARABFAE4AVABBAEwALAAgAE8AUgAgAEMATwBOAFMARQBRAFUARQBOAFQASQBBAEwAIABEAEEATQBBAEcARQBTACwAIABXAEgARQBUAEgARQBSACAASQBOACAAQQBOACAAQQBDAFQASQBPAE4AIABPAEYAIABDAE8ATgBUAFIAQQBDAFQALAAgAFQATwBSAFQAIABPAFIAIABPAFQASABFAFIAVwBJAFMARQAsACAAQQBSAEkAUwBJAE4ARwAgAEYAUgBPAE0ALAAgAE8AVQBUACAATwBGACAAVABIAEUAIABVAFMARQAgAE8AUgAgAEkATgBBAEIASQBMAEkAVABZACAAVABPACAAVQBTAEUAIABUAEgARQAgAEYATwBOAFQAIABTAE8ARgBUAFcAQQBSAEUAIABPAFIAIABGAFIATwBNACAATwBUAEgARQBSACAARABFAEEATABJAE4ARwBTACAASQBOACAAVABIAEUAIABGAE8ATgBUACAAUwBPAEYAVABXAEEAUgBFAC4ADQAKAGgAdAB0AHAAOgAvAC8AdwB3AHcALgBhAGQAbwBiAGUALgBjAG8AbQAvAHQAeQBwAGUALwBsAGUAZwBhAGwALgBoAHQAbQBsAAAAAAAFAAAAAwAAADgAAAAEAAABUAABAAAAAAAsAAMAAQAAADgAAwAKAAABUAAGAAwAAAAAAAEAAAAEARgAAABCAEAABQACB/8P/xf/H/8n/y//N/8//0f/T/9X/1//Z/9v/3f/f/+H/4//l/+f/6f/r/+3/7//x//P/9f/5//v//f//c///f//AAAAAAgAEAAYACAAKAAwADgAQABIAFAAWABgAGgAcAB4AIAAiACQAJgAoACoALAAuADAAMgA0ADgAOgA8AD4AP3w//8AAfgB8AHoAeAB2AHQAcgBwAG4AbABqAGgAZgBkAGIAYABeAFwAWgBYAFYAVABSAFAATgBMAEgARgBEAEIAQgBAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADAAAAAAZkAAAAAAAAAIgAAAAAAAAB/8AAAABAAAIAAAAD/8AAAABAAAQAAAAF/8AAAABAAAYAAAAH/8AAAABAAAgAAAAJ/8AAAABAAAoAAAAL/8AAAABAAAwAAAAN/8AAAABAAA4AAAAP/8AAAABAABAAAAAR/8AAAABAABIAAAAT/8AAAABAABQAAAAV/8AAAABAABYAAAAX/8AAAABAABgAAAAZ/8AAAABAABoAAAAb/8AAAABAABwAAAAd/8AAAABAAB4AAAAf/8AAAABAACAAAAAh/8AAAABAACIAAAAj/8AAAABAACQAAAAl/8AAAABAACYAAAAn/8AAAABAACgAAAAp/8AAAABAACoAAAAr/8AAAABAACwAAAAt/8AAAABAAC4AAAAv/8AAAABAADAAAAAx/8AAAABAADIAAAAz/8AAAABAADQAAAA1/8AAAABAADgAAAA5/8AAAABAADoAAAA7/8AAAABAADwAAAA9/8AAAABAAD4AAAA/c8AAAABAAD98AAA//0AAAXxAAEAAAABB/8AAAABAAEIAAABD/8AAAABAAEQAAABF/8AAAABAAEYAAABH/8AAAABAAEgAAABJ/8AAAABAAEoAAABL/8AAAABAAEwAAABN/8AAAABAAE4AAABP/8AAAABAAFAAAABR/8AAAABAAFIAAABT/8AAAABAAFQAAABV/8AAAABAAFYAAABX/8AAAABAAFgAAABZ/8AAAABAAFoAAABb/8AAAABAAFwAAABd/8AAAABAAF4AAABf/8AAAABAAGAAAABh/8AAAABAAGIAAABj/8AAAABAAGQAAABl/8AAAABAAGYAAABn/8AAAABAAGgAAABp/8AAAABAAGoAAABr/8AAAABAAGwAAABt/8AAAABAAG4AAABv/8AAAABAAHAAAABx/8AAAABAAHIAAABz/8AAAABAAHQAAAB1/8AAAABAAHYAAAB3/8AAAABAAHgAAAB5/8AAAABAAHoAAAB7/8AAAABAAHwAAAB9/8AAAABAAH4AAAB//0AAAABAAIAAAACB/8AAAABAAIIAAACD/8AAAABAAIQAAACF/8AAAABAAIYAAACH/8AAAABAAIgAAACJ/8AAAABAAIoAAACL/8AAAABAAIwAAACN/8AAAABAAI4AAACP/8AAAABAAJAAAACR/8AAAABAAJIAAACT/8AAAABAAJQAAACV/8AAAABAAJYAAACX/8AAAABAAJgAAACZ/8AAAABAAJoAAACb/8AAAABAAJwAAACd/8AAAABAAJ4AAACf/8AAAABAAKAAAACh/8AAAABAAKIAAACj/8AAAABAAKQAAACl/8AAAABAAKYAAACn/8AAAABAAKgAAACp/8AAAABAAKoAAACr/8AAAABAAKwAAACt/8AAAABAAK4AAACv/8AAAABAALAAAACx/8AAAABAALIAAACz/8AAAABAALQAAAC1/8AAAABAALYAAAC3/8AAAABAALgAAAC5/8AAAABAALoAAAC7/8AAAABAALwAAAC9/8AAAABAAL4AAAC//0AAAABAAMAAAADB/8AAAABAAMIAAADD/8AAAABAAMQAAADF/8AAAABAAMYAAADH/8AAAABAAMgAAADJ/8AAAABAAMoAAADL/8AAAABAAMwAAADN/8AAAABAAM4AAADP/8AAAABAANAAAADR/8AAAABAANIAAADT/8AAAABAANQAAADV/8AAAABAANYAAADX/8AAAABAANgAAADZ/8AAAABAANoAAADb/8AAAABAANwAAADd/8AAAABAAN4AAADf/8AAAABAAOAAAADh/8AAAABAAOIAAADj/8AAAABAAOQAAADl/8AAAABAAOYAAADn/8AAAABAAOgAAADp/8AAAABAAOoAAADr/8AAAABAAOwAAADt/8AAAABAAO4AAADv/8AAAABAAPAAAADx/8AAAABAAPIAAADz/8AAAABAAPQAAAD1/8AAAABAAPYAAAD3/8AAAABAAPgAAAD5/8AAAABAAPoAAAD7/8AAAABAAPwAAAD9/8AAAABAAP4AAAD//0AAAABAAQAAAAEB/8AAAABAAQIAAAED/8AAAABAAQQAAAEF/8AAAABAAQYAAAEH/8AAAABAAQgAAAEJ/8AAAABAAQoAAAEL/8AAAABAAQwAAAEN/8AAAABAAQ4AAAEP/8AAAABAARAAAAER/8AAAABAARIAAAET/8AAAABAARQAAAEV/8AAAABAARYAAAEX/8AAAABAARgAAAEZ/8AAAABAARoAAAEb/8AAAABAARwAAAEd/8AAAABAAR4AAAEf/8AAAABAASAAAAEh/8AAAABAASIAAAEj/8AAAABAASQAAAEl/8AAAABAASYAAAEn/8AAAABAASgAAAEp/8AAAABAASoAAAEr/8AAAABAASwAAAEt/8AAAAB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AAloAAAJb/8AAAABAAlwAAAJd/8AAAABAAl4AAAJf/8AAAABAAmAAAAJh/8AAAABAAmIAAAJj/8AAAABAAmQAAAJl/8AAAABAAmYAAAJn/8AAAABAAmgAAAJp/8AAAABAAmoAAAJr/8AAAABAAmwAAAJt/8AAAABAAm4AAAJv/8AAAABAAnAAAAJx/8AAAABAAnIAAAJz/8AAAABAAnQAAAJ1/8AAAABAAnYAAAJ3/8AAAABAAngAAAJ5/8AAAABAAnoAAAJ7/8AAAABAAnwAAAJ9/8AAAABAAn4AAAJ//0AAAABAAoAAAAKB/8AAAABAAoIAAAKD/8AAAABAAoQAAAKF/8AAAABAAoYAAAKH/8AAAABAAogAAAKJ/8AAAABAAooAAAKL/8AAAABAAowAAAKN/8AAAABAAo4AAAKP/8AAAABAApAAAAKR/8AAAABAApIAAAKT/8AAAABAApQAAAKV/8AAAABAApYAAAKX/8AAAABAApgAAAKZ/8AAAABAApoAAAKb/8AAAABAApwAAAKd/8AAAABAAp4AAAKf/8AAAABAAqAAAAKh/8AAAABAAqIAAAKj/8AAAABAAqQAAAKl/8AAAABAAqYAAAKn/8AAAABAAqgAAAKp/8AAAABAAqoAAAKr/8AAAABAAqwAAAKt/8AAAABAAq4AAAKv/8AAAABAArAAAAKx/8AAAABAArIAAAKz/8AAAABAArQAAAK1/8AAAABAArYAAAK3/8AAAABAArgAAAK5/8AAAABAAroAAAK7/8AAAABAArwAAAK9/8AAAABAAr4AAAK//0AAAABAAsAAAALB/8AAAABAAsIAAALD/8AAAABAAsQAAALF/8AAAABAAsYAAALH/8AAAABAAsgAAALJ/8AAAABAAsoAAALL/8AAAABAAswAAALN/8AAAABAAs4AAALP/8AAAABAAtAAAALR/8AAAABAAtIAAALT/8AAAABAAtQAAALV/8AAAABAAtYAAALX/8AAAABAAtgAAALZ/8AAAABAAtoAAALb/8AAAABAAtwAAALd/8AAAABAAt4AAALf/8AAAABAAuAAAALh/8AAAABAAuIAAALj/8AAAABAAuQAAALl/8AAAABAAuYAAALn/8AAAABAAugAAALp/8AAAABAAuoAAALr/8AAAABAAuwAAALt/8AAAABAAu4AAALv/8AAAAB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ASwBLQEuAS8BMAExATIBMwE0ATUBNgE3ATgBOQE6ATsBPAE9AT4BPwFAAUEBQgFDAUQBRQFGAUcBSAFJAUoBSwFMAU0BTgFPAVABUQFSAVMBVAFVAVYBVwFYAVkBWgFbAVwBXQFeAV8BYAFhAWIBYwFkAWUBZgFnAWgBaQFqAWsBbAFtAW4BbwFwAXEBcgFzAXQBdQF2AXcBeAF5AXoBewF8AX0BfgF/AYABgQGCAYMBhAGFAYYBhwGIAYkBigGLAYwBjQGOAY8BkAGRAZIBkwGUAZUBlgGXAZgBmQGaAZsBnAGdAZ4BnwGgAaEBogGjAaQBpQGmAacBqAGpAaoBqwGsAa0BrgGvAbABsQGyAbMBtAG1AbYBtwG4AbkBugG7AbwBvQG+Ab8BwAHBAcIBwwHEAcUBxgHHAcgByQHKAcsBzAHNAc4BzwHQAdEB0gHTAdQB1QHWAdcB2AHZAdoB2wHcAd0B3gHfAeAB4QHiAeMB5AHlAeYB5wHoAekB6gHrAewB7QHuAe8B8AHxAfIB8wH0AfUB9gH3AfgB+QH6AfsB/AH9Af4B/wIAAgECAgIDAgQCBQIGAgcCCAIJAgoCCwIMAg0CDgIPAhACEQISAhMCFAIVAhYCFwIYAhkCGgIbAhwCHQIeAh8CIAIhAiICIwIkAiUCJgInAigCKQIqAisCLAItAi4CLwIwAjECMgIzAjQCNQI2AjcCOAI5AjoCOwI8Aj0CPgI/AkACQQJCAkMCRAJFAkYCRwJIAkkCSgJLAkwCTQJOAk8CUAJRAlICUwJUAlUCVgJXAlgCWQJaAlsCXAJdAl4CXwJgAmECYgJjAmQCZQJmAmcCaAJpAmoCawJsAm0CbgJvAnACcQJyAnMCdAJ1AnYCdwJ4AnkCegJ7AnwCfQJ+An8CgAKBAoICgwKEAoUChgKHAogCiQKKAosCjAKNAo4CjwKQApECkgKTApQClQKWApcCmAKZApoCmwKcAp0CngKfAqACoQKiAqMCpAKlAqYCpwKoAqkCqgKrAqwCrQKuAq8CsAKxArICswK0ArUCtgK3ArgCuQK6ArsCvAK9Ar4CvwLAAsECwgLDAsQCxQLGAscCyALJAsoCywLMAs0CzgLPAtAC0QLSAtMC1ALVAtYC1wLYAtkC2gLbAtwC3QLeAt8C4ALhAuIC4wLkAuUC5gLnAugC6QLqAusC7ALtAu4C7wLwAvEC8gLzAvQC9QL2AvcC+AL5AvoC+wL8Av0C/gL/AwADAQMCAwMDBAMFAwYDBwMIAwkDCgMLAwwDDQMOAw8DEAMRAxIDEwMUAxUDFgMXAxgDGQMaAxsDHAMdAx4DHwMgAyEDIgMjAyQDJQMmAycDKAMpAyoDKwMsAy0DLgMvAzADMQMyAzMDNAM1AzYDNwM4AzkDOgM7AzwDPQM+Az8DQANBA0IDQwNEA0UDRgNHA0gDSQNKA0sDTANNA04DTwNQA1EDUgNTA1QDVQNWA1cDWANZA1oDWwNcA10DXgNfA2ADYQNiA2MDZANlA2YDZwNoA2kDagNrA2wDbQNuA28DcANxA3IDcwN0A3UDdgN3A3gDeQN6A3sDfAN9A34DfwOAA4EDggODA4QDhQOGA4cDiAOJA4oDiwOMA40DjgOPA5ADkQOSA5MDlAOVA5YDlwOYA5kDmgObA5wDnQOeA58DoAOhA6IDowOkA6UDpgOnA6gDqQOqA6sDrAOtA64DrwOwA7EDsgOzA7QDtQO2A7cDuAO5A7oDuwO8A70DvgO/A8ADwQPCA8MDxAPFA8YDxwPIA8kDygPLA8wDzQPOA88D0APRA9ID0wPUA9UD1gPXA9gD2QPaA9sD3APdA94D3wPgA+ED4gPjA+QD5QPmA+cD6APpA+oD6wPsA+0D7gPvA/AD8QPyA/MD9AP1A/YD9wP4A/kD+gP7A/wD/QP+A/8EAAQBBAIEAwQEBAUEBgQHBAgECQQKBAsEDAQNBA4EDwQQBBEEEgQTBBQEFQQWBBcEGAQZBBoEGwQcBB0EHgQfBCAEIQQiBCMEJAQlBCYEJwQoBCkEKgQrBCwELQQuBC8EMAQxBDIEMwQ0BDUENgQ3BDgEOQQ6BDsEPAQ9BD4EPwRABEEEQgRDBEQERQRGBEcESARJBEoESwRMBE0ETgRPBFAEUQRSBFMEVARVBFYEVwRYBFkEWgRbBFwEXQReBF8EYARhBGIEYwRkBGUEZgRnBGgEaQRqBGsEbARtBG4EbwRwBHEEcgRzBHQEdQR2BHcEeAR5BHoEewR8BH0EfgR/BIAEgQSCBIMEhASFBIYEhwSIBIkEigSLBIwEjQSOBI8EkASRBJIEkwSUBJUElgSXBJgEmQSaBJsEnASdBJ4EnwSgBKEEogSjBKQEpQSmBKcEqASpBKoEqwSsBK0ErgSvBLAEsQSyBLMEtAS1BLYEtwS4BLkEugS7BLwEvQS+BL8EwATBBMIEwwTEBMUExgTHBMgEyQTKBMsEzATNBM4EzwTQBNEE0gTTBNQE1QTWBNcE2ATZBNoE2wTcBN0E3gTfBOAE4QTiBOME5ATlBOYE5wToBOkE6gTrBOwE7QTuBO8E8ATxBPIE8wT0BPUE9gT3BPgE+QT6BPsE/AT9BP4E/wUABQEFAgUDBQQFBQUGBQcFCAUJBQoFCwUMBQ0FDgUPBRAFEQUSBRMFFAUVBRYFFwUYBRkFGgUbBRwFHQUeBR8FIAUhBSIFIwUkBSUFJgUnBSgFKQUqBSsFLAUtBS4FLwUwBTEFMgUzBTQFNQU2BTcFOAU5BToFOwU8BT0FPgU/BUAFQQVCBUMFRAVFBUYFRwVIBUkFSgVLBUwFTQVOBU8FUAVRBVIFUwVUBVUFVgVXBVgFWQVaBVsFXAVdBV4FXwVgBWEFYgVjBWQFZQVmBWcFaAVpBWoFawVsBW0FbgVvBXAFcQVyBXMFdAV1BXYFdwV4BXkFegV7BXwFfQV+BX8FgAWBBYIFgwWEBYUFhgWHBYgFiQWKBYsFjAWNBY4FjwWQBZEFkgWTBZQFlQWWBZcFmAWZBZoFmwWcBZ0FngWfBaAFoQWiBaMFpAWlBaYFpwWoBakFqgWrBawFrQWuBa8FsAWxBbIFswW0BbUFtgW3BbgFuQW6BbsFvAW9Bb4FvwXABcEFwgXDBcQFxQXGBccFyAXJBcoFywXMBc0FzgXPBdAF0QXSBdMF1AXVBdYF1wXYBdkF2gXbBdwF3QXeBd8F4AXhBeIF4wXkBeUF5gXnBegF6QXqBesF7AXtBe4F7wXwBfEF8gXzBfQF9QX2BfcF+AX5BfoF+wX8Bf0F/gX/BgAGAQYCBgMGBAYFBgYGBwYIBgkGCgYLBgwGDQYOBg8GEAYRBhIGEwYUBhUGFgYXBhgGGQYaBhsGHAYdBh4GHwYgBiEGIgYjBiQGJQYmBicGKAYpBioGKwYsBi0GLgYvBjAGMQYyBjMGNAY1BjYGNwY4BjkGOgY7BjwGPQY+Bj8GQAZBBkIGQwZEBkUGRgZHBkgGSQZKBksGTAZNBk4GTwZQBlEGUgZTBlQGVQZWBlcGWAZZBloGWwZcBl0GXgZfBmAGYQZiBmMGZAZlBmYGZwZoBmkGagZrBmwGbQZuBm8GcAZxBnIGcwZ0BnUGdgZ3BngGeQZ6BnsGfAZ9Bn4GfwaABoEGggaDBoQGhQaGBocGiAaJBooGiwaMBo0GjgaPBpAGkQaSBpMGlAaVBpYGlwaYBpkGmgabBpwGnQaeBp8GoAahBqIGowakBqUGpganBqgGqQaqBqsGrAatBq4GrwawBrEGsgazBrQGtQa2BrcGuAa5BroGuwa8Br0Gvga/BsAGwQbCBsMGxAbFBsYGxwbIBskGygbLBswGzQbOBs8G0AbRBtIG0wbUBtUG1gbXBtgG2QbaBtsG3AbdBt4G3wbgBuEG4gbjBuQG5QbmBucG6AbpBuoG6wbsBu0G7gbvBvAG8QbyBvMG9Ab1BvYG9wb4BvkG+gb7BvwG/Qb+Bv8HAAcBBwIHAwcEBwUHBgcHBwgHCQcKBwsHDAcNBw4HDwcQBxEHEgcTBxQHFQcWBxcHGAcZBxoHGwccBx0HHgcfByAHIQciByMHJAclByYHJwcoBykHKgcrBywHLQcuBy8HMAcxBzIHMwc0BzUHNgc3BzgHOQc6BzsHPAc9Bz4HPwdAB0EHQgdDB0QHRQdGB0cHSAdJB0oHSwdMB00HTgdPB1AHUQdSB1MHVAdVB1YHVwdYB1kHWgdbB1wHXQdeB18HYAdhB2IHYwdkB2UHZgdnB2gHaQdqB2sHbAdtB24HbwdwB3EHcgdzB3QHdQd2B3cHeAd5B3oHewd8B30Hfgd/B4AHgQeCB4MHhAeFB4YHhweIB4kHigeLB4wHjQeOB48HkAeRB5IHkweUB5UHlgeXB5gHmQeaB5sHnAedB54HnwegB6EHogejB6QHpQemB6cHqAepB6oHqwesB60HrgevB7AHsQeyB7MHtAe1B7YHtwe4B7kHuge7B7wHvQe+B78HwAfBB8IHwwfEB8UHxgfHB8gHyQfKB8sHzAfNB84HzwfQB9EH0gfTB9QH1QfWB9cH2AfZB9oH2wfcB90H3gffB+AH4QfiB+MH5AflB+YH5wfoB+kH6gfrB+wH7QfuB+8H8AfxB/IH8wf0B/UH9gf3B/gH+Qf6B/sH/Af9B/4H/wgACAEIAggDCAQIBQgGCAcICAgJCAoICwgMCA0IDggPCBAIEQgSCBMIFAgVCBYIFwgYCBkIGggbCBwIHQgeCB8IIAghCCIIIwgkCCUIJggnCCgIKQgqCCsILAgtCC4ILwgwCDEIMggzCDQINQg2CDcIOAg5CDoIOwg8CD0IPgg/CEAIQQhCCEMIRAhFCEYIRwhICEkISghLIPsMt/oktwH3ELf5LLcD9xD6BBX+fPmE+nwH/Vj+JxX50gf3xfwzBaawFfvF+DcF+PYGpmIV/dIH+8X4MwVwZhX3xfw3Bfz2Bg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODgABAQEK+B8MJpocGSQS+46LHAVGiwa9Cr0L+ucVAAPoAHwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAA') format('truetype'); }";
	    FontLoader.fontStyleAliasesMap = {"n": "normal", "b": "bold", "i": "italic", "o": "oblique"};
		
		FontLoader.prototype = {
			constructor: FontLoader,
			loadFonts: function() {
				var self = this,
	                newFontVariations;
				
				if (this._numberOfFonts === 0) {
					this._finish();
					return;
				}
				
				if (this.timeout !== null) {
					this._timeoutId = window.setTimeout(function timeoutFire() {
						self._finish();
					}, this.timeout);
				}
				
				// Use constant line-height so there won't be changes in height because Adobe Blank uses zero width but not zero height.
				this._testContainer = this._document.createElement("div");
				this._testContainer.style.cssText = "position:absolute; left:-10000px; top:-10000px; white-space:nowrap; font-size:20px; line-height:20px; visibility:hidden;";

	            // Create testDiv template that will be cloned for each font
	            this._testDiv = this._document.createElement("div");
	            this._testDiv.style.position = "absolute";
	            this._testDiv.appendChild(this._document.createTextNode(FontLoader.referenceText));

	            if (!FontLoader.useAdobeBlank) {
	                // AdobeBlank is not used
	                // We need to extract dimensions of reference font-families for each requested font variation.
	                // The extracted dimensions are stored in a static property "referenceFontFamilyVariationSizes",
	                // so we might already have some or all of them all.
	                newFontVariations = this._getNewFontVariationsFromFonts(this._fontsArray);
	                if (newFontVariations.length) {
	                    this._extractReferenceFontSizes(newFontVariations);
	                }
	                this._loadFonts();
	            } else if (FontLoader.adobeBlankReferenceSize) {
	                // AdobeBlank is used, and was loaded
	                this._loadFonts();
	            } else {
	                // AdobeBlank is used but was not loaded
	                this._loadAdobeBlankFont();
	            }
			},
	        _extractReferenceFontSizes: function(newFontVariations) {
				var clonedDiv, j, i,
	                key, size, fontVariation;

	            clonedDiv = this._testDiv.cloneNode(true);
	            this._testContainer.appendChild(clonedDiv);
	            this._document.body.appendChild(this._testContainer);

	            for (i = 0; i < newFontVariations.length; i++) {
	                fontVariation = newFontVariations[i];
	                key = fontVariation.key;
	                FontLoader.referenceFontFamilyVariationSizes[key] = [];
	                for (j = 0; j < FontLoader.referenceFontFamilies.length; j++) {
	                    clonedDiv.style.fontFamily = FontLoader.referenceFontFamilies[j];
	                    clonedDiv.style.fontWeight = fontVariation.weight;
	                    clonedDiv.style.fontStyle = fontVariation.style;
	                    size = new Size(clonedDiv.offsetWidth, clonedDiv.offsetHeight);
	                    FontLoader.referenceFontFamilyVariationSizes[key].push(size);
	                }
	            }

	            this._testContainer.parentNode.removeChild(this._testContainer);
	            clonedDiv.parentNode.removeChild(clonedDiv);
			},
	        _loadAdobeBlankFont: function() {
	            var self = this,
	                adobeBlankDiv,
	                adobeBlankFallbackFont = "serif";

	            this._addAdobeBlankFontFaceIfNeeded();

	            adobeBlankDiv = this._testDiv.cloneNode(true);
	            this._testContainer.appendChild(adobeBlankDiv);
	            this._document.body.appendChild(this._testContainer);

	            // When using AdobeBlank (all browsers except IE < 11) only interval checking and size watcher methods
	            // are available for watching element size.
	            if (FontLoader.useIntervalChecking) {
	                adobeBlankDiv.style.fontFamily = FontLoader.referenceFontFamilies[0] + ", " + adobeBlankFallbackFont;
	                this._testContainer.appendChild(adobeBlankDiv);
	                // Start polling element sizes but also do first synchronous check in case all fonts where already loaded.
	                this._intervalId = window.setInterval(function intervalFire() {
	                    self._checkAdobeBlankSize();
	                }, this._intervalDelay);
	                this._checkAdobeBlankSize();
	            } else {
	                adobeBlankDiv.style.fontFamily = adobeBlankFallbackFont;
	                this._adobeBlankSizeWatcher = new SizeWatcher(/** @type HTMLElement */adobeBlankDiv, {
	                    container: this._testContainer,
	                    delegate: this,
	                    continuous: true,
	                    direction: SizeWatcher.directions.decrease,
	                    dimension: SizeWatcher.dimensions.horizontal,
	                    document: this._document
	                });
	                this._adobeBlankSizeWatcher.prepareForWatch();
	                this._adobeBlankSizeWatcher.beginWatching();
	                adobeBlankDiv.style.fontFamily = FontLoader.referenceFontFamilies[0] + ", " + adobeBlankFallbackFont;
	            }
	        },
	        _getNewFontVariationsFromFonts: function(fonts) {
	            var font, key, i,
	                variations = [],
	                variationsMap = {};

	            for (i = 0; i < fonts.length; i++) {
	                font = fonts[i];
	                key = this._fontVariationKeyForFont(font);
	                if (!(key in variationsMap) && !(key in FontLoader.referenceFontFamilyVariationSizes)) {
	                    variationsMap[key] = true;
	                    variations.push({
	                        key: key,
	                        weight: font.weight,
	                        style: font.style
	                    });
	                }
	            }
	            return variations;
	        },
			_parseFonts: function(fonts) {
				var processedFonts = [];

				fonts.forEach(function (font) {
	                if (typeof font === "string") {
	                    if (font.indexOf(':') > -1) {
	                        processedFonts = processedFonts.concat(this._convertShorthandToFontObjects(font));
	                    } else {
	                        processedFonts.push({
	                            family: font,
	                            weight: 400,
	                            style: 'normal'
	                        });
	                    }
	                } else if (this._isValidFontObject(font)) {
	                    processedFonts.push(font);
	                } else {
	                    throw new Error("Invalid font format");
	                }
				}, this);

				return processedFonts;
			},
	        /**
	         * @param {FontDescriptor} fontObject
	         * @returns {boolean}
	         * @private
	         */
			_isValidFontObject: function(fontObject) {
				if (!fontObject.family || !fontObject.weight || !fontObject.style) {
					return false;
				}
				return ['normal', 'italic', 'bold', 'oblique'].indexOf(fontObject.style) !== -1;
			},
	        /**
	         * @param {string} fontString
	         * @returns {Array.<FontDescriptor>}
	         * @private
	         */
			_convertShorthandToFontObjects: function(fontString) {
				var fonts = [],
	                parts = fontString.split(':'),
				    variants,
				    fontFamily;

	            fontFamily = parts[0];
	            variants = parts[1].split(',');

				variants.forEach(function (variant) {
	                var styleAlias,
	                    weightAlias,
	                    weight,
	                    style;

	                if (variant.length !== 2) {
	                    throw new Error("Invalid Font Variation Description: '" + variant + "' for font string: '" + fontString + "'");
	                }

	                styleAlias = variant[0];
	                weightAlias = variant[1];

	                if (styleAlias in FontLoader.fontStyleAliasesMap) {
	                    style = FontLoader.fontStyleAliasesMap[styleAlias];
	                } else {
	                    return;
	                }

	                weight = parseInt(weightAlias, 10);
	                if (isNaN(weight)) {
	                    return;
	                } else {
	                    weight *= 100;
	                }

	                fonts.push({
						family: fontFamily,
						weight: weight,
						style: style
					});
				});

				return fonts;
			},
	        _addAdobeBlankFontFaceIfNeeded: function() {
	            var adobeBlankFontFaceStyle;
	            if (!this._document.getElementById(FontLoader.adobeBlankFontFaceStyleId)) {
	                adobeBlankFontFaceStyle = this._document.createElement("style");
	                adobeBlankFontFaceStyle.setAttribute("type", "text/css");
	                adobeBlankFontFaceStyle.setAttribute("id", FontLoader.adobeBlankFontFaceStyleId);
	                adobeBlankFontFaceStyle.appendChild(this._document.createTextNode(FontLoader.adobeBlankFontFaceRule));
	                this._document.getElementsByTagName("head")[0].appendChild(adobeBlankFontFaceStyle);
	            }
	        },
			_checkAdobeBlankSize: function() {
				var adobeBlankDiv = this._testContainer.firstChild;
				this._adobeBlankLoaded(adobeBlankDiv);
			},
			_adobeBlankLoaded: function(adobeBlankDiv) {
				// Prevent false size change, for example if AdobeBlank height is higher than fallback font.
				if (adobeBlankDiv.offsetWidth !== 0) {
					return;
				}
				
				FontLoader.adobeBlankReferenceSize = new Size(adobeBlankDiv.offsetWidth, adobeBlankDiv.offsetHeight);
				
				if (this._adobeBlankSizeWatcher !== null) {
					// SizeWatcher method
					this._adobeBlankSizeWatcher.endWatching();
					this._adobeBlankSizeWatcher.removeScrollWatchers();
					this._adobeBlankSizeWatcher = null;
				} else {
					// Polling method (IE)
					window.clearInterval(this._intervalId);
					adobeBlankDiv.parentNode.removeChild(adobeBlankDiv);
				}
				
				this._testContainer.parentNode.removeChild(this._testContainer);

				this._loadFonts();
			},
			_cloneNodeSetStyleAndAttributes: function(font, fontKey, referenceFontFamilyIndex) {
				var clonedDiv = this._testDiv.cloneNode(true);
	            clonedDiv.style.fontWeight = font.weight;
	            clonedDiv.style.fontStyle = font.style;
	            clonedDiv.setAttribute("data-font-map-key", fontKey);
				clonedDiv.setAttribute("data-ref-font-family-index", String(referenceFontFamilyIndex));
				return clonedDiv;
			},
	        _getFontMapKeyFromElement: function(element) {
	            return element.getAttribute("data-font-map-key");
	        },
	        _getFontFromElement: function(element) {
	            var fontKey = this._getFontMapKeyFromElement(element);
	            return this._fontsMap[fontKey];
	        },
	        _getFontFamilyFromElement: function(element) {
	            var font = this._getFontFromElement(element);
	            return font.family;
	        },
	        _getReferenceFontFamilyIndexFromElement: function(element) {
	            return element.getAttribute("data-ref-font-family-index");
	        },
	        _getReferenceFontFamilyFromElement: function(element) {
	            var referenceFontFamilyIndex = this._getReferenceFontFamilyIndexFromElement(element);
	            return FontLoader.referenceFontFamilies[referenceFontFamilyIndex];
	        },
	        _fontVariationKeyForFont: function(font) {
	            return font.weight + font.style;
	        },
	        _fontsMapKeyForFont: function(font) {
	            return font.family + font.weight + font.style
	        },
			_loadFonts: function() {
				var i, j, clonedDiv, sizeWatcher,
	                font,
	                fontKey,
	                fontVariationKey,
	                referenceFontSize,
	                sizeWatcherDirection,
	                sizeWatcherDimension,
					self = this;

				// Add div for each font-family
				for (i = 0; i < this._numberOfFonts; i++) {
	                font = this._fontsArray[i];
	                fontKey = this._fontsMapKeyForFont(font);
					this._fontsMap[fontKey] = font;

					for (j = 0; j < FontLoader.referenceFontFamilies.length; j++) {
	                    clonedDiv = this._cloneNodeSetStyleAndAttributes(font, fontKey, j);
						if (FontLoader.useResizeEvent) {
	                        clonedDiv.style.fontFamily = FontLoader.referenceFontFamilies[j];
	                        this._testContainer.appendChild(clonedDiv);
						} else if (FontLoader.useIntervalChecking) {
							clonedDiv.style.fontFamily = "'" + font.family + "', " + FontLoader.referenceFontFamilies[j];
	                        this._testContainer.appendChild(clonedDiv);
						} else {
	                        clonedDiv.style.fontFamily = FontLoader.referenceFontFamilies[j];
	                        if (FontLoader.useAdobeBlank) {
	                            referenceFontSize = FontLoader.adobeBlankReferenceSize;
	                            sizeWatcherDirection = SizeWatcher.directions.increase;
	                            sizeWatcherDimension = SizeWatcher.dimensions.horizontal;
	                        } else {
	                            fontVariationKey = this._fontVariationKeyForFont(font);
	                            referenceFontSize = FontLoader.referenceFontFamilyVariationSizes[fontVariationKey][j];
	                            sizeWatcherDirection = SizeWatcher.directions.both;
	                            sizeWatcherDimension = SizeWatcher.dimensions.both;
	                        }
							sizeWatcher = new SizeWatcher(/** @type HTMLElement */clonedDiv, {
								container: this._testContainer,
								delegate: this,
								size: referenceFontSize,
								direction: sizeWatcherDirection,
								dimension: sizeWatcherDimension,
								document: this._document
							});
							// The prepareForWatch() and beginWatching() methods will be invoked in separate iterations to
							// reduce number of browser's CSS recalculations.
							this._sizeWatchers.push(sizeWatcher);
						}
					}
				}

				// Append the testContainer after all test elements to minimize DOM insertions
				this._document.body.appendChild(this._testContainer);

				if (FontLoader.useResizeEvent) {
					for (j = 0; j < this._testContainer.childNodes.length; j++) {
						clonedDiv = this._testContainer.childNodes[j];
						// "resize" event works only with attachEvent
						clonedDiv.attachEvent("onresize", (function(self, clonedDiv) {
							return function() {
								self._elementSizeChanged(clonedDiv);
							}
						})(this, clonedDiv));
					}
					window.setTimeout(function() {
						for (j = 0; j < self._testContainer.childNodes.length; j++) {
							clonedDiv = self._testContainer.childNodes[j];
							clonedDiv.style.fontFamily = "'" + self._getFontFamilyFromElement(clonedDiv) + "', " + self._getReferenceFontFamilyFromElement(clonedDiv);
						}
					}, 0);
				} else if (FontLoader.useIntervalChecking) {
					// Start polling element sizes but also do first synchronous check in case all fonts where already loaded.
					this._intervalId = window.setInterval(function intervalFire() {
						self._checkSizes();
					}, this._intervalDelay);
					this._checkSizes();
				} else {
					// We are dividing the prepareForWatch() and beginWatching() methods to optimize browser performance by
					// removing CSS recalculation from each iteration to the end of iterations.
	                for (i = 0; i < this._sizeWatchers.length; i++) {
	                    sizeWatcher = this._sizeWatchers[i];
	                    sizeWatcher.prepareForWatch();
	                }
	                for (i = 0; i < this._sizeWatchers.length; i++) {
	                    sizeWatcher = this._sizeWatchers[i];
	                    sizeWatcher.beginWatching();
	                    // Apply tested font-family
	                    clonedDiv = sizeWatcher.getWatchedElement();
	                    clonedDiv.style.fontFamily = "'" + this._getFontFamilyFromElement(clonedDiv) + "', " + self._getReferenceFontFamilyFromElement(clonedDiv);
	                }
				}
			},
			_checkSizes: function() {
				var i, testDiv, font, fontVariationKey, currSize, refSize, refFontFamilyIndex;

				for (i = this._testContainer.childNodes.length - 1; i >= 0; i--) {
					testDiv = this._testContainer.childNodes[i];
					currSize = new Size(testDiv.offsetWidth, testDiv.offsetHeight);
	                if (FontLoader.useAdobeBlank) {
	                    refSize = FontLoader.adobeBlankReferenceSize;
	                } else {
	                    font = this._getFontFromElement(testDiv);
	                    fontVariationKey = this._fontVariationKeyForFont(font);
	                    refFontFamilyIndex = this._getReferenceFontFamilyIndexFromElement(testDiv);
	                    refSize = FontLoader.referenceFontFamilyVariationSizes[fontVariationKey][refFontFamilyIndex];
	                }
					if (!refSize.isEqual(currSize)) {
						// Element dimensions changed, this means its font loaded, remove it from testContainer div
						testDiv.parentNode.removeChild(testDiv);
						this._elementSizeChanged(testDiv);
					}
				}
			},
			_elementSizeChanged: function(element) {
				var font, fontKey;

				if (this._finished) {
					return;
				}

	            fontKey = this._getFontMapKeyFromElement(element);

				// Check that the font of this element wasn't already marked as loaded by an element with different reference font family.
				if (typeof this._fontsMap[fontKey] === "undefined") {
					return;
				}

	            font = this._fontsMap[fontKey];

				this._numberOfLoadedFonts++;
				delete this._fontsMap[fontKey];

				if (this.delegate && typeof this.delegate.fontLoaded === "function") {
					this.delegate.fontLoaded(font);
				}

				if (this._numberOfLoadedFonts === this._numberOfFonts) {
					this._finish();
				}
			},
			_finish: function() {
				var error, i, sizeWatcher,
	                fontKey,
					notLoadedFonts = [];
				
				if (this._finished) {
					return;
				}
				
				this._finished = true;
				
				if (this._adobeBlankSizeWatcher !== null) {
	                if (this._adobeBlankSizeWatcher.getState() === SizeWatcher.states.watchingForSizeChange) {
	                    this._adobeBlankSizeWatcher.endWatching();
	                }
					this._adobeBlankSizeWatcher = null;
				}

	            for (i = 0; i < this._sizeWatchers.length; i++) {
	                sizeWatcher = this._sizeWatchers[i];
	                if (sizeWatcher.getState() === SizeWatcher.states.watchingForSizeChange) {
	                    sizeWatcher.endWatching();
	                }
	            }
	            this._sizeWatchers = [];
				
				if (this._testContainer !== null) {
					this._testContainer.parentNode.removeChild(this._testContainer);
				}
				
				if (this._timeoutId !== null) {
					window.clearTimeout(this._timeoutId);
				}
				
				if (this._intervalId !== null) {
					window.clearInterval(this._intervalId);
				}
				
	            if (this.delegate) {
	                if (this._numberOfLoadedFonts < this._numberOfFonts) {
	                    for (fontKey in this._fontsMap) {
	                        if (this._fontsMap.hasOwnProperty(fontKey)) {
	                            notLoadedFonts.push(this._fontsMap[fontKey]);
	                        }
	                    }
	                    error = {
	                        message: "Not all fonts were loaded (" + this._numberOfLoadedFonts + "/" + this._numberOfFonts + ")",
	                        notLoadedFonts: notLoadedFonts
	                    };
	                } else {
	                    error = null;
	                }
	                if (typeof this.delegate.complete === "function") {
	                    this.delegate.complete(error);
	                } else if (typeof this.delegate.fontsLoaded === "function") {
	                    this.delegate.fontsLoaded(error);
	                }
	            }
			},
			/**
			 * SizeWatcher delegate method
			 * @param {SizeWatcher} sizeWatcher
			 */
			sizeWatcherChangedSize: function(sizeWatcher) {
				var watchedElement = sizeWatcher.getWatchedElement();
				if (sizeWatcher === this._adobeBlankSizeWatcher) {
					this._adobeBlankLoaded(watchedElement);
				} else {
					this._elementSizeChanged(watchedElement);
				}
			}
		};

		/**
		 * Size object
		 *
		 * @param width
		 * @param height
		 * @constructor
		 */
		function Size(width, height) {
			this.width = width;
			this.height = height;
		}

	    Size.sizeFromString = function(sizeString) {
	        var arr = sizeString.split(",");
	        if (arr.length !== 2) {
	            return null;
	        }
	        return new Size(arr[0], arr[1]);
	    };

		/**
		 * Compares receiver object to passed in size object.
		 * 
		 * @param otherSize
		 * @returns {boolean}
		 */
		Size.prototype.isEqual = function(otherSize) {
			return (this.width === otherSize.width && this.height === otherSize.height);
		};

	    Size.prototype.toString = function() {
	        return this.width + "," + this.height;
	    };

		/**
		 * SizeWatcher observes size of an element and notifies when its size is changed. It doesn't use any timeouts
		 * to check the element size, when change in size occurs a callback method immediately invoked.
		 * 
		 * To watch for element's size changes the element, and other required elements are appended to a container element
		 * you specify, and which must be added to the DOM tree before invoking prepareForWatch() method. Your container
		 * element should be positioned outside of client's visible area. Therefore you shouldn't use SizeWatcher to watch
		 * for size changes of elements used for UI.
		 * Such container element could be a simple <div> that is a child of the <body> element:
		 * <div style="position:absolute; left:-10000px; top:-10000px;"></div>
		 * 
		 * You must invoke SizeWatcher's methods in a specific order to establish size change listeners:
		 * 
		 * 1. Create SizeWatcher instance by invoke SizeWatcher constructor passing the element (size of which you want to
		 *    observe), the container element, the delegate object and optional size parameter of type Size which should be
		 *    the pre-calculated initial size of your element.
		 * 4. Invoke prepareForWatch() method. This method will calculate element size if you didn't passed it to the constructor.
		 * 5. Invoke beginWatching() method. This method will set event listeners and invoke your delegate's method once
		 *    element size changes. 
		 * 
		 * Failing to invoke above methods in their predefined order will throw an exception.
		 * 
		 * @param {HTMLElement}   element An element, size of which will be observed for changes.
		 * @param {Object}        options
		 * @param {HTMLElement}   options.container An element to which special observing elements will be added. Must be in DOM tree
		 *                        when prepareForWatch() method is called.
		 * @param {Object}        options.delegate A delegate object with a sizeWatcherChangedSize method which will be invoked, in
		 *                        context of the delegate object, when change in size occurs. This method is invoked with single
		 *                        parameter which is the current SizeWatcher instance.
		 * @param {Size}          [options.size] The pre-calculated initial size of your element. When passed, the element is not
		 *                        asked for offsetWidth and offsetHeight, which may be useful to reduce browser's CSS
		 *                        recalculations. If you will not pass the size parameter then its size calculation will be
		 *                        deferred to prepareForWatch() method.
		 * @param {Boolean}       [options.continuous=false] A boolean flag indicating if the SizeWatcher will watch only for
		 *                        the first size change (default) or will continuously watch for size changes.
		 * @param {Number}        [options.direction=SizeWatcher.directions.both] The direction of size change that should be
		 *                        watched: SizeWatcher.directions.increase, SizeWatcher.directions.decrease or
		 *                        SizeWatcher.directions.both
		 * @param {Number}        [options.dimension=SizeWatcher.dimensions.both] The dimension of size change that should be
		 *                        watched: SizeWatcher.dimensions.horizontal, SizeWatcher.dimensions.vertical or
		 *                        SizeWatcher.dimensions.both
		 * @param {HTMLDocument}  [options.document] The DOM tree context to use, if none provided then it will be the document.
		 * @constructor
		 */
		function SizeWatcher(element, options) {
			this._element = element;
			this._delegate = options.delegate;
			this._size = null;
			this._continuous = !!options.continuous;
			this._direction = options.direction ? options.direction : SizeWatcher.directions.both;
			this._dimension = options.dimension ? options.dimension : SizeWatcher.dimensions.both;
			this._sizeIncreaseWatcherContentElm = null;
			this._sizeDecreaseWatcherElm = null;
			this._sizeIncreaseWatcherElm = null;
			this._state = SizeWatcher.states.initialized;
			this._scrollAmount = 2;
			this._document = options.document || document;

			this._generateScrollWatchers(options.size);
			this._appendScrollWatchersToElement(options.container);
		}
		
		SizeWatcher.states = {
			initialized: 0,
			generatedScrollWatchers: 1,
			appendedScrollWatchers: 2,
			preparedScrollWatchers: 3,
			watchingForSizeChange: 4
		};

		SizeWatcher.directions = {
			decrease: 1,
			increase: 2,
			both: 3
		};

		SizeWatcher.dimensions = {
			horizontal: 1,
			vertical: 2,
			both: 3
		};
		
		//noinspection JSUnusedLocalSymbols
		SizeWatcher.prototype = {
			constructor: SizeWatcher,
			getWatchedElement: function() {
				return this._element;
			},
	        getState: function() {
	            return this._state;
	        },
			setSize: function(size) {
				this._size = size;
				//noinspection JSBitwiseOperatorUsage
				if (this._direction & SizeWatcher.directions.increase) {
					this._sizeIncreaseWatcherContentElm.style.cssText = "width: " + (size.width + this._scrollAmount) + "px; height: " + (size.height + this._scrollAmount) + "px;";
				}
				//noinspection JSBitwiseOperatorUsage
				if (this._direction & SizeWatcher.directions.decrease) {
					this._sizeDecreaseWatcherElm.style.cssText = "position:absolute; left: 0px; top: 0px; overflow: hidden; width: " + (size.width - this._scrollAmount) + "px; height: " + (size.height - this._scrollAmount) + "px;";
				}
			},
			_generateScrollWatchers: function(size) {

				this._element.style.position = "absolute";
				
				//noinspection JSBitwiseOperatorUsage
				if (this._direction & SizeWatcher.directions.increase) {
					this._sizeIncreaseWatcherContentElm = this._document.createElement("div");
					
					this._sizeIncreaseWatcherElm = this._document.createElement("div");
					this._sizeIncreaseWatcherElm.style.cssText = "position: absolute; left: 0; top: 0; width: 100%; height: 100%; overflow: hidden;";
					this._sizeIncreaseWatcherElm.appendChild(this._sizeIncreaseWatcherContentElm);

					this._element.appendChild(this._sizeIncreaseWatcherElm);
				}

				//noinspection JSBitwiseOperatorUsage
				if (this._direction & SizeWatcher.directions.decrease) {
					this._sizeDecreaseWatcherElm = this._document.createElement("div");
					this._sizeDecreaseWatcherElm.appendChild(this._element);
				}
				
				if (size) {
					this.setSize(size);
				}
				
				this._state = SizeWatcher.states.generatedScrollWatchers;
			},
			_appendScrollWatchersToElement: function(container) {
				if (this._state !== SizeWatcher.states.generatedScrollWatchers) {
					throw new Error("SizeWatcher._appendScrollWatchersToElement() was invoked before SizeWatcher._generateScrollWatchers()");
				}

				//noinspection JSBitwiseOperatorUsage
				if (this._direction & SizeWatcher.directions.decrease) {
					container.appendChild(this._sizeDecreaseWatcherElm);
				} else {
					container.appendChild(this._element);
				}
				
				this._state = SizeWatcher.states.appendedScrollWatchers;
			},
			removeScrollWatchers: function() {
				//noinspection JSBitwiseOperatorUsage
				if (this._direction & SizeWatcher.directions.decrease) {
					if (this._sizeDecreaseWatcherElm.parentNode) {
						this._sizeDecreaseWatcherElm.parentNode.removeChild(this._sizeDecreaseWatcherElm);
					}
				} else if (this._element.parentNode) {
					this._element.parentNode.removeChild(this._element);
				}
			},
			prepareForWatch: function() {
				var parentNode,
					sizeDecreaseWatcherElmScrolled = true,
					sizeIncreaseWatcherElmScrolled = true;
				
				if (this._state !== SizeWatcher.states.appendedScrollWatchers) {
					throw new Error("SizeWatcher.prepareForWatch() invoked before SizeWatcher._appendScrollWatchersToElement()");
				}
				
				if (this._size === null) {
					this.setSize(new Size(this._element.offsetWidth, this._element.offsetHeight));
				}

				//noinspection JSBitwiseOperatorUsage
				if (this._direction & SizeWatcher.directions.decrease) {
					sizeDecreaseWatcherElmScrolled = this._scrollElementToBottomRight(this._sizeDecreaseWatcherElm);
				}
				//noinspection JSBitwiseOperatorUsage
				if (this._direction & SizeWatcher.directions.increase) {
					sizeIncreaseWatcherElmScrolled = this._scrollElementToBottomRight(this._sizeIncreaseWatcherElm);
				}
				
				// Check if scroll positions updated.
				if (!sizeDecreaseWatcherElmScrolled || !sizeIncreaseWatcherElmScrolled) {
					
					// Traverse tree to the top node to see if element is in the DOM tree.
					parentNode = this._element.parentNode;
					while (parentNode !== this._document && parentNode !== null) {
						parentNode = parentNode.parentNode;
					}
					
					if (parentNode === null) {
						throw new Error("Can't set scroll position of scroll watchers. SizeWatcher is not in the DOM tree.");
					} else if (console && typeof console.warn === "function") {
						console.warn("SizeWatcher can't set scroll position of scroll watchers.");
					}
				}
				
				this._state = SizeWatcher.states.preparedScrollWatchers;
			},
			_scrollElementToBottomRight: function(element) {
				var elementScrolled = true;
				//noinspection JSBitwiseOperatorUsage
				if (this._dimension & SizeWatcher.dimensions.vertical) {
					element.scrollTop = this._scrollAmount;
					elementScrolled = elementScrolled && element.scrollTop > 0;
				}
				//noinspection JSBitwiseOperatorUsage
				if (this._dimension & SizeWatcher.dimensions.horizontal) {
					element.scrollLeft = this._scrollAmount;
					elementScrolled = elementScrolled && element.scrollLeft > 0;
				}
				return elementScrolled;
			},
			beginWatching: function() {
				if (this._state !== SizeWatcher.states.preparedScrollWatchers) {
					throw new Error("SizeWatcher.beginWatching() invoked before SizeWatcher.prepareForWatch()");
				}

				//noinspection JSBitwiseOperatorUsage
				if (this._direction & SizeWatcher.directions.decrease) {
					//noinspection JSValidateTypes
					this._sizeDecreaseWatcherElm.addEventListener("scroll", this, false);
				}
				//noinspection JSBitwiseOperatorUsage
				if (this._direction & SizeWatcher.directions.increase) {
					//noinspection JSValidateTypes
					this._sizeIncreaseWatcherElm.addEventListener("scroll", this, false);
				}
				
				this._state = SizeWatcher.states.watchingForSizeChange;
			},
			endWatching: function() {
				if (this._state !== SizeWatcher.states.watchingForSizeChange) {
					throw new Error("SizeWatcher.endWatching() invoked before SizeWatcher.beginWatching()");
				}

				//noinspection JSBitwiseOperatorUsage
				if (this._direction & SizeWatcher.directions.decrease) {
					//noinspection JSValidateTypes
					this._sizeDecreaseWatcherElm.removeEventListener("scroll", this, false);
				}
				//noinspection JSBitwiseOperatorUsage
				if (this._direction & SizeWatcher.directions.increase) {
					//noinspection JSValidateTypes
					this._sizeIncreaseWatcherElm.removeEventListener("scroll", this, false);
				}
				this._state = SizeWatcher.states.appendedScrollWatchers;
			},
			/**
			 * @private
			 */
			handleEvent: function(event) {
				var newSize, oldSize;
				
				// This is not suppose to happen because when we run endWatching() we remove scroll listeners.
				// But some browsers will fire second scroll event which was pushed into event stack before listener was
				// removed so do this check anyway.
				if (this._state !== SizeWatcher.states.watchingForSizeChange) {
					return;
				}
				
				newSize = new Size(this._element.offsetWidth, this._element.offsetHeight);
				oldSize = this._size;

				// Check if element size is changed. How come that element size isn't changed but scroll event fired?
				// This can happen in two cases: when double scroll occurs or immediately after calling prepareForWatch()
				// (event if scroll event listeners attached after it).
				// The double scroll event happens when one size dimension (e.g.:width) is increased and another
				// (e.g.:height) is decreased.
				if (oldSize.isEqual(newSize)) {
					return;
				}
				
				if (this._delegate && typeof this._delegate.sizeWatcherChangedSize === "function") {
					this._delegate.sizeWatcherChangedSize(this);
					
					// Check that endWatching() wasn't invoked from within the delegate.
					if (this._state !== SizeWatcher.states.watchingForSizeChange) {
						return;
					}
				}

				if (!this._continuous) {
					this.endWatching();
				} else {
					// Set the new size so in case of double scroll event we won't cause the delegate method to be executed twice
					// and also to update to the new watched size.
					this.setSize(newSize);
					// change state so prepareFowWatch() won't throw exception about wrong order invocation.
					this._state = SizeWatcher.states.appendedScrollWatchers;
					// Run prepareForWatch to reset the scroll watchers, we have already set the size
					this.prepareForWatch();
					// Set state to listeningForSizeChange, there is no need to invoke beginWatching() method as scroll event
					// listeners and callback are already set.
					this._state = SizeWatcher.states.watchingForSizeChange;
					
				}
			}
		};
		
		return FontLoader;
		
	}));


/***/ }
/******/ ]);