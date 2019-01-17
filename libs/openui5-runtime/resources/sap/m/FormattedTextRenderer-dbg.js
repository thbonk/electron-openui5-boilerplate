/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2018 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define([],
	function() {
		"use strict";


		/**
		 * FormattedText renderer.
		 * @namespace
		 */
		var FormattedTextRenderer = {};

		FormattedTextRenderer.render = function (oRm, oControl) {
			oRm.write("<div");
			oRm.writeControlData(oControl);
			oRm.addClass("sapMFT");
			oRm.writeClasses();
			// render Tooltip
			if (oControl.getTooltip_AsString()) {
				oRm.writeAttributeEscaped("title", oControl.getTooltip_AsString());
			}
			oRm.addStyle("width", oControl.getWidth() || null);
			oRm.addStyle("height", oControl.getHeight() || null);
			oRm.writeStyles();
			oRm.write(">"); // span element
			// render the remainder of the HTML
			oRm.write(oControl._getDisplayHtml());
			oRm.write("</div>");
		};

		return FormattedTextRenderer;

	}, /* bExport= */ true);
