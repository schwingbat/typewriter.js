var t = Typewriter = {
	settings: {
		speed: 1,
		input: "#input",
		output: "#output",
		typeCursor: "#type-cursor",
		userInput: "#user-prompt",
		userCursor: "#user-cursor",
		punctuationDelay: true,
		soundEffects: false
	}
};

function turnInput(action, callback) {
	var userInput = document.querySelector(t.settings.userInput),
		userCursor = document.querySelector(t.settings.userCursor),
		typeCursor = document.querySelector(t.settings.typeCursor);
	
	if (action === "on") {
		// Unhide and enable user input
		input.innerHTML = "";
		userInput.classList.remove("disabled");
		typeCursor.classList.add("disabled");
		setTimeout(function(){
			userCursor.classList.remove("disabled");
		}, 500);
		document.addEventListener("keydown", function(event) { input(event); });
	} else if (action === "off") {
		// Hide and disable user input
		document.removeEventListener("keydown");
		userInput.classList.add("disabled");
		userCursor.classList.add("disabled");
		typeCursor.classList.remove("disabled");
	}
	
	if (callback) { callback(); }
}

function write(text, speed, callback, wait) {
	turnInput('off');
	
	var output = document.querySelector(t.settings.output),
		charsRemaining = text.length,
		text = decodeURI(text);

	var printChar = function () {
		if (charsRemaining > 0) {
			var char = text[text.length - charsRemaining],
				nextChar = text[text.length - charsRemaining + 1],
				lastChar = text[text.length - charsRemaining - 1];
			output.insertAdjacentHTML("beforeend", char);
			charsRemaining -= 1;
			
			var delay = 60;
			
			// Someone, please slap me for what I'm about to do...
			// If you know a better way to define delays for particular characters,
			// submit a pull request and we'll pretend this never happened. :x
			
			if (t.settings.punctuationDelay) {
				if (char === "?" || char === "!") {
					if (nextChar === " ") { delay = 750; } // End of sentence punctuation
				} else if (char === ".") {
					if (lastChar !== "." && nextChar === " ") { delay = 750; } // end of sentence
					else if (nextChar === "." || lastChar === ".") { delay = 400; } // ellipsis
					else if (nextChar === " " && lastChar === ".") { delay = 400; } // end of ellipsis
					else { delay = 750; } // period catchall
				} else if (char === "-") { delay = 250; } // dash 
				else { delay = 60; } // catchall or normal letter
			}
			
			setTimeout(function () {
				printChar(); // repeat this function if more characters need printing
			}, delay * speed);
			
		} else {
			if (callback) {
				if (wait) {
					setTimeout(function() { callback(); }, wait);
				} else {
					callback();
				}
			}
		}
	}
	
	printChar();
}

function clear(callback, wait) {
	document.querySelector(t.settings.output).innerHTML = "";
	
	if (callback) {
		if (wait) {
			setTimeout(function() { callback(); }, wait);
		} else {
			callback();
		}
	}
}

function parse(val) {
	turnInput('off');
	if (val === "SETTINGS") {
		console.log("Running SETTINGS");
	} else if (val === "RESTART") {
		console.log("Running RESTART");
	} else {
		var responses = [
			"Sorry. I'm not quite sure what you mean by that.",
			"Hmm. You feeling okay, there?",
			"Dear God. WHAT IS HE TRYING TO SAY?",
			"Try SETTINGS. I think you'll like SETTINGS.",
			"Oh, sure. Go ahead and waste your time. I swear there are no easter eggs here. Really!"
		]
		clear(function() { 
			write(_.sample(responses), 0.6, function () {
				turnInput('on');
			});
		});
	}
}

function input(e) {
	var input = document.querySelector(t.settings.input);
	var char = String.fromCharCode(e.keyCode);
	
	if (e.which === 8) { // backspace or delete
		str = input.innerHTML;
		str = str.substring(0, str.length - 1);
		input.innerHTML = str;
	} else if (e.which === 13){ // enter
		e.preventDefault();
		parse(input.innerHTML);
		input.innerHTML = "";
	} else {
		input.insertAdjacentHTML("beforeend", char.toUpperCase());
	}
}