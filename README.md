# Typewriter.js

## Getting Started

```
typewriter.write(text, speed, wait time[, callback ]);
```

### Parameters

_**text**_<br>
A string containing the text you want to print.
	
_**speed**_<br>
A number representing the speed you want Typewriter to type the text. Default is 1. Setting speed to 0 will print your text immediately, skipping the typing effect. Higher numbers print faster while lower numbers print slower.

_**wait time**_<br>
Milliseconds to wait before executing the callback. Useful if you want to pause for dramatic effect or wait for a time before clearing the screen, for example.

_**callback**_<br>
_Optional._ A function to execute after the text is done being written. This can be another typewriter.write() or typewriter.clear() for example.


### All Together Now

```
typewriter.write("Hello World!", 0.5, 500, function() {
	console.log("Printed Hello World!");
});
```

The code above will print "Hello World!" at half the default speed, then wait half a second before logging "Printed Hello World!" to the console. Easy, right? Of course the `console.log` and delay are unnecessary, so it would probably look more like this on a real website;

```
typewriter.write("Hello World!", 0.5);
```

After you've played around with Typewriter a bit, you will probably find yourself wanting to execute a series of `typewriter.write()` commands in a specific order, for more granular control over the timing and speed of each section of text. 

Let's say you wanted to write "One Two Three Four", clearing the screen and cutting the typing speed in half for each word. You could do

```
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

It's not an optimal solution, but I'm pretty new at JavaScript and I'm still getting the hang of asynchronous functions. If you know of a simple enough way to get that under control, submit a pull request!

