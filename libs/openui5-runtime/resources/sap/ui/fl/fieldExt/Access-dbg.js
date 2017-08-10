/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define(["jquery.sap.storage"], function(Storage) {
	"use strict";

	/**
	 * @namespace
	 * @alias sap.ui.fl.fieldExt.Access
	 * @experimental Since 1.25.0
	 * @author SAP SE
	 * @version 1.48.5
	 */
	var Access = {};

	/**
	 * Local storage key
	 */
	Access._sStorageKey = "sap.ui.fl.fieldExt.Access";

	/**
	 * Services return to a valid state if they are longer invalid than iValidityPeriod.
	 * This prevents storing more and more unused data.
	 */
	Access._iValidityPeriod = 1 * 7 * 24 * 60 * 60 * 1000;	// 1 Week in ms

	/**
	 * Returns all Business Contexts for given service and EntityTypeName/EntitySetName. Note that either EntityTypeName or EntitySetName can be
	 * supplied. Providing both results in an exception
	 *
	 * @param {string} sServiceUri
	 * @param {string} sEntityTypeName
	 * @param {string} sEntitySetName
	 * @returns {array} aBusinessContexts
	 * @public
	 */
	Access.getBusinessContexts = function(sServiceUri, sEntityTypeName, sEntitySetName) {
		// Determine ServiceName and ServiceVersion from Service URI
		var oService = this._parseServiceUri(sServiceUri);

		// Build URL for BusinessContextRetrievalService based on ServiceName, ServiceVersion, EntityName
		var sBusinessContextRetrievalUri = this._buildBusinessContextRetrievalUri(oService.serviceName, oService.serviceVersion, sEntityTypeName, sEntitySetName);

		// Execute Ajax call
		var mAjaxSettings = this._getAjaxSettings();
		var promise = this._executeAjaxCall(sBusinessContextRetrievalUri, mAjaxSettings, oService.serviceName, oService.serviceVersion, sEntityTypeName, sEntitySetName);

		return promise;
	};

	/**
	 * Checks if a given service is stale
	 *
	 * A serviceInfo object is a string or an object which contains serviceName and serviceVersion.
	 *
	 * serviceInfo: {
	 * 		"serviceName": 		"<string>",
	 * 		"serviceVersion": 	"<string>"
	 * }
	 *
	 * @param  {string|map} [mServiceInfo] service info object or service uri
	 * @return {boolean} 	returns true if the service is stale
	 */
	Access.isServiceOutdated = function(mServiceInfo) {
		if (!this._isSystemInfoAvailable()) {
			return false;	// No system information available => All services are valid.
		}

		var mServiceItem = this._getServiceItem(this._createServiceItem(mServiceInfo));

		if (mServiceItem) {
			if (this._isServiceExpired(mServiceItem)) {
				this.setServiceValid(mServiceInfo);
				return false;
			} else {
				return true;
			}
		} else {
			return false;
		}
	};

	/**
	* Validates a given service. A valid service is not stale.
	*
	* A serviceInfo object is a string or an object which contains serviceName and serviceVersion.
	*
	* serviceInfo: {
	* 		"serviceName": 		"<string>",
	* 		"serviceVersion": 	"<string>"
	* }
	*
	* @param  {string|map} [serviceInfo] service info object or service uri
	* @return {void}
	*/
	Access.setServiceValid = function(mServiceInfo) {
		if (this._isSystemInfoAvailable()) {
			var mData = this._getDataFromLocalStorage();
			delete mData[this._createServiceItem(mServiceInfo).serviceKey];
			this._setDataToLocalStorage(mData);
		}
	};

	/**
	* Invalidates a given service.
	* Once a service has been validated oder invalidation period is over the service becomes valid again
	*
	* A serviceInfo object is a string or an object which contains serviceName and serviceVersion.
	*
	* serviceInfo: {
	* 		"serviceName": 		"<string>",
	* 		"serviceVersion": 	"<string>"
	* }
	*
	* @param  {string|map} [serviceInfo] service info object or service uri
	* @return {void}
	*/
	Access.setServiceInvalid = function(mServiceInfo) {
		if (this._isSystemInfoAvailable()) {
			var mData = this._getDataFromLocalStorage();
			var mItem = this._createServiceItem(mServiceInfo);
			mData[mItem.serviceKey] = mItem;
			this._setDataToLocalStorage(mData);
		}
	};

	/**
	 * Extracts ServiceName and ServiceVersion out of Service URI
	 *
	 * @private
	 * @param {string} 		sServiceUri			URI to an OData service document
	 * @returns {object} 						An object with serviceName and serviceVersion
	 */
	Access._parseServiceUri = function(sServiceUri) {
		/**
		 * 1.) Case
		 * If and only if a service URI contains "sap/opa/odata" and the subsequent segment (namespace) is not "sap"
		 * than the result is defined as "/<namespace>/<ServiceName>". The segment MUST not contain a slash.
		 * Both "sap/opa/odata" and the namespace are considered case insensitive because ABAP does not respect
		 * case sensitivity.
		 * 2.) Case
		 * If the namespace is "sap" the result is defined as "<ServiceName>".
		 *
		 * 3.) Case
		 * If a service URI does not contain "sap/opa/odata" the result is defined as the last segement of the resource
		 * path without a leading slash.
		 *
		 * Note: A service URI may contain a service version. Service versions have to specified as matrix parameter "v"
		 * of the resource segment which represents the service name. e.g. sap/opu/odata/MyService;v=0002. Only
		 * numerical characters are allowed. Default version is '0001'.
		 */

		// 1. Capture group => Namespace 	2.) Capture group => Service Name
		var oRegexService = /.*sap\/opu\/odata\/([^\/]+)\/([^\/]+)/i;
		var oRegexServiceVersion = /([^;]+);v=(\d{1,4})/i;

		var sODataPath = "sap/opu/odata";
		var sServiceNameWithVersion;

		// First extract namespace and service
		if (sServiceUri.toLowerCase().indexOf(sODataPath) !== -1) {
			// 1. and 2. Case
			var aServiceSegments = sServiceUri.match(oRegexService);
			if (!aServiceSegments || aServiceSegments.length !== 3) {
				throw new Error("sap.ui.fl.fieldExt.Access._parseService", "Malformed service URI (Invalid service name)");
			}
			if (aServiceSegments[1].toLowerCase() !== "sap" ) { 		// 1.) Case
				sServiceNameWithVersion = "/" + aServiceSegments[1] + "/" + aServiceSegments[2];
			} else {												// 2.) Case
				sServiceNameWithVersion = aServiceSegments[2];
			}
		} else {													// 3. Case
			// Remove last slash
			if (sServiceUri.length > 0 && sServiceUri.lastIndexOf("/") + 1 === sServiceUri.length) {
				sServiceUri = sServiceUri.substring(0, sServiceUri.length - 1);
			}
			sServiceNameWithVersion = sServiceUri.substring(sServiceUri.lastIndexOf("/") + 1);
		}

		// Check if a service version has been specified
		if (sServiceNameWithVersion.indexOf(";v=") !== -1) {
			var aVersionSegments = sServiceNameWithVersion.match(oRegexServiceVersion);
			if (!aVersionSegments || aVersionSegments.length !== 3) {
				throw new Error("sap.ui.fl.fieldExt.Access._parseService", "Malformed service URI (Invalid version)");
			}

			return {
				serviceName: aVersionSegments[1],
				serviceVersion: aVersionSegments[2]
			};
		} else {
			return {
				serviceName: sServiceNameWithVersion,
				serviceVersion: '0001'
			};
		}
	};

	/**
	 * Builds URI for BusinessContext Retrieval
	 *
	 * @private
	 * @param {string} sServiceUri
	 * @param {string} sServiceName
	 * @param {string} sEntityName
	 * @param {string} sEntitySetName
	 * @returns {string} sBusinessContextRetrievalUri
	 */
	Access._buildBusinessContextRetrievalUri = function(sServiceName, sServiceVersion, sEntityName, sEntitySetName) {
		if (sEntityName == null) {
			sEntityName = "";
		}
		if (sEntitySetName == null) {
			sEntitySetName = "";
		}

		if (((sEntitySetName.length === 0) && (sEntityName.length === 0)) || (!(sEntitySetName.length === 0) && !(sEntityName.length === 0))) {
			throw new Error("sap.ui.fl.fieldExt.Access._buildBusinessContextRetrievalUri()" + "Inconsistent input parameters EntityName: " + sEntityName + " EntitySet: " + sEntitySetName);
		}

		// Example call:
		// sap/opu/odata/SAP/APS_CUSTOM_FIELD_MAINTENANCE_SRV/GetBusinessContextsByEntityType?EntitySetName=''&EntityTypeName='BusinessPartner'&ServiceName='CFD_TSM_BUPA_MAINT_SRV'&ServiceVersion='0001'&$format=json
		var sBusinessContextRetrievalUri = "/sap/opu/odata/SAP/APS_CUSTOM_FIELD_MAINTENANCE_SRV/GetBusinessContextsByEntityType?" + "EntitySetName=\'" + sEntitySetName + "\'" + "&EntityTypeName=\'" + sEntityName + "\'" + "&ServiceName=\'" + sServiceName + "\'" + "&ServiceVersion=\'" + sServiceVersion + "\'" + "&$format=json";
		return sBusinessContextRetrievalUri;
	};

	/**
	 * Executes Ajax Call for BusinessContext Retrieval
	 *
	 * @private
	 * @param {string} sBusinessContextRetrievalUri
	 * @param {map} mRequestSettings
	 * @param {string} sServiceName
	 * @param {string} sServiceVersion
	 * @param {string} sEntityName
	 * @returns {Object} oPromise
	 */
	Access._executeAjaxCall = function(sBusinessContextRetrievalUri, mRequestSettings, sServiceName, sServiceVersion, sEntityType, sEntitySetName) {
		var that = this;
		var oDeferred = jQuery.Deferred();

		jQuery.ajax(sBusinessContextRetrievalUri, mRequestSettings).done(function(data, textStatus, jqXHR) {
			var aBusinessContexts = [];
			if (data) {
				aBusinessContexts = that._extractBusinessContexts(data);
			}

			var oResult = {
				BusinessContexts: aBusinessContexts,
				ServiceName: sServiceName,
				ServiceVersion: sServiceVersion
			};
			oDeferred.resolve(oResult);

		}).fail(function(jqXHR, textStatus, errorThrown) {
			var aErrorMessages = that._getMessagesFromXHR(jqXHR);
			var oError = {
				errorOccured: true,
				errorMessages: aErrorMessages,
				serviceName: sServiceName,
				serviceVersion: sServiceVersion,
				entityType: sEntityType,
				entitySet: sEntitySetName
			};
			oDeferred.reject(oError);
		});

		return oDeferred.promise();
	};

	/**
	 * @private
	 * @returns {map} mSettings
	 */
	Access._getAjaxSettings = function() {
		var mSettings = {
			type: "GET",
			async: true,
			dataType: "json"
		};
		return mSettings;
	};

	/**
	 * Extracts BusinessContext out of Request response data
	 *
	 * @private
	 * @param {object} oData
	 * @returns {array} BusinessContexts
	 */
	Access._extractBusinessContexts = function(data) {
		var aResults = null;
		var aBusinessContexts = [];
		if (data && data.d) {
			aResults = data.d.results;
		}

		if (aResults !== null && aResults.length > 0) {
			for (var i = 0; i < aResults.length; i++) {
				if (aResults[i].BusinessContext !== null) {
					aBusinessContexts.push(aResults[i].BusinessContext);
				}
			}
		}

		return aBusinessContexts;
	};

	/**
	 * Extracts error messages from request failure response
	 *
	 * @private
	 * @param {object} oXHR
	 * @returns {array} errorMessages
	 */
	Access._getMessagesFromXHR = function(oXHR) {
		var aMessages = [];
		try {
			var oErrorResponse = JSON.parse(oXHR.responseText);
			if (oErrorResponse && oErrorResponse.error && oErrorResponse.error.message && oErrorResponse.error.message.value && oErrorResponse.error.message.value !== '') {
				aMessages.push({
					severity: "error",
					text: oErrorResponse.error.message.value
				});
			} else {
				aMessages.push({
					severity: "error",
					text: oXHR.responseText
				});
			}

		} catch (e) {
			// ignore
		}
		return aMessages;
	};

	/**
	 * Returns the current timestamp in milliseconds
	 *
	 * @return {int} Current timestamp in milli seconds
	 */
	Access._getCurrentTime = function() {
		return Date.now();
	};

	/**
	 * Returns true if the given serviceItem is outdated
	 *
	 * @return {boolean} True if the serviceItem is outdated
	 */
	Access._isServiceExpired = function(mServiceItem) {
		return mServiceItem.expirationDate <= this._getCurrentTime();
	};

	/**
	 * Returns a local storage instance
	 *
	 * @return {object} SapUI local storage object
	 */
	Access._getLocalStorage = function() {
		return jQuery.sap.storage(jQuery.sap.storage.Type.local);
	};

	/**
	 * Checks if the current browser supportes a local storage
	 *
	 * @return {boolean} true if the current browser supports a local storage
	 */
	Access.isLocalStorageAvailable = function() {
		return this._getLocalStorage() && this._getLocalStorage().isSupported();
	};

	/**
	 * Returns a serviceItem from the local storage
	 *
	 * @param  {map} [mServiceItem] serviceItem
	 * @return {map} serviceItem from local storage or null if no serviceItem is available
	 */
	Access._getServiceItem = function(mServiceItem) {
		return this._getDataFromLocalStorage()[mServiceItem.serviceKey] || null;
	};

	/**
	 * Create a serviceItem from a given serviceInfo map.
	 *
	 * The serviceInfo map belongs to the public interface of this 'class'.
	 * ServiceItems are used to store outdated services in the local storage.
	 * A service item consists of a unique key per service and an expiration date.
	 *
	 * @param  {string|map} [mServiceInfo] serviceInfo Object or serviceUri
	 * @return {map} serviceItem
	 */
	Access._createServiceItem = function(mServiceInfo) {
		var iExpirationDate = this._getCurrentTime() + this._iValidityPeriod;
		var mSystemInfo = this._getSystemInfo( );
		var parsedServiceInfo = this._extractServiceInfo(mServiceInfo);

		return {
			"serviceKey":     mSystemInfo.getName() + mSystemInfo.getClient() + parsedServiceInfo.serviceName + parsedServiceInfo.serviceVersion,
			"expirationDate": iExpirationDate
		};
	};

	/**
	 * Returns a map, that contains the service name and the service version.
	 *
	 * @param  {string|map} [mServiceInfo] serviceInfo Object or serviceUri
	 * @return {map} serviceItem
	 */
	Access._extractServiceInfo = function(mServiceInfo) {
		if (typeof mServiceInfo === "string") {
			return this._parseServiceUri(mServiceInfo);
		} else {
			return mServiceInfo;
		}
	};

	/**
	 * Returns true if information about the current backend system are available
	 *
	 * @private
	 * @return {boolean} true if system info is available
	 */
	Access._isSystemInfoAvailable = function() {
		return sap && sap.ushell && sap.ushell.Container && sap.ushell.Container.getLogonSystem;
	};

	/**
	 * Returns informations about the current backend system
	 *
	 * @return {map}	System informations
	 */
	Access._getSystemInfo = function() {
		return sap.ushell.Container.getLogonSystem();
	};

	/**
	 * Writes a map of all outdated services to the local storage
	 *
	 * @param  {map}  [mData] Map of all outdated services
	 * @return {void}
	 */
	Access._setDataToLocalStorage = function(mData) {
		if (this.isLocalStorageAvailable() ) {
			this._getLocalStorage().put(Access._sStorageKey, JSON.stringify(mData));
		}
	};

	/**
	 * Reads a map of all outdated services from local storage
	 *
	 * @return {map} Map of all outdated services (possibly empty)
	 */
	Access._getDataFromLocalStorage = function() {
		// If no local storage is available, we simulate an empty one
		if (!this.isLocalStorageAvailable() ) {
			return { };
		}

		var sServiceData = this._getLocalStorage().get(Access._sStorageKey);

		if (!sServiceData) {
			// No data available => return empty map
			return { };
		} else {
			return JSON.parse(sServiceData);
		}
	};

	return Access;
}, /* bExport= */true);
