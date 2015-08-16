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

function getSelectedLayersIdx () {
  var selectedLayerIndexArray = [];
  var ref0 = new ActionReference();
  ref0.putEnumerated( charIDToTypeID( "Dcmn" ), charIDToTypeID( "Ordn" ), charIDToTypeID( "Trgt" ) );

  var desc0 = executeActionGet( ref0 );
  if (desc0.hasKey( stringIDToTypeID( 'targetLayers' ) )) {
    desc0 = desc0.getList( stringIDToTypeID( 'targetLayers' ) );
    var count = desc0.count;
    selectedLayerIndexArray = [];
    for (var i = 0; i < count; i++) {
      if (hasBackgroundLayer()) {
        selectedLayerIndexArray.push( desc0.getReference( i ).getIndex() );
      } else {
        selectedLayerIndexArray.push( desc0.getReference( i ).getIndex() + 1 );
      }
    }
  } else {
    var ref1 = new ActionReference();
    ref1.putProperty( charIDToTypeID( "Prpr" ), charIDToTypeID( "ItmI" ) );
    ref1.putEnumerated( charIDToTypeID( "Lyr " ), charIDToTypeID( "Ordn" ), charIDToTypeID( "Trgt" ) );
    if (hasBackgroundLayer()) {
      selectedLayerIndexArray.push( executeActionGet( ref1 ).getInteger( charIDToTypeID( "ItmI" ) ) - 1 );
    } else {
      selectedLayerIndexArray.push( executeActionGet( ref1 ).getInteger( charIDToTypeID( "ItmI" ) ) );
    }
    var vis = app.activeDocument.activeLayer.visible;
    if (vis == true) {
      app.activeDocument.activeLayer.visible = false;
    }
    var desc2 = new ActionDescriptor();
    var list2 = new ActionList();
    var ref2 = new ActionReference();
    ref2.putEnumerated( stringIDToTypeID( 'layer' ), stringIDToTypeID( 'ordinal' ), stringIDToTypeID( 'targetEnum' ) );
    list2.putReference( ref2 );
    desc2.putList( charIDToTypeID( 'null' ), list2 );
    executeAction( charIDToTypeID( 'Shw ' ), desc2, DialogModes.NO );
    if (app.activeDocument.activeLayer.visible == false) {
      selectedLayerIndexArray.shift();
    }
    app.activeDocument.activeLayer.visible = vis;
  }
  return selectedLayerIndexArray;
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

/**
 * check for background layer
 * returns {boolean}
 */
function hasBackgroundLayer () {
  try {
    //noinspection BadExpressionStatementJS
    app.activeDocument.backgroundLayer;
    return true;
  } catch (e) {
    return false;
  }
}

function deselectAllLayers () {
  var desc = new ActionDescriptor();
  var ref = new ActionReference();
  ref.putEnumerated( stringIDToTypeID( 'layer' ), stringIDToTypeID( 'ordinal' ), stringIDToTypeID( 'targetEnum' ) );
  desc.putReference( stringIDToTypeID( 'target' ), ref );
  executeAction( stringIDToTypeID( 'selectNoLayers' ), desc, DialogModes.NO );
}