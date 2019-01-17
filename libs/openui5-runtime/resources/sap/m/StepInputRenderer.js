/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2018 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define([],function(){"use strict";var S={};S.render=function(r,c){var i=c._getInput(),w=c.getWidth(),e=c.getEnabled(),E=c.getEditable();r.write("<div ");if(e&&E){r.write("tabindex='-1'");}r.addStyle("width",w);r.writeStyles();r.writeControlData(c);r.writeAccessibilityState(c);r.addClass("sapMStepInput");r.addClass("sapMStepInput-CTX");!e&&r.addClass("sapMStepInputReadOnly");!E&&r.addClass("sapMStepInputNotEditable");r.writeClasses();r.write(">");r.renderControl(i);r.write("</div>");};return S;},true);
