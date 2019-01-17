/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2018 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define([],function(){"use strict";var S={};S.render=function(r,o){r.write("<div");r.writeControlData(o);r.addClass("sapMSemanticPage");r.writeClasses();r.write(">");r.renderControl(o._getPage());r.write("</div>");};return S;},true);
