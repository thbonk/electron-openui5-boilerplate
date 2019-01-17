/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2018 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['sap/ui/base/ManagedObject',"sap/ui/test/_OpaLogger",'sap/ui/test/_ControlFinder','sap/ui/thirdparty/jquery'],function(M,_,a,$){"use strict";var b=M.extend("sap.ui.test.selectors._ControlSelectorValidator",{constructor:function(s,v){this.aSelectors=s;this.oValidationAncestor=v;this._oLogger=_.getLogger("sap.ui.test.selectors._ControlSelectorValidator");},_validate:function(s){if(s){var l=a._findControls($.extend({},s));if(this.oValidationAncestor&&l.length>1){l=l.filter(function(c){return this._hasAncestor(c,this.oValidationAncestor);}.bind(this));}if(l.length===1){this._oLogger.debug("Selector matched a single control: "+JSON.stringify(s));this.aSelectors.push(s);}else{this._oLogger.debug("Selector matched multiple controls: "+JSON.stringify(s));}}},_hasAncestor:function(c,A){var p=c.getParent();return!!p&&(p===A||this._hasAncestor(p,A));}});return b;});
