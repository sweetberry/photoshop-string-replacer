// thanks to mike hale and paul mr;
// 2013, use it at your own risk;
////////////////////////////////////
function getSelectedLayers () {
  var theLayers = getSelectedLayersIdx();
  var res = [];
  for (var p = 0; p < theLayers.length; p++) {
    selectLayerByIndex( theLayers[p], false );
    res.push( app.activeDocument.activeLayer );
  }
  for (var q = 0; q < theLayers.length; q++) {
    selectLayerByIndex( theLayers[q], true );
  }
  return res;
}
// by mike hale, via paul riggott;
// http://forums.adobe.com/message/1944754#1944754
function selectLayerByIndex ( index, add ) {
  add = undefined ? add = false : add;
  var ref = new ActionReference();
  ref.putIndex( charIDToTypeID( "Lyr " ), index );
  var desc = new ActionDescriptor();
  desc.putReference( charIDToTypeID( "null" ), ref );
  if (add) {
    desc.putEnumerated( stringIDToTypeID( "selectionModifier" ), stringIDToTypeID( "selectionModifierType" ), stringIDToTypeID( "addToSelection" ) );
  }
  desc.putBoolean( charIDToTypeID( "MkVs" ), false );
  try {
    executeAction( charIDToTypeID( "slct" ), desc, DialogModes.NO );
  } catch (e) {
    alert( e.message );
  }
}
function getSelectedLayersIdx(){
  var selectedLayers = [];
  var ref = new ActionReference();
  ref.putEnumerated( charIDToTypeID("Dcmn"), charIDToTypeID("Ordn"), charIDToTypeID("Trgt") );
  var desc = executeActionGet(ref);
  if( desc.hasKey( stringIDToTypeID( 'targetLayers' ) ) ){
    desc = desc.getList( stringIDToTypeID( 'targetLayers' ));
    var c = desc.count;
    selectedLayers = [];
    for(var i=0;i<c;i++){
      try{
        app.activeDocument.backgroundLayer;
        selectedLayers.push(  desc.getReference( i ).getIndex() );
      }catch(e){
        selectedLayers.push(  desc.getReference( i ).getIndex()+1 );
      }
    }
  }else{
    ref = new ActionReference();
    ref.putProperty( charIDToTypeID("Prpr") , charIDToTypeID( "ItmI" ));
    ref.putEnumerated( charIDToTypeID("Lyr "), charIDToTypeID("Ordn"), charIDToTypeID("Trgt") );
    try{
      app.activeDocument.backgroundLayer;
      selectedLayers.push( executeActionGet(ref).getInteger(charIDToTypeID( "ItmI" ))-1);
    }catch(e){
      selectedLayers.push( executeActionGet(ref).getInteger(charIDToTypeID( "ItmI" )));
    }
    var vis = app.activeDocument.activeLayer.visible;
    if(vis == true) app.activeDocument.activeLayer.visible = false;
    var desc9 = new ActionDescriptor();
    var list9 = new ActionList();
    var ref9 = new ActionReference();
    ref9.putEnumerated( charIDToTypeID('Lyr '), charIDToTypeID('Ordn'), charIDToTypeID('Trgt') );
    list9.putReference( ref9 );
    desc9.putList( charIDToTypeID('null'), list9 );
    executeAction( charIDToTypeID('Shw '), desc9, DialogModes.NO );
    if(app.activeDocument.activeLayer.visible == false) selectedLayers.shift();
    app.activeDocument.activeLayer.visible = vis;
  }
  return selectedLayers;
}

function getAllLayers () {
  var res = [];
  pushLayersRecurred( app.activeDocument, res );
  return res;
}

function pushLayersRecurred ( laySet, array ) {
  var layersLength = laySet.layers.length;
  for (var i = 0; i < layersLength; i++) {
    var targetLayer = laySet.layers[i];
    array.push( targetLayer );
    if (targetLayer.typename == 'LayerSet') {
      pushLayersRecurred( targetLayer, array );
    }
  }
}

function isMacOS () {
  return $.os.indexOf( "Mac" ) !== -1;
}