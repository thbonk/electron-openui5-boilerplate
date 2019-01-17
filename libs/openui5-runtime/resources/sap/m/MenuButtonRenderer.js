/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2018 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define([],function(){"use strict";var M={};M.CSS_CLASS="sapMMenuBtn";M.render=function(r,m){var w=m.getWidth();r.write("<div");r.writeControlData(m);r.addClass(M.CSS_CLASS);r.addClass(M.CSS_CLASS+m.getButtonMode());r.writeClasses();if(w!=""){r.addStyle("width",w);}r.writeStyles();r.write(">");m._ensureBackwardsReference();r.renderControl(m._getButtonControl());r.write("</div>");};return M;},true);
