/**************************
 * typewriter.js v2.0.0
 *
 * Copyright (c) 2015-2017 Tony McCoy
 * http://www.tonymccoy.me
 *
 * This software is distributed under the MIT License
 * http://opensource.org/licenses/MIT
 */

(function() {
	var Writer = function(config) {
		"use strict";

		// Clone config to prevent side effects.
		config = Object.assign({}, config);

		if (typeof config.el === "string") {
			config.el = document.querySelector(config.el);
		}

		if (config.speed == null) {
			config.speed = 1;
		}

		// Abort if no valid 'el' was found.
		if (!config.el || !(config.el instanceof HTMLElement)) {
			throw Error("el property should be either a string or a valid DOM element.");
		}

		var queue = [];
		var timeout = 0;
		var running = false;
		var lastTick = 0;

		// Private

		var bump = function() {
			if (!running) {
				running = true;
				tick();
			}
		};

		var enqueue = function(func) {
			queue.push(func);
			bump();
		};

		var tick = function() {
			if (queue[0]) {
				if (timeout <= 0) {
					queue.shift()(tick);
				} else {
					var now = Date.now();
					timeout = Math.max(0, timeout - (now - (lastTick || now)));
					lastTick = now;
					window.requestAnimationFrame(tick);
				}
			} else {
				running = false;
			}
		};

		// Public

		this.speed = function(factor) {
			enqueue(function(next) {
				config.speed = parseFloat(factor);
				next();
			});

			return this;
		};

		this.write = function(text) {
			// Print the given text.

			enqueue(function(next) {
				var el = config.el;
				var speed = config.speed;
				
				if (speed == 0) {
					el.appendChild(document.createTextNode(text));
					return next();
				} else {
					(function print(chars, lastPrint, i) {
						if (chars[i]) {
							var now = Date.now();

							if (lastPrint + 40 / speed < now) {
								el.appendChild(document.createTextNode(chars[i]));
								return window.requestAnimationFrame(print.bind(null, chars, now, i + 1));
							}

							window.requestAnimationFrame(print.bind(null, chars, lastPrint, i));
						} else {
							return next();
						}
					})(text.split(""), 0, 0);
				}
			});

			return this;
		};

		this.backspace = function(distance) {
			// Delete a certain number of characters character-by-character.
			// Like the inverse of 'write'.

			enqueue(function(next) {
				var el = config.el;
				var speed = config.speed;
				
				var count = 0;

				var back = function() {
					if (el.lastChild) {
						el.removeChild(el.lastChild);
						count += 1;
					}

					if (!el.lastChild || count === distance) {
						return next();
					}

					return window.setTimeout(back, 50 / speed || 0);
				};

				back();
			});

			return this;
		};

		this.wait = function(time) {
			enqueue(function(next) {
				timeout = (timeout || 0) + parseInt(time * 1000);
				next();
			});

			return this;
		};

		this.clear = function() {
			// Clear the contents of the root element.

			enqueue(function(next) {
				config.el.textContent = "";
				next();
			});

			return this;
		};

		this.break = function(count) {
			// Add a line break (or specified number of breaks)

			if (!count) count = 1;

			enqueue(function(next) {
				for (var i = 0; i < count; i++) {
					config.el.appendChild(document.createTextNode("\n"));
				}
				next();
			});

			return this;
		};


		// Aliases and alternate names

		this.pause = this.wait;
		this.newline = this.break;
	};

	if (typeof module !== "undefined") {
		module.exports = Writer;
	} else if (typeof window !== "undefined") {
		window.Typewriter = Writer;
	} else {
		throw Error("Unknown environment. Both module and window are undefined. Not running.");
	}
})();