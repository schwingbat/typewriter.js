# Typewriter.js

## Getting Started

First, you'll want to include Typewriter on your page and initialize it with your settings. The only ones you really have to specify are `outputElement` and `cursorElement`. The others will be set to reasonable defaults.

```javascript
<script src="typewriter.js"></script>
<script>
	var typewriter = new Typewriter({
		"speed": 1 // the base speed
		"outputElement": "#typewriter" // the element you want to print to,
		"cursorElement": "#cursor" // the element that will act as the cursor
		"punctuationDelay": true // Whether typewriter will pause after certain characters...
		"punctuationTiming": { // ...which you can specify here!
			'.': 400, // Amount of time to wait in milliseconds.
			'!': 400,
			'?': 400,
			',': 200
		}
	})
</script>
```

### Write Text
```javascript
typewriter.write(text, speed, wait time[, callback ])
```

#### Parameters

_**text**_<br>
A string containing the text you want to print.
	
_**speed**_<br>
A number representing the speed you want Typewriter to type the text. Default is 1. Setting speed to 0 will print your text immediately, skipping the typing effect. Higher numbers print faster while lower numbers print slower.

_**wait time**_<br>
Milliseconds to wait before executing the callback. Useful if you want to pause for dramatic effect or wait for a time before clearing the screen, for example.

_**callback**_<br>
_Optional._ A function to execute after the text is done being written. This can be another typewriter.write() or typewriter.clear() for example.

### Clear the Screen

```javascript
typewriter.clear(wait[, callback])
```

#### Parameters

_**wait**_<br>
Number of milliseconds to wait before clearing the screen.

_**callback**_<br>
An optional callback.


### All Together Now

```javascript
typewriter.write("Hello World!", 0.5, 500, function() {
	console.log("Printed Hello World!");
});
```

The code above will print "Hello World!" at half the default speed, then wait half a second before logging "Printed Hello World!" to the console. Easy, right? Of course the `console.log` and delay are unnecessary, so it would probably look more like this on a real website;

```javascript
typewriter.write("Hello World!", 0.5);
```

After you've played around with Typewriter a bit, you may find yourself wanting to execute a series of `typewriter.write()` commands in a specific order, for more granular control over the timing and speed of each section of text. 

Let's say you wanted to write "One Two Three Four", clearing the screen and cutting the typing speed in half for each word. You can do this...

```javascript
typewriter.write("One", 1, 250, function() {
	typewriter.clear(function() {
		typewriter.write("Two", 0.5, 250, function() {
			typewriter.clear(function() {
				typewriter.write("Three", 0.25, 250, function() {
					typewriter.clear(function() {
						typewriter.write("Four", 0.125);
					});
				});
			})
		});
	});
});
```

Which is very hard to read. Or, you can do this!

```javascript
typewriter.chain([
	"[write, 1, 250] One",
	"[clear]",
	"[write, 0.5, 250] Two",
	"[clear]",
	"[write, 0.25, 250] Three",
	"[clear]",
	"[write, 0.125] Four"
])
```

Which does exactly the same thing, but this time you can easily read it. The parameters go in the same order in brackets, except now the function is specified first and the text comes after the brackets.

Have fun!
