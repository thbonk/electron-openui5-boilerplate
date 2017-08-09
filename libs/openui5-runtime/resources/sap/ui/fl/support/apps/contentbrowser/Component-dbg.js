/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define(["sap/ui/core/UIComponent"],
	function (UIComponent) {
		"use strict";

		var Component = UIComponent.extend("sap.ui.fl.support.apps.contentbrowser.Component", {
			init: function () {
				var that = this;
				// call the init function of the parent
				UIComponent.prototype.init.apply(this, arguments);

				// set i18n
				var oI18nModel = new sap.ui.model.resource.ResourceModel({
					bundleUrl: "sap.ui.fl.support.apps.contentbrowser.i18n.i18n.properties"
				});
				this.setModel("i18n", oI18nModel);

				var sMessages = [];
				var oMessagesModel = new sap.ui.model.json.JSONModel(sMessages);
				this.setModel(oMessagesModel, "messages");
				sap.ui.require(["sap/ui/fl/support/apps/contentbrowser/utils/ErrorUtils"], function (ErrorUtils) {
					ErrorUtils.setMessagesModel(that, oMessagesModel);
				});


				var oContentJson = {};
				var oContentJsonModel = new sap.ui.model.json.JSONModel(oContentJson);
				this.setModel(oContentJsonModel, "content");

				var oLayersJson = [
					{
						name: "All",
						icon: "sap-icon://world"
					},
					{
						name: "VENDOR",
						icon: "sap-icon://sap-logo-shape"
					},
					{
						name: "PARTNER",
						icon: "sap-icon://supplier"
					},
					{
						name: "CUSTOMER_BASE",
						icon: "sap-icon://customer-and-supplier"
					},
					{
						name: "CUSTOMER",
						icon: "sap-icon://customer"
					},
					{
						name: "LOAD",
						icon: "sap-icon://database"
					},
					{
						name: "USER",
						icon: "sap-icon://person-placeholder"
					}
				];
				var oLayersJsonModel = new sap.ui.model.json.JSONModel(oLayersJson);
				this.setModel(oLayersJsonModel, "layers");

				// create the views based on the url/hash
				this.getRouter().initialize();
			},
			metadata: {
				manifest: "json"
			}
		});


		return Component;
	}
);
