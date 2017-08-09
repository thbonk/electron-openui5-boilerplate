/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global'],
	function(jQuery) {
	"use strict";


	/**
	 * ActionSheet renderer.
	 * @namespace
	 */
	var ActionSheetRenderer = {
	};


	/**
	 * Renders the HTML for the given control, using the provided {@link sap.ui.core.RenderManager}.
	 *
	 * @param {sap.ui.core.RenderManager} oRm the RenderManager that can be used for writing to the render output buffer
	 * @param {sap.ui.core.Control} oControl an object representation of the control that should be rendered
	 */
	ActionSheetRenderer.render = function(oRm, oControl){
		var aActionButtons = oControl._getAllButtons(),
			aInvisibleTexts = oControl.getAggregation("_invisibleAriaTexts"),
			oResourceBundle = sap.ui.getCore().getLibraryResourceBundle('sap.m'),
			iButtonsCount = aActionButtons.length,
			bAccessibilityOn = sap.ui.getCore().getConfiguration().getAccessibility(),
			iVisibleButtonCount = aActionButtons.filter(function (oButton) { return oButton.getVisible(); }).length,
			oCurInvisibleText, i, bMixedButtons, oButton, iVisibleButtonTempCount = 1,
			fnGetRelatedInvisibleText = function (oBtn) {
				return aInvisibleTexts.filter(function (oInvisibleText) {
					return oInvisibleText.getId().indexOf(oBtn.getId()) > -1;
				})[0];
			};

		for (i = 0 ; i < iButtonsCount ; i++) {
			oButton = aActionButtons[i];
			oButton.removeStyleClass("sapMActionSheetButtonNoIcon");
			if (oButton.getIcon() && oButton.getVisible()) {
				bMixedButtons = true;
			} else {
				oButton.addStyleClass("sapMActionSheetButtonNoIcon");
			}
		}

		// write the HTML into the render manager
		oRm.write("<div");
		oRm.writeControlData(oControl);
		oRm.addClass("sapMActionSheet");
		if (bMixedButtons) {
			oRm.addClass("sapMActionSheetMixedButtons");
		}
		oRm.writeClasses();

		var sTooltip = oControl.getTooltip_AsString();
		if (sTooltip) {
			oRm.writeAttributeEscaped("title", sTooltip);
		}

		oRm.write(">");

		for (i = 0 ; i < iButtonsCount ; i++) {
			oButton = aActionButtons[i];
			oRm.renderControl(aActionButtons[i].addStyleClass("sapMActionSheetButton"));

			if (bAccessibilityOn && oButton.getVisible()) {

				// It's not guaranteed that Button aggregation order is the same as InvisibleTexts aggregation order.
				// So, just find the proper matching between Button & Text
				oCurInvisibleText = fnGetRelatedInvisibleText(oButton);

				if (oCurInvisibleText) {
					oCurInvisibleText.setText(oResourceBundle.getText('ACTIONSHEET_BUTTON_INDEX', [iVisibleButtonTempCount, iVisibleButtonCount]));
					oRm.renderControl(oCurInvisibleText);
				}
				iVisibleButtonTempCount++;
			}
		}

		if (sap.ui.Device.system.phone && oControl.getShowCancelButton()) {
			oRm.renderControl(oControl._getCancelButton());
		}

		oRm.write("</div>");
	};


	return ActionSheetRenderer;

}, /* bExport= */ true);
