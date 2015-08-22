/**************************
 * typewriter.js v1.0.0
 * 
 * Copyright (c) 2015 Tony McCoy
 * http://www.tonymccoy.me
 * 
 * This software is distributed under the MIT License
 * http://opensource.org/licenses/MIT
 */

var typewriter = (function () {
	
	var options = {
		speed: 1,
		outputElement: "#output",
		cursor: "#type-cursor",
		punctuationDelay: true
	};
	
	// Time to pause for punctuation (in milliseconds)
	var punctuationTiming = {
		'.': 400,
		',': 250,
		'?': 400,
		'!': 400
	}
	
	var runCallback = function (callback, wait) {
		if (callback) {
			if (wait) {
				setTimeout(function () { callback(); }, wait);
			} else {
				callback();
			}
		}
	};
	
	var global = {
		config: function (obj) {
			var keys = Object.keys(obj);
			for (var i = 0; i < obj.length; i++) options[keys[i]] = obj[i];
		},
		write: function (text, speed, wait, callback) {
			
			// If no speed is specified, fall back to default speed
			if (speed || speed === 0) {
				if (typeof speed === "function") {
					if (callback) wait = callback;
					callback = speed;
					speed = options.speed;
				}
			} else { speed = options.speed; }
			
			var out = document.querySelector(options.outputElement),
				cursor = document.querySelector(options.cursor),
				charsRemaining = text.length;
		
			if (speed === 0) { // Print all text instantly
				out.insertAdjacentHTML("beforeend", text);
			} else {
				cursor.style.display = "inline-block"; // enable cursor
				
				(function charLoop(i) {
					var char = text[text.length - i],
						nextChar = text[text.length - i + 1],
						lastChar = text[text.length - i - 1],
						delay = 30;
						
					if (options.punctuationDelay) {
						if (char === ".") {
							delay = punctuationTiming[char];
							if (nextChar === ".") delay = punctuationTiming[char] / 2;
							if (lastChar === ".") delay = punctuationTiming[char] / 2;
						} else if (/[,?!]/.test(char) && nextChar === " ") {
							delay = punctuationTiming[char];
						}
					}
					
					out.insertAdjacentHTML("beforeend", char);
					
					setTimeout(function () {
						if (--i) {
							charLoop(i);
						} else {
							if (!callback) setTimeout(function () {
								cursor.style.display = "none";
							}, 300); // disable cursor
							runCallback(callback, wait);
						}
					}, delay / speed);
				})(text.length);
			}
		},
		clear: function (callback, wait) {
			document.querySelector(options.outputElement).innerHTML = "";
			runCallback(callback, wait);
		}
	};
	return global;
}());