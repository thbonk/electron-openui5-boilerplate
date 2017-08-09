/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define([
	"jquery.sap.global",
	"sap/ui/core/Icon",
	"sap/ui/core/IconPool",
	"sap/m/Image"
], function (jQuery, Icon, IconPool, Image) {
	"use strict";

	var ObjectImageHelper = function() {
	};

	ObjectImageHelper.createObjectImage = function(oHeader) {
		var oObjectImage,
			sObjectImageURI = oHeader.getObjectImageURI();

		if (sObjectImageURI.indexOf("sap-icon://") === 0) {
			oObjectImage = new Icon();
			oObjectImage.addStyleClass("sapUxAPObjectPageHeaderObjectImageIcon");
		} else {
			oObjectImage = new Image({
				densityAware: oHeader.getObjectImageDensityAware(),
				alt: oHeader.getObjectImageAlt(),
				decorative: false
			});

			oObjectImage.addStyleClass("sapUxAPObjectPageHeaderObjectImage");
		}

		oObjectImage.setSrc(sObjectImageURI);

		if (oHeader.getObjectImageAlt()) {
			oObjectImage.setTooltip(oHeader.getObjectImageAlt());
		}
		return oObjectImage;
	};

	ObjectImageHelper.createPlaceholder = function() {
		return IconPool.createControlByURI({
			src: IconPool.getIconURI("picture"),
			visible: true
		});
	};

	ObjectImageHelper._renderImageAndPlaceholder = function(oRm, oOptions) {

		var oHeader = oOptions.oHeader,
			oObjectImage = oOptions.oObjectImage,
			oPlaceholder = oOptions.oPlaceholder,
			bIsObjectIconAlwaysVisible = oOptions.bIsObjectIconAlwaysVisible,
			bAddSubContainer = oOptions.bAddSubContainer,
			sBaseClass = oOptions.sBaseClass,
			bShowPlaceholder = !(oHeader.getObjectImageShape() || oHeader.getShowPlaceholder()),
			bAddIconContainer = (oObjectImage instanceof Icon);

		if (oHeader.getObjectImageURI() || oHeader.getShowPlaceholder()) {
			oRm.write("<span ");
			oRm.addClass(sBaseClass);
			oRm.addClass('sapUxAPObjectPageHeaderObjectImage-' + oHeader.getObjectImageShape());
			if (bIsObjectIconAlwaysVisible) {
				oRm.addClass('sapUxAPObjectPageHeaderObjectImageForce');
			}
			oRm.writeClasses();
			oRm.write(">");

			if (bAddSubContainer) { // add subContainer
				oRm.write("<span class='sapUxAPObjectPageHeaderObjectImageContainerSub'>");
			}

			if (bAddIconContainer) {
				oRm.write("<div");
				oRm.addClass("sapUxAPObjectPageHeaderObjectImage");
				oRm.addClass("sapUxAPObjectPageHeaderPlaceholder");
				oRm.writeClasses();
				oRm.write(">");
			}

			oRm.renderControl(oObjectImage);
			ObjectImageHelper._renderPlaceholder(oRm, oPlaceholder, bShowPlaceholder);

			if (bAddIconContainer) {
				oRm.write("</div>"); // close icon container
			}

			if (bAddSubContainer) { // close subContainer
				oRm.write("</span>");
			}
			oRm.write("</span>");
		}
	};


	/**
	 * Renders the SelectTitleArrow icon.
	 *
	 * @param {sap.ui.core.RenderManager}
	 *            oRm the RenderManager that can be used for writing to the render output buffer
	 *
	 * @param {sap.uxap.ObjecPageHeader}
	 *            oControl the ObjectPageHeader
	 *
	 * @param {bVisible}  if the placeholder will be visible
	 *
	 * @private
	 */
	ObjectImageHelper._renderPlaceholder = function (oRm, oPlaceholder, bVisible) {
		oRm.write("<div");
		oRm.addClass('sapUxAPObjectPageHeaderPlaceholder');
		oRm.addClass('sapUxAPObjectPageHeaderObjectImage');
		if (!bVisible) {
			oRm.addClass('sapUxAPHidePlaceholder');
		}
		oRm.writeClasses();
		oRm.write(">");
		oRm.renderControl(oPlaceholder);
		oRm.write("</div>");
	};

	return ObjectImageHelper;

}, /* bExport= */ false);
