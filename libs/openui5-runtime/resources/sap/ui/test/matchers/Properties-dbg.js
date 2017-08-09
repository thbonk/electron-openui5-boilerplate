/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define(["jquery.sap.global", "sap/ui/test/_LogCollector"], function ($, _LogCollector) {
	"use strict";
	var oLogger = $.sap.log.getLogger("sap.ui.test.matchers.Properties", _LogCollector.DEFAULT_LEVEL_FOR_OPA_LOGGERS);

	/**
	 * @class Properties - checks if a control's properties have the provided values - all properties have to match their values.
	 * @param {object} oProperties the object with the properties to be checked. Example:
	 * <pre>
	 * // Would filter for an enabled control with the text "Accept".
	 * new Properties({
	 *     // The property text has the exact value "Accept"
	 *     text: "Accept",
	 *     // The property enabled also has to be true
	 *     enabled: true
	 * })
	 * </pre>
	 * If the value is a RegExp, it tests the RegExp with the value. RegExp only works with string properties.
	 * @public
	 * @name sap.ui.test.matchers.Properties
	 * @author SAP SE
	 * @since 1.27
	 */
	return function (oProperties) {
		return function(oControl) {
			var bIsMatching = true;
			$.each(oProperties, function(sPropertyName, oPropertyValue) {
				var fnProperty = oControl["get" + $.sap.charToUpperCase(sPropertyName, 0)];

				if (!fnProperty) {
					bIsMatching = false;
					oLogger.error("Control '" + oControl.sId + "' does not have a property called: '" +
						sPropertyName + "'");
					return false;
				}

				var vCurrentPropertyValue = fnProperty.call(oControl);
				if (oPropertyValue instanceof RegExp) {
					bIsMatching = oPropertyValue.test(vCurrentPropertyValue);
				} else {
					bIsMatching = vCurrentPropertyValue === oPropertyValue;
				}

				if (!bIsMatching) {
					oLogger.debug("The property '" + sPropertyName + "' of the control '" + oControl + "' " +
						"is '" + vCurrentPropertyValue + "', expected '" + oPropertyValue + "'");
					return false;
				}
			});

			return bIsMatching;
		};
	};

}, /* bExport= */ true);
