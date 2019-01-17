/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2018 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['./BarInPageEnabler'],function(B){"use strict";var T={};T.render=B.prototype.render;T.decorateRootElement=function(r,t){var a;r.addClass("sapMTB");if(!t.getAriaLabelledBy().length){a=t.getTitleId();}r.writeAccessibilityState(t,{role:t._getAccessibilityRole(),labelledBy:a});r.addClass("sapMTBNewFlex");if(t.getActive()){r.addClass("sapMTBActive");r.writeAttribute("tabindex","0");}else{r.addClass("sapMTBInactive");}r.addClass("sapMTB"+t.getStyle());r.addClass("sapMTB-"+t.getActiveDesign()+"-CTX");var w=t.getWidth();var h=t.getHeight();w&&r.addStyle("width",w);h&&r.addStyle("height",h);};T.renderBarContent=function(r,t){t.getContent().forEach(function(c){B.addChildClassTo(c,t);r.renderControl(c);});};T.shouldAddIBarContext=function(c){return false;};return T;},true);
