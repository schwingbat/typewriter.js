/**************************
 * typewriter.js v2.0.0
 *
 * Copyright (c) 2015 Tony McCoy
 * http://www.tonymccoy.me
 *
 * This software is distributed under the MIT License
 * http://opensource.org/licenses/MIT
 */

(function() {
    'use strict';

    // Writer Prototype

    var Writer = {
        queue: [],
        config: {
            speed: 1,
            punctuationDelay: false,
            punctuationTiming: {
                // Time to pause for punctuation in milliseconds.
                // Any character can be assigned a value. These are just my defaults.
                '.': 400,
                ',': 250,
                '?': 400,
                '!': 400
            }  
        },
        timeout: 0,
        _bump: function() {
            if (!this.running) {
                this.running = true;
                this._tick();
            }
        },
        _enqueue: function(func) {
            this.queue.push(func.bind(this, this._tick.bind(this)));
            this._bump();
        },
        _tick: function() {
            if (this.queue[0]) {
                if (this.timeout <= 0) {
                    this.queue.shift()();
                } else {
                    const now = Date.now();
                    this.timeout = Math.max(0, this.timeout - (now - (this.lastTick || now)));
                    this.lastTick = now;
                    window.requestAnimationFrame(this._tick.bind(this));
                }
            } else {
                this.running = false;
            }
        },
        speed: function(factor) {
            // Set the speed of writing. Persists until set again.

            this._enqueue(function(next) {
                this.config.speed = parseFloat(factor);
                next();
            });

            return this;
        },
        write: function(text) {
            // Print the given text.

            this._enqueue(function(next) {
                var el = this.config.el;
                var speed = this.config.speed;
                
                if (speed == 0) {
                    el.appendChild(document.createTextNode(text));
                    return next();
                } else {
                    var punc = this.config.punctuationTiming || {};
                    var puncPause = this.config.punctuationPause;

                    var chars = text.split('');
                    var i = 0;

                    var print = function() {
                        var char = chars[i];
                        el.appendChild(document.createTextNode(char));
                        i += 1;
                        if (chars[i]) {
                            var pause = 0;
                            if (puncPause && punc[chars[i]]) {
                                pause = punc[chars[i]] || 0;
                            }
                            window.setTimeout(print, (50 + pause) / speed || 0);
                        } else {
                            return next();
                        }
                    }

                    print();
                }
            });

            return this;
        },
        backspace: function(distance) {
            // Delete a certain number of characters character-by-character.
            // Like the inverse of 'write'

            this._enqueue(function(next) {
                var el = this.config.el;
                var speed = this.config.speed;
                
                var count = 0;

                var back = function() {
                    if (el.lastChild) {
                        el.removeChild(el.lastChild);
                        count += 1;
                    } else {
                        return next();
                    }

                    if (count === distance) {
                        return next();
                    }

                    return window.setTimeout(back, 50 / speed || 0);
                }

                back();
            });

            return this;
        },
        wait: function(time) {
            // Wait a given number of seconds before continuing.

            this._enqueue(function(next) {
                this.timeout = (this.timeout || 0) + parseInt(time * 1000);
                next();
            });

            return this;
        },
        pause: function(time) {
            return this.wait(time);
        },
        clear: function() {
            // Clear the contents of the root element.

            this._enqueue(function(next) {
                this.config.el.textContent = '';
                next();
            });

            return this;
        },
        break: function(count) {
            // Add a line break (or specified number of breaks)

            if (!count) count = 1;

            this._enqueue(function(next) {
                for (var i = 0; i < count; i++) {
                    this.config.el.appendChild(document.createTextNode('\n'));
                }
                next();
            });

            return this;
        },
        newline: function(count) {
            return this.break(count);
        },
    };

    // Typewriter Constructor

    var typeWriter = function (config) {
        var writer = Object.create(Writer);

        // Validate crucial config items.

        var el = (typeof config.el === 'string')
            ? document.querySelector(config.el)
            : config.el;

        if (!el || !(el instanceof HTMLElement)) {
            throw Error('el property should be either a string or a valid DOM element.');
        }

        // Apply configuration and return the instance.

        Object.assign(writer.config, config, { el });
        return writer;
    }

    if (typeof module !== 'undefined') {
        module.exports = typeWriter;
    } else if (typeof window !== 'undefined') {
        window.Typewriter = typeWriter;
    } else {
        throw Error('Unknown environment. Both module and window are undefined. Not running.');
    }
})();