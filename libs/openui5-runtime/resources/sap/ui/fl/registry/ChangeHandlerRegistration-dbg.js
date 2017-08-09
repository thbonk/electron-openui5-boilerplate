/*!
* UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
*/

sap.ui.define(["sap/ui/fl/registry/ChangeRegistry"], function(ChangeRegistry) {
	"use strict";

	var ChangeHandlerRegistration = {
		getChangeHandlersOfLoadedLibsAndRegisterOnNewLoadedLibs: function () {
			var that = this;
			var oCore = sap.ui.getCore();
			var oAlreadyLoadedLibraries = oCore.getLoadedLibraries();

			jQuery.each(oAlreadyLoadedLibraries, function (sLibraryName, oLibrary) {
				if (oLibrary.extensions && oLibrary.extensions.flChangeHandlers) {
					that.registerFlexChangeHandlers(oLibrary.extensions.flChangeHandlers);
				}
			});

			oCore.attachLibraryChanged(this.handleLibraryRegistrationAfterFlexLibraryIsLoaded.bind(this));

		},

		registerFlexChangeHandlers: function (oFlChangeHandlers) {
			if (oFlChangeHandlers) {
				var oChangeRegistryInstance = ChangeRegistry.getInstance();
				oChangeRegistryInstance.registerControlsForChanges(oFlChangeHandlers);
			}
		},

		handleLibraryRegistrationAfterFlexLibraryIsLoaded: function (oLibraryChangedEvent) {
			if (oLibraryChangedEvent.getParameter("operation") === "add") {
				var oLibMetadata = oLibraryChangedEvent.getParameter("metadata");
				if (oLibMetadata && oLibMetadata.extensions && oLibMetadata.extensions.flChangeHandlers) {
					var oFlChangeHandlers = oLibMetadata.extensions.flChangeHandlers;
					this.registerFlexChangeHandlers(oFlChangeHandlers);
				}
			}
		}
	};

	return ChangeHandlerRegistration;

}, true);
