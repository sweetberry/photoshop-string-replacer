//     util_js.js 0.0.1
//     (c) 2015 sweetberry studio.
//     Preference_photoshop may be freely distributed under the MIT license.


function escapeRegexpCharacter ( string ) {
  return string.replace( /([\\\^\$\*\+\?\.\(\)\[\]\{\}\|])/gm, '\\$1' );
}

function makeRegexpFromString ( string, isEscapeRegexpChar ) {
  try {
    var targetString = (isEscapeRegexpChar) ? string : escapeRegexpCharacter( string );
    return new RegExp( targetString, "gm" );
  } catch (e) {
    return null;
  }
}