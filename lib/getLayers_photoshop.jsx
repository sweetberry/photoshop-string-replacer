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
  var desc = executeActionGet( _getActiveDocumentActionReference() );
  if (desc.hasKey( stringIDToTypeID( 'targetLayers' ) )) {
    desc = desc.getList( stringIDToTypeID( 'targetLayers' ) );
    var count = desc.count;
    selectedLayerIndexArray = [];
    for (var i = 0; i < count; i++) {
      if (hasBackgroundLayer()) {
        selectedLayerIndexArray.push( desc.getReference( i ).getIndex() );
      } else {
        selectedLayerIndexArray.push( desc.getReference( i ).getIndex() + 1 );
      }
    }
  } else {
    var ref = new ActionReference();
    ref.putProperty( charIDToTypeID( "Prpr" ), charIDToTypeID( "ItmI" ) );
    ref.putEnumerated( charIDToTypeID( "Lyr " ), charIDToTypeID( "Ordn" ), charIDToTypeID( "Trgt" ) );
    if (hasBackgroundLayer()) {
      selectedLayerIndexArray.push( executeActionGet( ref ).getInteger( charIDToTypeID( "ItmI" ) ) - 1 );
    } else {
      selectedLayerIndexArray.push( executeActionGet( ref ).getInteger( charIDToTypeID( "ItmI" ) ) );
    }
    var vis = app.activeDocument.activeLayer.visible;
    if (vis == true) {
      app.activeDocument.activeLayer.visible = false;
    }
    var desc2 = new ActionDescriptor();
    var list = new ActionList();
    list.putReference( _getAllLayersActionReference() );
    desc2.putList( charIDToTypeID( 'null' ), list );
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

function pushLayersRecurred ( layerSet, array ) {
  var layersLength = layerSet.layers.length;
  for (var i = 0; i < layersLength; i++) {
    var targetLayer = layerSet.layers[i];
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
  desc.putReference( stringIDToTypeID( 'target' ), _getAllLayersActionReference() );
  executeAction( stringIDToTypeID( 'selectNoLayers' ), desc, DialogModes.NO );
}

function _getActiveDocumentActionReference () {
  var ref = new ActionReference();
  ref.putEnumerated( charIDToTypeID( "Dcmn" ), charIDToTypeID( "Ordn" ), charIDToTypeID( "Trgt" ) );
  return ref;
}

function _getAllLayersActionReference () {
  var ref = new ActionReference();
  ref.putEnumerated( stringIDToTypeID( 'layer' ), stringIDToTypeID( 'ordinal' ), stringIDToTypeID( 'targetEnum' ) );
  return ref;
}
