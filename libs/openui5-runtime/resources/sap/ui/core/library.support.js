/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["jquery.sap.global","sap/ui/support/supportRules/RuleSet","./Misc.support","./Config.support","./Model.support","./View.support","./App.support"],function(q,R,M,C,a,V,A){"use strict";var l={name:"sap.ui.core",niceName:"UI5 Core Library"};var r=new R(l);M.addRulesToRuleSet(r);C.addRulesToRuleSet(r);a.addRulesToRuleSet(r);V.addRulesToRuleSet(r,{iNumberOfControlsThreshold:20000});var o=["jQuery.sap.require","$.sap.require","sap.ui.requireSync","jQuery.sap.sjax"];if(q&&q.sap&&q.sap.sjax){o.push("jQuery.sap.syncHead","jQuery.sap.syncGet","jQuery.sap.syncPost","jQuery.sap.syncGetText","jQuery.sap.syncGetJSON");}A.addRulesToRuleSet(r,{aObsoleteFunctionNames:o});return{lib:l,ruleset:r};},true);
