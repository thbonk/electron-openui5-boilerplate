/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2018 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.ui.support.Bootstrap.
sap.ui.define(["jquery.sap.global"],
	function (jQuery) {
	"use strict";

	var Bootstrap = {
		initSupportRules: function (aSettings, oDelegates) {
			sap.ui.require(["sap/ui/support/supportRules/Main", "sap/ui/support/jQuery.sap.support"], function (Main) {
				if (aSettings[0].toLowerCase() === "true" || aSettings[0].toLowerCase() === "silent") {

					var bHasReadyFunction = oDelegates && oDelegates.onReady && typeof oDelegates.onReady === "function";

					if (!Main._pluginStarted) {
						if (bHasReadyFunction) {
							Main.attachEvent("ready", oDelegates.onReady);
						}

						Main.startPlugin(aSettings);
					} else {
						if (bHasReadyFunction) {
							oDelegates.onReady();
						}
					}

					/**
					 * Enables the additional logging capabilities of the logger,
					 * allowing the developers to pass custom data, that is later going to be added
					 * to the executionScope of the rules
					 */
					if ('logSupportInfo' in jQuery.sap.log) {
						jQuery.sap.log.logSupportInfo(true);
					}
				}
			});
		}
	};

	return Bootstrap;
});
