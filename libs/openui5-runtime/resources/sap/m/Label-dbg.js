/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.m.Label
sap.ui.define(['jquery.sap.global', './library', 'sap/ui/core/Control', 'sap/ui/core/LabelEnablement'],
	function(jQuery, library, Control, LabelEnablement) {
	"use strict";

	/**
	 * Constructor for a new Label.
	 *
	 * @param {string} [sId] ID for the new control, generated automatically if no ID is given
	 * @param {object} [mSettings] Initial settings for the new control
	 *
	 * @class
	 * The Label control is used in a UI5 mobile application to provide label text for other controls. Design such as bold, and text alignment can be specified.
	 * As of version 1.50 the default value of the <code>wrapping</code> property is set to <code>false</code>
	 *
	 * Labels for required fields are marked with an asterisk.
	 * <h3>Overview</h3>
	 * Labels are used as titles for single controls or groups of controls.
	 * <h3>Usage</h3>
	 * <h4>When to use</h4>
	 * <ul>
	 * <li>It's recommended to use the <code>Label</code> in Form controls.</li>
	 * <li>Use title case for labels.</li>
	 * </ul>
	 * <h4>When not to use</h4>
	 * <ul>
	 * <li> It is not recommended to use labels in Bold.</li>
	 * </ul>
	 * @extends sap.ui.core.Control
	 * @implements sap.ui.core.Label,sap.ui.core.IShrinkable
	 *
	 * @author SAP SE
	 * @version 1.50.6
	 *
	 * @constructor
	 * @public
	 * @alias sap.m.Label
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var Label = Control.extend("sap.m.Label", /** @lends sap.m.Label.prototype */ { metadata : {

		interfaces : [
			"sap.ui.core.Label",
			"sap.ui.core.IShrinkable"
		],
		library : "sap.m",
		properties : {

			/**
			 * Sets the design of a Label to either Standard or Bold.
			 */
			design : {type : "sap.m.LabelDesign", group : "Appearance", defaultValue : sap.m.LabelDesign.Standard},

			/**
			 * Determines the Label text to be displayed.
			 */
			text : {type : "string", group : "Misc", defaultValue : null},

			/**
			 * Available alignment settings are "Begin", "Center", "End", "Left", and "Right".
			 */
			textAlign : {type : "sap.ui.core.TextAlign", group : "Appearance", defaultValue : sap.ui.core.TextAlign.Begin},

			/**
			 * Options for the text direction are RTL and LTR. Alternatively, the control can inherit the text direction from its parent container.
			 */
			textDirection : {type : "sap.ui.core.TextDirection", group : "Appearance", defaultValue : sap.ui.core.TextDirection.Inherit},

			/**
			 * Determines the width of the label.
			 */
			width : {type : "sap.ui.core.CSSSize", group : "Dimension", defaultValue : ''},

			/**
			 * Indicates that user input is required for input control labeled by the sap.m.Label.
			 * When the property is set to true and associated input field is empty an asterisk character is added to the label text.
			 */
			required : {type : "boolean", group : "Misc", defaultValue : false},

			/**
			 * Determines if the label is in displayOnly mode. Controls in this mode are neither interactive, nor editable, nor focusable, and not in the tab chain.
			 *
			 * <b>Note:</b> This property should be used only in Form controls in preview mode.
			 *
			 * @since 1.50.0
			 */
			displayOnly : {type : "boolean", group : "Appearance", defaultValue : false},

			/**
			 * Determines the wrapping of the text within the <code>Label</code>.
			 * If set to true the <code>Label</code> will wrap, when set to false the <code>Label</code> will be truncated and replaced with ellipsis which is the default behavior.
			 *
			 * @since 1.50
			 */
			wrapping: {type : "boolean", group : "Appearance", defaultValue : false}
		},
		associations : {

			/**
			 * Association to the labeled control.
			 * By default the label set the for attribute to the ID of the labeled control. This can be changed by implementing the function getIdForLabel on the labelled control.
			 */
			labelFor : {type : "sap.ui.core.Control", multiple : false}
		},
		designTime : true
	}});

	Label.prototype.setText = function(sText) {
		var sValue = this.getText();
		if (sValue !== sText) {
			this.setProperty("text", sText, true);
			this.$().html(jQuery.sap.encodeHTML(this.getProperty("text")));
			if (sText) {
				this.$().removeClass("sapMLabelNoText");
			}else {
				this.$().addClass("sapMLabelNoText");
			}
		}
		return this;
	};

	Label.prototype.setTooltip = function(oTooltip) {
		var oValue = this.getTooltip();
		if (oValue !== oTooltip) {
			this.setAggregation("tooltip", oTooltip, true);
			this.$().attr("title", this.getTooltip());
		}
		return this;
	};

	Label.prototype.setDisplayOnly = function(displayOnly) {
		if (typeof displayOnly !== "boolean") {
			jQuery.sap.log.error("DisplayOnly property should be boolean. The new value will not be set");
			return this;
		}

		this.$().toggleClass("sapMLabelDisplayOnly", displayOnly);

		return sap.ui.core.Control.prototype.setProperty.call(this, "displayOnly", displayOnly);
	};

	/**
	 * @see sap.ui.core.Control#getAccessibilityInfo Provides the current accessibility state of the control.
	 * @protected
	 */
	Label.prototype.getAccessibilityInfo = function() {
		return {description: this.getText()};
	};

	// enrich Label functionality
	LabelEnablement.enrich(Label.prototype);

	return Label;

}, /* bExport= */ true);
