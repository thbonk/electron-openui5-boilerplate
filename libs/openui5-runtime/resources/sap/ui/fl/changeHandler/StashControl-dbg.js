/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define([
	"jquery.sap.global"
], function(
	jQuery
) {
	"use strict";

	/**
	 * Change handler for stashing of a control.
	 * @alias sap.ui.fl.changeHandler.StashControl
	 * @author SAP SE
	 * @version 1.50.8
	 * @experimental Since 1.27.0
	 */
	var StashControl = {};

	/**
	 * Stashes and hides a control.
	 *
	 * @param {sap.ui.fl.Change} oChange change object with instructions to be applied on the control map
	 * @param {sap.ui.core.Control} oControl control that matches the change selector for applying the change
	 * @param {object} mPropertyBag	- map of properties
	 * @param {object} mPropertyBag.modifier - modifier for the controls
	 * @returns {boolean} true - if change could be applied
	 * @public
	 */
	StashControl.applyChange = function(oChange, oControl, mPropertyBag) {
		oChange.setRevertData({
			originalValue: mPropertyBag.modifier.getStashed(oControl)
		});

		mPropertyBag.modifier.setStashed(oControl, true);
		return true;
	};

	/**
	 * Reverts previously applied change
	 *
	 * @param {sap.ui.fl.Change} oChange change object with instructions to be applied on the control map
	 * @param {sap.ui.core.Control} oControl control that matches the change selector for applying the change
	 * @param {object} mPropertyBag	- map of properties
	 * @param {object} mPropertyBag.modifier - modifier for the controls
	 * @returns {boolean} true - if change has been reverted
	 * @public
	 */
	StashControl.revertChange = function(oChange, oControl, mPropertyBag) {
		var mRevertData = oChange.getRevertData();

		if (mRevertData) {
			mPropertyBag.modifier.setStashed(oControl, mRevertData.originalValue);
			oChange.resetRevertData();
		} else {
			jQuery.sap.log.error("Attempt to revert an unapplied change.");
			return false;
		}

		return true;
	};

	/**
	 * Completes the change by adding change handler specific content
	 *
	 * @param {sap.ui.fl.Change} oChange change object to be completed
	 * @param {object} oSpecificChangeInfo as an empty object since no additional attributes are required for this operation
	 * @public
	 */
	StashControl.completeChangeContent = function(oChange, oSpecificChangeInfo) {

	};

	return StashControl;
},
/* bExport= */true);
