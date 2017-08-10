/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides object sap.ui.dt.test.Element.
sap.ui.define([
	'jquery.sap.global',
	'sap/ui/dt/ElementUtil',
	'sap/ui/dt/OverlayRegistry'
],
function(jQuery, ElementUtil, OverlayRegistry) {
	"use strict";

	/**
	 * Class for Element tests.
	 *
	 * @class
	 * Utility functionality for Element tests
	 *
	 * @author SAP SE
	 * @version 1.48.5
	 *
	 * @private
	 * @static
	 * @since 1.38
	 * @alias sap.ui.dt.test.Element
	 * @experimental Since 1.38. This class is experimental and provides only limited functionality. Also the API might be changed in future.
	 */

	var MIN_SIZE = 5;
	var ElementTest = {};


	/**
	 * Returns all design time information of the element
	 * @param  {sap.ui.core.Element} oElement the element to test
	 * @return {map} result object
	 */
	ElementTest.getInfo = function(oElement) {
		var oMetadata = oElement.getMetadata();
		var oElementOverlay = OverlayRegistry.getOverlay(oElement);

		return {
			metadata : oMetadata,
			overlay : oElementOverlay
		};
	};


	/**
	 * Returns all aggregation infos of the element
	 * @param  {sap.ui.core.Element} oElement the element to test
	 * @return {map} result object
	 */
	ElementTest.getAggregationInfo = function(oElement, sAggregationName) {
		var mAggregationTest = {
			ignored : true,
			domRefDeclared : false,
			domRefFound : false,
			domRefVisible : false,
			overlayTooSmall : false,
			overlayGeometryCalculatedByChildren : false,
			overlayVisible : false
		};
		var oDesignTimeMetadata;

		var mElementInfo = this.getInfo(oElement);
		var oAggregationOverlay = mElementInfo.overlay.getAggregationOverlay(sAggregationName);
		if (oAggregationOverlay) {
			oDesignTimeMetadata = oAggregationOverlay.getDesignTimeMetadata();
		}

		if (oDesignTimeMetadata && !oDesignTimeMetadata.isIgnored(oElement)) {
			mAggregationTest.ignored = false;
			mAggregationTest.domRefDeclared = !!oDesignTimeMetadata.getDomRef();
			var oAggregationDomRef = oAggregationOverlay.getAssociatedDomRef();
			if (oAggregationDomRef) {
				mAggregationTest.domRefFound = true;
				mAggregationTest.domRefVisible = jQuery(oAggregationDomRef).is(":visible");
			}

			var mGeometry = oAggregationOverlay.getGeometry();
			if (mGeometry) {
				var mSize = mGeometry.size;
				mAggregationTest.overlayTooSmall = (mSize.width <= MIN_SIZE || mSize.height <= MIN_SIZE);
				mAggregationTest.overlayGeometryCalculatedByChildren = !mGeometry.domRef;
				mAggregationTest.overlayVisible = oAggregationOverlay.$().is(":visible");
			}
		}

		return mAggregationTest;
	};


	/**
	 * Returns all information of all aggregations of the element
	 * @param  {sap.ui.core.Element} oElement the element to test
	 * @return {map} result object
	 */
	ElementTest.getAggregationsInfo = function(oElement) {
		var mAggregationTests = {};

		ElementUtil.iterateOverAllPublicAggregations(oElement, function(oAggregation) {
			mAggregationTests[oAggregation.name] = this.getAggregationInfo(oElement, oAggregation.name);
		}.bind(this));

		return mAggregationTests;
	};

	return ElementTest;
}, /* bExport= */ true);
