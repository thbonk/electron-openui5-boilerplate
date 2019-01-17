/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2018 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
/*
 * IMPORTANT: This is a private module, its API must not be used and is subject to change.
 * Code other than the OpenUI5 libraries must not introduce dependencies to this module.
 */
sap.ui.define([], function() {
	"use strict";
	/**
	 * Validates if the given object is empty
	 *
	 * @function
	 * @since 1.58
	 * @private
	 * @name module:sap/base/util/isEmptyObject
	 * @param {Object} oToValidate - object to validate
	 * @returns {boolean} flag if given object is empty
	 */
	return function(oToValidate) {
		/*eslint-disable no-unused-vars */
		for (var sName in oToValidate) {
			return false;
		}
		/*eslint-enable no-unused-vars */
		return true;
	};
});
