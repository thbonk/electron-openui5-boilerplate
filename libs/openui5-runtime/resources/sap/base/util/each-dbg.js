/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2018 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define([], function() {
	"use strict";

	/**
	 * Iterates over elements of the given object or array.
	 *
	 * Numeric indexes are only used for instances of <code>Array</code>.
	 * For all other objects, including those with a numeric
	 * <code>length</code> property, the properties are iterated by name.
	 *
	 * When <code>fnCallback</code> returns <code>false</code>, then the iteration stops (break).
	 *
	 * @function
	 * @since 1.58
	 * @param {object|any[]} oObject object or array to enumerate the properties of
	 * @param {function} fnCallback function to call for each property name
	 * @alias module:sap/base/util/each
	 * @return {object|any[]} the given <code>oObject</code>
	 * @public
	 */
	var fnEach = function(oObject, fnCallback) {
		var isArray = Array.isArray(oObject),
			length, i;

		if ( isArray ) {
			for (i = 0, length = oObject.length; i < length; i++) {
				if ( fnCallback.call(oObject[i], i, oObject[i]) === false ) {
					break;
				}
			}
		} else {
			for ( i in oObject ) {
				if ( fnCallback.call(oObject[i], i, oObject[i] ) === false ) {
					break;
				}
			}
		}

		return oObject;
	};

	return fnEach;
});
