/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/fl/support/apps/contentbrowser/utils/ErrorUtils"
], function (Controller, ErrorUtils) {
	"use strict";

	/**
	 * Controller for layers list in the browser.
	 *
	 * @constructor
	 * @alias sap.ui.fl.support.apps.contentbrowser.controller.Layers
	 * @author SAP SE
	 * @version 1.48.5
	 * @experimental Since 1.45
	 */
	return Controller.extend("sap.ui.fl.support.apps.contentbrowser.controller.Layers", {
		/**
		 * Handler for triggering the navigation to a selected layer.
		 * @param {Object} oEvent
		 * @public
		 */
		onLayerSelected: function (oEvent) {
			var oSource = oEvent.getSource();
			var sLayerBindingPath = oSource.getBindingContextPath().substring(1);
			var oLayerModelData = this.getView().getModel("layers").getData();
			var sLayerName = oLayerModelData[sLayerBindingPath].name;

			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("LayerContentMaster", {"layer": sLayerName});
		},

		/**
		 * Handler for displaying the stored error messages.
		 * @param {Object} oEvent
		 * @public
		 */
		handleMessagePopoverPress: function (oEvent) {
			var oSource = oEvent.getSource();
			ErrorUtils.handleMessagePopoverPress(oSource);
		}
	});
});
