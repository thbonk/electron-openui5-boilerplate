/*
 * ! UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2018 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define([
	"sap/ui/fl/FakeLrepStorage"
], function(
	FakeLrepStorage
) {
	/**
	 * Class handling the Fake Lrep storage for local storage
	 *
	 * @class
	 *
	 * @author SAP SE
	 * @version 1.61.2
	 *
	 * @private
	 * @static
	 * @since 1.48
	 * @alias sap.ui.fl.FakeLrepLocalStorage
	 */

	"use strict";

	return FakeLrepStorage(window.localStorage);
}, /* bExport= */ true);