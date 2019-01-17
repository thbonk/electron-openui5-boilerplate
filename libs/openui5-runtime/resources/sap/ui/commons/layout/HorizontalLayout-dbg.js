/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2018 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.ui.commons.layout.HorizontalLayout.
sap.ui.define([
 'sap/ui/commons/library',
 'sap/ui/layout/HorizontalLayout',
 './HorizontalLayoutRenderer'
],
	function(library, LayoutHorizontalLayout, HorizontalLayoutRenderer) {
	"use strict";



	/**
	 * Constructor for a new layout/HorizontalLayout.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * A layout that provides support for horizontal alignment of controls
	 * @extends sap.ui.layout.HorizontalLayout
	 *
	 * @author SAP SE
	 * @version 1.61.2
	 *
	 * @constructor
	 * @public
	 * @deprecated Since version 1.38. Instead, use the <code>sap.ui.layout.HorizontalLayout</code> control.
	 * @alias sap.ui.commons.layout.HorizontalLayout
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var HorizontalLayout = LayoutHorizontalLayout.extend("sap.ui.commons.layout.HorizontalLayout", /** @lends sap.ui.commons.layout.HorizontalLayout.prototype */ { metadata : {

		library : "sap.ui.commons"
	}});



	return HorizontalLayout;

});
