/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2018 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define([
	"sap/ui/fl/LrepConnector",
	"sap/ui/rta/appVariant/AppVariantUtils",
	"sap/base/i18n/ResourceBundle"],
	function(LrepConnector, AppVariantUtils, ResourceBundle) {
		"use strict";

		var Utils = {};

		var sModulePath = sap.ui.require.toUrl("sap/ui/rta/appVariant/manageApps/") + "webapp";
		var oI18n = ResourceBundle.create({
			url : sModulePath + "/i18n/i18n.properties"
		});

		Utils.sendRequest = function(sRoute, sOperation) {
			var oLREPConnector = LrepConnector.createConnector();
			return oLREPConnector.send(sRoute, sOperation);
		};

		Utils.getAppVariantOverviewAttributes = function(oAppVariantInfo, bKeyUser) {
			var oAppVariantAttributes;
			var fnCheckAppType = function() {
				if (oAppVariantInfo.isOriginal && oAppVariantInfo.isAppVariant) {
					return oI18n.getText("MAA_ORIGINAL_TYPE");
				} else if (oAppVariantInfo.isAppVariant) {
					return oI18n.getText("MAA_APP_VARIANT_TYPE");
				} else if (oAppVariantInfo.isOriginal) {
					return oI18n.getText("MAA_ORIGINAL_TYPE");
				}
			};

			var fncheckNavigationSupported = function(oNavigationParams) {
				var oNavigationService = sap.ushell.Container.getService( "CrossApplicationNavigation" );
				return oNavigationService.getLinks(oNavigationParams);
			};

			var fnGetNavigationInfo = function(oAppVariantAttributes) {
				if (oAppVariantInfo.hasStartableIntent) {
					var sSemanticObject = oAppVariantInfo.startWith.semanticObject;
					var sAction = oAppVariantInfo.startWith.action;
					var oParams = oAppVariantInfo.startWith.parameters;

					var oNavigationParams = {
						semanticObject : sSemanticObject,
						action : sAction,
						params: oParams
					};

					return fncheckNavigationSupported(oNavigationParams).then(function(aResult) {
						if (aResult.length && bKeyUser) {
							oAppVariantAttributes.adaptUIButtonVisibility = true;
						} else {
							oAppVariantAttributes.adaptUIButtonVisibility = false;
						}
						oAppVariantAttributes.semanticObject = sSemanticObject;
						oAppVariantAttributes.action = sAction;

						if (oParams) {
							Object.keys(oParams).forEach(function(sParamValue) {
								if (oParams[sParamValue].value) {
									oParams[sParamValue] = oParams[sParamValue].value;
								}
							});

							oAppVariantAttributes.params = oParams;
						}
						return Promise.resolve(oAppVariantAttributes);
					});
				} else {
					oAppVariantAttributes.adaptUIButtonVisibility = false;
					return Promise.resolve(oAppVariantAttributes);
				}
			};

			// Adding the tooltip to every icon which is shown on the App Variant Overview Dialog
			var sIconUrl = oAppVariantInfo.iconUrl;
			if (sIconUrl && sap.ui.core.IconPool.isIconURI(sIconUrl)) {
				oAppVariantInfo.iconText = sIconUrl.split('//')[1];
			}

			oAppVariantAttributes = {
				appId : oAppVariantInfo.appId,
				title : oAppVariantInfo.title || '',
				subTitle : oAppVariantInfo.subTitle || '',
				description : oAppVariantInfo.description || '',
				icon : oAppVariantInfo.iconUrl || '',
				iconText : oAppVariantInfo.iconText,
				isOriginal : oAppVariantInfo.isOriginal,
				typeOfApp : fnCheckAppType(),
				descriptorUrl : oAppVariantInfo.descriptorUrl,
				isKeyUser : bKeyUser
			};

			var sNewAppVariantId = AppVariantUtils.getNewAppVariantId();

			if (sNewAppVariantId === oAppVariantInfo.appId) {
				oAppVariantAttributes.currentStatus = oI18n.getText("MAA_NEW_APP_VARIANT");
			}

			return fnGetNavigationInfo(oAppVariantAttributes);
		};

		Utils.getAppVariantOverview = function(sReferenceAppId, bKeyUser) {
			// Customer* means the layer can be either CUSTOMER or CUSTOMER_BASE. This layer calculation will be done backendside
			var sLayer = bKeyUser ? 'CUSTOMER*' : 'VENDOR';
			var sRoute = '/sap/bc/lrep/app_variant_overview/?sap.app/id=' + sReferenceAppId + '&layer=' + sLayer;

			return this.sendRequest(sRoute, 'GET').then(function(oResult) {
				var aAppVariantOverviewInfo = [];
				var aAppVariantInfo;
				if (oResult.response && oResult.response.items) {
					aAppVariantInfo = oResult.response.items;
				} else {
					return Promise.resolve([]);
				}

				aAppVariantInfo.forEach(function(oAppVariantInfo) {
					if (!oAppVariantInfo.isDescriptorVariant) {
						aAppVariantOverviewInfo.push(this.getAppVariantOverviewAttributes(oAppVariantInfo, bKeyUser));
					}
				}, this);

				return Promise.all(aAppVariantOverviewInfo).then(function(aResponses) {
					return aResponses;
				});

			}.bind(this));
		};

		Utils.getDescriptor = function(sDescriptorUrl) {
			return this.sendRequest(sDescriptorUrl, 'GET').then(function(oResult) {
				return oResult.response;
			});
		};

	return Utils;
}, /* bExport= */true);