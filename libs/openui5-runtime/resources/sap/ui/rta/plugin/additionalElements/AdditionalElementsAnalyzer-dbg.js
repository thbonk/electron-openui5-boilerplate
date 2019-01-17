/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2018 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

 sap.ui.define([
	"sap/ui/thirdparty/jquery",
	'sap/ui/core/StashedControlSupport',
	'sap/ui/dt/ElementUtil',
	'sap/ui/rta/Utils',
	'sap/ui/rta/util/BindingsExtractor'
	],
	function (
		jQuery,
		StashedControlSupport,
		ElementUtil,
		RtaUtils,
		BindingsExtractor
	) {
	"use strict";

	function _enrichProperty(mProperty, mEntity){
		var mProp = jQuery.extend({},mProperty);
		mProp.entityName = mEntity.name;

		var mLabelAnnotation = mProperty["com.sap.vocabularies.Common.v1.Label"];
		mProp.fieldLabel = mLabelAnnotation && mLabelAnnotation.String;

		var mQuickInfoAnnotation = mProperty["com.sap.vocabularies.Common.v1.QuickInfo"];
		mProp.quickInfo = mQuickInfoAnnotation && mQuickInfoAnnotation.String;

		//CDS UI.Hidden new way also for sap:visible = false
		var mHiddenAnnotation = mProperty["com.sap.vocabularies.UI.v1.Hidden"];
		mProp.hidden = mHiddenAnnotation && mHiddenAnnotation.Bool === "true";

		if (!mProp.hidden){
			// Old hidden annotation
			var mFieldControlAnnotation = mProperty["com.sap.vocabularies.Common.v1.FieldControl"];
			if (mFieldControlAnnotation){
				mProp.hidden = mFieldControlAnnotation.EnumMember === "com.sap.vocabularies.Common.v1.FieldControlType/Hidden";
			}
		}
		return mProp;
	}

	/**
	 * Is field using a complex type
	 *
	 * @param {Object} mProperty - property from entityType
	 * @returns {Boolean} - Returns true if property is using a complex type
	 */
	function _isComplexType (mProperty) {
		if (mProperty && mProperty.type) {
			if (mProperty.type.toLowerCase().indexOf("edm") !== 0) {
				return true;
			}
		}
		return false;
	}

	function _expandComplexProperties(aODataProperties, oMetaModel, mEntity){
		return aODataProperties.reduce(function(aExpandedProperties, mProperty){
			var vProps = _enrichProperty(mProperty, mEntity);
			if (_isComplexType(vProps)) {
				var mComplexType = oMetaModel.getODataComplexType(vProps.type);
				if (mComplexType) {
					vProps = mComplexType.property.map(function(oComplexProperty){
						oComplexProperty = _enrichProperty(oComplexProperty, mEntity);
						oComplexProperty.bindingPath = vProps.name + "/" + oComplexProperty.name;
						oComplexProperty.referencedComplexPropertyName = vProps.fieldLabel || vProps.name;
						return oComplexProperty;
					});
				}
			} else {
				//harmonize structure
				vProps.bindingPath = mProperty.name;
			}
			return aExpandedProperties.concat(vProps);
		}, []);
	}

	function _filterInvisibleProperties(aODataProperties, oElement, sAggregationName) {
		return aODataProperties.filter(function(mProperty){
			//see _enrichProperty
			return !mProperty.hidden;
		}).filter(function(mProperty){
			//@runtime hidden by field control value = 0
			var mFieldControlAnnotation = mProperty["com.sap.vocabularies.Common.v1.FieldControl"];
			var sFieldControlPath = mFieldControlAnnotation && mFieldControlAnnotation.Path;
			if (sFieldControlPath){
				// if the binding is a listbinding, we skip the check for field control
				var bListBinding = oElement.getBinding(sAggregationName) instanceof sap.ui.model.ListBinding;
				if (bListBinding) {
					return true;
				}
				var iFieldControlValue = oElement.getBindingContext().getProperty(sFieldControlPath);
				return iFieldControlValue !== 0;
			}
			return true;
		});
	}

	function _checkForAbsoluteAggregationBinding(oElement, sAggregationName) {
		if (!oElement) {
			return false;
		}
		var oBindingInfo = oElement.getBindingInfo(sAggregationName);
		var sPath = oBindingInfo && oBindingInfo.path;
		if (!sPath) {
			return false;
		}
		if (sPath.indexOf(">") > -1) {
			sPath = sPath.split(">").pop();
		}
		return sPath.indexOf("/") === 0;
	}

	function _getDefaultModelBindingData(oElement, bAbsoluteAggregationBinding, sAggregationName) {
		var vBinding;
		if (bAbsoluteAggregationBinding) {
			vBinding = oElement.getBindingInfo(sAggregationName);
			//check to be default model binding otherwise return undefined
			if (typeof vBinding.model === "string" && vBinding.model !== ""){
				vBinding = undefined;
			}
		} else {
			//here we explicitly request the default models binding context
			vBinding = oElement.getBindingContext();
		}
		return vBinding;
	}

	function _getBindingPath(oElement, sAggregationName) {
		var bAbsoluteAggregationBinding = _checkForAbsoluteAggregationBinding(oElement, sAggregationName);
		var vBinding = _getDefaultModelBindingData(oElement, bAbsoluteAggregationBinding, sAggregationName);
		if (vBinding) {
			return bAbsoluteAggregationBinding ? vBinding.path : vBinding.getPath();
		}
	}

	/**
	 * Fetching all available properties of the Element's Model
	 * @param {sap.ui.core.Control} oElement - Control instance
	 * @param {string} sAggregationName - aggregation name of the action
	 * @return {Promise} - Returns Promise with results
	 * @private
	 */
	function _getODataPropertiesOfModel(oElement, sAggregationName) {
		var oModel = oElement.getModel();
		var mData = {
			property: [],
			navigationProperty: [],
			navigationEntityNames: []
		};

		if (oModel) {
			var sModelName = oModel.getMetadata().getName();
			if (sModelName === "sap.ui.model.odata.ODataModel" || sModelName === "sap.ui.model.odata.v2.ODataModel") {
				var oMetaModel = oModel.getMetaModel();
				return oMetaModel.loaded().then(function(){
					var sBindingContextPath = _getBindingPath(oElement, sAggregationName);
					if (sBindingContextPath) {
						var oMetaModelContext = oMetaModel.getMetaContext(sBindingContextPath);
						var mODataEntity = oMetaModelContext.getObject();

						var oDefaultAggregation = oElement.getMetadata().getAggregation();
						if (oDefaultAggregation) {
							var oBinding = oElement.getBindingInfo(oDefaultAggregation.name);
							var oTemplate = oBinding && oBinding.template;

							if (oTemplate) {
								var sPath = oElement.getBindingPath(oDefaultAggregation.name);
								var oODataAssociationEnd = oMetaModel.getODataAssociationEnd(mODataEntity, sPath);
								var sFullyQualifiedEntityName = oODataAssociationEnd && oODataAssociationEnd.type;
								if (sFullyQualifiedEntityName) {
									var oEntityType = oMetaModel.getODataEntityType(sFullyQualifiedEntityName);
									mODataEntity = oEntityType;
								}
							}
						}

						mData.property = mODataEntity.property || [];
						mData.property = _expandComplexProperties(mData.property, oMetaModel, mODataEntity);
						mData.property = _filterInvisibleProperties(mData.property, oElement, sAggregationName);

						if (mODataEntity.navigationProperty){
							mData.navigationProperty = mODataEntity.navigationProperty;
							mODataEntity.navigationProperty.forEach(function(oNavProp){
								var sFullyQualifiedEntityName = (
									oMetaModel.getODataAssociationEnd(mODataEntity, oNavProp.name)
									&& oMetaModel.getODataAssociationEnd(mODataEntity, oNavProp.name).type
								);
								var oEntityType = oMetaModel.getODataEntityType(sFullyQualifiedEntityName);
								if (oEntityType && oEntityType.name){
									if (mData.navigationEntityNames.indexOf(oEntityType.name) === -1){
										mData.navigationEntityNames.push(oEntityType.name);
									}
								}
							});
						}
					}
					return mData;
				});
			}
		}

		return Promise.resolve(mData);
	}

	function _oDataPropertyToAdditionalElementInfo (oODataProperty){
		return {
			selected : false,
			label : oODataProperty.fieldLabel || oODataProperty.name,
			referencedComplexPropertyName: oODataProperty.referencedComplexPropertyName ? oODataProperty.referencedComplexPropertyName : "",
			duplicateComplexName: oODataProperty.duplicateComplexName ? oODataProperty.duplicateComplexName : false,
			tooltip :  oODataProperty.quickInfo || oODataProperty.fieldLabel,
			originalLabel: "",
			//command relevant data
			type : "odata",
			entityType : oODataProperty.entityName,
			name : oODataProperty.name,
			bindingPath : oODataProperty.bindingPath
		};
	}

	function _elementToAdditionalElementInfo (mData){
		var oElement = mData.element;
		var mAction = mData.action;
		return {
			selected : false,
			label : ElementUtil.getLabelForElement(oElement, mAction.getLabel),
			tooltip : oElement.quickInfoFromOData || oElement.name || ElementUtil.getLabelForElement(oElement, mAction.getLabel),
			referencedComplexPropertyName: oElement.referencedComplexPropertyName ? oElement.referencedComplexPropertyName : "",
			duplicateComplexName: oElement.duplicateComplexName ? oElement.duplicateComplexName : false,
			bindingPaths: oElement.bindingPaths,
			originalLabel: oElement.renamedLabel && oElement.fieldLabel !== oElement.labelFromOData ? oElement.labelFromOData : "",
			//command relevant data
			type : "invisible",
			elementId : oElement.getId()
		};
	}

	/**
	 * Retrieving sibling elements from its parent container which are bound to the same Model (important!)
	 *
	 * @param {sap.ui.core.Control} oElement - element for which we're looking for siblings
	 * @param {sap.ui.core.Control} oRelevantContainer - "parent" container of the oElement
	 * @param {string} sAggregationName - name of the aggregation of the action
	 *
	 * @return {Array.<sap.ui.core.Control>} - returns an array with found siblings elements
	 *
	 * @private
	 */
	function _getRelevantElements(oElement, oRelevantContainer, sAggregationName) {
		if (oRelevantContainer && oRelevantContainer !== oElement) {
			var sEntityName = RtaUtils.getEntityTypeByPath(
				oElement.getModel(),
				_getBindingPath(oElement, sAggregationName)
			);

			return ElementUtil
				.findAllSiblingsInContainer(oElement, oRelevantContainer)
				// We accept only siblings that are bound on the same model
				.filter(function (oSiblingElement) {
					var sPath = _getBindingPath(oSiblingElement, sAggregationName);
					if (sPath) {
						return RtaUtils.getEntityTypeByPath(oSiblingElement.getModel(), sPath) === sEntityName;
					}
					return false;
				});
		} else {
			return [oElement];
		}
	}

	function _checkForComplexDuplicates(aODataProperties) {
		aODataProperties.forEach(function(oODataProperty, index, aODataProperties) {
			if (oODataProperty["duplicateComplexName"] !== true) {
				for (var j = index + 1; j < aODataProperties.length - 1; j++) {
					if (oODataProperty.fieldLabel === aODataProperties[j].fieldLabel) {
						oODataProperty["duplicateComplexName"] = true;
						aODataProperties[j]["duplicateComplexName"] = true;
					}
				}
			}
		});
		return aODataProperties;
	}

	//check for duplicate labels to later add the referenced complexTypeName if available
	function _checkForDuplicateLabels(oInvisibleElement, aODataProperties) {
		return aODataProperties.some(function(oDataProperty) {
			return oDataProperty.fieldLabel === oInvisibleElement.fieldLabel;
		});
	}

	// Get all relevant bindings for the element (from all properties)
	function _collectBindingPaths(oInvisibleElement, oModel){
		oInvisibleElement.bindingPaths = [];
		oInvisibleElement.bindingContextPaths = [];
		var sAggregationName = oInvisibleElement.sParentAggregationName;
		var oParent = oInvisibleElement.getParent();
		var aBindings = BindingsExtractor.getBindings(oInvisibleElement, oModel);

		if (oParent) {
			var oDefaultAggregation = oParent.getMetadata().getAggregation();

			if (oDefaultAggregation) {
				var iPositionOfInvisibleElement = ElementUtil.getAggregation(oParent, sAggregationName).indexOf(oInvisibleElement);
				var sParentDefaultAggregationName = oDefaultAggregation.name;
				var oBinding = oParent.getBindingInfo(sParentDefaultAggregationName);
				var oTemplate = oBinding && oBinding.template;

				if (oTemplate) {
					var oTemplateDefaultAggregation = oTemplate.getMetadata().getAggregation();

					if (oTemplateDefaultAggregation) {
						var sTemplateDefaultAggregationName = oTemplateDefaultAggregation.name;
						var oTemplateElement = ElementUtil.getAggregation(oTemplate, sTemplateDefaultAggregationName)[iPositionOfInvisibleElement];
						aBindings = aBindings.concat(BindingsExtractor.getBindings(oTemplateElement, null, true));
					}
				}
			}
		}

		for (var i = 0, l = aBindings.length; i < l; i++) {
			if (aBindings[i].getPath && aBindings[i].getPath()){
				if (oInvisibleElement.bindingPaths.indexOf(aBindings[i].getPath()) === -1){
					oInvisibleElement.bindingPaths.push(aBindings[i].getPath());
				}
			}
			if (aBindings[i].getContext && aBindings[i].getContext()){
				if (oInvisibleElement.bindingContextPaths.indexOf(aBindings[i].getContext().getPath()) === -1){
					oInvisibleElement.bindingContextPaths.push(aBindings[i].getContext().getPath());
				}
			}
			if (jQuery.isPlainObject(aBindings[i])){
				if (oInvisibleElement.bindingPaths.indexOf(aBindings[i].parts[0].path) === -1){
					oInvisibleElement.bindingPaths.push(aBindings[i].parts[0].path);
				}
			}
		}
		return oInvisibleElement;
	}

	/**
	 * Checks if array of paths is not empty
	 * @param {Array.<String>} aBindingPaths - Array of collected binding paths
	 * @return {Boolean} - true if it has binding(s)
	 * @private
	 */
	function _hasBindings(aBindingPaths) {
		return Array.isArray(aBindingPaths) && aBindingPaths.length > 0;
	}

	/**
	 * Checks if array of paths contains bindings through navigation
	 *
	 * @param {Array.<String>} aBindingPaths - Array of collected binding paths
	 * @param {Array.<Object>} aNavigationProperties - Array of Navigation Properties
	 * @param {Array.<String>} aNavigationEntityNames - Array of Navigation Entity Names
	 * @param {Array.<String>} aBindingContextPaths - Array of Binding Context Paths
	 *
	 * @return {Boolean} - true if it has at least one navigational binding
	 */
	function _hasNavigationBindings(aBindingPaths, aNavigationProperties, aNavigationEntityNames, aBindingContextPaths) {
		var bNavigationInBindingPath = _hasBindings(aBindingPaths)
			&& aBindingPaths.some(function (sPath) {
				var aParts = sPath.trim().replace(/^\//gi, '').split('/');
				if (aParts.length > 1) {
					return aNavigationProperties.indexOf(aParts.shift()) !== -1;
				}
			});

		// BindingContextPath : "/SEPMRA_C_PD_Supplier('100000001')"
		// NavigationEntityName : "SEPMRA_C_PD_Supplier"
		var bNavigationInEntity = aBindingContextPaths.some(function(sContextPath){
			sContextPath = sContextPath.match(/^\/?([A-Za-z0-9_]+)/)[0];
			return (aNavigationEntityNames.indexOf(sContextPath) >= 0);
		});

		return bNavigationInBindingPath || bNavigationInEntity;
	}

	/**
	 * Looks for a ODataProperty for a set of bindings paths
	 *
	 * @param {Array.<String>} aBindingPaths - Array of collected binding paths
	 * @param {Array.<Object>} aODataProperties - Array of Fields
	 *
	 * @return {Object|undefined} - returns first found Object with Field (Property) description, undefined if not found
	 *
	 * @private
	 */
	function _findODataProperty(aBindingPaths, aODataProperties) {
		return aODataProperties.filter(function (oDataProperty) {
			return aBindingPaths.indexOf(oDataProperty.bindingPath) !== -1;
		}).pop();
	}

	/**
	 * Enhance Invisible Element with extra data from OData property
	 *
	 * @param {sap.ui.core.Control} oInvisibleElement - Invisible Element
	 * @param {Object} mODataProperty - ODataProperty as a source of data enhancement process
	 *
	 * @private
	 */
	function _enhanceInvisibleElement(oInvisibleElement, mODataProperty) {
		oInvisibleElement.labelFromOData = mODataProperty.fieldLabel;
		oInvisibleElement.quickInfoFromOData = mODataProperty.quickInfo;
		oInvisibleElement.name = mODataProperty.name;
		if (oInvisibleElement.fieldLabel !== oInvisibleElement.labelFromOData) {
			oInvisibleElement.renamedLabel = true;
		}
		if (mODataProperty.referencedComplexPropertyName) {
			oInvisibleElement.referencedComplexPropertyName = mODataProperty.referencedComplexPropertyName;
		}
	}

	/**
	 * Checks if this InvisibleProperty should be included in resulting list and adds information
	 * from oDataProperty to the InvisibleProperty if available
	 *
	 * @param {sap.ui.core.Control} oInvisibleElement - Invisible Element
	 * @param {Array.<Object>} aODataProperties - Array of Fields
	 * @param {Array.<Object>} aNavigationProperties - Array of Navigation Properties
	 * @param {Array.<Object>} aNavigationEntityNames - Array of Navigation Entity names
	 *
	 * @return {Boolean} - whether this field is
	 *
	 * @private
	 */
	function _checkAndEnhanceODataProperty(oInvisibleElement, aODataProperties, aNavigationProperties, aNavigationEntityNames) {
		var aBindingPaths = oInvisibleElement.bindingPaths,
			aBindingContextPaths = oInvisibleElement.bindingContextPaths,
			mODataProperty;

		return (
			// include it if the field has no bindings (bindings can be added in runtime)
			!_hasBindings(aBindingPaths)
			// include it if some properties got binding through valid navigations of the current Model
			|| _hasNavigationBindings(aBindingPaths, aNavigationProperties, aNavigationEntityNames, aBindingContextPaths)
			// looking for a corresponding OData property, if it exists oInvisibleElement is being enhanced
			// with extra data from it
			|| (
				(mODataProperty = _findODataProperty(aBindingPaths, aODataProperties))
				&&  (_enhanceInvisibleElement(oInvisibleElement, mODataProperty) || true)
			)
		);
	}

	// API: depending on the available actions for the aggregation call one or both of these methods
	var oAnalyzer = {
		/**
		 * Filters available invisible elements whether they could be shown or not
		 *
		 * @param {sap.ui.core.Control} oElement - Container Element where to start search for a invisible
		 * @param {Object} mActions - Container with actions
		 *
		 * @return {Promise} - returns a Promise which resolves with a list of hidden controls are available to display
		 */
		enhanceInvisibleElements : function(oElement, mActions){
			var oModel = oElement.getModel();
			var mRevealData = mActions.reveal;
			var mAddODataProperty = mActions.addODataProperty;
			var oDefaultAggregation = oElement.getMetadata().getAggregation();
			var sAggregationName = oDefaultAggregation ? oDefaultAggregation.name : mActions.aggregation;

			return Promise.resolve()
				.then(function () {
					return _getODataPropertiesOfModel(oElement, sAggregationName);
				})
				.then(function(mData) {
					var aODataProperties = mData.property;
					var aODataNavigationProperties = mData.navigationProperty.map(function (mNavigation) {
						return mNavigation.name;
					});
					var aODataNavigationEntityNames = mData.navigationEntityNames;

					aODataProperties = _checkForComplexDuplicates(aODataProperties);

					var aAllElementData = [];
					var aInvisibleElements = mRevealData.elements || [];

					aInvisibleElements.forEach(function(mInvisibleElement) {
						var oInvisibleElement = mInvisibleElement.element;
						var mAction = mInvisibleElement.action;
						var bIncludeElement = true;

						// BCP: 1880498671
						if (mAddODataProperty) {
							if (_getBindingPath(oElement, sAggregationName) === _getBindingPath(oInvisibleElement, sAggregationName)) {
								//TODO fix with stashed type support
								oInvisibleElement = _collectBindingPaths(oInvisibleElement, oModel);
								oInvisibleElement.fieldLabel = ElementUtil.getLabelForElement(oInvisibleElement, mAction.getLabel);
								oInvisibleElement.duplicateComplexName = _checkForDuplicateLabels(oInvisibleElement, aODataProperties);

								//Add information from the oDataProperty to the InvisibleProperty if available;
								//if oData is available and the element is not present in it, do not include it
								//Example use case: custom field which was hidden and then removed from system
								//should not be available for adding after the removal
								if (aODataProperties.length > 0){
									bIncludeElement = _checkAndEnhanceODataProperty(oInvisibleElement, aODataProperties, aODataNavigationProperties, aODataNavigationEntityNames);
								}
							} else if (BindingsExtractor.getBindings(oInvisibleElement, oModel).length > 0) {
								bIncludeElement = false;
							}
						}

						if (bIncludeElement) {
							aAllElementData.push({
								element : oInvisibleElement,
								action : mAction
							});
						}
					});
					return aAllElementData;
				})
				.then(function(aAllElementData) {
					return aAllElementData.map(_elementToAdditionalElementInfo);
				});
		},

		/**
		 * Retrieves available OData properties from the metadata
		 *
		 * @param {sap.ui.core.Control} oElement - Source element of which Model we're looking for additional properties
		 * @param {Object} mAction - Action descriptor
		 *
		 * @return {Promise} - returns a Promise which resolves with a list of available to display OData properties
		 */
		getUnboundODataProperties: function (oElement, mAction) {
			var oDefaultAggregation = oElement.getMetadata().getAggregation();
			var sAggregationName = oDefaultAggregation ? oDefaultAggregation.name : mAction.action.aggregation;
			var oModel = oElement.getModel();

			return Promise.resolve()
				.then(function () {
					return _getODataPropertiesOfModel(oElement, sAggregationName);
				})
				.then(function(mData) {
					var aODataProperties = mData.property;
					var aRelevantElements = _getRelevantElements(oElement, mAction.relevantContainer, sAggregationName);
					var aBindings = [];

					aRelevantElements.forEach(function(oElement){
						aBindings = aBindings.concat(BindingsExtractor.getBindings(oElement, oModel));
					});

					var fnFilter = mAction.action.filter ? mAction.action.filter : function() {return true;};

					aODataProperties = aODataProperties.filter(function(oDataProperty) {
						var bHasBindingPath = false;
						if (aBindings){
							bHasBindingPath = aBindings.some(function(vBinding) {
								return (
									jQuery.isPlainObject(vBinding)
									? vBinding.parts[0].path
									: !!vBinding.getPath && vBinding.getPath()
								) === oDataProperty.bindingPath;
							});
						}
						return !bHasBindingPath && fnFilter(mAction.relevantContainer, oDataProperty);
					});

					aODataProperties = _checkForComplexDuplicates(aODataProperties);

					return aODataProperties;
				})
				.then(function(aUnboundODataProperties) {
					return aUnboundODataProperties.map(_oDataPropertyToAdditionalElementInfo);
				});
		}
	};
	return oAnalyzer;
});