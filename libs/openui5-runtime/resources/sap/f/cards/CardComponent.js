/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2018 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','sap/ui/core/UIComponent'],function(q,U){"use strict";var C=U.extend("sap.f.cards.CardComponent",{constructor:function(s){U.apply(this,arguments);this._mSettings=s;},metadata:{}});C.prototype.applySettings=function(){U.prototype.applySettings.apply(this,arguments);};C.prototype.createContent=function(){return U.prototype.createContent.apply(this,arguments);};C.prototype.render=function(r){var c=this.getRootControl();if(c&&r){r.renderControl(c);}};return C;});
