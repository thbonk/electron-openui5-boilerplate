/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define(['sap/f/semantic/SemanticButton'], function(SemanticButton) {
	"use strict";

	/**
	* Constructor for a new <code>NegativeAction</code>.
	* @param {string} [sId] ID for the new control, generated automatically if no ID is given
	* @param {object} [mSettings] Custom initial settings for the new control
	*
	* @class
	* A semantic-specific button, eligible for the <code>negativeAction</code> aggregation of the
	* {@link sap.f.semantic.SemanticPage} to be placed in its footer.
	*
	* @extends <code>sap.f.semantic.SemanticButton</code>
	*
	* @author SAP SE
	* @version 1.48.5
	*
	* @constructor
	* @public
	* @since 1.46.0
	* @alias sap.f.semantic.NegativeAction
	* @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	*/
	var NegativeAction = SemanticButton.extend("sap.f.semantic.NegativeAction", /** @lends sap.f.semantic.NegativeAction.prototype */ {
		metadata: {
			library: "sap.f",
			properties: {

				/**
				* Defines <code>NegativeAction</code> text.
				* <b>Note:</b> the default text is "Reject"
				*/
				text: {type: "string", group: "Misc", defaultValue: null}
			}
		}
	});

	return NegativeAction;
}, /* bExport= */ true);
