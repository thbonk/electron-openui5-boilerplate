/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2018 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['./library','sap/ui/core/Element'],function(l,E){"use strict";var G=E.extend("sap.m.QuickViewGroup",{metadata:{library:"sap.m",properties:{visible:{type:"boolean",group:"Appearance",defaultValue:true},heading:{type:"string",group:"Misc",defaultValue:""}},defaultAggregation:"elements",aggregations:{elements:{type:"sap.m.QuickViewGroupElement",multiple:true,singularName:"element",bindable:"bindable"}}}});["setModel","bindAggregation","setAggregation","insertAggregation","addAggregation","removeAggregation","removeAllAggregation","destroyAggregation"].forEach(function(f){G.prototype["_"+f+"Old"]=G.prototype[f];G.prototype[f]=function(){var r=G.prototype["_"+f+"Old"].apply(this,arguments);var p=this.getParent();if(p){p._updatePage();}if(["removeAggregation","removeAllAggregation"].indexOf(f)!==-1){return r;}return this;};});G.prototype.setProperty=function(){E.prototype.setProperty.apply(this,arguments);var p=this.getParent();if(p){p._updatePage();}};return G;});
