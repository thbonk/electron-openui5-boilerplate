/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','./FlexBoxStylingHelper','./library','sap/ui/core/LayoutData'],function(q,F,l,L){"use strict";var a=L.extend("sap.m.FlexItemData",{metadata:{library:"sap.m",properties:{alignSelf:{type:"sap.m.FlexAlignSelf",group:"Misc",defaultValue:sap.m.FlexAlignSelf.Auto},order:{type:"int",group:"Misc",defaultValue:0},growFactor:{type:"float",group:"Misc",defaultValue:0},shrinkFactor:{type:"float",group:"Misc",defaultValue:1},baseSize:{type:"sap.ui.core.CSSSize",group:"Misc",defaultValue:"auto"},minHeight:{type:"sap.ui.core.CSSSize",group:"Dimension",defaultValue:'auto'},maxHeight:{type:"sap.ui.core.CSSSize",group:"Dimension",defaultValue:''},minWidth:{type:"sap.ui.core.CSSSize",group:"Dimension",defaultValue:'auto'},maxWidth:{type:"sap.ui.core.CSSSize",group:"Dimension",defaultValue:''},styleClass:{type:"string",group:"Misc",defaultValue:''},backgroundDesign:{type:"sap.m.BackgroundDesign",group:"Appearance",defaultValue:sap.m.BackgroundDesign.Transparent}}}});a.prototype.setAlignSelf=function(v){var o=this.getAlignSelf();this.setProperty("alignSelf",v,true);this.$().removeClass("sapMFlexItemAlign"+o).addClass("sapMFlexItemAlign"+this.getAlignSelf());return this;};a.prototype.setOrder=function(v){this.setProperty("order",v,true);F.setStyle(null,this,"order",this.getOrder());return this;};a.prototype.setGrowFactor=function(v){this.setProperty("growFactor",v,true);F.setStyle(null,this,"flex-grow",this.getGrowFactor());return this;};a.prototype.setShrinkFactor=function(v){this.setProperty("shrinkFactor",v,true);F.setStyle(null,this,"flex-shrink",this.getShrinkFactor());return this;};a.prototype.setBaseSize=function(v){this.setProperty("baseSize",v,true);F.setStyle(null,this,"flex-basis",this.getBaseSize());return this;};a.prototype.setMinHeight=function(v){this.setProperty("minHeight",v,true);this.$().css("min-height",this.getMinHeight());return this;};a.prototype.setMaxHeight=function(v){this.setProperty("maxHeight",v,true);this.$().css("max-height",this.getMaxHeight());return this;};a.prototype.setMinWidth=function(v){this.setProperty("minWidth",v,true);this.$().css("min-width",this.getMinWidth());return this;};a.prototype.setMaxWidth=function(v){this.setProperty("maxWidth",v,true);this.$().css("max-width",this.getMaxWidth());return this;};a.prototype.setBackgroundDesign=function(v){var o=this.getBackgroundDesign();this.setProperty("backgroundDesign",v,true);this.$().removeClass("sapMFlexBoxBG"+o).addClass("sapMFlexBoxBG"+this.getBackgroundDesign());return this;};a.prototype.setStyleClass=function(v){var o=this.getStyleClass();this.setProperty("styleClass",v,true);this.$().removeClass(o).addClass(this.getStyleClass());return this;};return a;},true);
