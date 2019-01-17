/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2018 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['sap/ui/core/Renderer'],function(R){"use strict";var S={};S.CSS_CLASS="sapMSliderTooltip";S.render=function(r,c){r.write("<div");r.writeControlData(c);r.writeClasses();r.write(">");this.renderTooltipContent(r,c);r.write("</div>");};S.renderTooltipContent=function(r,c){};return S;},true);
