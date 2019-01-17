/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2018 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['sap/m/semantic/SemanticButton','sap/m/library',"sap/ui/events/KeyCodes"],function(S,l,K){"use strict";var B=l.ButtonType;var a=S.extend("sap.m.semantic.SemanticToggleButton",{metadata:{library:"sap.m",properties:{pressed:{type:"boolean",group:"Data",defaultValue:false}}}});a.prototype._onTap=function(e){e.setMarked();if(this.getEnabled()){this.setPressed(!this.getPressed());this.firePress({pressed:this.getPressed()});}};a.prototype._onKeydown=function(e){if(e.which===K.SPACE||e.which===K.ENTER){this._onTap(e);}};a.prototype._applyProperty=function(p,v,s){if(p==='pressed'){this._setPressed(v,s);}else{S.prototype._applyProperty.apply(this,arguments);}};a.prototype._setPressed=function(p,s){var b=p?B.Emphasized:B.Default;this._getControl().setType(b,s);};a.prototype._createInstance=function(c){var i=new c({id:this.getId()+"-toggleButton"});i.addEventDelegate({ontap:this._onTap,onkeydown:this._onKeydown},this);return i;};return a;});
