//Show with default settings
//Add configure method
//and then method for redisplaying the glosses.
(function (root){
	
	//default options
	var options = {
				numberGlosses: true,
				prettyMergedColumns: true,
				rowClasses: {1: 'source', 2: 'morphemes', 3: 'translation', 4: 'translation'},
				selector: ".gloss",
				showFormattingErrors: false,
				syntheticLanguage: false,
				useSmallCaps: true,
				useFakeSmallCaps: false
			};
		//hideQuotes - quotes are needed for the leipzig rules
		//syntheticLanguage - auto makes second line a full line, since the wordIdx isn't going to have spaces
			//could also add option to align based on hyphens. 


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
				//matches wordIdxs in double quotes or single quotes (ignoring single quotes that are used in contractions etc.)
				//no support for single quotes that're part of wordIdxs but have a bounding space, e.g. the students' )
				//
				//it also matches full lines with a ! in front as one full match.
				//
				//if there's a double quote and then a single end quote, ignore the single end quote and keep going to 
				// the double quote at the end.
				var preformatArray = line.match(/(!\s)?("|'((?!\s)|^)).+?("|(?=').*?"|'((?=\s)|$))|[^\s]+/g);
				console.log(preformatArray);
				// var breaks = line.split(/\s+(?!\/)/).filter(function (d) { return (d !== ""); });
				// //My regex fu isn't good enough to split and preserve wordIdxs in quotes so
				// //I'm just going to go through and merge wordIdxs
				
				// var lookingFor = "",
				// 	current = "",
				// 	preformatArray = [],
				// 	merging = false;
				// for (var i = 0; i < breaks.length; i++) {
				// 	var first = breaks[i].slice(0,1),
				// 		last = breaks[i].slice(breaks[i].length-1);

				// 	if(!merging){
				// 		if(first === "\"" || first === "'"){
				// 			lookingFor = first;
				// 			current += breaks[i];
				// 			merging = true;
				// 		} else
				// 			preformatArray.push(breaks[i]);
				// 	} else {
				// 		current += " "+breaks[i];
				// 		if(last === lookingFor){
				// 			merging = false;
				// 			preformatArray.push(current);
				// 			current = "";
				// 		}

						
				// 	}

				// }
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
					var lines = glosses[i].innerHTML.trim().split(/<br\/?>/);

					//Synthetic languages generally don't align well (since there are so few spaces)
					//If the option is set, make the second line a full length line.
					// This is a bad way of doing it... heh
					// if(options.syntheticLanguage)
					// 	lines[1] = '! "'+lines+'"';

					var	wordIdxlines =  equalizeArrayLength(lines.map(this.layout)),
						wordzips = zipn(wordIdxlines),
						output = "",
						fullLength = [],
						fullLengthOutput = "",
						skipRow = [];

					console.log(wordzips);

					if(options.numberGlosses)
						output = "<div class=\"gloss-segment gloss-label\"><a href=\"#gloss"+(i+1)+"\">("+(i+1)+")</a></div>";

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
							currentColumn = wordzips[col];




						if(wordzips[col].indexOf("xx") > -1 && options.prettyMergedColumns)
							formattedGloss = "<div class=\"gloss-segment gloss-merged\">";
						else
							formattedGloss = "<div class=\"gloss-segment\">";

						for(var wordIdx = 0; wordIdx < currentColumn.length; wordIdx++){
							if(skipRow && skipRow.indexOf(wordIdx) > -1)
								continue;

							if(!currentColumn[wordIdx] && options.showFormattingErrors)
								formattedGloss += "<span class=\"gloss-error\">Error</span><br/>";
							else if(currentColumn[wordIdx] === "xx")
								formattedGloss += "&nbsp;";
							else if(currentColumn[wordIdx].charAt(0) === '!' ||
									(options.syntheticLanguage && wordIdx === 1)) {
								if(currentColumn[wordIdx].charAt(0) === '!')
									fullLength.push(currentColumn[wordIdx].substring(1).trim());
								else
									fullLength.push(currentColumn[wordIdx]);
								skipRow.push(wordIdx);
							} else {
								formattedGloss += "<span class=\"gloss-row"+wordIdx+" "+options.rowClasses[wordIdx+1]+"\">"+currentColumn[wordIdx]+"</span>";
								if(wordIdx !== currentColumn.length-1)
									formattedGloss += "<br/>";
							}
						}
						
						formattedGloss += "</div>";
						output += formattedGloss;
					}


					if(fullLength){
						//Number of BRs for the previous rows
						var numBreaks = lines.length-fullLength.length+1;
						fullLengthOutput = (new Array(numBreaks)).join("<br/>");
						for (var row = 0; row < fullLength.length; row++) {
							fullLengthOutput += "<div class=\"gloss-row gloss-full "+options.rowClasses[lines.length]+"\">"+fullLength[row]+"</div>";
						}
					}

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
		return string.replace(/\*(\S+)\*/g, '<span class="morpheme">$1</span>');
	}
	function setFakeSmallCaps (string) {
		return string.replace(/\*(\S+)\*/g, '<span class="morpheme-fake-caps">$1</span>');
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


	//export to window
	root.gloss = gloss();
	root.gloss.setGloss();
})(this);
