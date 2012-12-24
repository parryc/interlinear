# interlinear

Word-aligned interlinear glosses for the web, with the help of JavaScript and CSS.

## Options

* ```defaultSelector: ".gloss"``` The default class for encapsulating divs
* ```showFormattingErrors: false``` Show if there are any blanks in the alignment 
* ```useSmallCaps: true``` Use small caps for morphemes.  This is done by ```*morpeme*```, e.g. ```*nom*```
* ```useFakeSmallCaps: false``` If your font has bad kerning for small caps, enable this.

##TODO

* Somethings (e.g. querySelectorAll) may not be totally backwards compatible? 
* Add support for tooltips (such as with bootstrap)
* Add support for tagging languages

## From

See [this Speechlike blog post](http://www.speechlike.org/2012/12/interlinear-glossing-with-javascript-and-css/).