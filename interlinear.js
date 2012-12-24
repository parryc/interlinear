//Show with default settings
//Add configure method
//and then method for redisplaying the glosses.
(function (root){
	
	//default options
	var options = {
				defaultSelector: ".gloss",
				showFormattingErrors: true,
				useSmallCaps: true,
				useCharosSmallCaps: false,
				useCustomSmallCaps: false,
				customSmallCapsName: ""
			},
		raw = document.querySelectorAll(".gloss");
	function gloss(){
		return {
			options: options,
			layout: function(line){
				var preformatArray = line.split(/\s+(?!\/)/).filter(function (d) { return (d !== ""); });

				if(options.useSmallCaps)
					preformatArray = preformatArray.map(setSmallCaps);


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
				var glosses = document.querySelectorAll(this.options.defaultSelector);
				/*
					TODO: convert first grabbing of glosses to array list to store as raw data
					then go through, that way configurations can be added on the fly
					// nl is the nodelist
					var arr = [];
					for(var i = nl.length; i--; arr.unshift(nl[i]));

				*/
				//if(!this.raw)
				//	this.raw = glosses;

				//Go through every div marked with the default selector
				for(var i = 0; i < glosses.length; i++){
					var lines = glosses[i].innerHTML.trim().split(/<br\/?>/),
						wordlines =  equalizeArrayLength(lines.map(this.layout)),
						wordzips = zipn(wordlines),
						output = "";
					console.log(wordlines);

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
					console.log(output);
					glosses[i].innerHTML = output;
					glosses[i].className += " formatted-gloss";
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