/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','./library','sap/ui/core/Control','sap/ui/unified/ColorPicker'],function(q,l,C,U){"use strict";var a=U.extend("sap.ui.commons.ColorPicker",{metadata:{deprecated:true,library:"sap.ui.commons"},renderer:"sap.ui.unified.ColorPickerRenderer"});try{sap.ui.getCore().loadLibrary("sap.ui.unified");}catch(e){q.sap.log.error("The control 'sap.ui.commons.ColorPicker' needs library 'sap.ui.unified'.");throw(e);}return a;},true);
