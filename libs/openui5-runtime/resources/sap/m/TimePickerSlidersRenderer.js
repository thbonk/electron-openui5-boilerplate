/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2018 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/Device"],function(D){"use strict";var T={};T.render=function(r,c){var s=c.getAggregation("_columns"),l=c.getLabelText()||"",R=sap.ui.getCore().getLibraryResourceBundle("sap.m"),S,b=sap.ui.getCore().getConfiguration().getRTL();r.write("<div");r.writeControlData(c);r.addClass("sapMTimePickerContainer");r.addStyle("width",c.getWidth());r.addStyle("height",c.getHeight());r.writeClasses();r.writeStyles();r.writeAccessibilityState(c,{label:(l+" "+R.getText("TIMEPICKER_SCREENREADER_TAG")).trim()});r.write(">");if(!D.system.desktop){r.write("<div id=\""+c.getId()+"-label"+"\"");r.addClass("sapMTimePickerContainerLabel");r.writeClasses();r.write(">");r.addStyle("display","block");r.writeEscaped(l);r.write("</div>");}if(b){for(S=s.length-1;S>=0;S--){r.renderControl(s[S]);}}else{for(S=0;S<s.length;S++){r.renderControl(s[S]);}}r.write("</div>");};return T;},true);
