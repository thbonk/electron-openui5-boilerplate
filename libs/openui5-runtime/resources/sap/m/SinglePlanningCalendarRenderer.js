/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2018 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define([],function(){"use strict";var S={};S.render=function(r,c){var h=c._getHeader(),g=c._getGrid();r.write("<div");r.writeControlData(c);r.writeAccessibilityState({role:"region",roledescription:c._oRB.getText("SPC_CONTROL_NAME"),labelledby:{value:h.getId()+"-Title "+g.getId()+"-nowMarkerText",append:true}});r.addClass("sapMSinglePC");r.addClass("sapUiSizeCompact");r.writeClasses();r.write(">");r.renderControl(h);r.renderControl(g);r.write("</div>");};return S;},true);
