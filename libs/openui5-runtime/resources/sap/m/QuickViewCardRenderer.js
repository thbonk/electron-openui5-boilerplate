/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2018 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define([],function(){"use strict";var Q={};Q.render=function(r,q){var c=q.getNavContainer();r.write("<div");r.addClass("sapMQuickViewCard");if(!q.getShowVerticalScrollBar()){r.addClass("sapMQuickViewCardNoScroll");}r.writeControlData(q);r.writeClasses();r.write(">");r.renderControl(c);r.write("</div>");};return Q;},true);
