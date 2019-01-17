/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2018 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['./library',"./ObjectPageDynamicHeaderContentRenderer","sap/base/Log"],function(l,O,L){"use strict";try{sap.ui.getCore().loadLibrary("sap.f");}catch(e){L.error("The control 'sap.uxap.ObjectPageDynamicHeaderContent' needs library 'sap.f'.");throw(e);}var D=sap.ui.requireSync("sap/f/DynamicPageHeader");var a=D.extend("sap.uxap.ObjectPageDynamicHeaderContent",{metadata:{interfaces:["sap.uxap.IHeaderContent"],library:"sap.uxap"}});a.createInstance=function(c,v,C,p,s){return new a({content:c,visible:v,pinnable:p,id:s});};a.prototype.supportsPinUnpin=function(){return true;};a.prototype.supportsChildPageDesign=function(){return false;};a.prototype.supportsAlwaysExpanded=function(){return false;};a.prototype.setContentDesign=function(d){};return a;});
