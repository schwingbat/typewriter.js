# Typewriter.js

I'm not actually sure why I made this. It seemed like a good idea at 3 AM, and it's kind of... neat. I've literally never used it for anything. Hopefully someone finds it useful to annoy people and make them wait to read some text. :)

## Getting Started

First, you'll want to include Typewriter on your page and initialize it with your settings. The only one you really have to specify is `el`, which is the selector for an element that the text should be printed to.

```html
<script src="typewriter.js"></script>

<script>
var writer = new Typewriter({
  speed: 1 // the base speed
  el: '#typewriter' // the element you want to print to
});
</script>
```

## How It Works

Once you've created an instance, you can chain methods on it like so:

```javascript
writer
  .write('Hello')
  .wait(2)
  .write(' ')
  .wait(1)
  .speed(0.5)
  .write('world!')
  .wait(5)
  .clear();
```

## Methods

All available methods are listed below. They can be chained in any order, so knock yourself out!

### `write(text)`

Writes the provided string character-by-character at the current speed.

### `backspace(length)`

Deletes the specified number of characters character-by-character at the current speed.

Also, pro tip: If you want to delete a particular bit of text, do this:
```javascript
writer.write('This is some text that should be deleted.');
writer.backspace('text that should be deleted'.length);
writer.write('NEW AND IMPROVED TEXT!');
```

The final text will, as you might expect, be: `This is some NEW AND IMPROVED TEXT!`.

### `wait(seconds)` or `pause(seconds)`

Pauses for a given number of seconds before running the next function.

### `clear()`

Clears all text content from the `el` element.

### `speed(number)`

Sets the speed of all following calls to `write`. Higher numbers are faster. Default is `1`. A value of `0` will cause `write`s to print instantly.

### `break(count)` or `newline(count)`

Inserts a specified number of line breaks. Equivalent to `.write('\n')`, but it looks better. If no `count` is given it'll default to `1`.