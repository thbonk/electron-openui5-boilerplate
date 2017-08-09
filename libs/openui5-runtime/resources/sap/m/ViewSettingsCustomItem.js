/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','./ViewSettingsItem','sap/ui/base/ManagedObject','./library'],function(q,V,M,l){"use strict";var a=V.extend("sap.m.ViewSettingsCustomItem",{metadata:{library:"sap.m",properties:{filterCount:{type:"int",group:"Behavior",defaultValue:0}},aggregations:{customControl:{type:"sap.ui.core.Control",multiple:false}}}});a.prototype.exit=function(){if(this._control&&!this._control.getParent()){this._control.destroy();delete this._control;}};a.prototype.setCustomControl=function(c){this._control=c;return this;};a.prototype.getCustomControl=function(){return this._control;};a.prototype.setFilterCount=function(v){this.setProperty("filterCount",v,true);return this;};a.prototype.setSelected=function(v){this.setProperty("selected",v,true);return this;};a.prototype.clone=function(i,L,o){var c=M.prototype.clone.apply(this,arguments);c._control=this._control.clone();return c;};return a;},true);
