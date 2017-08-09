/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define(["./WizardProgressNavigator"], function (WizardProgressNavigator) {
	"use strict";

	var CLASSES = WizardProgressNavigator.CLASSES,
		ATTRIBUTES = WizardProgressNavigator.ATTRIBUTES,
		WizardProgressNavigatorRenderer = {};

	WizardProgressNavigatorRenderer.render = function (oRm, oControl) {
		this.startNavigator(oRm, oControl);

		this.renderList(oRm, oControl);

		this.endNavigator(oRm);
	};

	WizardProgressNavigatorRenderer.startNavigator = function (oRm, oControl) {
		var sWizardLabelText = sap.ui.getCore().getLibraryResourceBundle("sap.m").getText("WIZARD_LABEL");

		oRm.write("<nav");
		oRm.writeControlData(oControl);
		oRm.writeAttribute("class", CLASSES.NAVIGATION + " sapContrastPlus");
		oRm.writeAttribute(ATTRIBUTES.STEP_COUNT, oControl.getStepCount());
		oRm.writeAccessibilityState({
			"role": "navigation",
			"label": sWizardLabelText
		});
		oRm.write(">");
	};

	WizardProgressNavigatorRenderer.renderList = function (oRm, oControl) {
		this.startList(oRm, oControl);
		this.renderSteps(oRm, oControl);
		this.endList(oRm);
	};

	WizardProgressNavigatorRenderer.startList = function (oRm, oControl) {
		var aStepTitles = oControl.getStepTitles();

		oRm.write("<ul");

		if (oControl.getVaryingStepCount()) {
			oRm.addClass(CLASSES.LIST_VARYING);
		} else {
			oRm.addClass(CLASSES.LIST);
		}

		if (!aStepTitles.length) {
			oRm.addClass(CLASSES.LIST_NO_TITLES);
		}

		oRm.writeAccessibilityState({
			"role": "list"
		});

		oRm.writeClasses();
		oRm.write(">");
	};

	WizardProgressNavigatorRenderer.renderSteps = function (oRm, oControl) {
		var iStepCount = oControl.getStepCount(),
			aStepTitles = oControl.getStepTitles(),
			aStepIcons = oControl.getStepIcons();

		for (var i = 1; i <= iStepCount; i++) {
			this.startStep(oRm, i);
			this.renderAnchor(oRm, oControl, i, aStepTitles[i - 1], aStepIcons[i - 1]);
			this.endStep(oRm);
		}
	};

	WizardProgressNavigatorRenderer.startStep = function (oRm, iStepNumber) {
		oRm.write("<li");
		oRm.writeAttribute("class", CLASSES.STEP);
		oRm.writeAttribute(ATTRIBUTES.STEP, iStepNumber);

		oRm.writeAccessibilityState({
			"role": "listitem"
		});

		oRm.write(">");
	};

	WizardProgressNavigatorRenderer.renderAnchor = function (oRm, oControl, iStepNumber, sStepTitle, sIconUri) {
		var aSteps = oControl._cachedSteps,
			oCurrentStep = aSteps[iStepNumber],
			sStepText = sap.ui.getCore().getLibraryResourceBundle("sap.m").getText("WIZARD_PROG_NAV_STEP_TITLE");

		oRm.write("<a tabindex='-1' ");
		if (!oCurrentStep || !!parseInt(oCurrentStep.style.zIndex, 10)) {
			oRm.write("aria-disabled='true'");
		}

		oRm.writeAttribute("class", CLASSES.ANCHOR);

		if (sStepTitle) {
			oRm.writeAttributeEscaped("title", iStepNumber + ". " + sStepTitle);
		} else {
			oRm.writeAttributeEscaped("title", sStepText + " " + iStepNumber);
		}

		oRm.write(">");

		oRm.write("<span");
		oRm.writeAttribute("class", CLASSES.ANCHOR_CIRCLE);
		oRm.write(">");

		if (sIconUri) {
			oRm.writeIcon(sIconUri, [CLASSES.ANCHOR_ICON], {title: null});
		} else {
			oRm.write(iStepNumber);
		}

		oRm.write("</span>");

		if (sStepTitle) {
			oRm.write("<span");
			oRm.writeAttribute("class", CLASSES.ANCHOR_TITLE);
			oRm.write(">");
			oRm.writeEscaped(sStepTitle);
			oRm.write("</span>");
		}

		oRm.write("</a>");
	};

	WizardProgressNavigatorRenderer.endStep = function (oRm) {
		oRm.write("</li>");
	};

	WizardProgressNavigatorRenderer.endList = function (oRm) {
		oRm.write("</ul>");
	};

	WizardProgressNavigatorRenderer.endNavigator = function (oRm) {
		oRm.write("</nav>");
	};

	return WizardProgressNavigatorRenderer;

}, /* bExport= */ true);
