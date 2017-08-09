/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides default renderer for control sap.m.Text
sap.ui.define(['jquery.sap.global', 'sap/ui/core/Renderer'],
	function(jQuery, Renderer) {
	"use strict";

	/**
	 * Text renderer.
	 *
	 * @author SAP SE
	 * @namespace
	 */
	var TextRenderer = {};

	/**
	 * Renders the HTML for the given control, using the provided {@link sap.ui.core.RenderManager}.
	 *
	 * @param {sap.ui.core.RenderManager} oRm The RenderManager that can be used for writing to the render output buffer.
	 * @param {sap.m.Text} oText An object representation of the control that should be rendered.
	 */
	TextRenderer.render = function(oRm, oText) {
		// get control values
		var sWidth = oText.getWidth(),
			sText = oText.getText(true),
			sTextDir = oText.getTextDirection(),
			sTooltip = oText.getTooltip_AsString(),
			nMaxLines = oText.getMaxLines(),
			bWrapping = oText.getWrapping(),
			sTextAlign = oText.getTextAlign();

		// start writing html
		oRm.write("<span");
		oRm.writeControlData(oText);
		oRm.addClass("sapMText");
		oRm.addClass("sapUiSelectable");

		// set classes for wrapping
		if (!bWrapping || nMaxLines == 1) {
			oRm.addClass("sapMTextNoWrap");
		} else if (bWrapping) {
			// no space text must break
			if (sText && sText.length > 0 && !/\s/.test(sText)) {
				oRm.addClass("sapMTextBreakWord");
			}
		}

		// write style and attributes
		sWidth ? oRm.addStyle("width", sWidth) : oRm.addClass("sapMTextMaxWidth");
		if (sTextDir !== sap.ui.core.TextDirection.Inherit){
			oRm.writeAttribute("dir", sTextDir.toLowerCase());
		}
		sTooltip && oRm.writeAttributeEscaped("title", sTooltip);
		if (sTextAlign) {
			sTextAlign = Renderer.getTextAlign(sTextAlign, sTextDir);
			if (sTextAlign) {
				oRm.addStyle("text-align", sTextAlign);
			}
		}

		// finish writing html
		oRm.writeClasses();
		oRm.writeStyles();
		oRm.write(">");

		// handle max lines
		if (oText.hasMaxLines()) {
			this.renderMaxLines(oRm, oText);
		} else {
			this.renderText(oRm, oText);
		}

		// finalize
		oRm.write("</span>");
	};

	/**
	 * Renders the max lines inner wrapper
	 *
	 * @param {sap.ui.core.RenderManager} oRm The RenderManager that can be used for writing to the render output buffer.
	 * @param {sap.m.Text} oText An object representation of the control that should be rendered.
	 */
	TextRenderer.renderMaxLines = function(oRm, oText) {
		oRm.write("<span");
		oRm.writeAttribute("id", oText.getId() + "-inner");
		oRm.addClass("sapMTextMaxLine");

		oRm.writeClasses();
		oRm.writeStyles();
		oRm.write(">");
		this.renderText(oRm, oText);
		oRm.write("</span>");
	};

	/**
	 * Renders the normalized text property.
	 *
	 * @param {sap.ui.core.RenderManager} oRm The RenderManager that can be used for writing to the render output buffer.
	 * @param {sap.m.Text} oText An object representation of the control that should be rendered.
	 */
	TextRenderer.renderText = function(oRm, oText) {
		var sText = oText.getText(true);
		oRm.writeEscaped(sText);
	};

	return TextRenderer;

}, /* bExport= */ true);
