/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define([
	"sap/ui/fl/support/apps/contentbrowser/utils/HtmlEscapeUtils"
], function (HtmlEscapeUtils) {
	"use strict";

	/**
	 * Provides the connectivity to the layered repository REST service.
	 *
	 * @constructor
	 * @alias sap.ui.fl.support.apps.contentbrowser.lrepConnector.LRepConnector
	 * @author SAP SE
	 * @version 1.48.5
	 * @experimental Since 1.45
	 */
	var LrepConnector = {};

	LrepConnector.sContentPathPrefix = "/sap/bc/lrep/content";
	LrepConnector._sXcsrfToken = undefined;

	/**
	 * Gets content from the layered repository.
	 *
	 * @param {String} sLayer - determines the layer for obtaining the content
	 * @param {String} sContentSuffix - namespace plus filename and file type of content
	 * @param {Boolean} bReadContextMetadata - read content plus metadata information
	 * @param {Boolean} bReadRuntimeContext - gets the content in runtime instead of design time
	 * @param {Boolean} bRequestAsText - gets content data as plain text
	 * @returns {Promise} Promise of GET content request to the back end
	 * @public
	 */
	LrepConnector.getContent = function (sLayer, sContentSuffix, bReadContextMetadata, bReadRuntimeContext, bRequestAsText) {
		var that = this;

		var oGetContentPromise = new Promise(function (fnResolve, fnReject) {
			sContentSuffix = encodeURI(sContentSuffix);
			var sLayerSuffix = that._getLayerSuffix(sLayer);
			var sContextSuffix = that._getContextSuffix(sLayerSuffix, bReadRuntimeContext, bReadContextMetadata);
			var sUrl = LrepConnector.sContentPathPrefix + (sContentSuffix ? "" : "/") + sContentSuffix + sLayerSuffix + sContextSuffix;

			that._sendContentRequest(sUrl, fnResolve, fnReject, bRequestAsText);
		});

		return oGetContentPromise;
	};

	/**
	 * Saves a file to the layered repository.
	 *
	 * @param {String} sLayer - determines the layer for saving the content
	 * @param {String} sNamespace - namespace of the file
	 * @param {String} sFilename - name of the file
	 * @param {String} sFileType - type of the file
	 * @param {String} sContent - content of the file saved to the layered repository
	 * @returns {Promise} Promise of the SAVE content request to the back end
	 * @public
	 */
	LrepConnector.saveFile = function (sLayer, sNamespace, sFilename, sFileType, sContent) {
		var that = this;

		return new Promise(function (fnResolve, fnReject) {
			if (!sLayer || sNamespace === undefined || !sFilename || !sFileType) {
				fnReject();
			}

			var sContentSuffix = HtmlEscapeUtils.unescapeSlashes(sNamespace) + sFilename + "." + sFileType;
			var sLayerSuffix = that._getLayerSuffix(sLayer);
			var sUrl = LrepConnector.sContentPathPrefix + sContentSuffix + sLayerSuffix;
			that._getTokenAndSendPutRequest.call(that, sUrl, sContent, fnResolve, fnReject);
		});
	};

	/**
	 * Deletes a file from the layered repository.
	 *
	 * @param {String} sLayer - determines the layer for deleting the content
	 * @param {String} sNamespace - namespace of the file
	 * @param {String} sFileName - name of the file
	 * @param {String} sFileType - type of the file
	 * @returns {Promise} Promise of DELETE content request to the back end
	 * @public
	 */
	LrepConnector.deleteFile = function (sLayer, sNamespace, sFileName, sFileType) {
		var that = this;

		return new Promise(function (fnResolve, fnReject) {
			if (!sLayer || sNamespace === undefined || !sFileName || !sFileType) {
				fnReject();
			}

			var sContentSuffix = HtmlEscapeUtils.unescapeSlashes(sNamespace) + sFileName + "." + sFileType;
			var sLayerSuffix = that._getLayerSuffix(sLayer);
			var sUrl = LrepConnector.sContentPathPrefix + sContentSuffix + sLayerSuffix;
			that._getTokenAndSendDeletionRequest.call(that, sUrl, fnResolve, fnReject);
		});
	};

	/**
	 * Gets a XCSRF token for a REST request.
	 *
	 * @param {String} sUrl - URL that is required to get the token
	 * @returns {Promise} Promise of the GET token HEAD request to back end
	 * @private
	 */
	LrepConnector._getXcsrfToken = function (sUrl) {
		var that = this;
		return new Promise(function (sResolve, fnReject) {
			if (that._sXcsrfToken) {
				sResolve(that._sXcsrfToken);
			}

			jQuery.ajax({
				url: sUrl,
				type: "HEAD",
				beforeSend: function (oRequest) {
					oRequest.setRequestHeader("X-CSRF-Token", "fetch");
				},
				success: function (sData, sMsg, oJqXHR) {
					that._sXcsrfToken = oJqXHR.getResponseHeader("x-csrf-token");
					sResolve(that._sXcsrfToken);
				},
				error: function (jqXHR, sTextStatus, sErrorThrown) {
					LrepConnector._reportError(jqXHR, sTextStatus, sErrorThrown);
					fnReject(sErrorThrown);
				}
			});
		});
	};

	/**
	 * Get layer suffix for request URL;
	 * If all layers are selected, the layer suffix is empty.
	 * @param {String} sLayer - normal layer plus 'All'
	 * @returns {String} correct layer suffix
	 * @private
	 */
	LrepConnector._getLayerSuffix = function (sLayer) {
		if (sLayer === "All"){
			return "";
		}
		return "?layer=" + sLayer;
	};

	/**
	 * Get context suffix for request URL.
	 *
	 * @param {String} sLayerSuffix - layer suffix based on selected layer
	 * @param {Boolean} bReadRuntimeContext - gets content in runtime instead of design time
	 * @param {Boolean} bReadContextMetadata - reads content plus metadata information
	 * @returns {String} correct context suffix for URL request
	 * @private
	 */
	LrepConnector._getContextSuffix = function (sLayerSuffix, bReadRuntimeContext, bReadContextMetadata) {
		var sReadRuntimeContextSuffix = "";
		if (!bReadRuntimeContext) {
			sReadRuntimeContextSuffix += (sLayerSuffix ? "&" : "?");
			sReadRuntimeContextSuffix += "dt=true";
		}
		if (!!bReadContextMetadata) {
			sReadRuntimeContextSuffix += (sLayerSuffix || sReadRuntimeContextSuffix ? "&" : "?");
			sReadRuntimeContextSuffix += "metadata=true";
		}
		return sReadRuntimeContextSuffix;
	};

	/**
	 * Reports an error during back-end request.
	 *
	 * @param {Object} oJqXHR - "jqXHR " object which is returned from ajax request
	 * @param {String} sTextStatus - status text of the error
	 * @param {Object} oErrorThrown - object which containing the error description
	 * @private
	 */
	LrepConnector._reportError = function (oJqXHR, sTextStatus, oErrorThrown) {
		sap.ui.require(["sap/ui/fl/support/apps/contentbrowser/utils/ErrorUtils"], function (ErrorUtils) {
			ErrorUtils.displayError("Error", oJqXHR.status, sTextStatus + ": " + oErrorThrown);
		});
	};

	/**
	 * Sends a GET content request to the back end.
	 *
	 * @param {String} sUrl - request URL
	 * @param {Function} fnResolve - callback function if request was resolved
	 * @param {Function} fnReject - callback function if request was rejected
	 * @param {Boolean} bRequestAsText - sends ajax request with data type as plain text
	 * @private
	 */
	LrepConnector._sendContentRequest = function (sUrl, fnResolve, fnReject, bRequestAsText) {
		var oRequest = {
			url: sUrl,
			type: "GET",
			success: function (oData) {
				fnResolve(oData);
			},
			error: function (oJqXHR, sTextStatus, oErrorThrown) {
				LrepConnector._reportError(oJqXHR, sTextStatus, oErrorThrown);
				fnReject(oErrorThrown);
			}
		};
		//code extension content should be treated as plain text to avoid parser error.
		if (!!bRequestAsText){
			oRequest.dataType = "text";
		}
		jQuery.ajax(oRequest);
	};

	/**
	 * Gets the token and sends an updating request.
	 *
	 * @param {String} sUrl - request URL
	 * @param {Object} oData - data for PUT request
	 * @param {Function} fnResolve - callback function if request was resolved
	 * @param {Function} fnReject - callback function if request was rejected
	 * @param {Function} fnReject - callback function if request was rejected
	 * @private
	 */
	LrepConnector._getTokenAndSendPutRequest = function (sUrl, oData, fnResolve, fnReject) {
		var that = this;
		LrepConnector._getXcsrfToken(sUrl).then(function (oXcsrfToken) {
			that._sendPutRequest(oXcsrfToken, sUrl, oData, fnResolve, fnReject);
		});
	};

	/**
	 * Sends PUT content request to the back end.
	 *
	 * @param {Object} oXcsrfToken - token object
	 * @param {String} sUrl - request URL
	 * @param {Object} oData - data of PUT request
	 * @param {Function} fnResolve - callback function if request was resolved
	 * @param {Function} fnReject - callback function if request was rejected
	 * @private
	 */
	LrepConnector._sendPutRequest = function (oXcsrfToken, sUrl, oData, fnResolve, fnReject) {
		jQuery.ajax({
			url: sUrl,
			contentType: "text/plain",
			data: oData,
			beforeSend: function (oRequest) {
				oRequest.setRequestHeader("X-CSRF-Token", oXcsrfToken);
			},
			type: "PUT",
			success: function () {
				fnResolve();
			},
			error: function (oJqXHR, sTextStatus, oErrorThrown) {
				LrepConnector._reportError(oJqXHR, sTextStatus, oErrorThrown);
				fnReject(oErrorThrown);
			}
		});
	};

	/**
	 * Gets token and sends DELETE content request to the back end.
	 *
	 * @param {String} sUrl - request URL
	 * @param {Function} fnResolve - callback function if request was resolved
	 * @param {Function} fnReject - callback function if request was rejected
	 * @private
	 */
	LrepConnector._getTokenAndSendDeletionRequest = function (sUrl, fnResolve, fnReject) {
		var that = this;
		this._getXcsrfToken(sUrl).then(function (sXcsrfToken) {
			that._sendDeletionRequest(sXcsrfToken, sUrl, fnResolve, fnReject);
		});
	};

	/**
	 * Sends DELETE request to the back end.
	 *
	 * @param {Object} oXcsrfToken - token object
	 * @param {String} sUrl - request URL
	 * @param {Function} fnResolve - callback function if request was resolved
	 * @param {Function} fnReject - callback function if request was rejected
	 * @private
	 */
	LrepConnector._sendDeletionRequest = function (oXcsrfToken, sUrl, fnResolve, fnReject) {
		jQuery.ajax({
			url: sUrl,
			beforeSend: function (oRequest) {
				oRequest.setRequestHeader("X-CSRF-Token", oXcsrfToken);
			},
			type: "DELETE",
			success: function (oData) {
				fnResolve(oData);
			},
			error: function (oJqXHR, sTextStatus, oErrorThrown) {
				LrepConnector._reportError(oJqXHR, sTextStatus, oErrorThrown);
				fnReject(oErrorThrown);
			}
		});
	};

	return LrepConnector;
});
