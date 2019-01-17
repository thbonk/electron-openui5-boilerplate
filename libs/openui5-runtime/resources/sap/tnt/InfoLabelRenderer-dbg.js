/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2018 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides the default renderer for control sap.tnt.InfoLabel
sap.ui.define(["./library", "sap/ui/core/Renderer", "sap/ui/core/library"],
	function(library, Renderer, coreLibrary) {
		"use strict";

		var RenderMode = library.RenderMode;
		var TextDirection = coreLibrary.TextDirection;

		/**
		 * <code>InfoLabel</code> renderer.
		 *
		 * @author SAP SE
		 * @namespace
		 */
		var InfoLabelRenderer = {};

		/**
		 * Renders the HTML for the given control, using the provided {@link sap.ui.core.RenderManager}.
		 *
		 * @param {sap.ui.core.RenderManager} oRm The <code>RenderManager</code> that can be used for writing to the renderer output buffer
		 * @param {sap.tnt.InfoLabel} oControl An object representation of the control that should be rendered
		 */
		InfoLabelRenderer.render = function (oRm, oControl) {
			var iColorVariant = oControl.getColorScheme(),
				sRenderMode = oControl.getRenderMode(),
				sText = oControl.getText(),
				sTextDir = oControl.getTextDirection(),
				sWidth = oControl.getWidth(),
				bDisplayOnly = oControl.getDisplayOnly();

			oRm.write("<div");
			oRm.writeControlData(oControl);
			oRm.addClass("sapTntInfoLabel");

			if (sRenderMode === RenderMode.Narrow) {
				oRm.addClass("sapTntInfoLabelRenderModeNarrow");
			}

			if (bDisplayOnly) {
				oRm.addClass("sapTntInfoLabelDisplayOnly");
			}

			if (sText === "") {
				oRm.addClass("sapTntInfoLabelNoText");
			}

			if (sWidth) {
				oRm.addStyle("width", sWidth);
			}
			oRm.addClass("backgroundColor" + iColorVariant );
			oRm.writeClasses();
			oRm.writeStyles();

			oRm.write(">");

			oRm.write("<span");
			oRm.addClass("sapTntInfoLabelInner");
			oRm.writeClasses();

			if (sTextDir !== TextDirection.Inherit){
				oRm.writeAttribute("dir", sTextDir.toLowerCase());
			}

			oRm.write(">");
			oRm.writeEscaped(sText);
			oRm.write("</span>");

			if (InfoLabelRenderer._sAriaText) {

				oRm.write("<span class='sapUiPseudoInvisibleText'>");

				if (sText === "") {
					oRm.writeEscaped(InfoLabelRenderer._sAriaTextEmpty);
				} else {
					oRm.writeEscaped(InfoLabelRenderer._sAriaText);
				}

				oRm.write("</span>");
			}

			oRm.write("</div>");
		};

		return InfoLabelRenderer;

	}, /* bExport= */ true);