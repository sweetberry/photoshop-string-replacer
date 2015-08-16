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