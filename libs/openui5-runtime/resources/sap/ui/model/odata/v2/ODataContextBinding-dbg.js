/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

//Provides an abstraction for list bindings
sap.ui.define(['jquery.sap.global', 'sap/ui/model/ContextBinding', 'sap/ui/model/ChangeReason'],
		function(jQuery, ContextBinding, ChangeReason) {
	"use strict";


	/**
	 * Constructor for odata.ODataContextBinding
	 *
	 * @class
	 * The ContextBinding is a specific binding for a setting context for the model
	 *
	 * @param {sap.ui.model.Model} oModel
	 * @param {String} sPath
	 * @param {Object} oContext
	 * @param {map} [mParameters] a map which contains additional parameters for the binding.
	 * @param {string} [mParameters.expand] for the OData <code>$expand</code> query option parameter which should be included in the request
	 * @param {string} [mParameters.select] for the OData <code>$select</code> query option parameter which should be included in the request
	 * @param {map} [mParameters.custom] an optional map of custom query parameters. Custom parameters must not start with <code>$</code>.
	 * @abstract
	 * @public
	 * @alias sap.ui.model.odata.v2.ODataContextBinding
	 * @extends sap.ui.model.ContextBinding
	 */
	var ODataContextBinding = ContextBinding.extend("sap.ui.model.odata.v2.ODataContextBinding", /** @lends sap.ui.model.odata.v2.ODataContextBinding.prototype */ {

		constructor : function(oModel, sPath, oContext, mParameters, oEvents){
			ContextBinding.call(this, oModel, sPath, oContext, mParameters, oEvents);
			this.bRefreshGroupId = undefined;
		}
	});

	/**
	 * Initializes the binding, will create the binding context.
	 * If metadata is not yet available, do nothing, method will be called again when
	 * metadata is loaded.
	 * @see sap.ui.model.Binding.prototype.initialize
	 */
	ODataContextBinding.prototype.initialize = function() {
		var that = this,
			sResolvedPath,
			bCreatedRelative = this.isRelative() && this.oContext && this.oContext.bCreated,
			bReloadNeeded;

		// don't fire any requests if metadata is not loaded yet.
		if (!this.oModel.oMetadata.isLoaded() || !this.bInitial) {
			return;
		}
		this.bInitial = false;

		// if path cannot be resolved or parent context is created, set element context to null
		sResolvedPath = this.oModel.resolve(this.sPath, this.oContext);
		if (!sResolvedPath || bCreatedRelative) {
			this.oElementContext = null;
			this._fireChange({ reason: ChangeReason.Context });
			return;
		}

		// check whether a request is necessary and create binding context
		bReloadNeeded = this.oModel._isReloadNeeded(sResolvedPath, this.mParameters);
		if (bReloadNeeded) {
			this.fireDataRequested();
		}
		this.oModel.createBindingContext(this.sPath, this.oContext, this.mParameters, function(oContext) {
			var oData;
			that.oElementContext = oContext;
			that._fireChange({ reason: ChangeReason.Context });
			if (bReloadNeeded) {
				if (that.oElementContext) {
					oData = that.oElementContext.getObject(that.mParameters);
				}
				//register datareceived call as  callAfterUpdate
				that.oModel.callAfterUpdate(function() {
					that.fireDataReceived({data: oData});
				});
			}
		}, bReloadNeeded);
	};

	/**
	 * @see sap.ui.model.ContextBinding.prototype.checkUpdate
	 *
	 * @param {boolean} bForceUpdate
	 */
	ODataContextBinding.prototype.checkUpdate = function(bForceUpdate) {
		var oContext;
		if (this.bInitial) {
			return;
		}
		oContext = this.oModel.createBindingContext(this.sPath, this.oContext, this.mParameters);
		if (oContext && oContext !== this.oElementContext) {
			this.oElementContext = oContext;
			this._fireChange({ reason: ChangeReason.Context });
		}
	};

	/**
	 * @see sap.ui.model.ContextBinding.prototype.refresh
	 *
	 * @param {boolean} [bForceUpdate] Update the bound control even if no data has been changed
	 * @param {string} [sGroupId] The group Id for the refresh
	 *
	 * @public
	 */
	ODataContextBinding.prototype.refresh = function(bForceUpdate, sGroupId) {
		if (typeof bForceUpdate === "string") {
			sGroupId = bForceUpdate;
			bForceUpdate = false;
		}
		this.sRefreshGroup = sGroupId;
		this._refresh(bForceUpdate);
		this.sRefreshGroup = undefined;
	};

	/**
	 * @see sap.ui.model.ContextBinding.prototype.refresh
	 *
	 * @param {boolean} [bForceUpdate] Update the bound control even if no data has been changed
	 * @param {map} [mChangedEntities] Map of changed entities
	 * @private
	 */
	ODataContextBinding.prototype._refresh = function(bForceUpdate, mChangedEntities) {
		var that = this, oData, sKey, oStoredEntry, bChangeDetected = false,
			mParameters = this.mParameters,
			bCreatedRelative = this.isRelative() && this.oContext && this.oContext.bCreated,
			sResolvedPath = this.oModel.resolve(this.sPath, this.oContext);

		if (this.bInitial || bCreatedRelative) {
			return;
		}

		if (mChangedEntities) {
			//get entry from model. If entry exists get key for update bindings
			oStoredEntry = this.oModel._getObject(this.sPath, this.oContext);
			if (oStoredEntry) {
				sKey = this.oModel._getKey(oStoredEntry);
				if (sKey in mChangedEntities) {
					bChangeDetected = true;
				}
			}
		} else { // default
			bChangeDetected = true;
		}
		if (bForceUpdate || bChangeDetected) {
			//recreate Context: force update
			if (sResolvedPath) {
				this.fireDataRequested();
			}
			if (this.sRefreshGroup) {
				mParameters = jQuery.extend({},this.mParameters);
				mParameters.groupId = this.sRefreshGroup;
			}
			this.oModel.createBindingContext(this.sPath, this.oContext, mParameters, function(oContext) {
				if (that.oElementContext === oContext) {
					if (bForceUpdate) {
						that._fireChange({ reason: ChangeReason.Context });
					}
				} else {
					that.oElementContext = oContext;
					that._fireChange({ reason: ChangeReason.Context });
				}
				if (that.oElementContext) {
					oData = that.oElementContext.getObject(that.mParameters);
				}
				//register datareceived call as  callAfterUpdate
				if (sResolvedPath) {
					that.oModel.callAfterUpdate(function() {
						that.fireDataReceived({data: oData});
					});
				}
			}, true);
		}
	};

	/**
	 * @see sap.ui.model.ContextBinding.prototype.setContext
	 *
	 * @param {sap.ui.model.Context} oContext The binding context object
	 * @private
	 */
	ODataContextBinding.prototype.setContext = function(oContext) {
		var that = this,
			oData,
			sResolvedPath,
			oData,
			bCreated = oContext && oContext.bCreated,
			bReloadNeeded;

		if (this.oContext !== oContext) {
			this.oContext = oContext;

			// If binding is initial or not a relative binding, nothing to do here
			if (this.bInitial || !this.isRelative()) {
				return;
			}

			sResolvedPath = this.oModel.resolve(this.sPath, this.oContext);

			// If path doesn't resolve or parent context is created, reset current context
			if (!sResolvedPath || bCreated) {
				if (this.oElementContext !== null) {
					this.oElementContext = null;
					this._fireChange({ reason: ChangeReason.Context });
				}
				return;
			}

			// Create new binding context and fire change
			oData = this.oModel._getObject(this.sPath, this.oContext);
			bReloadNeeded = this.oModel._isReloadNeeded(sResolvedPath, oData, this.mParameters);

			if (bReloadNeeded) {
				this.fireDataRequested();
			}
			this.oModel.createBindingContext(this.sPath, this.oContext, this.mParameters, function(oContext) {
				that.oElementContext = oContext;
				that._fireChange({ reason: ChangeReason.Context });
				if (sResolvedPath && bReloadNeeded) {
					if (that.oElementContext) {
						oData = that.oElementContext.getObject(that.mParameters);
					}
					//register datareceived call as  callAfterUpdate
					that.oModel.callAfterUpdate(function() {
						that.fireDataReceived({data: oData});
					});
				}
			}, bReloadNeeded);
		}
	};

	return ODataContextBinding;

});
