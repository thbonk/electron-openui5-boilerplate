/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
//Provides mixin sap.ui.model.odata.v4.lib._V2Requestor
sap.ui.define([
	"sap/ui/core/format/DateFormat",
	"sap/ui/model/odata/ODataUtils",
	"./_Helper"
], function (DateFormat, ODataUtils, _Helper) {
	"use strict";

	var // Example: "/Date(1395705600000)/", matching group: ticks in milliseconds
		rDate = /^\/Date\((\d+)\)\/$/,
		oDateFormatter = DateFormat.getDateInstance({pattern: "yyyy-MM-dd", UTC : true}),
		// Example "/Date(1420529121547+0530)/", the offset ("+0530") is optional
		// matches: 1 = ticks in milliseconds, 2 = offset sign, 3 = offset hours, 4 = offset minutes
		rDateTimeOffset = /^\/Date\((\d+)(?:([-+])(\d\d)(\d\d))?\)\/$/,
		oDateTimeOffsetFormatter =
			DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd'T'HH:mm:ss", UTC : true}),
		oDateTimeOffsetMSFormatter =
			DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd'T'HH:mm:ss.SSS", UTC : true}),
		rPlus = /\+/g,
		rSlash = /\//g,
		// Example: "PT11H33M55S",
		// PT followed by optional hours, optional minutes, optional seconds with optional fractions
		rTime = /^PT(?:(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)(\.\d+)?S)?)$/i,
		oTimeFormatter = DateFormat.getTimeInstance({pattern: "HH:mm:ss", UTC : true});

	/**
	 * A mixin for a requestor using an OData V2 service.
	 *
	 * @alias sap.ui.model.odata.v4.lib._V2Requestor
	 * @mixin
	 */
	function _V2Requestor() {}

	/**
	 * Final (cannot be overridden) request headers for OData V2.
	 */
	_V2Requestor.prototype.mFinalHeaders = {
		"Content-Type" : "application/json;charset=UTF-8"
	};

	/**
	 * Predefined request headers in $batch parts for OData V2.
	 */
	_V2Requestor.prototype.mPredefinedPartHeaders = {
		"Accept" : "application/json"
	};

	/**
	 * Predefined request headers for all requests for OData V2.
	 */
	_V2Requestor.prototype.mPredefinedRequestHeaders = {
		"Accept" : "application/json",
		"MaxDataServiceVersion" : "2.0",
		"DataServiceVersion" : "2.0",
		"X-CSRF-Token" : "Fetch"
	};

	/**
	 * Converts an OData V2 value {@link https://tools.ietf.org/html/rfc3548#section-3} of type
	 * Edm.Binary to the corresponding OData V4 value
	 * {@link https://tools.ietf.org/html/rfc4648#section-5}.
	 *
	 * @param {string} sV2Value
	 *   The OData V2 value
	 * @returns {string}
	 *   The corresponding OData V4 value
	 */
	_V2Requestor.prototype.convertBinary = function (sV2Value) {
		return sV2Value.replace(rPlus, "-").replace(rSlash, "_");
	};

	/**
	 * Converts an OData V2 value of type Edm.DateTime with <code>sap:display-format="Date"</code>
	 * to the corresponding OData V4 Edm.Date value
	 *
	 * @param {string} sV2Value
	 *   The OData V2 value
	 * @returns {string}
	 *   The corresponding OData V4 value
	 * @throws {Error}
	 *   If the V2 value is not convertible
	 */
	_V2Requestor.prototype.convertDate = function (sV2Value) {
		var oDate,
			aMatches = rDate.exec(sV2Value);

		if (!aMatches) {
			throw new Error("Not a valid Edm.DateTime value '" + sV2Value + "'");
		}
		oDate = new Date(parseInt(aMatches[1], 10));
		if (Number(aMatches[1] % (24 * 60 * 60 * 1000)) !== 0) {
			throw new Error("Cannot convert Edm.DateTime value '" + sV2Value
				+ "' to Edm.Date because it contains a time of day");
		}
		return oDateFormatter.format(oDate);
	};

	/**
	 * Converts an OData V2 value of type Edm.DateTimeOffset or Edm.DateTime without
	 * <code>sap:display-format="Date"</code> to the corresponding OData V4 Edm.DateTimeOffset value
	 *
	 * @param {string} sV2Value
	 *   The OData V2 value
	 * @returns {string}
	 *   The corresponding OData V4 value
	 * @throws {Error}
	 *   If the V2 value is not convertible
	 */
	_V2Requestor.prototype.convertDateTimeOffset = function (sV2Value) {
		var aMatches = rDateTimeOffset.exec(sV2Value),
			oFormatter,
			sOffset,
			iOffsetHours,
			iOffsetMinutes,
			iOffsetSign,
			iTicks;

		if (!aMatches) {
			throw new Error("Not a valid Edm.DateTimeOffset value '" + sV2Value + "'");
		}
		iTicks = parseInt(aMatches[1], 10);
		iOffsetHours = parseInt(aMatches[3], 10);
		iOffsetMinutes = parseInt(aMatches[4], 10);
		if (!aMatches[2] || iOffsetHours === 0 && iOffsetMinutes === 0) {
			sOffset = "Z";
		} else {
			iOffsetSign = aMatches[2] === "-" ? -1 : 1;
			iTicks += iOffsetSign * (iOffsetHours * 60 * 60 * 1000 + iOffsetMinutes * 60 * 1000);
			sOffset = aMatches[2] + aMatches[3] + ":"  + aMatches[4];
		}
		oFormatter = iTicks % 1000 ? oDateTimeOffsetMSFormatter : oDateTimeOffsetFormatter;
		return oFormatter.format(new Date(iTicks)) + sOffset;
	};

	/**
	 * Converts an OData V2 value of type Edm.Double or Edm.Single (Edm.Float) to the corresponding
	 * OData V4 value.
	 *
	 * @param {string} sV2Value
	 *   The OData V2 value
	 * @returns {any}
	 *   The corresponding OData V4 value
	 */
	_V2Requestor.prototype.convertDoubleSingle = function (sV2Value) {
		switch (sV2Value) {
			case "NaN":
			case "INF":
			case "-INF":
				return sV2Value;
			default:
				return parseFloat(sV2Value);
		}
	};

	/**
	 * Converts an OData V2 value of type Edm.Time to the corresponding OData V4 Edm.TimeOfDay value
	 *
	 *  @param {string} sV2Value
	 *   The OData V2 value
	 * @returns {string}
	 *   The corresponding OData V4 value
	 * @throws {Error}
	 *   If the V2 value is not convertible
	 */
	_V2Requestor.prototype.convertTimeOfDay = function (sV2Value) {
		var oDate,
			aMatches = rTime.exec(sV2Value),
			iTicks;

		if (!aMatches) {
			throw new Error("Not a valid Edm.Time value '" + sV2Value + "'");
		}

		iTicks = Date.UTC(1970, 0, 1, aMatches[1] || 0, aMatches[2] || 0, aMatches[3] || 0);
		oDate = new Date(iTicks);
		return oTimeFormatter.format(oDate) + (aMatches[4] || "");
	};

	/**
	 * Converts a complex value or a collection of complex values from an OData V2 response payload
	 * to an object in OData V4 JSON format.
	 *
	 * @param {object} oObject
	 *   The object to be converted
	 * @param {object} mTypeByName
	 *   A map of type metadata by qualified name
	 * @returns {object}
	 *   The converted payload
	 * @throws {Error}
	 *   If oObject does not contain inline metadata with type information
	 */
	_V2Requestor.prototype.convertNonPrimitive = function (oObject, mTypeByName) {
		var sPropertyName,
			sPropertyType,
			oType,
			sTypeName,
			vValue,
			that = this;

		// results may be an array of entities or the property 'results' of a single request.
		if (oObject.results && !oObject.__metadata) {
			// collection of complex values, coll. of primitive values only supported since OData V3
			oObject.results.forEach(function (oItem) {
				that.convertNonPrimitive(oItem, mTypeByName);
			});
			return oObject.results;
		}

		// complex value
		if (!oObject.__metadata || !oObject.__metadata.type) {
			throw new Error("Cannot convert complex value without type information in "
					+ "__metadata.type: " + JSON.stringify(oObject));
		}

		sTypeName = oObject.__metadata.type;
		oType = mTypeByName[sTypeName]; // can be entity type or complex type
		delete oObject.__metadata;
		for (sPropertyName in oObject) {
			vValue = oObject[sPropertyName];
			if (vValue === null) {
				continue;
			}
			if (typeof vValue === "object") { // non-primitive property value
				if (vValue.__deferred) {
					delete oObject[sPropertyName];
				} else {
					oObject[sPropertyName] = this.convertNonPrimitive(vValue, mTypeByName);
				}
				continue;
			}
			sPropertyType = oType[sPropertyName] && oType[sPropertyName].$Type;
			// primitive property value
			oObject[sPropertyName] = this.convertPrimitive(vValue, sPropertyType,
				sTypeName, sPropertyName);
		}
		return oObject;
	};

	/**
	 * Computes the OData V4 primitive value for the given OData V2 primitive value and type.
	 *
	 * @param {any} vValue
	 *   The value to be converted
	 * @param {string} sPropertyType
	 *   The name of the OData V4 primitive type for conversion such as "Edm.String"
	 * @param {string} sTypeName
	 *   The qualified name of the entity or complex type containing the property with the value to
	 *   be converted
	 * @param {string} sPropertyName
	 *   The name of the property in the entity or complex type
	 * @returns {any}
	 *   The converted value
	 * @throws {Error}
	 *   If the property type is unknown
	 */
	_V2Requestor.prototype.convertPrimitive = function (vValue, sPropertyType, sTypeName,
			sPropertyName) {
		switch (sPropertyType) {
			case "Edm.Binary":
				return this.convertBinary(vValue);
			case "Edm.Date":
				return this.convertDate(vValue);
			case "Edm.DateTimeOffset":
				return this.convertDateTimeOffset(vValue);
			case "Edm.Boolean":
			case "Edm.Byte":
			case "Edm.Decimal":
			case "Edm.Guid":
			case "Edm.Int16":
			case "Edm.Int32":
			case "Edm.Int64":
			case "Edm.SByte":
			case "Edm.String":
				return vValue;
			case "Edm.Double":
			case "Edm.Single":
				return this.convertDoubleSingle(vValue);
			case "Edm.TimeOfDay":
				return this.convertTimeOfDay(vValue);
			default:
				throw new Error("Type '" + sPropertyType + "' of property '" + sPropertyName
					+ "' in type '" + sTypeName + "' is unknown; cannot convert value: " + vValue);
		}
	};

	/**
	 * Converts an OData V2 response payload to an OData V4 response payload.
	 *
	 * @param {object} oResponsePayload
	 *   The OData V2 response payload
	 * @returns {_SyncPromise}
	 *   A promise which resolves with the OData V4 response payload or rejects with an error if
	 *   the V2 response cannot be converted
	 */
	_V2Requestor.prototype.doFetchV4Response = function (oResponsePayload) {
		var that = this;

		return this.fnFetchEntityContainer().then(function (mScope) {
			var oPayload = that.convertNonPrimitive(oResponsePayload.d, mScope);

			// d.results may be an array of entities in case of a collection request or the property
			// 'results' of a single request.
			if (oResponsePayload.d.results && !oResponsePayload.d.__metadata) {
				oPayload = {value : oPayload};
				if (oResponsePayload.d.__count) {
					oPayload["@odata.count"] = oResponsePayload.d.__count;
				}
				if (oResponsePayload.d.__next) {
					oPayload["@odata.nextLink"] = oResponsePayload.d.__next;
				}
			}
			return oPayload;
		});
	};

	/**
	 * Converts the supported V4 OData system query options to the corresponding V2 OData system
	 * query options.
	 *
	 * @param {object} mQueryOptions The query options
	 * @param {function(string,any)} fnResultHandler
	 *   The function to process the converted options getting the name and the value
	 * @param {boolean} [bDropSystemQueryOptions=false]
	 *   Whether all system query options are dropped (useful for non-GET requests)
	 * @param {boolean} [bSortExpandSelect=false]
	 *   Whether the paths in $expand and $select shall be sorted in the query string
	 * @throws {Error}
	 *   If a system query option other than $expand and $select is used or if any $expand value is
	 *   not an object
	 */
	_V2Requestor.prototype.doConvertSystemQueryOptions = function (mQueryOptions, fnResultHandler,
			bDropSystemQueryOptions, bSortExpandSelect) {
		var aSelects = [];

		/**
		 * Converts the V4 $expand options to flat V2 $expand and $select structure.
		 *
		 * @param {string[]} aExpands The resulting list of $expand paths
		 * @param {object} mExpandItem The current $expand item to be processed
		 * @param {string} sPathPrefix The path prefix used to compute the absolute path
		 * @returns {string[]} The list of $expand paths
		 * @throws {Error}
		 *   If a system query option other than $expand and $select is used or if any $expand value
		 *   is not an object
		 */
		function convertExpand(aExpands, mExpandItem, sPathPrefix) {
			if (!mExpandItem || typeof mExpandItem !== "object") {
				throw new Error("$expand must be a valid object");
			}

			Object.keys(mExpandItem).forEach(function (sExpandPath) {
				var sAbsoluteExpandPath = _Helper.buildPath(sPathPrefix, sExpandPath),
					vExpandOptions = mExpandItem[sExpandPath], // an object or true
					vSelectsInExpand;

				aExpands.push(sAbsoluteExpandPath);

				if (typeof vExpandOptions === "object") {
					Object.keys(vExpandOptions).forEach(function (sQueryOption) {
						switch (sQueryOption) {
							case "$expand":
								// process nested expands
								convertExpand(aExpands, vExpandOptions.$expand,
									sAbsoluteExpandPath);
								break;
							case "$select":
								// process nested selects
								vSelectsInExpand = vExpandOptions.$select;
								if (!Array.isArray(vSelectsInExpand)) {
									vSelectsInExpand = vSelectsInExpand.split(",");
								}
								vSelectsInExpand.forEach(function (sSelect) {
									aSelects.push(_Helper.buildPath(sAbsoluteExpandPath, sSelect));
								});
								break;
							default:
								throw new Error("Unsupported query option in $expand: "
									+ sQueryOption);
						}
					});
				}
				if (!vExpandOptions.$select) {
					aSelects.push(sAbsoluteExpandPath + "/*");
				}
			});
			return aExpands;
		}

		Object.keys(mQueryOptions).forEach(function (sName) {
			var bIsSystemQueryOption = sName[0] === '$',
				vValue = mQueryOptions[sName];

			if (bDropSystemQueryOptions && bIsSystemQueryOption) {
				return;
			}

			switch (sName) {
				case "$expand":
					vValue = convertExpand([], vValue, "");
					vValue = (bSortExpandSelect ? vValue.sort() : vValue).join(",");
					break;
				case "$orderby":
					break;
				case "$select":
					aSelects.push.apply(aSelects,
						Array.isArray(vValue) ? vValue : vValue.split(","));
					return; // don't call fnResultHandler; this is done later
				default:
					if (bIsSystemQueryOption) {
						throw new Error("Unsupported system query option: " + sName);
					}
			}
			fnResultHandler(sName, vValue);
		});

		// only if all (nested) query options are processed, all selects are known
		if (aSelects.length > 0) {
			if (!mQueryOptions.$select) {
				aSelects.push("*");
			}
			fnResultHandler("$select", (bSortExpandSelect ? aSelects.sort() : aSelects).join(","));
		}
	};

	/**
	 * Formats a given internal value into a literal suitable for usage in OData V2 URLs. See
	 * http://www.odata.org/documentation/odata-version-2-0/overview#AbstractTypeSystem.
	 *
	 * @param {any} vValue
	 *   The value
	 * @param {object} oProperty
	 *   The OData property
	 * @returns {string}
	 *   The literal for the URL
	 * @throws {Error}
	 *   When called for an unsupported type
	 * @see sap.ui.model.odata.ODataUtils#formatValue
	 */
	_V2Requestor.prototype.formatPropertyAsLiteral = function (vValue, oProperty) {
		var sType = oProperty.$v2Type || oProperty.$Type;

		switch (sType) {
			case "Edm.Binary":
			case "Edm.DateTime":
			case "Edm.DateTimeOffset":
			case "Edm.Time":
				throw new Error("Type '" + sType + "' in the key is not supported");
			default:
				return ODataUtils.formatValue(vValue, sType);
		}
	};

	return function (oObject) {
		jQuery.extend(oObject, _V2Requestor.prototype);
	};
}, /* bExport= */ false);