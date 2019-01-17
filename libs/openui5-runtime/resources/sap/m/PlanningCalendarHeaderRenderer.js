/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2018 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define([],function(){"use strict";var P={};P.render=function(r,h){var a=h.getAggregation("_actionsToolbar"),n=h.getAggregation("_navigationToolbar");r.write("<div");r.writeControlData(h);r.addClass("sapMPCHead");r.writeClasses();r.write(">");if(a){r.renderControl(a);}if(n){r.renderControl(n);}r.write("</div>");};return P;},true);
