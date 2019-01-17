/*!

* UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2018 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.

*/
sap.ui.define(["sap/ui/core/library","sap/ui/core/InvisibleText"],function(c,I){"use strict";var T=c.TextDirection;var a={};a.render=function(r,C){r.write("<div tabindex=\"-1\"");r.writeControlData(C);r.addClass("sapMToken");r.writeAttribute("role","listitem");r.writeAttribute("aria-readonly",!C.getEditable());r.writeAttribute("aria-selected",C.getSelected());if(C.getSelected()){r.addClass("sapMTokenSelected");}if(!C.getEditable()){r.addClass("sapMTokenReadOnly");}r.writeClasses();var t=C.getTooltip_AsString();if(t){r.writeAttributeEscaped("title",t);}var A={};A.describedby={value:I.getStaticId("sap.m","TOKEN_ARIA_LABEL"),append:true};if(C.getEditable()){A.describedby={value:I.getStaticId("sap.m","TOKEN_ARIA_DELETABLE"),append:true};}r.writeAccessibilityState(C,A);r.write(">");a._renderInnerControl(r,C);if(C.getEditable()){r.renderControl(C._deleteIcon);}r.write("</div>");};a._renderInnerControl=function(r,C){var t=C.getTextDirection();r.write("<span");r.addClass("sapMTokenText");r.writeClasses();if(t!==T.Inherit){r.writeAttribute("dir",t.toLowerCase());}r.write(">");var b=C.getText();if(b){r.writeEscaped(b);}r.write("</span>");};return a;},true);
