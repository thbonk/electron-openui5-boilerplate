/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["jquery.sap.global","sap/ui/support/library","sap/ui/support/supportRules/RuleSet","./Button.support","./Dialog.support","./Input.support"],function(q,S,R,B,D,I){"use strict";var l={name:"sap.m",niceName:"UI5 Main Library"};var r=new R(l);B.addRulesToRuleset(r);D.addRulesToRuleset(r);I.addRulesToRuleset(r);return{lib:l,ruleset:r};},true);
