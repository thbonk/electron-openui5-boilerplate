/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2018 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

/**
 * Card request handler
 * @experimental
 */
sap.ui.define(["jquery.sap.global", "sap/base/Log"], function (jQuery, log) {
	"use strict";

	var aModes = ["no-cors", "same-origin", "cors"];
	var aMethods = ["GET", "POST"];

	var data = {};

	data._isValidRequest = function (oRequest) {

		if (aModes.indexOf(oRequest.mode) === -1) {
			return false;
		}

		if (aMethods.indexOf(oRequest.method) === -1) {
			return false;
		}

		if (typeof oRequest.url !== "string") {
			return false;
		}

		return true;
	};

	data.fetch = function (oRequestConfig) {
		var sMessage = "Invalid request";

		return new Promise(function (resolve, reject) {

			if (!oRequestConfig) {
				log.error(sMessage);
				reject(sMessage);
			}

			var oRequest = {
				"mode": oRequestConfig.mode || "cors",
				"url": oRequestConfig.url,
				"method": (oRequestConfig.method && oRequestConfig.method.toUpperCase()) || "GET",
				"data": oRequestConfig.parameters,
				"headers": oRequestConfig.headers,
				"timeout": 15000
			};

			if (oRequest.method === "GET") {
				oRequest.dataType = "json";
			}

			if (this._isValidRequest(oRequest)) {
				jQuery.ajax(oRequest).done(function (oData) {
					resolve(oData);
				}).fail(function (jqXHR, sTextStatus, sError) {
					reject(sError);
				});
			} else {
				log.error(sMessage);
				reject(sMessage);
			}
		}.bind(this));
	};

	return data;
});