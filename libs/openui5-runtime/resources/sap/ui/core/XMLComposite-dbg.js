/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

/**
 * This class provides the possibly to declare the "view" part of a composite control
 * in an XML fragment which will automatically define the rendering accordingly.
 * Additionally, the XMLComposite allows aggregations defined on the control
 * to be forwarded (on an instance level) to the inner controls used in the
 * XML fragment.
 *
 * CAUTION: naming, location and APIs of this entity will possibly change and should
 * therefore be considered experimental
 *
 * @private
 * @sap-restricted
 *
 */
sap.ui.define([
	'jquery.sap.global', 'sap/ui/core/Control', 'sap/ui/core/XMLCompositeMetadata', 'sap/ui/model/base/ManagedObjectModel', 'sap/ui/core/util/XMLPreprocessor',
	'sap/ui/model/json/JSONModel', 'sap/ui/core/Fragment', 'sap/ui/base/ManagedObject', 'sap/ui/base/DataType', 'sap/ui/core/AggregationProxy'
], function (jQuery, Control, XMLCompositeMetadata, ManagedObjectModel, XMLPreprocessor, JSONModel, Fragment, ManagedObject, DataType, Proxy) {
	"use strict";

	// private functions
	var mControlImplementations = {};

	function initXMLComposite (sFragment, oFragmentContext) {
		if (!mControlImplementations[sFragment]) {
			jQuery.sap.require(sFragment);
			mControlImplementations[sFragment] = jQuery.sap.getObject(sFragment);
		}
		return mControlImplementations[sFragment];
	}

	function parseScalarType (sType, sValue, sName, oController) {
		// check for a binding expression (string)
		var oBindingInfo = ManagedObject.bindingParser(sValue, oController, true);
		if (oBindingInfo && typeof oBindingInfo === "object") {
			return oBindingInfo;
		}

		var vValue = sValue = oBindingInfo || sValue;// oBindingInfo could be an unescaped string
		var oType = DataType.getType(sType);
		if (oType) {
			if (oType instanceof DataType) {
				vValue = oType.parseValue(sValue);
			}
		// else keep original sValue (e.g. for enums)
		} else {
			throw new Error("Property " + sName + " has unknown type " + sType);
		}

		// Note: to avoid double resolution of binding expressions, we have to escape string values once again
		return typeof vValue === "string" ? ManagedObject.bindingParser.escape(vValue) : vValue;
	}

	function addAttributesContext (mContexts, sName, oElement, oImpl, oVisitor) {
		var oAttributesModel = new JSONModel(oElement),
			oMetadata = oImpl.getMetadata(),
			mAggregations = oMetadata.getAllAggregations(),
			mProperties = oMetadata.getAllProperties(),
			mSpecialSettings = oMetadata._mAllSpecialSettings;

		oAttributesModel.getVisitor = function () {
			return oVisitor;
		};
		oAttributesModel.getProperty = function (sPath, oContext) {
			var oResult;
			sPath = this.resolve(sPath, oContext);
			sPath = sPath.substring(1);

			if (sPath && sPath.startsWith && sPath.startsWith("metadataContexts")) {
				return this._navInMetadataContexts(sPath);//note as metadataContexts is an object the path can be deep
			}

			if (mProperties.hasOwnProperty(sPath)) {
				// get a property
				var oProperty = mProperties[sPath];
				if (!oElement.hasAttribute(sPath)) {
					return oProperty.defaultValue;
				}
				// try to resolve a result from templating time or keep the original value
				oResult = oVisitor.getResult(oElement.getAttribute(sPath)) || oElement.getAttribute(sPath);
				if (oResult) {
					var oScalar = parseScalarType(oProperty.type, oResult, sPath);
					if (typeof oScalar === "object" && oScalar.path) {
						return oResult;
					}
					return oScalar;
				}
				return null;

			} else if (mAggregations.hasOwnProperty(sPath)) {
				var oAggregation = mAggregations[sPath];
				if (oAggregation.multiple === true && oAggregation.type === "TemplateMetadataContext") {
					if (!oElement.hasAttribute(sPath)) {
						return null;
					}
					return oElement.getAttribute(sPath);
				}
				return oElement.getAttribute(sPath);
			} else if (mSpecialSettings.hasOwnProperty(sPath)) {
				var oSpecialSetting = mSpecialSettings[sPath];

				if (!oElement.hasAttribute(sPath)) {
					return oSpecialSetting.defaultValue || null;
				}

				oResult = oVisitor.getResult(oElement.getAttribute(sPath));

				if (oSpecialSetting.type) {
					var oScalar = parseScalarType(oSpecialSetting.type, oResult, sPath);
					if (typeof oScalar === "object" && oScalar.path) {
						return oResult;
					}
					return oScalar;
				}

				if (oResult) {
					return oResult;
				}
				return oElement.getAttribute(sPath);
			}
		};

		oAttributesModel._navInMetadataContexts = function(sPath) {
			var sRemainPath = sPath.replace("metadataContexts/","");
			var sInnerPath,aPath = sRemainPath.split("/");

			var oResult,vNode = mContexts["metadataContexts"].getObject();

			while (aPath.length > 0 && vNode) {

				if (vNode.getObject) {
					//try to nav deep
					oResult = vNode.getObject(aPath.join("/"));
				}

				if (!oResult) {
					sInnerPath = aPath.shift();
					vNode = vNode[sInnerPath];
				} else {
					return oResult;
				}
			}

			return vNode;

		};

		oAttributesModel.getContextName = function () {
			return sName;
		};
		mContexts[sName] = oAttributesModel.getContext("/");
	}

	// TODO: be more specific about what is returned; at the moment we would return
	// also e.g. models which are not specifically defined on the composite control
	// but are propagated from outside of it. Ideally, we would only return
	// settings which are specifically defined on the XMLComposite !
	function getSettings (oPropagates) {
		var oSettings = {};
		oSettings.models = oPropagates.oModels || {};
		oSettings.bindingContexts = oPropagates.oBindingContexts || {};
		return oSettings;
	}

	/**
	 * XMLComposite is the base class for composite controls that use a XML fragment representation
	 * for their visual parts. From a user perspective such controls appear as any other control, but internally the
	 * rendering part is added as a fragment.
	 * The fragment that is used should appear in the same folder as the control's JS implementation with the file extension
	 * <code>.control.xml</code>.
	 * The fragment's content can access the interface data from the XMLComposite control via bindings. Currently only aggregations and properties
	 * can be used with bindings inside a fragment.
	 * The exposed model that is used for internal bindings in the fragment has the default name <code>$this</code>. The name will always start
	 * with an <code>$</code>. The metadata of the derived control can define the alias with its metadata. A code example can be found below.
	 *
	 * As XMLComposites compose other controls, they are only invalidated and re-rendered if explicitly defined. Additional metadata
	 * for invalidation can be given for properties and aggregation. The default invalidation is <code>"none"</code>.
	 * Setting invalidate to <code>true</code> for properties and aggregations sets the complete XMLComposite
	 * to invalidate and rerender. For templating scenarios the XMLComposite can also be forced to re-template completely. In such case set invalidate
	 * of the corresponding property to <code>"template"</code>
	 *
	 * Example:
	 * <pre>
	 * XMLComposite.extend("sap.mylib.MyXMLComposite", {
	 *   metadata : {
	 *     library: "sap.mylib",
	 *     properties : {
	 *       text: { //changing this property will not re-render the XMLComposite
	 *          type: "string",
	 *          defaultValue: ""
	 *       },
	 *       title: { //changing this property will re-render the XMLComposite as it defines invalidate: true
	 *          type: "string",
	 *          defaultValue: "",
	 *          invalidate: true
	 *       },
	 *       value: { //changing this property will re-render the XMLComposite as it defines invalidate: true
	 *          type: "string",
	 *          defaultValue: "",
	 *          invalidate: true
	 *       },
	 *       progress: { //changing this property will re-template the XMLComposite as it defines invalidate: true
	 *          type: "int",
	 *          defaultValue: "",
	 *          invalidate: "template"
	 *       }
	 *     },
	 *     defaultProperty : "text",
	 *     aggregations : {
	 *       items : {
	 *          type: "sap.ui.core.Control",
	 *          invalidate: true
	 *       },
	 *       header : {
	 *          type: "sap.mylib.FancyHeader",
	 *          multiple : false
	 *       }
	 *     },
	 *     defaultAggregation : "items"
	 *     events: {
	 *       outerEvent : {
	 *         parameters : {
	 *           opener : "sap.ui.core.Control"
	 *         }
	 *       }
	 *     }
	 *   },
	 *   //alias defaults to "this"
	 *   alias: "mycontrolroot" //inner bindings will use model name $mycontrolroot
	 *   //fragment defaults to {control name}.control.xml in this case sap.mylib.MyXMLComposite.control.xml
	 *   fragment: "sap.mylib.MyXMLCompositeOther.control.xml" //the name of the fragment
	 * });
	 * </pre>
	 *
	 * Internally the XMLComposite instantiates and initializes the given fragment and stores the resulting control in a hidden
	 * aggregation named <code>_content</code>. The fragment should only include one root element.
	 *
	 * Bindings of inner controls to the interface of the XMLComposite can be done with normal binding syntax.
	 * Here properties are used as property bindings and aggregations are used as list bindings.
	 * Currently it is not possible to bind associations in a fragment.
	 *
	 * Example:
	 * <pre>
	 *    &lt;core:FragmentDefinition xmlns:m="sap.m" xmlns:core="sap.ui.core"&gt;
	 *       &lt;m:Text text="{$this&gt;text}" visible="{= ${$this&gt;text} !== ""}" /&gt;
	 *    &lt;/core:FragmentDefinition&gt;
	 * </pre>
	 * <pre>
	 *    &lt;core:FragmentDefinition xmlns:m="sap.m" xmlns:core="sap.ui.core"&gt;
	 *       &lt;m:VBox items="{path:"$this&gt;texts", filters:{path:"text", operator:"Contains", value1:"Text"}, sorter:{path:"text", descending:true}}"&gt;
	 *           &lt;m:Text text="{$this&gt;text}" /&gt;
	 *       &lt;/m:VBox&gt;
	 *    &lt;/core:FragmentDefinition&gt;
	 * </pre>
	 * <pre>
	 *    &lt;core:FragmentDefinition xmlns:m="sap.m" xmlns:core="sap.ui.core"&gt;
	 *       &lt;m:Button text="Press Me" press="handlePress"/&gt;
	 *    &lt;/core:FragmentDefinition&gt;
	 * </pre>
	 *
	 * All events handled within the fragment will be dispatched to the XMLComposite control. It is recommended to follow this paradigm to allow
	 * reuse of a XMLComposite without any dependency to controller code of the current embedding view.
	 *
	 * <pre>
	 *    MyXMLComposite.prototype.handlePress = function() {
	 *        this.fireOuterEvent(); // passing on the event to the outer view
	 *    }
	 * </pre>
	 *
	 * @see sap.ui.core.Control
	 * @see sap.ui.core.Fragment
	 *
	 * @class Base Class for XMLComposite controls.
	 * @extends sap.ui.core.Control
	 *
	 * @author SAP SE
	 * @version 1.50.6
	 * @since 1.50.0
	 * @alias sap.ui.core.XMLComposite
	 *
	 * @abstract
	 * @experimental
	 * @private
	 * @sap-restricted sap.fe
	 */
	var XMLComposite = Control.extend("sap.ui.core.XMLComposite", {
		metadata: {
			aggregations: {
				/**
				 * Aggregation used to store the default content
				 * @private
				 */
				_content: {
					type: "sap.ui.core.Control",
					multiple: false,
					visibility: "hidden"
				}
			}
		},
		renderer: function (oRm, oControl) {
			oRm.write("<div");
			oRm.writeControlData(oControl);
			oRm.writeClasses(); // to make class="..." in XMLViews and addStyleClass() work
			oRm.write(">");
			var oContent = oControl.getAggregation(oControl.getMetadata().getCompositeAggregationName());
			if (oContent) {
				oRm.renderControl(oContent);
			}
			oRm.write("</div>");
		}
	}, XMLCompositeMetadata);

	/**
	 * Applies the settings of the XMLComposite control
	 *
	 * @returns {sap.ui.core.XMLComposite} The instance of the control
	 *
	 * @private
	 */
	XMLComposite.prototype.applySettings = function () {
		this._bIsInitializing = true;
		var vResult = Control.prototype.applySettings.apply(this, arguments);
		this._bIsInitializing = false;
		return vResult;
	};

	/**
	 * Returns an element by its ID in the context of the XMLComposite.
	 *
	 * May only be used by the implementation of a specific XMLComposite, not by an application using a XMLComposite.
	 *
	 * @param {string} sId XMLComposite-local ID of the inner element
	 * @returns {sap.ui.core.Element} element by its ID or <code>undefined</code>
	 * @protected
	 */
	XMLComposite.prototype.byId = function(sId) {
		return sap.ui.getCore().byId(Fragment.createId(this.getId(), sId));
	};

	/**
	 * Returns the managed object model of the XMLComposite control
	 *
	 * @returns {sap.ui.model.base.ManagedObjectModel} the managed object model of the XMLComposite control
	 *
	 * @private
	 */
	XMLComposite.prototype._getManagedObjectModel = function () {
		if (!this._oManagedObjectModel) {
			this._oManagedObjectModel = new ManagedObjectModel(this);
		}
		return this._oManagedObjectModel;
	};

	/**
	 * Checks whether invalidation should be suppressed for the given aggregations
	 * Suppressing an aggregation update will only lead to rendering of the changed subtree
	 *
	 * @param {string} sName the name of the aggregation to check
	 * @param {boolean} [bSuppressInvalidate] the requested invalidation or undefined
	 *
	 * @private
	 *
	 */
	XMLComposite.prototype.getSuppressInvalidateAggregation = function (sName, bSuppressInvalidate) {
		var oMetadata = this.getMetadata(),
			oAggregation = oMetadata.getAggregation(sName) || oMetadata.getAllPrivateAggregations()[sName];
		if (!oAggregation) {
			return true;
		}
		bSuppressInvalidate = oMetadata._suppressInvalidate(oAggregation, bSuppressInvalidate);
		oMetadata._requestFragmentRetemplatingCheck(this, oAggregation);
		return bSuppressInvalidate;
	};

	/**
	 * @see sap.ui.core.Control#setProperty
	 */
	XMLComposite.prototype.setProperty = function (sName, oValue, bSuppressInvalidate) {
		var oMetadata = this.getMetadata(),
			oProperty = oMetadata.getProperty(sName);
		if (!oProperty) {
			return this;
		}
		bSuppressInvalidate = this.getMetadata()._suppressInvalidate(oProperty, bSuppressInvalidate);
		if (Control.prototype.getProperty.apply(this, [sName]) !== oValue) {
			oMetadata._requestFragmentRetemplatingCheck(this, oProperty);
		}
		return Control.prototype.setProperty.apply(this, [sName, oValue, bSuppressInvalidate]);
	};

	/**
	 * @see sap.ui.core.Control#bindAggregation
	 */
	XMLComposite.prototype.bindAggregation = function (sName, oObject) {
		var oMetadata = this.getMetadata(),
			oAggregation = oMetadata.getAggregation(sName) || oMetadata.getAllPrivateAggregations()[sName],
			oBinding = Control.prototype.getBinding.apply(this, [sName]);
		if (!oBinding || (oBinding && oBinding.getPath() !== oObject.path)) {
			oMetadata._requestFragmentRetemplatingCheck(this, oAggregation);
		}
		return Control.prototype.bindAggregation.apply(this, [sName, oObject]);
	};

	/**
	 * @see sap.ui.core.Control#unbindAggregation
	 */
	XMLComposite.prototype.unbindAggregation = function (sName) {
		var oMetadata = this.getMetadata(),
			oAggregation = oMetadata.getAggregation(sName) || oMetadata.getAllPrivateAggregations()[sName];
		if (this.isBound(sName)) {
			oMetadata._requestFragmentRetemplatingCheck(this, oAggregation, true);
		}
		return Control.prototype.unbindAggregation.apply(this, [sName]);
	};

	/**
	 * @see sap.ui.core.Control#setAggregation
	 */
	XMLComposite.prototype.setAggregation = function (sName, oObject, bSuppressInvalidate) {
		return Control.prototype.setAggregation.apply(this, [sName, oObject, this.getSuppressInvalidateAggregation(sName, bSuppressInvalidate)]);
	};

	/**
	 * @see sap.ui.core.Control#addAggregation
	 */
	XMLComposite.prototype.addAggregation = function (sName, oObject, bSuppressInvalidate) {
		return Control.prototype.addAggregation.apply(this, [sName, oObject, this.getSuppressInvalidateAggregation(sName, bSuppressInvalidate)]);
	};

	/**
	 * @see sap.ui.core.Control#unbindAggregation
	 */
	XMLComposite.prototype.insertAggregation = function (sName, oObject, iIndex, bSuppressInvalidate) {
		return Control.prototype.insertAggregation.apply(this, [sName, oObject, iIndex, this.getSuppressInvalidateAggregation(sName, bSuppressInvalidate)]);
	};
	/**
	 * sap.ui.core.Control#removeAggregation
	 */
	XMLComposite.prototype.removeAggregation = function (sName, oObject, bSuppressInvalidate) {
		return Control.prototype.removeAggregation.apply(this, [sName, oObject, this.getSuppressInvalidateAggregation(sName, bSuppressInvalidate)]);
	};

	/**
	 * @see sap.ui.core.Control#removeAllAggregation
	 */
	XMLComposite.prototype.removeAllAggregation = function (sName, bSuppressInvalidate) {
		return Control.prototype.removeAllAggregation.apply(this, [sName, this.getSuppressInvalidateAggregation(sName, bSuppressInvalidate)]);
	};

	/**
	 * @see sap.ui.core.Control#destroyAggregation
	 */
	XMLComposite.prototype.destroyAggregation = function (sName, bSuppressInvalidate) {
		return Control.prototype.destroyAggregation.apply(this, [sName, this.getSuppressInvalidateAggregation(sName, bSuppressInvalidate)]);
	};

	/**
	 * @see sap.ui.core.Control#updateAggregation
	 */
	XMLComposite.prototype.updateAggregation = function (sName, bSuppressInvalidate) {
		var oAggregation = this.getMetadata().getAggregation(sName);
		if (oAggregation && oAggregation.type === "TemplateMetadataContext") {
			this.invalidate();
			return;
		}
		Control.prototype.updateAggregation.apply(this, arguments);
	};

	/**
	 * @see sap.ui.core.Control#setVisible
	 */
	XMLComposite.prototype.setVisible = function (bVisible) {
		this.setProperty("visible", bVisible);
		if (this.getParent()) {
			// TODO: is this correct ?
			this.getParent().invalidate();
		}
		return this;
	};

	/**
	 * Destroys the internal composite aggregation
	 *
	 * @returns {sap.ui.core.XMLComposite} Returns <code>this</code> to allow method chaining
	 *
	 * @private
	 */
	XMLComposite.prototype._destroyCompositeAggregation = function () {
		var sCompositeName = this.getMetadata().getCompositeAggregationName(),
			oContent = this.getAggregation(sCompositeName);
		if (oContent) {
			oContent.destroy();
		}
		return this;
	};

	/**
	 * Whenever bindings are updated the corresponding aggregations need to be destroyed,
	 * otherwise the managed object tree is not updating the proxy object in the inner managed object tree.
	 */
	XMLComposite.prototype.updateBindings = function () {
		if (this._bIsInitializing) {
			return;
		}
		var oResult = Control.prototype.updateBindings.apply(this, arguments);
		for (var n in this.mBindingInfos) {
			var oAggregation = this.getMetadata().getAggregation(n);
			if (oAggregation &&
				oAggregation.multiple &&
				!oAggregation._doesNotRequireFactory &&
				this.isBound(n) &&
				!this.getBinding(n)) {
				this[oAggregation._sDestructor]();
			}
		}
		return oResult;
	};
	/**
	 * Sets the internal composite aggregation
	 *
	 * @returns {sap.ui.core.XMLComposite} Returns <code>this</code> to allow method chaining
	 *
	 * @private
	 */
	XMLComposite.prototype._setCompositeAggregation = function (oNewContent) {
		var sCompositeName = this.getMetadata().getCompositeAggregationName();
		this._destroyCompositeAggregation();
		if (!this._oManagedObjectModel) {
			this._getManagedObjectModel();
		}
		if (jQuery.isArray(oNewContent)) {
			this.setAggregation(sCompositeName, null);
			return;
		}
		if (oNewContent) {
			oNewContent.setModel(this._oManagedObjectModel, "$" + this.alias);
			oNewContent.bindObject("$" + this.alias + ">/");
		}
		var that = this;
		this.setAggregation(sCompositeName, oNewContent);
		var that = this;

		// in short, the reason we overwrite the _getPropertiesToPropagate is that we wish to filter out controlTree models from parents
		// from being propagated. This is not strictly needed but it could lead to confusion if in an inner
		// XMLComposite control you could reference the controlTree model of a "parent" XMLComposite control.
		oNewContent._getPropertiesToPropagate = function () {
			// XMLComposite control content should only propagate the contexts that are not contexts of parent XMLComposite controls
			// this is the case for XMLComposite controls that are nested in other XMLComposite controls

			// notice that the call ManagedObject.prototype._getPropertiesToPropagate.apply(this, arguments) gives us
			// all the parent properties (model, bindingContexts and listeners) merged with the properties of self
			// (the latter is merged on top of the parent properties) - in this method it is about what we overtake from
			// this already merged result
			var oProperties = ManagedObject.prototype._getPropertiesToPropagate.apply(this, arguments),
				oBindingContexts = {},
				oModels = {},
				oModel;
			for (var n in oProperties.oBindingContexts) {
				var oContext = oProperties.oBindingContexts[n];
				if (oContext) {
					oModel = oContext.getModel();
					// if the model to be propageted is a controlTree model of an XMLComposite with a different name that the controlTree model
					// of our current control, then we do *not* propagate
					if (oModel instanceof ManagedObjectModel && oModel.getRootObject() instanceof XMLComposite && "$" + that.alias !== n) {
						continue;
					}
					// so in this case we know that either we are dealing with a model which is not a controlTree model of an XMLComposite or
					// it is so but the name of the model to propagete is identical to the name of our current control and since oProperties
					// is already a merge we know that in the latter case the controlTree model *is* the controlTree model set on
					// oNewContent (=this) in _setCompositeAggregation
					oBindingContexts[n] = oProperties.oBindingContexts[n];
				}
			}
			for (var n in oProperties.oModels) {
				var oModel = oProperties.oModels[n];
				if (oModel && oModel instanceof ManagedObjectModel && oModel.getRootObject() instanceof XMLComposite && "$" + that.alias !== n) {
					continue;
				}
				oModels[n] = oProperties.oModels[n];
			}

			oProperties.oBindingContexts = oBindingContexts;
			oProperties.oModels = oModels;
			return oProperties;
		};
		this.invalidate();
	};

	/**
	 * Initializes composite support with the given settings
	 * @param {map} mSettings the map of settings
	 *
	 * @private
	 */
	XMLComposite.prototype._initCompositeSupport = function (mSettings) {
		var oMetadata = this.getMetadata(),
			sAggregationName = oMetadata.getCompositeAggregationName(),
			bInitialized = false;
		if (mSettings && sAggregationName) {
			var oNode = mSettings[sAggregationName];
			if (oNode && oNode.localName === "FragmentDefinition") {
				this._destroyCompositeAggregation();
				this._setCompositeAggregation(sap.ui.xmlfragment({
					sId: this.getId(),
					fragmentContent: mSettings[sAggregationName],
					oController: this
				}));
				bInitialized = true;
			}
			delete mSettings[sAggregationName];
		}
		if (!bInitialized) {
			this._destroyCompositeAggregation();
			this._setCompositeAggregation(sap.ui.xmlfragment({
				sId: this.getId(),
				fragmentContent: this.getMetadata()._fragment,
				oController: this
			}));
		}

	};

	/**
	 * Requests a re-templating of the XMLComposite control
	 *
	 * @param {boolean} bForce true forces the re-templating
	 *
	 * @private
	 */
	XMLComposite.prototype.requestFragmentRetemplating = function (bForce) {
		// check all binding context of aggregations
		if (bForce) {
			this.fragmentRetemplating();
			return;
		}
		var mAggregations = this.getMetadata().getMandatoryAggregations(),
			bBound = true;
		for (var n in mAggregations) {
			bBound = typeof this.getBindingInfo(n) === "object";
			if (!bBound) {
				break;
			}
		}
		if (bBound) {
			this.fragmentRetemplating();
		}
	};

	/**
	 * Retemplates the XMLComposite control if a property or aggregation marked with invalidate : "template" in the metadata of the
	 * specific instance
	 *
	 * @private
	 */
	XMLComposite.prototype.fragmentRetemplating = function () {
		var oMetadata = this.getMetadata(),
			oFragment = oMetadata.getFragment();

		if (!oFragment) {
			throw new Error("Fragment " + oFragment.tagName + " not found");
		}
		var oManagedObjectModel = this._getManagedObjectModel();
		var that = this;
		oManagedObjectModel.getContextName = function () {
			return that.alias;
		};
		// TODO: Can we add the Model manually to the propProp Map without setting it?
		// be more specific about which models are set

		// TODO: what happens with any previous model?  Memory leak?
		this.setModel(oManagedObjectModel, this.alias);
		this.bindObject(this.alias + ">/");
		oManagedObjectModel._mSettings = getSettings(this._getPropertiesToPropagate());
		delete oManagedObjectModel._mSettings.models["$" + this.alias];
		delete oManagedObjectModel._mSettings.bindingContexts["$" + this.alias];
		this.setModel(null, this.alias);
		XMLPreprocessor.process(oFragment.querySelector("*"), {}, oManagedObjectModel._mSettings);
		// now with the updated fragment, call _initCompositeSupport again on the
		// aggregation hosting the fragment
		var mSettings = {};
		mSettings[oMetadata.getCompositeAggregationName()] = oFragment;
		this._initCompositeSupport(mSettings);
	};

	/**
	 * Called for the initial templating of an XMLComposite control
	 * @param {DOMNode} oElement root element for templating
	 * @param {IVisitor} oVisitor the interface of the visitor of the XMLPreprocessor
	 * @see sap.ui.core.util.XMLPreprocessor
	 * @private
	 */
	XMLComposite.initialTemplating = function (oElement, oVisitor, sFragment) {
		var oImpl = initXMLComposite(sFragment),
			mContexts = {},
			oMetadata = oImpl.getMetadata(),
			oFragment = oMetadata.getFragment(),
			oErrorModel = new JSONModel({});

		if (!oFragment) {
			throw new Error("Fragment " + sFragment + " not found");
		}
		var sMetadataContexts = oElement.getAttribute("metadataContexts");

		if (!sMetadataContexts && oMetadata._mSpecialSettings.metadataContexts) {
			sMetadataContexts = oMetadata._mSpecialSettings.metadataContexts.defaultValue;
		}

		//extend the contexts from metadataContexts
		if (sMetadataContexts) {
			var sKey,oCtx,oMetadataContexts = ManagedObject.bindingParser(sMetadataContexts);

			if (!oMetadataContexts.parts) {
				oCtx = oMetadataContexts;

				oMetadataContexts = { parts: [oCtx]};
			}

			for (var j = 0; j < oMetadataContexts.parts.length; j++) {
				oCtx = oMetadataContexts.parts[j];

				if (!oCtx.model) {
					oCtx.model = oImpl.prototype.defaultMetaModel;
				}

				sKey = oCtx.name || oCtx.model || undefined;
				try {
					mContexts[sKey] = oVisitor.getContext(oCtx.model + ">" + oCtx.path);//add the context to the visitor
					oMetadataContexts[sKey] = mContexts[sKey];//make it available inside metadataContexts JSON object
				} catch (ex) {
					//ignore the context as this can only be the case if the model is not ready, i.e. not a preprocessing model but maybe a model for providing afterwards
					mContexts["_$error"] = mContexts["_$error"] || oErrorModel.getContext("/");
					mContexts["_$error"].oModel.setProperty("/" + sKey,ex);
				}
			}

			var oMdCModel = new JSONModel(oMetadataContexts);

			//make metadataContext accessible
			mContexts["metadataContexts"] = oMdCModel.getContext("/");
		}

		addAttributesContext(mContexts, oImpl.prototype.alias, oElement, oImpl, oVisitor);
		var oContextVisitor = oVisitor["with"](mContexts, true);
		var	mMetadata = oImpl.getMetadata();
		// resolve templating
		oContextVisitor.visitChildNodes(oFragment);
		var oNode = oFragment.ownerDocument.createElementNS("http://schemas.sap.com/sapui5/extension/sap.ui.core.xmlcomposite/1", mMetadata.getCompositeAggregationName());
		oNode.appendChild(oFragment);
		oElement.appendChild(oNode);
	};

	/**
	 * TODO: Where to put default helpers
	 */
	XMLComposite.helper = {
		// Annotation Helper to go to the meta model context of the corresponding meta model
		listContext: function (oContext) {
			var oBindingInfo = oContext.getModel().getProperty(oContext.getPath());
			if (typeof oBindingInfo === "string") {
				oBindingInfo = ManagedObject.bindingParser(oBindingInfo);
			}
			if (jQuery.isArray(oBindingInfo)) {
				var oBinding = oContext.getModel().getProperty(oContext.getPath() + "/@binding");
				if (oBinding) {
					return oBinding.getModel().getMetaModel().getMetaContext(oBinding.getPath());
				} else {
					return undefined;
				}
			}
			if (typeof oBindingInfo === "object") {
				var oVisitor = oContext.getModel().getVisitor();
				var oModel = oVisitor.getSettings().models[oBindingInfo.model];
				if (oModel) {
					return oModel.createBindingContext(oBindingInfo.path);
				}
				return null;
			} else {
				return undefined;
			}
		},
		// TODO: very similar to listContext, maybe parts like the identical first 60% can be factored out
		listMetaContext: function (oContext) {
			var oBindingInfo = oContext.getModel().getProperty(oContext.getPath());
			if (typeof oBindingInfo === "string") {
				oBindingInfo = ManagedObject.bindingParser(oBindingInfo);
			}
			if (jQuery.isArray(oBindingInfo)) {
				var oBinding = oContext.getModel().getProperty(oContext.getPath() + "/@binding");
				if (oBinding) {
					return oBinding.getModel().getMetaModel().getMetaContext(oBinding.getPath());
				} else {
					return undefined;
				}
			}
			if (typeof oBindingInfo === "object") {
				var oVisitor = oContext.getModel().getVisitor();
				oBindingInfo = ManagedObject.bindingParser("{" + oBindingInfo.path + "}");
				var oModel = oVisitor.getSettings().models[oBindingInfo.model];
				if (oModel) {
					var oMetaModel = oModel.getMetaModel();
					if (oMetaModel && oMetaModel.getMetaContext) {
						return oMetaModel.getMetaContext(oBindingInfo.path);
					}
				}
				return null;
			} else {
				return undefined;
			}
		},

		// Annotation Helper to bind a property to the managed object model
		runtimeProperty: function (oContext, vValue) {
			if (oContext.getModel().getContextName) {
				return "{$" + oContext.getModel().getContextName() + ">" + oContext.getPath() + "}";
			}
			return vValue;
		},

		// Annotation Helper to bind a property to the managed object model
		runtimeBinding: function (oContext, vValue) {
			return "{Name}";
		},

		// Annotation Helper to bind an aggregation
		runtimeListBinding: function (oContext, vValue) {
			// if the value is an array, this is an resolved list binding and the binding needs to be as string
			if (jQuery.isArray(vValue)) {
				var oBinding = oContext.getModel().getProperty(oContext.getPath() + "/@binding");
				if (oBinding) {
					return "{path: '" + oBinding.getPath() + "'}";
				}
				return null;
			}
			return vValue;
		}
	};
	XMLComposite.helper.listMetaContext.requiresIContext = true;
	XMLComposite.helper.runtimeProperty.requiresIContext = true;
	XMLComposite.helper.runtimeListBinding.requiresIContext = true;
	XMLComposite.helper.runtimeBinding.requiresIContext = true;
	return XMLComposite;
}, true);
