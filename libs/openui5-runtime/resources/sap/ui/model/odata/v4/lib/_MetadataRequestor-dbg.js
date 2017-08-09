/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

//Provides class sap.ui.model.odata.v4.lib._MetadataRequestor
sap.ui.define([
	"jquery.sap.global",
	"./_Helper",
	"./_MetadataConverter"
], function (jQuery, _Helper, _MetadataConverter) {
	"use strict";

	return {
		/**
		 * Creates a requestor for metadata documents.
		 * @param {object} mHeaders
		 *   A map of headers
		 * @param {object} mQueryParams
		 *   A map of query parameters as described in {@link _Helper.buildQuery}
		 * @returns {object}
		 *   A new MetadataRequestor object
		 */
		create : function (mHeaders, mQueryParams) {
			var sQueryStr = _Helper.buildQuery(mQueryParams);

			return {
				/**
				 * Reads a metadata document from the given URL.
				 * @param {string} sUrl
				 *   The URL of a metadata document, it must not contain a query string or a
				 *   fragment part
				 * @param {boolean} [bSkipQuery=false]
				 *   Indicates whether to omit the query string
				 * @returns {Promise}
				 *   A promise fulfilled with the metadata as a JSON object
				 */
				read : function (sUrl, bSkipQuery) {
					return new Promise(function (fnResolve, fnReject) {
						jQuery.ajax(bSkipQuery ? sUrl : sUrl + sQueryStr, {
							method : "GET",
							headers : mHeaders
						})
						.then(function (oData /*, sTextStatus, jqXHR */) {
							fnResolve(oData);
						}, function (jqXHR, sTextStatus, sErrorMessage) {
							fnReject(_Helper.createError(jqXHR));
						});
					}).then(function (oXMLMetadata) {
						return _MetadataConverter.convertXMLMetadata(oXMLMetadata);
					});
				}
			};
		}
	};
}, /* bExport= */false);
