/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2018 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['sap/ui/core/Renderer'],function(R){"use strict";var N={};N.render=function(r,c){var a,v,g=c.getItems(),e=c.getExpanded(),b=[];r.write("<ul");r.writeControlData(c);var w=c.getWidth();if(w&&e){r.addStyle("width",w);}r.writeStyles();r.addClass("sapTntNavLI");if(!e){r.addClass("sapTntNavLICollapsed");}r.writeClasses();a=e?'tree':'toolbar';r.writeAttribute("role",a);r.write(">");g.forEach(function(d){if(d.getVisible()){b.push(d);}});b.forEach(function(d,i){d.render(r,c,i,v);});r.write("</ul>");};return N;},true);
