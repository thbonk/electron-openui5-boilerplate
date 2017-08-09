/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define(['jquery.sap.global', './Matcher'], function ($, Matcher) {
	"use strict";

	/**
	 * BindingPath - checks if a control has a binding context with the exact same binding path.
	 *
	 * @class BindingPath - checks if a control has a binding context with the exact same binding path
	 * @extends sap.ui.test.matchers.Matcher
	 * @param {object} [mSettings] Map/JSON-object with initial settings for the new BindingPath.
	 * @public
	 * @name sap.ui.test.matchers.BindingPath
	 * @author SAP SE
	 * @since 1.32
	 */
	return Matcher.extend("sap.ui.test.matchers.BindingPath", /** @lends sap.ui.test.matchers.BindingPath.prototype */ {

		metadata: {
			publicMethods: ["isMatching"],
			properties: {
				/**
				 * The value of the binding path that is used for matching.
				 */
				path: {
					type: "string"
				},
				/**
				 * The name of the binding model that is used for matching.
				 */
				modelName: {
					type: "string"
				}
			}
		},

		/**
		 * Checks if the control has a binding context that matches the path
		 *
		 * @param {sap.ui.core.Control} oControl the control that is checked by the matcher
		 * @return {boolean} true if the binding path has a strictly matching value.
		 * @public
		 */

		isMatching: function (oControl) {
			var oBindingContext;

			// check if there is a binding path
			if (!this.getPath()) {
				throw new Error(this + " the path needs to be a not empty string");
			}

			// check if there is a model name
			if (this.getModelName()) {
				oBindingContext = oControl.getBindingContext(this.getModelName());
			} else {
				oBindingContext = oControl.getBindingContext();
			}

			// check if there is a binding context
			if (!oBindingContext) {
				this._oLogger.debug("The control " + oControl + " has no binding context for the model " + this.getModelName());
				return false;
			}

			// check if the binding context is correct
			var bResult = this.getPath() === oBindingContext.getPath();

			if (!bResult) {
				this._oLogger.debug("The control " + oControl + " does not " +
					"have a matching binding context expected " + this.getPath() + " but got " +
				oBindingContext.getPath());
			}

			return bResult;
		}

	});

}, /* bExport= */ true);
