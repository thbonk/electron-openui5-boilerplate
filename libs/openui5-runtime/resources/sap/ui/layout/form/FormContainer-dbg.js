/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.ui.layout.form.FormContainer.
sap.ui.define(['jquery.sap.global', 'sap/ui/core/Element', 'sap/ui/core/EnabledPropagator', 'sap/ui/core/theming/Parameters', 'sap/ui/layout/library'],
	function(jQuery, Element, EnabledPropagator, Parameters, library) {
	"use strict";



	/**
	 * Constructor for a new sap.ui.layout.form.FormContainer.
	 *
	 * @param {string} [sId] ID for the new control, generated automatically if no ID is given
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * A <code>FormContainer</code> represents a group inside a <code>Form</code>. It consists of <code>FormElements</code>.
	 * The rendering of the <code>FormContainer</code> is done by the <code>FormLayout</code> assigned to the <code>Form</code>.
	 * @extends sap.ui.core.Element
	 *
	 * @author SAP SE
	 * @version 1.48.5
	 *
	 * @constructor
	 * @public
	 * @since 1.16.0
	 * @alias sap.ui.layout.form.FormContainer
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var FormContainer = Element.extend("sap.ui.layout.form.FormContainer", /** @lends sap.ui.layout.form.FormContainer.prototype */ { metadata : {

		library : "sap.ui.layout",
		properties : {

			/**
			 * Container is expanded.
			 *
			 * <b>Note:</b> This property only works if <code>expandable</code> is set to <code>true</code>.
			 */
			expanded : {type : "boolean", group : "Misc", defaultValue : true},

			/**
			 * Defines if the <code>FormContainer</code> is expandable.
			 *
			 * <b>Note:</b> The expander icon will only be shown if a <code>title</code> is set for the <code>FormContainer</code>.
			 */
			expandable : {type : "boolean", group : "Misc", defaultValue : false},

			/**
			 * If set to <code>false</code>, the <code>FormContainer</code> is not rendered.
			 */
			visible : {type : "boolean", group : "Misc", defaultValue : true}
		},
		defaultAggregation : "formElements",
		aggregations : {

			/**
			 * The <code>FormElements</code> contain the content (labels and fields) of the <code>FormContainers</code>.
			 */
			formElements : {type : "sap.ui.layout.form.FormElement", multiple : true, singularName : "formElement"},

			/**
			 * Title of the <code>FormContainer</code>. Can either be a <code>Title</code> element or a string.
			 * If a <code>Title</code> element is used, the style of the title can be set.
			 *
			 * <b>Note:</b> If a <code>Toolbar</code> is used, the <code>Title</code> is ignored.
			 */
			title : {type : "sap.ui.core.Title", altTypes : ["string"], multiple : false},

			/**
			 * Toolbar of the <code>FormContainer</code>.
			 *
			 * <b>Note:</b> If a <code>Toolbar</code> is used, the <code>Title</code> is ignored.
			 * If a title is needed inside the <code>Toolbar</code> it must be added at content to the <code>Toolbar</code>.
			 * In this case add the <code>Title</code> to the <code>ariaLabelledBy</code> association.
			 * @since 1.36.0
			 */
			toolbar : {type : "sap.ui.core.Toolbar", multiple : false},

			/*
			 * Internal Expand button
			 */
			_expandButton : {type : "sap.ui.core.Control", multiple : false, visibility: "hidden"}
		},
		associations: {

			/**
			 * Association to controls / IDs that label this control (see WAI-ARIA attribute <code>aria-labelledby</code>).
			 *
			 * <b>Note:</b> This attribute is only rendered if the <code>FormContainer</code> has it's own
			 * DOM representation in the used <code>FormLayout</code>.
			 * @since 1.36.0
			 */
			ariaLabelledBy: { type: "sap.ui.core.Control", multiple: true, singularName: "ariaLabelledBy" }
		},
		designTime : true
	}});

	FormContainer.prototype.init = function(){

		this._rb = sap.ui.getCore().getLibraryResourceBundle("sap.ui.layout");

	};

	FormContainer.prototype.exit = function(){

		if (this._oExpandButton) {
			delete this._oExpandButton;
		}
		this._rb = undefined;

	};

	FormContainer.prototype.setExpandable = function(bExpandable){

		this.setProperty("expandable", bExpandable);

		if (bExpandable) {
			var that = this;
			if (!this._oExpandButton) {
				if (!this._bExpandButtonRequired) {
					this._bExpandButtonRequired = true;
					sap.ui.layout.form.FormHelper.createButton.call(this, this.getId() + "--Exp", _handleExpButtonPress, _expandButtonCreated);
				}
			} else {
				_setExpanderIcon(that);
			}
		}

		return this;

	};

	function _expandButtonCreated(oButton) {

		this._oExpandButton = oButton;
		this.setAggregation("_expandButton", this._oExpandButton); // invalidate because this could happen after Form is already rendered
		_setExpanderIcon(this);

	}

	FormContainer.prototype.setExpanded = function(bExpanded){

		this.setProperty("expanded", bExpanded, true); // no automatic rerendering

		var that = this;
		_setExpanderIcon(that);

		var oForm = this.getParent();
		if (oForm && oForm.toggleContainerExpanded) {
			oForm.toggleContainerExpanded(that);
		}

		return this;

	};

	FormContainer.prototype.setToolbar = function(oToolbar) {

		// for sap.m.Toolbar Auto-design must be set to transparent
		oToolbar = sap.ui.layout.form.FormHelper.setToolbar.call(this, oToolbar);

		this.setAggregation("toolbar", oToolbar);

		return this;

	};

	/*
	 * If onAfterRendering of a field is processed the Form (layout) might need to change it.
	 */
	FormContainer.prototype.contentOnAfterRendering = function(oFormElement, oControl){

		// call function of parent (if assigned)
		var oParent = this.getParent();
		if (oParent && oParent.contentOnAfterRendering) {
			oParent.contentOnAfterRendering( oFormElement, oControl);
		}

	};

	/*
	 * If LayoutData changed on control this may need changes on the layout. So bubble to the form
	 */
	FormContainer.prototype.onLayoutDataChange = function(oEvent){

		// call function of parent (if assigned)
		var oParent = this.getParent();
		if (oParent && oParent.onLayoutDataChange) {
			oParent.onLayoutDataChange(oEvent);
		}

	};

	/*
	 * Checks if properties are fine
	 * Expander only visible if title is set -> otherwise give warning
	 * @return 0 = no problem, 1 = warning, 2 = error
	 * @private
	 */
	FormContainer.prototype._checkProperties = function(){

		var iReturn = 0;

		if (this.getExpandable() && (!this.getTitle() || this.getToolbar())) {
			jQuery.sap.log.warning("Expander only displayed if title is set", this.getId(), "FormContainer");
			iReturn = 1;
		}

		return iReturn;

	};

	/**
	 * As Elements must not have a DOM reference it is not sure if one exists
	 * If the FormContainer has a DOM representation this function returns it,
	 * independent from the ID of this DOM element
	 * @return {Element} The Element's DOM representation or null
	 * @private
	 */
	FormContainer.prototype.getRenderedDomRef = function(){

		var that = this;
		var oForm = this.getParent();

		if (oForm && oForm.getContainerRenderedDomRef) {
			return oForm.getContainerRenderedDomRef(that);
		}else {
			return null;
		}

	};

	/**
	 * As Elements must not have a DOM reference it is not sure if one exists
	 * If the FormElement has a DOM representation this function returns it,
	 * independent from the ID of this DOM element
	 * @param {sap.ui.layout.form.FormElement} oElement FormElement
	 * @return {Element} The Element's DOM representation or null
	 * @private
	 */
	FormContainer.prototype.getElementRenderedDomRef = function(oElement){

		var oForm = this.getParent();

		if (oForm && oForm.getElementRenderedDomRef) {
			return oForm.getElementRenderedDomRef(oElement);
		}else {
			return null;
		}

	};

	function _setExpanderIcon(oContainer){

		if (!oContainer._oExpandButton) {
			return;
		}

		var sIcon, sIconHovered, sText, sTooltip;

		if (oContainer.getExpanded()) {
			sIcon = Parameters._getThemeImage('_sap_ui_layout_Form_FormContainerColImageURL');
			sIconHovered = Parameters._getThemeImage('_sap_ui_layout_Form_FormContainerColImageDownURL');
			sText = "-";
			sTooltip = oContainer._rb.getText("FORM_COLLAPSE");
		} else {
			sIcon = Parameters._getThemeImage('_sap_ui_layout_Form_FormContainerExpImageURL');
			sIconHovered = Parameters._getThemeImage('_sap_ui_layout_Form_FormContainerExpImageDownURL');
			sText = "+";
			sTooltip = oContainer._rb.getText("FORM_EXPAND");
		}

		if (sIcon) {
			sText = "";
		}

		sap.ui.layout.form.FormHelper.setButtonContent(oContainer._oExpandButton, sText, sTooltip, sIcon, sIconHovered);

	}

	function _handleExpButtonPress(oEvent){

		this.setExpanded(!this.getExpanded());

	}

	return FormContainer;

}, /* bExport= */ true);
