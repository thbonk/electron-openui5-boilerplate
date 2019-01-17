/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2018 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/test/selectors/_Selector","sap/ui/base/ManagedObjectMetadata"],function(_,M){"use strict";var a=_.extend("sap.ui.test.selectors._ViewID",{_generate:function(c){var C=c.getId();var v=this._getControlViewName(c);if(!M.isGeneratedId(C)){var V=v+"--";var i=C.indexOf(V);if(i>-1){var s=C.substring(i+V.length);if(!s.indexOf("-")>-1&&!s.match(/[0-9]$/)){this._oLogger.debug("Control with ID "+C+" belongs to view with viewName "+v+" and has relative ID "+s);return{viewName:v,id:s,skipBasic:true};}}else{this._oLogger.debug("Control "+c+" does not belong to a view");}}}});return a;});
