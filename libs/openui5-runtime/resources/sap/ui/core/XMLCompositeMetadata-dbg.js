/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

/**
 * This class is used in connection with XMLComposite
 *
 * CAUTION: naming, location and APIs of this entity will possibly change and should
 * therefore be considered experimental
 *
 * @private
 *
 */
sap.ui.define([
	'jquery.sap.global', 'sap/ui/core/ElementMetadata', 'sap/ui/core/XMLTemplateProcessor'
], function (jQuery, ElementMetadata, XMLTemplateProcessor) {
	"use strict";

	var InvalidationMode = {
		Render: true,
		Template: "template",
		None: false
	};

	/*
	 *
	 * Creates a new metadata object that describes a subclass of XMLComposite.
	 *
	 * @param {string} sClassName fully qualified name of the described class
	 * @param {object} oClassInfo static info to construct the metadata from
	 *
	 * @author SAP SE
	 * @version 1.50.6
	 * @since 1.50.0
	 * @alias sap.ui.core.XMLCompositeMetadata
	 * @private
	 */
	var XMLCompositeMetadata = function (sClassName, oClassInfo) {
		if (!oClassInfo.hasOwnProperty("renderer")) {
			oClassInfo.renderer = "sap.ui.core.XMLCompositeRenderer";
		}

		if (!oClassInfo.hasOwnProperty("alias")) {
			oClassInfo.alias = "this";
		}

		ElementMetadata.apply(this, arguments);
		var bClassIsAbstract = this._bAbstract;// notice we cannot use this.getMetadata().isAbstract() yet ...
		if (!bClassIsAbstract) {
			// class is not abstract so we try to load accompanying xml
			if (!oClassInfo.fragment && sClassName !== "sap.ui.core.XMLComposite") {
				oClassInfo.fragment = sClassName;
				oClassInfo.fragmentUnspecified = true;
			}
			if (!this._fragment && oClassInfo.fragment) {
				try {
					this._fragment = XMLTemplateProcessor.loadTemplate(oClassInfo.fragment, "control");
				} catch (e) {
					if (!oClassInfo.fragmentUnspecified) {
						// fragment xml was explicitly specified so we expect to find something !
						throw (e);
					} else {
						// should the class perhaps have been abstract ...
						jQuery.sap.log.warning("Implicitly inferred fragment xml " + oClassInfo.fragment + " not found. " + sClassName + " is not abstract!");
					}
				}
			}
		}

		this._sCompositeAggregation = oClassInfo.metadata ? oClassInfo.metadata.compositeAggregation || null : null;

		this._createPrivateAggregationAccessors();
		this._applyAggregationSettings();
	};

	XMLCompositeMetadata.prototype = Object.create(ElementMetadata.prototype);
	XMLCompositeMetadata.uid = ElementMetadata.uid;

	XMLCompositeMetadata.prototype.getCompositeAggregationName = function () {
		return this._sCompositeAggregation || "_content";
	};

	XMLCompositeMetadata.prototype.getFragment = function () {
		if (this._fragment) {
			return this._fragment.cloneNode(true);
		}
	};

	XMLCompositeMetadata.prototype._applyAggregationSettings = function () {
		// TBD: Is this till needed?
		var mAggregations = this.getAllAggregations();
		for (var n in mAggregations) {
			if (mAggregations[n].type === "TemplateMetadataContext") {
				this.getAggregation(n)._doesNotRequireFactory = true;
			}
		}
	};

	XMLCompositeMetadata.prototype._createPrivateAggregationAccessors = function () {
		var mPrivateAggregations = this.getAllPrivateAggregations(),
			proto = this.getClass().prototype,
			fnGenHelper = function (name, fn) {
				if (!proto[name]) {
					proto[name] = fn;
				}
			};
		for (var n in mPrivateAggregations) {
			mPrivateAggregations[n].generate(fnGenHelper);
		}
	};

	XMLCompositeMetadata.prototype._suppressInvalidate = function (oMember, bSuppress) {
		if (bSuppress) {
			return true;
		}
		if (!oMember.appData) {
			oMember.appData = {};
			oMember.appData.invalidate = InvalidationMode.None;
		}
		if (oMember && oMember.appData && oMember.appData.invalidate === InvalidationMode.Render) {
			return false;
		}
		return true; // i.e. invalidate = InvalidationMode.None || InvalidationMode.Template
	};

	XMLCompositeMetadata.prototype._requestFragmentRetemplatingCheck = function (oControl, oMember, bForce) {
		if (!oControl._bIsInitializing && oMember && oMember.appData && oMember.appData.invalidate === InvalidationMode.Template &&
			!oControl._requestFragmentRetemplatingPending) {
			if (oControl.requestFragmentRetemplating) {
				oControl._requestFragmentRetemplatingPending = true;
				// to avoid several separate re-templating requests we collect them
				// in a timeout
				setTimeout(function () {
					oControl.requestFragmentRetemplating(bForce);
					oControl._requestFragmentRetemplatingPending = false;
				}, 0);
			} else {
				throw new Error("Function requestFragmentRetemplating not available although invalidationMode was set to template");
			}
		}
	};

	XMLCompositeMetadata.prototype.getMandatoryAggregations = function () {
		if (!this._mMandatoryAggregations) {
			var mAggregations = this.getAllAggregations(),
				mMandatory = {};
			for (var n in mAggregations) {
				if (mAggregations[n].type === "TemplateMetadataContext" && mAggregations[n].appData.mandatory) {
					mMandatory[n] = mAggregations[n];
				}
			}
			this._mMandatoryAggregations = mMandatory;
		}
		return this._mMandatoryAggregations;
	};

	return XMLCompositeMetadata;

}, true);
