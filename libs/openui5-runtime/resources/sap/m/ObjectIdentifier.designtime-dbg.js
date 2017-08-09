/*
 * ! UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides the Design Time Metadata for the sap.m.ObjectIdentifier control.
sap.ui.define([
	'sap/m/library'
], function(MLibrary) {
	"use strict";
	var oWrapper;
	return {
		// There is a dependency to 'sap.ui.comp' library because the so called 'settings' handler is implemented for SmartLink. So we register
		// the 'settings' handler in 'sap.ui.comp' library which basically do the same stuff as for SmartLink. The registration mechanism has been
		// chosen in order to be on the save site if 'sap.ui.comp' library is not used at all (e.g. OpenUI5).
		registerSettingsHandler: function(oWrapper_) {
			oWrapper = oWrapper_;
		},
		getStableElements: function(oObjectIdentifier) {
			return oWrapper ? oWrapper.getStableElements(oObjectIdentifier) : null;
		},
		actions: {
			settings: function() {
				if (!oWrapper) {
					return;
				}
				if (!oWrapper.isSettingsAvailable()) {
					jQuery.sap.log.error("sap.ui.comp.navpopover.ObjectIdentifier.designtime: 'settings' action is not available");
					return;
				}
				return {
					handler: function(oObjectIdentifier, fGetUnsavedChanges) {
						return oWrapper.execute(oObjectIdentifier, fGetUnsavedChanges);
					}
				};
			}
		}
	};
}, /* bExport= */false);
