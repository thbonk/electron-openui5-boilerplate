/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides a filter for list bindings
sap.ui.define(['sap/ui/base/Exception'],
	function(Exception) {
	"use strict";


	/**
	 * FormatException class
	 *
	 * This exception is thrown, when an error occurs while trying to convert a value of the model to
	 * a specific property value in the UI.
	 *
	 * @alias sap.ui.model.FormatException
	 * @public
	 */
	var FormatException = function(message) {
		this.name = "FormatException";
		this.message = message;
	};
	FormatException.prototype = Object.create(Exception.prototype);

	return FormatException;

}, /* bExport= */ true);
