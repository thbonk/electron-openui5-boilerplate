/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2018 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define([],function(){"use strict";var T={};T.render=function(r,c){r.write("<div");r.writeControlData(c);r.addClass("sapMTBSeparator");r.writeAccessibilityState(c,{role:"separator"});r.writeClasses();r.write("></div>");};return T;},true);
