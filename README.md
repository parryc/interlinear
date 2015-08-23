# Interlinear

Word-aligned interlinear glosses for the web, with the help of JavaScript and CSS.

## How to use

In your header add ```<link rel="stylesheet" type="text/css" href="interlinear.css"/>``` and at the bottom of the page add ```<script type="text/javascript" src="interlinear.js"></script>```.  This is to make sure that the document has been fully loaded before automatically formatting the text. 

If you want to call it explicitly, there is a variable ```gloss``` that controls everything (like jQuery). 

* Calling the layout function: ```gloss.setGloss()```
* Reconfiguring (calls ```setGloss()``` automatically) is done by passing in any options you want to change to the configure function ```gloss.configure({ ... options ... })```

Within the body of your webpage it's pretty simple. Within the gloss div, just make sure each line is delineated by a ```<br/>``` tag.

```html
<div class="gloss">
	ཟིང་འཁྲུགས་ ལང་མདོག་ ཁ་པོ་ རེད་<br/>
	zing-'khrugs lang-mdog kha-po red<br/>
	unrest arise-*nom* likely-*nom* be
</div>
```

If you change the class name, make sure to reconfigure ```gloss```. 

## Options

* Full width row: If you want a row to ignore all spacing (e.g. like a label for the gloss), include a ```! ``` in front of the text. Multiple translation rows can be added at the end (e.g. if you need translations in two languages).

```html
<div class="gloss">
	nanggayan guny-bi-yarluga?<br/>
	who *2DU.A.3SG.P-FUT*-poke<br/>
	! 'Who do you two want to spear?'
</div>
```

* ```numberGlosses: true``` Labels all glosses with a number and link. You can reference the gloss with ```#glossNUMBER```.
* ```prettyMergedColumns: true``` If you want columns to merge with styling (there is some default styling).  To mark a column to be merged include ```xx``` in the space that you want to be blank. For example 

```html
<div class="gloss">
	aux chevaux<br/>
	to.*art.pl* horse.*pl*<br/>
	'to the horses' xx
</div>
```
Note: You can also see that placing glosses in quotes will keep them to one morpheme

* ```rowClasses: {1: 'source', 2: 'morphemes', 3: 'translation'}``` These are default class names for rows 1-3.  There is some initial styling and they can be overwritten as needed.
* ```selector: ".gloss"``` The class selector for encapsulating divs
* ```syntheticLanguage: false``` The nature of synthetic languages makes good looking column alignment rare. Flip this switch to ignore column splis for the gloss row. This applies to every gloss. For single glosses, add the data element ```data-synthetic = "1"```.

```html
<div class="gloss" data-synthetic="1">
	ingin-nia-ritsi=guuq<br/>
	sit-down try *2p-imp.quote*<br/>
	! "I was told to say 'sit down' to you"<br/>
	! "From Fortescue (1984)"
</div>
```

* ```showFormattingErrors: false``` Show if there are any blanks in the alignment 
* ```useSmallCaps: true``` Use small caps for morphemes.  This is done by ```*morpeme name*```, e.g. ```*nom*```
* ```useFakeSmallCaps: false``` If your font has bad kerning for small caps, enable this.

## From

See [this Speechlike blog post](http://www.speechlike.org/2012/12/interlinear-glossing-with-javascript-and-css/).  Additional ideas from the [Leipzig glossing rules](http://www.eva.mpg.de/lingua/resources/glossing-rules.php)

## TODO

* Support for (cf. xyz) in translation and title lines
* Support for singular line class reassignment (see Leipzing #5)
* Sub-numbering, ex. 5a, 5b
* Remove requirement for 's in non-breaking lines
* Support for infixes (replace </> with html codes)
* Better looking CSS for numbers next to small-caps

## License

[MIT](http://parryc.mit-license.org/)
