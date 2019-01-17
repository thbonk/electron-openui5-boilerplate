/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2018 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['sap/ui/core/Renderer'],function(R){"use strict";var S={};S.CSS_CLASS="sapMSliderTooltip";S.render=function(r,c){r.write("<div");r.writeControlData(c);r.addClass(S.CSS_CLASS);r.writeClasses();if(c.getWidth()){r.addStyle("width",c.getWidth());}r.writeStyles();r.write(">");this.renderTooltipElement(r,c);r.write("</div>");};S.renderTooltipElement=function(r,c){var a=sap.ui.getCore().getConfiguration().getAccessibility();r.write('<input ');r.addClass(S.CSS_CLASS+"Input");if(!c.getEditable()){r.addClass(S.CSS_CLASS+"NonEditable");}if(a){r.writeAccessibilityState(c,{});}r.writeClasses();r.writeAttribute("tabindex","-1");r.writeAttributeEscaped("value",c.getValue());r.writeAttributeEscaped("type","number");r.writeAttributeEscaped("step",c.getStep());r.writeAttributeEscaped("id",c.getId()+"-input");r.write("/>");};return S;},true);
