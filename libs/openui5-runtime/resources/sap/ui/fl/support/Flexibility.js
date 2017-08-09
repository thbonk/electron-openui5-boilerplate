/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["jquery.sap.global","sap/ui/core/support/Plugin","sap/ui/core/support/Support","sap/ui/model/json/JSONModel"],function(q,P,S,J){"use strict";var F=P.extend("sap.ui.fl.support.Flexibility",{constructor:function(s){P.apply(this,["sapUiSupportFlexibility","Flexibility",s]);this._oStub=s;if(this.runsAsToolPlugin()){this._aEventIds=[this.getId()+"SetChanges"];}else{this._aEventIds=[this.getId()+"GetChanges"];}}});F.prototype.init=function(s){P.prototype.init.apply(this,arguments);if(s.isToolStub()){this.addStylesheet("sap/ui/fl/support/flexibility");this.oModel=new J();this._renderToolPlugin();}else{this.onsapUiSupportFlexibilityGetChanges();}};F.prototype._renderToolPlugin=function(){var t=this;var _=function(){var r=sap.ui.getCore().createRenderManager();r.write("<div class='sapUiSupportToolbar'>");r.write("<a href='#' id='"+t.getId()+"-Refresh' class='sapUiSupportLink'>Refresh</a>");t.$().on("click",'#'+t.getId()+"-Refresh",q.proxy(t._onRefreshChanges,t));r.write("</div>");r.write("<div id='"+t.getId()+"-FlexCacheArea' class='sapUiSizeCompact' />");r.flush(t.$().get(0));r.destroy();};var a=function(){t.oView=sap.ui.view({viewName:"sap.ui.fl.support.Flexibility",type:sap.ui.core.mvc.ViewType.XML});t.oView.placeAt(t.getId()+"-FlexCacheArea");t.oView.setModel(t.oModel,"flex");};_();a();this._onRefreshChanges();};F.prototype._onRefreshChanges=function(){S.getStub().sendEvent(this.getId()+"GetChanges",{});};F.prototype.onsapUiSupportFlexibilityGetChanges=function(){var t=this;if(sap.ui.fl&&sap.ui.fl.Cache){var c=sap.ui.fl.Cache.getEntries();var r=[];var p=[];q.each(c,function(f,e){var C=e.file.changes.changes.slice(0);var a=e.file.changes.contexts.slice(0);if(a.length>0){var o=sap.ui.fl.context.ContextManager.getActiveContexts(a).then(function(A){a.forEach(function(b){b.isActive=A.indexOf(b.id)!==-1;});C.forEach(function(b){b.isActive=!b.context||A.indexOf(b.context)!==-1;});});r.push({reference:f,changes:C,contexts:a});p.push(o);}else{C.forEach(function(b){b.isActive=!b.context;});r.push({reference:f,changes:C,contexts:a});}});Promise.all(p).then(function(){t._oStub.sendEvent(t.getId()+"SetChanges",r);});}else{t._oStub.sendEvent(t.getId()+"SetChanges",{});}};F.prototype.onsapUiSupportFlexibilitySetChanges=function(e){var c=e.getParameters();this.oModel.setData(c);};F.prototype.exit=function(s){P.prototype.exit.apply(this,arguments);};return F;});
