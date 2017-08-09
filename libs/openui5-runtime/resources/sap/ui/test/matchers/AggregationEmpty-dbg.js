/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define(['jquery.sap.global', './Matcher', './AggregationLengthEquals'], function ($, Matcher, AggregationLengthEquals) {
	"use strict";

	var oAggregationLengthMatcher = new AggregationLengthEquals({
		length: 0
	});

	/**
	 * AggregationEmpty - checks if an aggregation is empty.
	 *
	 * @class AggregationEmpty - checks if an aggregation is empty
	 * @param {object} [mSettings] optional map/JSON-object with initial settings for the new AggregationEmptyMatcher
	 * @extends sap.ui.test.matchers.Matcher
	 * @public
	 * @name sap.ui.test.matchers.AggregationEmpty
	 */
	return Matcher.extend("sap.ui.test.matchers.AggregationEmpty", /** @lends sap.ui.test.matchers.AggregationEmpty.prototype */ {

		metadata : {
			publicMethods : [ "isMatching" ],
			properties : {
				/**
				 * The name of the aggregation that is used for matching.
				 */
				name : {
					type : "string"
				}
			}
		},

		/**
		 * Checks if the control has an empty aggregation.
		 *
		 * @param {sap.ui.core.Control} oControl the control that is checked by the matcher
		 * @return {boolean} true if the Aggregation set in the property aggregationName is empty, false if it is not.
		 * @public
		 */
		isMatching : function (oControl) {
			oAggregationLengthMatcher.setName(this.getName());
			return oAggregationLengthMatcher.isMatching(oControl);
		}

	});

}, /* bExport= */ true);