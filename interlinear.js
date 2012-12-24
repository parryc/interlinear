//Show with default settings
//Add configure method
//and then method for redisplaying the glosses.
(function (root){
	
	//default options
	var options = {
				defaultSelector: ".gloss",
				showFormattingErrors: false,
				useSmallCaps: true,
				useFakeSmallCaps: false
			};
		//raw = document.querySelectorAll(".gloss");
	function gloss(){
		return {
			options: options,
			raw: {},
			layout: function(line){
				var preformatArray = line.split(/\s+(?!\/)/).filter(function (d) { return (d !== ""); });

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
					if(opts.hasOwnProperty(prop))
						this.options[prop] = opts[prop];
				}
				this.setGloss();
			},
			setGloss: function(){
				var selector = this.options.defaultSelector,
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
					var lines = glosses[i].innerHTML.trim().split(/<br\/?>/),
						wordlines =  equalizeArrayLength(lines.map(this.layout)),
						wordzips = zipn(wordlines),
						output = "";


					for(var j = 0; j < wordzips.length; j++){
						var formattedGloss = "<div class=\"gloss-segment\">";
						for(var k = 0; k < wordzips[j].length; k++){
							if(!wordzips[j][k] && options.showFormattingErrors)
								formattedGloss += "<span class=\"gloss-error\">Error</span><br/>";
							else
								formattedGloss += wordzips[j][k]+"<br/>";
						}
						
						formattedGloss += "</div>";
						output += formattedGloss;
					}

					glosses[i].innerHTML = output;

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
})(this);