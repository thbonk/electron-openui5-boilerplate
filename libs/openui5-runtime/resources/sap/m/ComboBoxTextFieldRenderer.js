/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2018 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['./InputBaseRenderer','sap/ui/core/Renderer','sap/ui/core/LabelEnablement'],function(I,R,L){"use strict";var C=R.extend(I);C.CSS_CLASS_COMBOBOXTEXTFIELD="sapMComboBoxTextField";C.writeInnerAttributes=function(r,c){r.writeAttribute("autocomplete","off");r.writeAttribute("autocorrect","off");r.writeAttribute("autocapitalize","off");r.writeAttribute("type","text");};C.writeOuterAttributes=function(r,c){if(sap.ui.getCore().getConfiguration().getAccessibility()){r.writeAttribute("role","combobox");}};C.getAriaRole=function(){};C.getAccessibilityState=function(c){var a=I.getAccessibilityState.call(this,c);a.autocomplete="both";return a;};C.addOuterStyles=function(r,c){r.addStyle("max-width",c.getMaxWidth());};return C;},true);
