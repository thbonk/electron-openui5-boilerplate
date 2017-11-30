/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["jquery.sap.global","sap/ui/fl/changeHandler/Base","sap/ui/fl/Utils"],function(q,B,F){"use strict";var P={};P.applyChange=function(c,C,p){var d=c.getDefinition();var s=d.content.property;var v=d.content.newBinding;var m=p.modifier;c.setRevertData({originalValue:m.getPropertyBinding(C,s)});m.setPropertyBinding(C,s,v);};P.revertChange=function(c,C,p){var r=c.getRevertData();if(r){var d=c.getDefinition();var s=d.content.property;var v=r.originalValue;var m=p.modifier;m.setPropertyBinding(C,s,v);c.resetRevertData();}else{q.sap.log.error("Attempt to revert an unapplied change.");return false;}return true;};P.completeChangeContent=function(c,s){var C=c.getDefinition();if(s.content){C.content=s.content;}else{throw new Error("oSpecificChangeInfo attribute required");}};return P;},true);
