/*
 * ! UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2018 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define([
	"sap/ui/fl/FakeLrepConnectorStorage",
	"sap/ui/fl/FakeLrepLocalStorage"
],
function(
	FakeLrepConnectorStorage,
	FakeLrepLocalStorage
) {
	"use strict";

	/**
	 * Class for connecting to Fake LREP storing changes in local storage
	 *
	 * @class
	 *
	 * @author SAP SE
	 * @version 1.61.2
	 *
	 * @private
	 * @static
	 * @since 1.48
	 * @alias sap.ui.fl.FakeLrepConnectorLocalStorage
	 */

	return FakeLrepConnectorStorage(FakeLrepLocalStorage);
}, /* bExport= */ true);