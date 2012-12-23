/*
  n-ary `zip` function. Takes an array of arrays and returns
  the result of "aligning" their contents.

  e.g. `zipn([[1,2,3], ["a","b","c"]]) => [[1,"a"],[2,"b"],[3,"c"]]`

  This is an improvement over the jQuery `zip` function, which is binary
  and therefore too limited for present needs.
*/
function zipn (xss) {
  var zipped = [];
  for (var i = 0; i < xss[0].length; i++) {
    zipped[i] = [];
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
  The handler function for the contents of `align` objects.
*/
function gloss (text, lgname) {
  if (typeof(lgname) === "undefined") {
    lgname = "default";
  }
  var lines = text.split(/<br>/),
      wordlines = lines.map(function (d) {
        return d.split(/\s+(?!\/)/)
                .filter(function (d) { return (d != ""); })
                .map(fixSpaces)
                .map(setSmallCaps);
        }),
      wordzips = zipn(wordlines),
      glosses = wordzips.map(function (d) { return inLinedWord(d, lgname); }),
      joined = glosses.join(""),
      textStart = '<div class="interlinear"><div class="spacer">&nbsp;</div>',
      textEnd = '<div class="spacer">&nbsp;</div></div>',
      text = textStart + joined + textEnd;
  return text;
  
}

/*
  Takes a `zipn`-generated sequence of words and formats them for display
  as word-aligned glosses.
*/
function inLinedWord (words, lgname) { // n.b. takes an arbitrary number of arguments via `arguments`
  var front = words.slice(0,(words.length - 1)),
      last = words[(words.length - 1)],
      appended = front
                 .map(function (d, i) { return String(d) + 
                                               '</div><div class="under under' +
                                               String(i) + '">'; })
                 .join("");
  return '<div class="float"><div class="over language-' + lgname + '">' +
         appended + last +
         '</div></div>';
}

/*
  Waits until the document is loaded and then applies `gloss` to the contents of `aligned` elements.
*/
$(document).ready(function () {
  $(".aligned").each(function () {
    var text = $(this).html(),
        language = $(this).attr("language");
    $(this).html(gloss(text, language));
  });
});