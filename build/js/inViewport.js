/*******************************************************
	InViewport.js v1.0.0
	http://www.weskaplan.com

	Licensed under the MIT license.
	http://www.opensource.org/licenses/mit-license.php	

	Copyright 2014, Wes Kaplan
	http://www.weskaplan.com

*******************************************************/


( function(window) {

	/* 
	
	Helper functions for setting an element's class
	
	*/

	function classRegExp( htmlClass ){											// Creates a Regular Expression that finds the class at the 
		return new RegExp( '(^|\\s)' + htmlClass + '(\\s|$)' );					// beginning, middle, or end of the string
	}

	function hasClass( element, htmlClass) {										
		return classRegExp(htmlClass).test( element.className );
	}

	function addClass( element, htmlClass ) {
		if (!hasClass(element, htmlClass)){
			element.className += ' ' + htmlClass;
		}
	}

	function removeClass( element, htmlClass ){
		element.className = element.className.replace( classRegExp( htmlClass ) , ' ' );
	}

	function toggleClass( element, htmlClass ){
		( hasClass( element, htmlClass ) ? removeClass : addClass )( element, htmlClass );
	}

	/*
	
	Helper functions for finding elements in the viewport
	
	*/

	function totalOffset( element ) {											// Function that finds an element's offset from the whole page by looping
		var offsetTop = 0;														// through each parent, returns top and left offset of element's top left corner
		var offsetLeft = 0;
		while(element) {
			offsetTop += element.offsetTop;
			offsetLeft += element.offsetLeft;
			element = element.offsetParent;
		}
		return {
			top:	offsetTop,
			left:	offsetLeft
			}
	}

	function getViewportTop() { 												// Gets the top of the window, uses scrollTop for older browsers
		return window.pageYOffset || window.document.documentElement.scrollTop;
	}

	function elemInViewport( element, amount ) {								// Returns true if the amount or more of the element is in the viewport
		var amount 			= (amount <= 1 && amount >= 0) ? amount : 0,		// Amount can be between 0 and 1, which means between 0% and 100% of the element
			elHeight 		= element.offsetHeight,								// If amount not set, or is given an incorrect value, amount defaults to 0
			elTop 			= totalOffset(element).top,
			elLeft			= totalOffset(element).left,
			elCutoffTop		= elTop + (elHeight * amount),
			elCutoffBottom 	= elTop + (elHeight * (1 - amount)),
			viewportTop 	= getViewportTop(),
			viewportBottom 	= viewportTop + window.innerHeight;

		return elCutoffBottom >= viewportTop && elCutoffTop <= viewportBottom;
	}

	/*

	Merge for merging options to defualts

	*/

	function merge( a, b ) {
		for( var key in b ) { 
			if( b.hasOwnProperty( key ) ) {
				a[key] = b[key];
			}
		}
		return a;
	}

	/*

	Plugin to add or remove classes when finding something in the viewport

	*/

	function InViewport( element, options ) {											// Constructor for InViewport
		this.element = element;
		this.options = merge(this.defaults, options);									// Set options by merging user provided options with defaults
		console.log( JSON.stringify(this.options) );
		this._init();
	}

	InViewport.prototype = {

		defaults : {																	// Default options
				itemSelector: 		'li',
				inViewClass: 		'inView',
				outOfViewClass:		'outOfView',
				seenClass: 			'seen',
				minTime: 			0.3,
				maxTime: 			1,
				minStart: 	 		{x:-500, y:-500},
				maxStart: 			{x:500, y:500},
				animate:            true,
				amount: 			0,
				inViewFunction: 	null
		},

		_init : function(){

			this.inViewFunction = this.options.inViewFunction || this._inViewFunction;	// If a custom function is provided, use that function, otherwise use default
			this.items = [];
			var self = this;

			self.items = self.items.concat(
				Array.prototype.slice.call(	self.element.children )			// Get HTMLCollection object of all elements we will find in viewport,
			);																	// then slice them into an Array object (so I can call forEach() later)

			self._checkViewport();

			window.addEventListener( 'scroll' , function(){ self._checkViewport() }, false );
			window.addEventListener( 'resize' , function(){ self._checkViewport() }, false );

		},

		_checkViewport : function() {
			var self = this;
			this.items.forEach( self.inViewFunction, self );
		},

		_inViewFunction : function(element, i , items){
			var options = this.options;

			if(elemInViewport(element, options.amount) ){(console.log(element + ' is in viewport'))};

			if( !hasClass(element, options.inViewClass) ) {
				element.style.opacity = 0;
					if( !isNaN( options.maxStart.x - options.minStart.x ) && //Set each element with a random start location
						!isNaN( options.maxStart.y - options.minStart.y ) ){	
							randX = (Math.random() * (options.maxStart.x - options.minStart.x) + options.minStart.x) + 'px';
							randY = (Math.random() * (options.maxStart.y - options.minStart.y) + options.minStart.y) + 'px';
							console.log(element.constructor + randX + randY);
							element.style.WebkitTransform = 'translateX(' + randX + ') translateY(' + randY + ') rotate(0deg)';
					}

					if( !isNaN( options.maxTime - options.minTime ) ){	//Set each element with a random animation time
						randTime = (Math.random() * (options.maxTime - options.minTime) + options.minTime) + 's';
						element.style.WebkitAnimationDuration = randTime;
					}
			}

			if (!elemInViewport(element, options.amount) && !hasClass(element, options.outOfViewClass)){
				addClass(element, options.outOfViewClass);
				removeClass(element, options.inViewClass);
			}

			if (elemInViewport(element, options.amount) && !hasClass(element, options.inViewClass)){
				addClass(element, options.inViewClass);
				removeClass(element, options.outOfViewClass);
				if (!hasClass(element, options.seenClass) ){
					addClass(element, options.seenClass)
				}
			}
		}
	}
	window.InViewport = InViewport
})(window);