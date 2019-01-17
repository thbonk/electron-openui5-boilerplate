/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2018 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['sap/ui/core/Renderer'],function(R){"use strict";var S={},C={MAIN_CLASS:"sapMSliderTooltipContainer"};S.render=function(r,c){var t=c.getAssociatedTooltipsAsControls();r.write("<div");r.writeControlData(c);r.addStyle("width",c.getWidth());r.writeStyles();r.writeClasses();r.write(">");r.write("<div");r.writeAttribute("id",c.getId()+"-container");r.addStyle("left","0%");r.addStyle("right","0%");r.addClass(C.MAIN_CLASS);if(!c.getEnabled()){r.addClass(C.MAIN_CLASS+"Disabled");}r.writeClasses();r.writeStyles();r.write(">");if(t&&t.length){t.forEach(function(T){r.renderControl(T);});}r.write("</div>");r.write("</div>");};return S;},true);
