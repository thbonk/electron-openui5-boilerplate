/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2018 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["./library","sap/ui/core/Renderer","sap/ui/core/library"],function(l,R,c){"use strict";var a=l.RenderMode;var T=c.TextDirection;var I={};I.render=function(r,C){var i=C.getColorScheme(),s=C.getRenderMode(),t=C.getText(),b=C.getTextDirection(),w=C.getWidth(),d=C.getDisplayOnly();r.write("<div");r.writeControlData(C);r.addClass("sapTntInfoLabel");if(s===a.Narrow){r.addClass("sapTntInfoLabelRenderModeNarrow");}if(d){r.addClass("sapTntInfoLabelDisplayOnly");}if(t===""){r.addClass("sapTntInfoLabelNoText");}if(w){r.addStyle("width",w);}r.addClass("backgroundColor"+i);r.writeClasses();r.writeStyles();r.write(">");r.write("<span");r.addClass("sapTntInfoLabelInner");r.writeClasses();if(b!==T.Inherit){r.writeAttribute("dir",b.toLowerCase());}r.write(">");r.writeEscaped(t);r.write("</span>");if(I._sAriaText){r.write("<span class='sapUiPseudoInvisibleText'>");if(t===""){r.writeEscaped(I._sAriaTextEmpty);}else{r.writeEscaped(I._sAriaText);}r.write("</span>");}r.write("</div>");};return I;},true);
