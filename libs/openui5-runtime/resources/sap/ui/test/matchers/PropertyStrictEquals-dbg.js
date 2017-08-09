/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define(['jquery.sap.global', './Matcher'], function (jQuery, Matcher) {
	"use strict";

	/**
	 * PropertyStrictEquals - checks if a property has the exact same value.
	 *
	 * @class PropertyStrictEquals - checks if a property has the exact same value
	 * @extends sap.ui.test.matchers.Matcher
	 * @param {object} [mSettings] optional map/JSON-object with initial settings for the new PropertyStrictEquals
	 * @public
	 * @name sap.ui.test.matchers.PropertyStrictEquals
	 * @author SAP SE
	 * @since 1.23
	 */
	return Matcher.extend("sap.ui.test.matchers.PropertyStrictEquals", /** @lends sap.ui.test.matchers.PropertyStrictEquals.prototype */ {

		metadata : {
			publicMethods : [ "isMatching" ],
			properties : {
				/**
				 * The Name of the property that is used for matching.
				 */
				name : {
					type : "string"
				},
				/**
				 * The value of the property that is used for matching.
				 */
				value : {
					type : "any"
				}
			}
		},

		/**
		 * Checks if the control has a property that matches the value
		 *
		 * @param {sap.ui.core.Control} oControl the control that is checked by the matcher
		 * @return {boolean} true if the property has a strictly matching value.
		 * @public
		 */
		isMatching : function (oControl) {
			var sPropertyName = this.getName(),
				sId = oControl.getId(),
				fnProperty = oControl["get" + jQuery.sap.charToUpperCase(sPropertyName, 0)];

			if (!fnProperty) {
				this._oLogger.error("Control '" + sId + "' does not have a property called '" + sPropertyName + "'");
				return false;
			}

			var vPropertyValue = fnProperty.call(oControl);
			var bMatches = vPropertyValue === this.getValue();
			if (!bMatches) {
				this._oLogger.debug("The property '" + sPropertyName + "' of '" + sId + "' has the value '" + vPropertyValue + "' expected '" + this.getValue() + "'");
			}
			return bMatches;

		}
	});

}, /* bExport= */ true);