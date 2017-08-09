/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides default renderer for control sap.f.Avatar
sap.ui.define([],
	function () {
		"use strict";

		/**
		 * <code>Avatar</code> renderer.
		 * @author SAP SE
		 * @namespace
		 */
		var AvatarRenderer = {};

		/**
		 * Renders the HTML for the given control, using the provided {@link sap.ui.core.RenderManager}.
		 *
		 * @param {sap.ui.core.RenderManager} oRm the RenderManager that can be used for writing to the Render-Output-Buffer
		 * @param {sap.ui.core.Control} oAvatar an object representation of the control that should be rendered
		 */
		AvatarRenderer.render = function (oRm, oAvatar) {
			var sInitials = oAvatar.getInitials(),
				sActualDisplayType = oAvatar._getActualDisplayType(),
				sDisplaySize = oAvatar.getDisplaySize(),
				sDisplayShape = oAvatar.getDisplayShape(),
				sImageFitType = oAvatar.getImageFitType(),
				sCustomDisplaySize = oAvatar.getCustomDisplaySize(),
				sCustomFontSize = oAvatar.getCustomFontSize(),
				sSrc = oAvatar.getSrc(),
				sAvatarClass = "sapFAvatar";

			oRm.write("<span");
			oRm.writeControlData(oAvatar);
			oRm.addClass(sAvatarClass);
			oRm.addClass(sAvatarClass + sDisplaySize);
			oRm.addClass(sAvatarClass + sActualDisplayType);
			oRm.addClass(sAvatarClass + sDisplayShape);
			if (oAvatar.hasListeners("press")) {
				oRm.addClass("sapMPointer");
				oRm.addClass("sapFAvatarFocusable");
				oRm.writeAccessibilityState(oAvatar, {
					"role": "button"
				});
				oRm.writeAttribute("tabIndex", 0);
			}
			if (sActualDisplayType === sap.f.AvatarType.Image) {
				oRm.addClass(sAvatarClass + sActualDisplayType + sImageFitType);
				oRm.addStyle("background-image", "url('" + jQuery.sap.encodeHTML(sSrc) + "')");
			}
			if (sDisplaySize === sap.f.AvatarSize.Custom) {
				oRm.addStyle("width", sCustomDisplaySize);
				oRm.addStyle("height", sCustomDisplaySize);
				oRm.addStyle("font-size", sCustomFontSize);
			}
			oRm.writeClasses();
			oRm.writeStyles();
			oRm.write(">");
			if (sActualDisplayType === sap.f.AvatarType.Icon) {
				oRm.renderControl(oAvatar._getIcon());
			} else if (sActualDisplayType === sap.f.AvatarType.Initials){
				oRm.write("<span");
				oRm.addClass(sAvatarClass + "InitialsHolder");
				oRm.writeClasses();
				oRm.write(">");
				oRm.writeEscaped(sInitials);
				oRm.write("</span>");
			}
			oRm.write("</span>");
		};

		return AvatarRenderer;
	}, /* bExport= */ true);