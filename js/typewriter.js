/**************************
 * typewriter.js v1.1.0
 *
 * Copyright (c) 2015 Tony McCoy
 * http://www.tonymccoy.me
 *
 * This software is distributed under the MIT License
 * http://opensource.org/licenses/MIT
 */

'use strict'

var Typewriter = (function(config) {

    var options = {
        speed: 1,
        outputElement: "#output",
        cursorElement: "#type-cursor",
        punctuationDelay: true,
        punctuationTiming: {
            // Time to pause for punctuation in milliseconds.
            // Any character can be assigned a value. These are just my defaults.
            '.': 400,
            ',': 250,
            '?': 400,
            '!': 400
        }
    }

    function modObject(destination, source) {
        var sourceKeys = Object.keys(source)
        var destKeys = Object.keys(destination)

        sourceKeys.forEach(function(key) {
            source[key] = destination[key]
        })
    }

    var waitBeforeCallback = function(callback, wait) {
        if (callback) {
            if (wait) setTimeout(function() {
                callback()
            }, wait)
            else callback()
        }
    }

    if (config) modObject(options, config)

    var global = {
        chain: function(inputArray) {
            var self = this

            var functions = inputArray.map(function(input) {
                var params = input.substring(input.indexOf('[') + 1, input.indexOf(']'))
                    .split(',')
                    .map(function(param) {
                        return param.trim()
                    })
                var text = input.substring(input.indexOf(']') + 1, input.length)//.trim()

                return {
                    func: self[params[0]],
                    name: params[0],
                    params: (text.length > 0) ? [text, params[1], params[2]] : [params[1]]
                }
            })

            function queueFunctions(num) {
                if (functions[num] && functions[num].name === 'clear') {
                    console.log("WAT", num)
                    if (num < functions.length)
                        return functions[num].func(functions[num].params[0], function() {
                            queueFunctions(num + 1)
                        })
                    else return functions[num].func(functions[num].params[0])
                } else if (functions[num] && functions[num].name === 'write') {
                    if (num < functions.length)
                        return functions[num].func(functions[num].params[0], functions[num].params[1], functions[num].params[2], function() {
                            queueFunctions(num + 1)
                        })
                    else return functions[num].func(functions[num].params[0], functions[num].params[1], functions[num].params[2])
                }
            }

            queueFunctions(0)
        },
        write: function(text, speed, wait, callback) {
            //return new Promise(function(resolve, reject) {
            // If no speed is specified, fall back to default speed
            if (!speed || speed === 0) {
                if (typeof speed === "function") {
                    if (callback) wait = callback;
                    callback = speed;
                    speed = options.speed;
                }
            } else speed = options.speed;

            var out = document.querySelector(options.outputElement),
                cursor = document.querySelector(options.cursorElement),
                charsRemaining = text.length;

            if (speed === 0) { // Print all text instantly
                out.insertAdjacentHTML("beforeend", text);
            } else {
                (function charLoop(i) {
                    var char = text[text.length - i],
                        nextChar = text[text.length - i + 1],
                        lastChar = text[text.length - i - 1],
                        delay = 30

                    if (options.punctuationDelay && options.punctuationTiming) {
                        Object.keys(options.punctuationTiming).forEach(function(key) {
                            if (char === key) delay = options.punctuationTiming[key]
                        })
                    }

                    window.requestAnimationFrame(function() {
                        out.insertAdjacentHTML("beforeend", char);

                        if (callback) {
                            setTimeout(function() {
                                if (--i) charLoop(i);
                                else waitBeforeCallback(callback, wait)
                            }, delay / speed);
                        }
                    })
                })(text.length);
            }
        },
        clear: function(wait, callback) {
            setTimeout(function() {
                document.querySelector(options.outputElement).innerHTML = "";
                callback();
            }, wait)
        }
    };
    return global;
});
