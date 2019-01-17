/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2018 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define([],function(){"use strict";var D={};D.render=function(r,d){var o=d._getState(),s="sapFDynamicPageHeader",b=d.getBackgroundDesign();r.write("<header");r.writeControlData(d);r.writeAccessibilityState({role:"region"});r.addClass("sapContrastPlus");r.addClass(s);if(o.headerHasContent){r.addClass("sapFDynamicPageHeaderWithContent");}if(o.headerPinnable){r.addClass("sapFDynamicPageHeaderPinnable");}if(b){r.addClass(s+b);}r.writeClasses();r.write(">");this._renderHeaderContent(r,o);r.renderControl(o.collapseButton);if(o.headerPinnable){r.renderControl(o.pinButton);}r.write("</header>");};D._renderHeaderContent=function(r,d){if(d.headerHasContent){r.write("<div");r.addClass("sapFDynamicPageHeaderContent");r.writeClasses();r.write(">");d.content.forEach(r.renderControl,r);r.write("</div>");}};return D;},true);
