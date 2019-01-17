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
	 * Class handling the Fake Lrep storage for session storage
	 *
	 * @class
	 *
	 * @author SAP SE
	 * @version 1.61.2
	 *
	 * @private
	 * @static
	 * @since 1.58
	 * @alias sap.ui.fl.FakeLrepSessionStorage
	 */

	"use strict";

	return FakeLrepStorage(window.sessionStorage);
}, /* bExport= */ true);