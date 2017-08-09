/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.ui.core.ComponentContainer.
sap.ui.define(['sap/ui/base/ManagedObject', './Control', './Component', './Core', './library'],
	function(ManagedObject, Control, Component, Core, library) {
	"use strict";


	var ComponentLifecycle = library.ComponentLifecycle;


	/**
	 * Constructor for a new ComponentContainer.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * Component Container
	 * @extends sap.ui.core.Control
	 * @version 1.46.12
	 *
	 * @constructor
	 * @public
	 * @alias sap.ui.core.ComponentContainer
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var ComponentContainer = Control.extend("sap.ui.core.ComponentContainer", /** @lends sap.ui.core.ComponentContainer.prototype */ { metadata : {

		library : "sap.ui.core",
		properties : {

			/**
			 * Component name, the package where the component is contained. This property can only be applied initially.
			 */
			name : {type : "string", defaultValue : null},

			/**
			 * The URL of the component. This property can only be applied initially.
			 */
			url : {type : "sap.ui.core.URI", defaultValue : null},

			/**
			 * Enable/disable validation handling by MessageManager for this component.
			 * The resulting Messages will be propagated to the controls.
			 * This property can only be applied initially.
			 */
			handleValidation : {type : "boolean", defaultValue : false},

			/**
			 * The settings object passed to the component when created. This property can only be applied initially.
			 */
			settings : {type : "object", defaultValue : null},

			/**
			 * Defines whether binding information is propagated to the component.
			 */
			propagateModel : {type : "boolean", defaultValue : false},

			/**
			 * Container width in CSS size
			 */
			width : {type : "sap.ui.core.CSSSize", group : "Dimension", defaultValue : null},

			/**
			 * Container height in CSS size
			 */
			height : {type : "sap.ui.core.CSSSize", group : "Dimension", defaultValue : null},

			/**
			 * Lifecycle behavior for the Component associated by the ComponentContainer.
			 * By default the behavior is "Legacy" which means that the ComponentContainer
			 * takes care to destroy the Component once the ComponentContainer is destroyed
			 * but not when a new Component is associated.
			 */
			lifecycle : {type : "sap.ui.core.ComponentLifecycle", defaultValue : ComponentLifecycle.Legacy}

		},
		associations : {

			/**
			 * The component displayed in this ComponentContainer.
			 */
			component : {type : "sap.ui.core.UIComponent", multiple : false}
		}
	}});


	/*
	 * Helper function to set the new Component of the container.
	 */
	function setContainerComponent(oComponentContainer, vComponent, bSuppressInvalidate, bDestroyOldComponent) {
		// find the reference to the current component and to the old component
		var oComponent = typeof vComponent === "string" ? Core.getComponent(vComponent) : vComponent;
		var oOldComponent = oComponentContainer.getComponentInstance();
		// if there is no difference between the old and the new component just skip this setter
		if (oOldComponent !== oComponent) {
			// unlink the old component from the container
			if (oOldComponent) {
				oOldComponent.setContainer(undefined);
				if (bDestroyOldComponent) {
					oOldComponent.destroy();
				} else {
					// cleanup the propagated properties in case of not destroying the component
					oComponentContainer._propagateProperties(true, oOldComponent, ManagedObject._oEmptyPropagatedProperties, true);
				}
			}
			// set the new component
			oComponentContainer.setAssociation("component", oComponent, bSuppressInvalidate);
			// cross link the new component and propagate the properties (models)
			oComponent = oComponentContainer.getComponentInstance();
			if (oComponent) {
				oComponent.setContainer(oComponentContainer);
				oComponentContainer.propagateProperties(true); //all models/listeners
			}
		}
	}


	/**
	 * Returns the real component instance which is associated with the container.
	 * @return {sap.ui.core.UIComponent} the component instance
	 */
	ComponentContainer.prototype.getComponentInstance = function () {
		var sComponentId = this.getComponent();
		return sComponentId && Core.getComponent(sComponentId);
	};


	/**
	 * Sets the component of the container. Depending on the ComponentContainer's
	 * lifecycle this might destroy the old associated Component.
	 *
	 * Once the component is associated with the container the cross connection
	 * to the component will be set and the models will be propagated if defined.
	 *
	 * @param {string|sap.ui.core.UIComponent} vComponent Id of an element which becomes the new target of this component association. Alternatively, an element instance may be given.
	 * @return {sap.ui.core.ComponentContainer} the reference to <code>this</code> in order to allow method chaining
	 * @public
	 */
	ComponentContainer.prototype.setComponent = function(vComponent, bSuppressInvalidate) {
		setContainerComponent(this, vComponent, bSuppressInvalidate,
			this.getLifecycle() === ComponentLifecycle.Container);
		return this;
	};


	/*
	 * delegate the onBeforeRendering to the component instance
	 */
	ComponentContainer.prototype.onBeforeRendering = function() {

		// check if we have already a valid component instance
		// in this case we skip the component creation via props
		// ==> not in applySettings to make sure that components are lazy instantiated,
		//     e.g. in case of invisible containers the component will not be created
		//     immediately in the constructor.
		var oComponent = this.getComponentInstance();
		if (!oComponent) {
			// create the component / link to the container (if a name is given)
			var sName = this.getName();
			if (sName) {
				// helper to create and set a new component instance
				var fnCreateAndSetComponent = function createAndSetComponent() {
					oComponent = sap.ui.component({
						name: sName,
						url: this.getUrl(),
						handleValidation: this.getHandleValidation(),
						settings: this.getSettings()
					});
					this.setComponent(oComponent, true);
				}.bind(this);
				// delegate the owner component if available
				var oOwnerComponent = Component.getOwnerComponentFor(this);
				if (oOwnerComponent) {
					oOwnerComponent.runAsOwner(fnCreateAndSetComponent);
				} else {
					fnCreateAndSetComponent();
				}
			}
		}

		// delegate the onBeforeRendering to the component instance
		if (oComponent && oComponent.onBeforeRendering) {
			oComponent.onBeforeRendering();
		}

	};

	/*
	 * delegate the onAfterRendering to the component instance
	 */
	ComponentContainer.prototype.onAfterRendering = function() {
		var oComponent = this.getComponentInstance();
		if (oComponent && oComponent.onAfterRendering) {
			oComponent.onAfterRendering();
		}
	};


	/*
	 * once the container is destroyed we remove the reference to the container
	 * in the component and destroy the component unless its lifecycle is managed
	 * by the application.
	 */
	ComponentContainer.prototype.exit = function() {
		setContainerComponent(this, undefined, true,
			this.getLifecycle() !== ComponentLifecycle.Application);
	};


	/*
	 * overridden to support property propagation to the associated component
	 */
	ComponentContainer.prototype.propagateProperties = function (vName) {
		var oComponent = this.getComponentInstance();
		if (oComponent && this.getPropagateModel()) {
			this._propagateProperties(vName, oComponent);
			Control.prototype.propagateProperties.apply(this, arguments);
		}
	};

	/*
	 * overridden to support contextual settings propagation to the associated component
	 * no need to call the parent prototype method as there are no aggregations to propagate to
	 */
	ComponentContainer.prototype._propagateContextualSettings = function () {
		var oComponent = this.getComponentInstance();
		if (oComponent) {
			oComponent._applyContextualSettings(this._getContextualSettings());
		}
	};

	return ComponentContainer;

});
