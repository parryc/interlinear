//Show with default settings
//Add configure method
//and then method for redisplaying the glosses.
(function (root){
	
	//default options
	var options = {
				citationClass: 'citation',
				numberGlosses: true,
				prettyMergedColumns: true,
				rowClasses: {1: 'source', 2: 'morphemes', 3: 'translation', 4: 'translation'},
				selector: ".gloss",
				showFormattingErrors: false,
				syntheticLanguage: false,
				useSmallCaps: true,
				useFakeSmallCaps: false
			};

	//Because goddammit IE.
	if(!Array.prototype.indexOf) {
		Array.prototype.indexOf = function(needle) {
			for(var i = 0; i < this.length; i++) {
				if(this[i] === needle) {
					return i;
				}
			}
			return -1;
		};
	}

	function gloss(){
		return {
			options: options,
			raw: {},
			layout: function(line){
				/*
					This regex matches in this priority: 
						1. Words grouped by double quotes "
						2. Words groupd by single quotes ' (this includes a word medial single quotes. so 'you're cute' would
							match the entire string)
						3. Single words

						** If there is a ! in front of the line, it will match the whole line if the rest of the phrase
							is surrounded by quotes of some sort. This is used for pulling out full lines. 

					The regex:
						(!\s)? -- include a ![space] at the front
						("|'((?!\s)|^)) -- match a double quote, or a single quote that is proceeded by a space, or beg. of line
						.+? -- any character, non-greedy
						("|(?=').*?"|'((?=\s)|$)) -- double quote, a double quote even if there is a single quote in there, 
														a single quote followed by a space, end of line
						|[^\s]+  -- or characters that aren't spaces (e.g. a single word)

				*/

				var preformatArray = line.match(/(!\s)?("|'((?!\s)|^)).+?("|(?=').*?"|'((?=\s)|$))|[^\s]+/g);
				
				if(options.useSmallCaps){
					if(options.useFakeSmallCaps)
						preformatArray = preformatArray.map(setFakeSmallCaps);
					else
						preformatArray = preformatArray.map(setSmallCaps);
				}

				return preformatArray;
			},
			configure: function(opts){
				for(var prop in opts){
					if(opts.hasOwnProperty(prop)) {
						//Don't overwrite default associations
						if(prop === 'rowClasses') {
							for(var row in opts[prop]){
								this.options[prop][row] = opts[prop][row];
							}
						} else
							this.options[prop] = opts[prop];
					}
				}
				this.setGloss();
			},
			setGloss: function(){
				var selector = this.options.selector,
					glosses = document.querySelectorAll(selector);


				//Checks if there is saved raw data.  If there is, it restores it (in case of on the fly configurations)
				//Otherwise, if it doesn't exist, it saves the raw data before manipulating it.
				if(this.raw[selector]){
					for(var g = 0; g < this.raw[selector].length; g++)
						glosses[g].innerHTML = this.raw[selector][g];
				} else {
					var rawArr = [];
					for(var pos = glosses.length; pos--; rawArr.unshift(glosses[pos].innerHTML));
					if(!this.raw[selector])
						this.raw[selector] = rawArr;
				}

				//Go through every div marked with the default selector
				for(var i = 0; i < glosses.length; i++){
					var lines            = glosses[i].innerHTML.trim().split(/<br\/?>/)
						 ,hasTitle         = glosses[i].dataset.title !== "0"
						 ,isSynthetic      = (glosses[i].dataset.synthetic === "1" || options.syntheticLanguage)
						 ,output           = ""
						 ,fullLength       = []
						 ,fullLengthOutput = ""
						 ,skipRow          = []
						 ,wordIdxlines
						 ,wordzips
						 ;

					if(hasTitle) {
						title = "<div class=\"gloss-row gloss-full "+options.citationClass+"\">"+lines[0]+"</div>";
						lines = lines.slice(1)
					} else {
						title = "";
					}

					wordIdxlines =  equalizeArrayLength(lines.map(this.layout));
					wordzips = zipn(wordIdxlines);

					console.log(wordzips);

					if(options.numberGlosses) {
						output = "<div class=\"gloss-segment gloss-label\"><a href=\"#gloss"+(i+1)+"\">("+(i+1)+")</a></div>";
					}
					
					output += "<title>";

					/*
						Wordzips: 

						My s Marko
						1PL COM Marko
						We with Marko

						Becomes an array of the columns
						[ 
							[My, 1PL, We],
							[s, COM, with],
							[Marko, Marko, Marko]
						]
					*/

					//reset skipRow for current gloss
					//skipRow is used to mark the row that is not split into columns
					skipRow = [];

					for(var col = 0; col < wordzips.length; col++){
						console.log(col);
						var formattedGloss = "",
							currentColumn = wordzips[col],
							firstChar = "";


						if(wordzips[col].indexOf("xx") > -1 && options.prettyMergedColumns)
							formattedGloss = "<div class=\"gloss-segment gloss-merged\">";
						else
							formattedGloss = "<div class=\"gloss-segment\">";

						for(var wordIdx = 0; wordIdx < currentColumn.length; wordIdx++){
							if(skipRow && skipRow.indexOf(wordIdx) > -1)
								continue;

							firstChar = currentColumn[wordIdx].charAt(0);

							if(!currentColumn[wordIdx] && options.showFormattingErrors)
								formattedGloss += "<span class=\"gloss-error\">Error</span><br/>";
							else if(currentColumn[wordIdx] === "xx")
								formattedGloss += "&nbsp;";
							else if(firstChar === '!' || (isSynthetic && wordIdx === 1)) {
								if(firstChar === '!')
									fullLength.push(currentColumn[wordIdx].substring(1).trim());
								else if(isSynthetic && wordIdx === 1) {
									//Merge all of the columns into one full length row
									temp = "";
									for (var t = 0; t < wordzips.length; t++) {
											temp += printWord(1, wordzips[t][1], options);
										}
									fullLength.push(temp);
								} else
									fullLength.push(currentColumn[wordIdx]);
								skipRow.push(wordIdx);
							} else {
								formattedGloss += printWord(wordIdx, currentColumn[wordIdx], options);
								if(wordIdx !== currentColumn.length-1)
									formattedGloss += "<br/>";
							}
						}
						
						formattedGloss += "</div>";
						output += formattedGloss;
					}


					if(fullLength){
						//Number of BRs for the previous rows
						var numBreaks = lines.length-fullLength.length+1
							 ,row       = 0
							 ,hasTitle  = (glosses[i].dataset.title !== "0")
							 ,titleText = ""
						   ;

						fullLengthOutput = (new Array(numBreaks)).join("<br/>");
						for (row; row < fullLength.length; row++) {
							fullLengthOutput += "<div class=\"gloss-row gloss-full "+options.rowClasses[lines.length]+"\">"+fullLength[row]+"</div>";
						}
					}

					output = output.replace('<title>',title);
					glosses[i].innerHTML = output+fullLengthOutput;

					//Don't duplicate on reconfiguration
					if(glosses[i].className.indexOf("formatted-gloss") === -1)
						glosses[i].className += " formatted-gloss";

					//Add a clearfix after each gloss, since they might be interspersed within text
					var cf = document.createElement("div");
					cf.className = "clearfix";
					glosses[i].appendChild(cf);

				}
			}
		};
	}


	/*
		n-ary `zip` function. Takes an array of arrays and returns
		the result of "aligning" their contents.

		e.g. `zipn([[1,2,3], ["a","b","c"]]) => [[1,"a"],[2,"b"],[3,"c"]]`

		This is an improvement over the jQuery `zip` function, which is binary
		and therefore too limited for present needs.
	*/
	function zipn (xss) {
		var zipped = [];
		for (var k = 0; k < xss[0].length; k++) {
			zipped[k] = [];
		}
		for (var i = 0; i < xss[0].length; i++) {
			for (var j = 0; j < xss.length; j++) {
				zipped[i] = zipped[i].concat(xss[j][i]);
			}
		}
		return zipped;
	}

	/*
		Auxiliary functions to strip meta-characters from text.
	*/
	function fixSpaces (string) {
		return string.replace(/\//g, "");
	}
	function setSmallCaps (string) {
		return string.replace(/\*(\S+?)\*/g, '<span class="morpheme">$1</span>');
	}
	function setFakeSmallCaps (string) {
		return string.replace(/\*(\S+?)\*/g, '<span class="morpheme-fake-caps">$1</span>');
	}
	/*
		Find longest line length and equalize all to that length
	*/
	function equalizeArrayLength(arrays){
		var max = 0;
		for (var i = arrays.length - 1; i >= 0; i--) {
			if(arrays[i].length > max)
				max = arrays[i].length;
		}

		for (var j = arrays.length - 1; j >= 0; j--) {
			if(arrays[j].length < max){
				while(arrays[j].length < max){
					arrays[j].push('');
				}
			}
		}

		return arrays;
	}

	function printWord(idx, word, options) {
		return "<span class=\"gloss-row"+idx+" "+options.rowClasses[idx+1]+"\">"+word+"</span>";
	}


	//export to window
	root.gloss = gloss();
	root.gloss.setGloss();
})(this);
