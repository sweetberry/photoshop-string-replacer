﻿/* 2015.08.13 *///@include'../lib/underscore.js'//@include'../lib/json2.js'//@include'../lib/preference_photoshop.jsx'//@include'../lib/getLayers_photoshop.jsx'(function () {  var reports = [];  var message = {    TITLE: 'String replacer',    VERSION: 'v0.0.2',    AUTHOR: "pixel@sweetberry.com",    DESCRIPTION: localize( {en: "Supporting the replacement of string.\r\r", ja_JP: "文字列の置換支援。\r"} ),    NO_DOCUMENT: localize( {en: "Please open the document", ja_JP: "ドキュメントを開いてください"} ),    NO_ITEM: localize( {en: "Nothing is selected", ja_JP: "何も選択されていません"} ),    NO_RESULT: localize( {en: "No results found.", ja_JP: "結果が見つかりませんでした"} ),    SELECT_ALL_CONFIRM: localize( {en: "\rYou want to all items?", ja_JP: "\r全アイテムを対象としますか？"} )  };  var preference = new Preference( message.TITLE );  var myPalette = createUI();  myPalette.show();  myPalette.center();  function createUI () {    // palette    var myPalette;    myPalette = new Window( "dialog", message.TITLE, undefined, {resizeable: true} );    myPalette.onResizing = myPalette.onResize = function () {this.layout.resize();};    myPalette.orientation = "column";    myPalette.onShow = function () {      myPalette.minimumSize = myPalette.size;    };    var editDdListWidth = 220;    //makeHeader    myPalette.headerGrp = myPalette.add( 'group' );    myPalette.headerGrp.alignment = ["fill", "top"];    myPalette.headerLeftRow = myPalette.headerGrp.add( 'group {orientation:"column",alignment:["left","fill"]}' );    myPalette.headerRigthRow = myPalette.headerGrp.add( 'group {orientation:"column",alignment:["fill","fill"]}' );    myPalette.headerLeftRow.add( 'statictext {alignment:["right","fill"],text:"from:"}' );    myPalette.headerLeftRow.add( 'statictext {alignment:["right","fill"],text:"to:"}' );    myPalette.fromEditDdListGrp = myPalette.headerRigthRow.add( 'group {orientation:"stack",alignment:["fill","fill"],alignChildren:"left"}' );    var fromList, fromEText;    if (isMacOS()) {      fromEText = myPalette.fromEditDdListGrp.add( 'edittext' );    }    fromList = myPalette.fromEditDdListGrp.add( "dropdownlist", undefined, [] );    if (!isMacOS()) {      fromEText = myPalette.fromEditDdListGrp.add( 'edittext' );    }    fromList.minimumSize.width = editDdListWidth;    fromList.maximumSize.width = editDdListWidth;    fromEText.minimumSize.width = editDdListWidth - 20;    fromEText.maximumSize.width = editDdListWidth - 20;    myPalette.toEditDdListGrp = myPalette.headerRigthRow.add( 'group {orientation:"stack",alignment:["fill","fill"],alignChildren:"left"}' );    var toList, toEText;    if (isMacOS()) {      toEText = myPalette.toEditDdListGrp.add( 'edittext' );    }    toList = myPalette.toEditDdListGrp.add( "dropdownlist", undefined, [] );    if (!isMacOS()) {      toEText = myPalette.toEditDdListGrp.add( 'edittext' );    }    toList.minimumSize.width = editDdListWidth;    toList.maximumSize.width = editDdListWidth;    toEText.minimumSize.width = editDdListWidth - 20;    toEText.maximumSize.width = editDdListWidth - 20;    myPalette.midGrp = myPalette.add( 'group' );    myPalette.midGrp.orientation = "column";    myPalette.midGrp.alignment = ["fill", "top"];    myPalette.scopePnl = myPalette.midGrp.add( "panel", undefined, "scope" );    myPalette.scopePnl.alignment = ["fill", "top"];    myPalette.scopePnl.minimumSize.width = editDdListWidth + 40;    myPalette.scopeFirstRow = myPalette.scopePnl.add( 'group {orientation:"row",alignment:["fill","fill"]}' );    var layerCheck = myPalette.scopeFirstRow.add( 'checkbox {text:"Layer",alignment:["fill","fill"]}' );    var layerSetCheck = myPalette.scopeFirstRow.add( 'checkbox {text:"LayerSet",alignment:["fill","fill"]}' );    myPalette.scopeSecondRow = myPalette.scopePnl.add( 'group {orientation:"row",alignment:["fill","fill"]}' );    var layerSelOnlyCheck = myPalette.scopeSecondRow.add( 'checkbox {text:"Only selected layers",alignment:["fill","fill"]}' );    myPalette.scopeThirdRow = myPalette.scopePnl.add( 'group {orientation:"row",alignment:["fill","fill"]}' );    //var channelCheck = myPalette.scopeThirdRow.add( 'checkbox {text:"channel",alignment:["fill","fill"]}' );    //var pathCheck = myPalette.scopeThirdRow.add( 'checkbox {text:"path",alignment:["fill","fill"]}' );    myPalette.trgPnl = myPalette.midGrp.add( "panel", undefined, "target" );    myPalette.trgPnl.alignment = ["fill", "top"];    myPalette.trgFirstRow = myPalette.trgPnl.add( 'group {orientation:"row",alignment:["fill","fill"]}' );    var nameCheck = myPalette.nameCheck = myPalette.trgFirstRow.add( 'checkbox {text:"name",alignment:["fill","fill"]}' );    myPalette.trgSecondRow = myPalette.trgPnl.add( 'group {orientation:"row",alignment:["fill","fill"]}' );    var textCheck = myPalette.textCheck = myPalette.trgSecondRow.add( 'checkbox {text:"textSource",alignment:["fill","fill"]}' );    myPalette.trgThirdRow = myPalette.trgPnl.add( 'group {orientation:"row",alignment:["fill","fill"]}' );    var applyTextToLayerNameCheck = myPalette.applyTextToLayerNameCheck = myPalette.trgThirdRow.add( 'checkbox {text:"applyTextToLayerName",alignment:["fill","fill"]}' );    myPalette.footerGrp = myPalette.add( 'group {orientation:"row",alignment:["fill","fill"]}' );    myPalette.footerLeftGrp = myPalette.footerGrp.add( 'group {orientation:"column",alignment:["left","bottom"]}' );    var regexCheck = myPalette.footerLeftGrp.add( 'checkbox {text:"use RegExp",alignment:["left",""]}' );    var searchOnlyCheck = myPalette.footerLeftGrp.add( 'checkbox {text:"search only",alignment:["left",""]}' );    var aboutBtn = myPalette.footerLeftGrp.add( 'button {text:"About..."}' );    myPalette.footerRightGrp = myPalette.footerGrp.add( 'group {orientation:"column",alignment:["fill","fill"]}' );    myPalette.doPnl = myPalette.footerRightGrp.add( 'panel {alignment:["fill","fill"]}' );    var doBtn = myPalette.doPnl.add( 'button {text:"Do it!",alignment:["fill","fill"]}' );    myPalette.doPnl.minimumSize.width = 100;    //初期設定で初期化    layerCheck.value = preference.get( "layerCheck", true );    layerSetCheck.value = preference.get( "layerSetCheck", true );    layerSelOnlyCheck.value = preference.get( "layerSelOnlyCheck", true );    //channelCheck.value = preference.get( "channelCheck" );    //pathCheck.value = preference.get( "pathCheck" );    nameCheck.value = preference.get( "nameCheck", true );    textCheck.value = preference.get( "textCheck" );    applyTextToLayerNameCheck.value = preference.get( "applyTextToLayerNameCheck" );    regexCheck.value = preference.get( "regexCheck" );    searchOnlyCheck.value = preference.get( "searchOnlyCheck" );    fromEText.text = preference.get( "fromEText", "" );    toEText.text = preference.get( "toEText", "" );    setListItemFromText( toList, preference.get( "toList", [] ) );    setListItemFromText( fromList, preference.get( "fromList", [] ) );    //events    aboutBtn.onClick = function () {      alert( message.TITLE + ' ' + message.VERSION + '\r' + message.DESCRIPTION + '\r' + message.AUTHOR );    };    doBtn.onClick = function () {      updateDdList();      try {        app.activeDocument.suspendHistory( message.TITLE, "doMain()" );      } catch (e) {        alert( message.NO_DOCUMENT );      }    };    fromList.onChange = function () {      fromEText.text = fromList.selection.text;      fromEText.active = true;      fromList.selection.selected = false;    };    toList.onChange = function () {      toEText.text = toList.selection.text;      toEText.active = true;      toList.selection.selected = false;    };    layerCheck.onClick = function () {      preference.set( "layerCheck", this.value );      checkRefresh();    };    layerSetCheck.onClick = function () {      preference.set( "layerSetCheck", this.value );      checkRefresh();    };    layerSelOnlyCheck.onClick = function () {      preference.set( "layerSelOnlyCheck", this.value );      checkRefresh();    };    //channelCheck.onClick = function () {    //  preference.set( "channelCheck", this.value );    //};    //pathCheck.onClick = function () {    //  preference.set( "pathNameCheck", this.value );    //};    nameCheck.onClick = function () {      preference.set( "nameCheck", this.value );    };    textCheck.onClick = function () {      preference.set( "textCheck", this.value );    };    applyTextToLayerNameCheck.onClick = function () {      preference.set( "applyTextToLayerNameCheck", this.value );      checkRefresh();    };    regexCheck.onClick = function () {      preference.set( "regexCheck", this.value );    };    searchOnlyCheck.onClick = function () {      preference.set( "searchOnlyCheck", this.value );      checkRefresh();    };    function updateDdList () {      _.each( [        {et: fromEText, ddList: fromList},        {et: toEText, ddList: toList}      ], function ( editList ) {        var prevItems = getListItemToText( editList.ddList );        var searchIndex = _.indexOf( prevItems, editList.et.text );        //Hack:_.uniqが旨く動かなかったのでべた書きです。        if (searchIndex !== -1) {          prevItems.splice( searchIndex, 1 );        }        prevItems.unshift( editList.et.text );        //最大保存行数でクリップする。        var maxRowNum = 10;        if (prevItems.length > maxRowNum) {          prevItems.length = maxRowNum;        }        setListItemFromText( editList.ddList, prevItems );      } );      preference.set( "fromEText", fromEText.text );      preference.set( "toEText", toEText.text );      preference.set( "fromList", getListItemToText( fromList ) );      preference.set( "toList", getListItemToText( toList ) );    }    function setListItemFromText ( ddList, array ) {      ddList.removeAll();      _.each( array, function ( text ) {        ddList.add( 'item', text );      } );    }    function getListItemToText ( ddList ) {      return _.map( ddList.items, function ( item ) {return item.text;} );    }    function checkRefresh () {      //未実装      //pathCheck.enabled = false;      //channelCheck.enabled = false;      nameCheck.enabled = false;      textCheck.enabled = false;      if (layerCheck.value) {        nameCheck.enabled = true;        textCheck.enabled = true;      }      if (layerSetCheck.value) {        nameCheck.enabled = true;      }      //if (channelCheck.value) {      //  nameCheck.enabled = true;      //}      //if (pathCheck.value) {      //  nameCheck.enabled = true;      //}      if (searchOnlyCheck.value) {        toEText.enabled = false;        doBtn.text = "Search";      } else {        toEText.enabled = true;        doBtn.text = "Replace";      }      if (applyTextToLayerNameCheck.value) {        layerSetCheck.enabled = false;        nameCheck.enabled = false;        textCheck.enabled = false;        regexCheck.enabled = false;        toEText.enabled = false;        fromEText.enabled = false;      } else {        layerSetCheck.enabled = true;        regexCheck.enabled = true;        fromEText.enabled = true;      }    }    checkRefresh();    return myPalette;  }  function isMacOS () {    return $.os.indexOf( "Mac" ) !== -1;  }  function showLog ( textArray ) {    //dialog    var logPalette = new Window( 'dialog', message.TITLE + ' log', undefined, {resizeable: true} );    logPalette.onResizing = logPalette.onResize = function () {this.layout.resize();};    logPalette.orientation = "column";    logPalette.onShow = function () {      logPalette.minimumSize = logPalette.size;    };    logPalette.minimumSize = [200, 400];    var logText = logPalette.add( 'statictext', undefined, '', {multiline: true, scrolling: true} );    logText.alignment = ["fill", "fill"];    //text    var resArray = [];    logText.text = "";    _.each( textArray, function ( row ) {      resArray.push( row );    } );    logText.text = resArray.join( "\r\r" );    logPalette.show();  }  function reports2textArray () {    var resArray = [];    _.each( reports, function ( row ) {      if (preference.get( 'searchOnlyCheck' )) {        resArray.push( makeAddressStr( row.trgItem ) + "\r     @" + row.entity + ":: " + row.src );      } else {        resArray.push( makeAddressStr( row.trgItem ) + "\r     @" + row.entity + ": " + row.src + " >> " + row.dst );      }    } );    return resArray;    /**     *     * @param item     * @returns {string}     */    function makeAddressStr ( item ) {      var addressArray = [];      var cursorObj = item;      while (cursorObj !== app.activeDocument) {        addressArray.unshift( cursorObj.name );        cursorObj = cursorObj.parent;      }      return addressArray.join( "/" );    }  }  function doWithSeparateEntity ( item ) {    var srcString, dstString, visible;    if (preference.get( 'applyTextToLayerNameCheck' ) && myPalette.applyTextToLayerNameCheck.enabled) {      if (item.kind == LayerKind.TEXT) {        var srcName = item.name;        var targetContents = item.textItem.contents.replace( /[\n\r]/gm, ' ' );        if (srcName != targetContents) {          reports.push( {trgItem: item, src: srcName, dst: targetContents, entity: 'gapName'} );          if (!preference.get( 'searchOnlyCheck' )) {            item.name = targetContents;          }        }      }      return;    }    if (preference.get( 'nameCheck' ) && myPalette.nameCheck.enabled) {      if (isItemTypeCheckOn( item )) {        srcString = item.name;        dstString = searchOrReplaceWithReports( srcString, 'name' );        if (!_.isNull( dstString )) {          visible = item.visible;          item.name = dstString;          item.visible = visible;        }      }    }    if (preference.get( 'textCheck' ) && myPalette.textCheck.enabled) {      if (isItemTypeCheckOn( item ) && item.kind == LayerKind.TEXT) {        srcString = item.textItem.contents;        dstString = searchOrReplaceWithReports( srcString, 'textSource' );        if (!_.isNull( dstString )) {          visible = item.visible;          item.textItem.contents = dstString;          item.visible = visible;        }      }    }    function isItemTypeCheckOn ( item ) {      var res = false;      if (preference.get( 'layerCheck' ) && item.typename == 'ArtLayer') {        res = true;      }      if (preference.get( 'layerSetCheck' ) && item.typename == 'LayerSet') {        res = true;      }      return res;    }    function searchOrReplaceWithReports ( srcString, entityType ) {      var dstString = null;      if (preference.get( 'searchOnlyCheck' ) && searchString( srcString )) {        reports.push( {trgItem: item, src: srcString, dst: dstString, entity: entityType} );      } else {        dstString = replaceString( srcString );        if (srcString != dstString && !_.isNull( dstString )) {          reports.push( {trgItem: item, src: srcString, dst: dstString, entity: entityType} );        } else {          dstString = null;        }      }      return dstString;      /**       *       * @param srcText       * @returns {boolean}       */      function searchString ( srcText ) {        var targetRegexp = getSearchTrgRegexp( preference.get( 'fromEText' ) );        if (targetRegexp) {          return srcText.search( targetRegexp ) !== -1;        } else {          return null;        }      }      /**       *       * @param srcText       * @returns {string}       */      function replaceString ( srcText ) {        var replaceValue = preference.get( 'toEText' );        var targetRegexp = getSearchTrgRegexp( preference.get( 'fromEText' ) );        if (targetRegexp) {          return srcText.replace( targetRegexp, replaceValue );        } else {          return null;        }      }      function getSearchTrgRegexp ( fromString ) {        var res = fromString;        try {          if (preference.get( 'regexCheck' )) {            //noinspection JSClosureCompilerSyntax            res = new RegExp( res, "gm" );          } else {            var escaped = res.replace( /([\\\^\$\*\+\?\.\(\)\[\]\{\}\|])/gm, '\\$1' );            //noinspection JSClosureCompilerSyntax            res = new RegExp( escaped, "gm" );          }        } catch (e) {          res = undefined;        }        return res;      }    }  }  function doMain () {    try {      //noinspection BadExpressionStatementJS      app.activeDocument;    } catch (e) {      alert( message.NO_DOCUMENT );      return;    }    reports = [];    var selectedLayerIdx = getSelectedLayersIdx();    var list = listUpTargetItemsList();    var topLayerIndex = (hasBackgroundLayer()) ? list.length - 1 : list.length;    //ここで何かしら選択しておく。選択がないとコケる    if (!selectedLayerIdx.length && list.length) {      selectLayerByIndex( topLayerIndex, false );    }    _.each( list, function ( item ) {      doWithSeparateEntity( item );    } );    //選択状態を復帰させる。    if (!selectedLayerIdx.length && list.length) {      deselectAllLayers()    } else if (selectedLayerIdx.length) {      for (var q = 0; q < selectedLayerIdx.length; q++) {        selectLayerByIndex( selectedLayerIdx[q], true );      }    }    app.refresh();    if (reports.length) {      showLog( reports2textArray() );    } else {      alert( message.NO_RESULT );    }    /**     * レイヤーオブジェクトの選択状態とGUI設定からターゲットレイヤーのリストを作成し返します。     * @returns {object[]}     */    function listUpTargetItemsList () {      var dstList = [];      var selectedLayers = getSelectedLayers();      var allLayers = getAllLayers();      if (selectedLayers.length < 1) {//全レイヤー        if (confirm( message.NO_ITEM + message.SELECT_ALL_CONFIRM, true )) {          _.each( allLayers, function ( layer ) {            addList( layer );          } );        }      } else if (preference.get( 'layerSelOnlyCheck' )) {//選択レイヤーのみ        _.each( selectedLayers, function ( item ) {          addList( item );        } );      } else {//選択レイヤーの再帰版        var tempArray = [];        _.each( selectedLayers, function ( item ) {          tempArray.push( item );          if (item.typename == 'LayerSet') {            pushLayersRecurred( item, tempArray );          }        } );        _.each( _.uniq( tempArray ), function ( item ) {          addList( item );        } );      }      return dstList;      function addList ( item ) {        if (preference.get( 'layerCheck' ) && item.typename == 'ArtLayer') {          pushItem( item );        }        if (preference.get( 'layerSetCheck' ) && item.typename == 'LayerSet') {          pushItem( item );        }        function pushItem ( item ) {          if (_.indexOf( dstList, item ) == -1) {            dstList.push( item );          }        }      }    }  }}());