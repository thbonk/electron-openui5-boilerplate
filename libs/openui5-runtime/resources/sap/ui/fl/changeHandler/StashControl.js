/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["jquery.sap.global"],function(q){"use strict";var S={};S.applyChange=function(c,C,p){c.setRevertData({originalValue:p.modifier.getStashed(C)});p.modifier.setStashed(C,true);return true;};S.revertChange=function(c,C,p){var r=c.getRevertData();if(r){p.modifier.setStashed(C,r.originalValue);c.resetRevertData();}else{q.sap.log.error("Attempt to revert an unapplied change.");return false;}return true;};S.completeChangeContent=function(c,s){};return S;},true);
