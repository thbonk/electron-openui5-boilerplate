/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["jquery.sap.global"],function(q){"use strict";var U={};U.applyChange=function(c,C,p){var m=c.getContent();var M=p.modifier;c.setRevertData({originalValue:p.modifier.getStashed(C)});M.setStashed(C,false);if(m.parentAggregationName){var t=m.parentAggregationName;var T=M.getParent(C);M.removeAggregation(T,t,C);M.insertAggregation(T,t,C,m.index,p.view);}return true;};U.revertChange=function(c,C,p){var r=c.getRevertData();if(r){p.modifier.setStashed(C,r.originalValue);c.resetRevertData();}else{q.sap.log.error("Attempt to revert an unapplied change.");return false;}return true;};U.completeChangeContent=function(c,s){var C=c.getDefinition();if(s.content){C.content=s.content;}};return U;},true);
