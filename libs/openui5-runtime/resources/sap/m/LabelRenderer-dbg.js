/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides the default renderer for control sap.m.Label
sap.ui.define(['jquery.sap.global', 'sap/ui/core/Renderer'],
	function(jQuery, Renderer) {
	"use strict";

	/**
	 * Label renderer.
	 *
	 * @author SAP SE
	 * @namespace
	 */
	var LabelRenderer = {};

	/**
	 * Renders the HTML for the given control, using the provided {@link sap.ui.core.RenderManager}.
	 *
	 * @param {sap.ui.core.RenderManager} rm The RenderManager that can be used for writing to the renderer output buffer
	 * @param {sap.ui.core.Control} oLabel An object representation of the control that should be rendered
	 */
	LabelRenderer.render = function(rm, oLabel){
		// convenience variable
		var r = LabelRenderer,
			sTextDir = oLabel.getTextDirection(),
			sTextAlign = oLabel.getTextAlign(),
			sWidth = oLabel.getWidth(),
			sLabelText = oLabel.getText(),
			sTooltip = oLabel.getTooltip_AsString(),
			labelForRendering = oLabel.getLabelForRendering(),
			htmlTagToRender = labelForRendering ? "label" : "span",
			bDisplayOnly = oLabel.getDisplayOnly();

		// write the HTML into the render manager
		// for accessibility reasons when a label doesn't have a "for" attribute, pointing at a HTML element it is rendered as span
		rm.write("<" + htmlTagToRender);
		rm.writeControlData(oLabel);

		// styles
		rm.addClass("sapMLabel");
		rm.addClass("sapUiSelectable");

		// label wrapping
		if (oLabel.getWrapping()) {
			rm.addClass("sapMLabelWrapped");
		}
		// set design to bold
		if (oLabel.getDesign() == sap.m.LabelDesign.Bold) {
			rm.addStyle("font-weight", "bold");
		}

		if (oLabel.isRequired()) {
			rm.addClass("sapMLabelRequired");
		}

		if (labelForRendering) {
			sap.ui.core.LabelEnablement.writeLabelForAttribute(rm, oLabel);
		} else if (oLabel.getParent() instanceof sap.m.Toolbar) {
			rm.addClass("sapMLabelTBHeader");
		}

		// text direction
		if (sTextDir !== sap.ui.core.TextDirection.Inherit){
			rm.writeAttribute("dir", sTextDir.toLowerCase());
		}

		// style for width
		if (sWidth) {
			rm.addStyle("width", sWidth);
		} else {
			rm.addClass("sapMLabelMaxWidth");
		}

		// style for text alignment
		if (sTextAlign) {
			sTextAlign = r.getTextAlign(sTextAlign, sTextDir);
			if (sTextAlign) {
				rm.addStyle("text-align", sTextAlign);
			}
		}

		if (sLabelText == "") {
			rm.addClass("sapMLabelNoText");
		}

		if (bDisplayOnly) {
			rm.addClass("sapMLabelDisplayOnly");
		}

		rm.writeStyles();
		rm.writeClasses();

		if (sTooltip) {
			rm.writeAttributeEscaped("title", sTooltip);
		}

		rm.write(">");

		// write the label text
		rm.write("<bdi id=\"" + oLabel.getId() + "-bdi\" >");
		if (sLabelText) {
			rm.writeEscaped(sLabelText);
		}
		rm.write("</bdi>");

		rm.write("</" + htmlTagToRender + ">");
	};

	/**
	 * Dummy inheritance of static methods/functions.
	 * @see sap.ui.core.Renderer.getTextAlign
	 * @private
	 */
	LabelRenderer.getTextAlign = Renderer.getTextAlign;

	return LabelRenderer;

}, /* bExport= */ true);
