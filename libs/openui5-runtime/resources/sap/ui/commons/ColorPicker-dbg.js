/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.ui.commons.ColorPicker.
sap.ui.define(['jquery.sap.global', './library', 'sap/ui/core/Control', 'sap/ui/unified/ColorPicker'],
	function(jQuery, library, Control, UnifiedColorPicker) {
	"use strict";



	/**
	 * Constructor for a new ColorPicker.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * This control gives the user the opportunity to choose a color. The color can be defined using HEX-, RGB- or HSV-values or a CSS colorname.
	 * @extends sap.ui.core.Control
	 *
	 * @author SAP SE
	 * @version 1.48.5
	 *
	 * @constructor
	 * @public
	 * @deprecated Since version 1.38.
	 * @alias sap.ui.commons.ColorPicker
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var ColorPicker = UnifiedColorPicker.extend("sap.ui.commons.ColorPicker", /** @lends sap.ui.commons.ColorPicker.prototype */ {
		metadata : {
			deprecated : true,
			library : "sap.ui.commons"
		},
		renderer : "sap.ui.unified.ColorPickerRenderer"
	});

	try {
		sap.ui.getCore().loadLibrary("sap.ui.unified");
	} catch (e) {
		jQuery.sap.log.error("The control 'sap.ui.commons.ColorPicker' needs library 'sap.ui.unified'.");
		throw (e);
	}

	return ColorPicker;

}, /* bExport= */ true);
