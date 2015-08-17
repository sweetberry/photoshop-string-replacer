//     util_photoshop.jsx 0.1.0
//     (c) 2015 sweetberry studio.
//     Preference_photoshop may be freely distributed under the MIT license.


//@include'../lib/underscore.js';

function getSelectedLayers () {
  var res = [];
  _.each( getSelectedLayerIndexes(), function ( index ) {
    selectLayerByIndex( index, false );
    res.push( app.activeDocument.activeLayer );
    selectLayerByIndex( index, true );
  } );
  return res;
}

function getAllLayers () {
  var res = [];
  pushLayersRecurred( app.activeDocument, res );
  return res;
}

function pushLayersRecurred ( layerSet, array ) {
  _.each( layerSet.layers, function ( targetLayer ) {
    array.push( targetLayer );
    if (targetLayer.typename == 'LayerSet') {
      pushLayersRecurred( targetLayer, array );
    }
  } );
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

function getSelectedLayerIndexes () {
  var selectedLayerIndexes = [];
  var ref0 = new ActionReference();
  ref0.putEnumerated( charIDToTypeID( "Dcmn" ), charIDToTypeID( "Ordn" ), charIDToTypeID( "Trgt" ) );

  var desc0 = executeActionGet( ref0 );
  if (desc0.hasKey( stringIDToTypeID( 'targetLayers' ) )) {
    desc0 = desc0.getList( stringIDToTypeID( 'targetLayers' ) );
    var count = desc0.count;
    selectedLayerIndexes = [];
    for (var i = 0; i < count; i++) {
      if (hasBackgroundLayer()) {
        selectedLayerIndexes.push( desc0.getReference( i ).getIndex() );
      } else {
        selectedLayerIndexes.push( desc0.getReference( i ).getIndex() + 1 );
      }
    }
  } else {
    var ref1 = new ActionReference();
    ref1.putProperty( charIDToTypeID( "Prpr" ), charIDToTypeID( "ItmI" ) );
    ref1.putEnumerated( charIDToTypeID( "Lyr " ), charIDToTypeID( "Ordn" ), charIDToTypeID( "Trgt" ) );
    if (hasBackgroundLayer()) {
      selectedLayerIndexes.push( executeActionGet( ref1 ).getInteger( charIDToTypeID( "ItmI" ) ) - 1 );
    } else {
      selectedLayerIndexes.push( executeActionGet( ref1 ).getInteger( charIDToTypeID( "ItmI" ) ) );
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
      selectedLayerIndexes.shift();
    }
    app.activeDocument.activeLayer.visible = vis;
  }
  return selectedLayerIndexes;
}

function deselectAllLayers () {
  var desc = new ActionDescriptor();
  var ref = new ActionReference();
  ref.putEnumerated( stringIDToTypeID( 'layer' ), stringIDToTypeID( 'ordinal' ), stringIDToTypeID( 'targetEnum' ) );
  desc.putReference( stringIDToTypeID( 'target' ), ref );
  executeAction( stringIDToTypeID( 'selectNoLayers' ), desc, DialogModes.NO );
}