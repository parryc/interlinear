# Interlinear

Word-aligned interlinear glosses for the web, with the help of JavaScript and CSS.

## How to use

In your header add ```<link rel="stylesheet" type="text/css" href="interlinear.css"/>``` and at the bottom of the page add ```<script type="text/javascript" src="interlinear.js"></script>```.  This is to make sure that the document has been fully loaded before automatically formatting the text. 

If you want to call it explicitly, there is a variable ```gloss``` that controls everything (like jQuery). 

* Calling the layout function: ```gloss.setGloss()```
* Reconfiguring (calls ```setGloss()``` automatically) is done by passing in any options you want to change to the configure function ```gloss.configure({ ... options ... })```

## Options

* ```selector: ".gloss"``` The class selector for encapsulating divs
* ```showFormattingErrors: false``` Show if there are any blanks in the alignment 
* ```useSmallCaps: true``` Use small caps for morphemes.  This is done by ```*morpeme name*```, e.g. ```*nom*``` (must be lowercase)
* ```useFakeSmallCaps: false``` If your font has bad kerning for small caps, enable this.

##TODO

* Somethings (e.g. querySelectorAll) may not be totally backwards compatible? 
* Add support for tooltips (such as with bootstrap)
* Add support for tagging languages

## From

See [this Speechlike blog post](http://www.speechlike.org/2012/12/interlinear-glossing-with-javascript-and-css/).