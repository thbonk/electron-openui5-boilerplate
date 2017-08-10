/*
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define([	"jquery.sap.global", "sap/ui/fl/Utils", "sap/ui/fl/transport/Transports", "sap/ui/fl/transport/TransportDialog", "sap/ui/fl/registry/Settings" ], function(jQuery, Utils, Transports, TransportDialog, FlexSettings) {
	"use strict";
	/**
	 * @public
	 * @alias sap.ui.fl.transport.TransportSelection
	 * @constructor
	 * @author SAP SE
	 * @version 1.48.5
	 * @since 1.38.0
	 * Helper object to select an ABAP transport for an LREP object. This is not a generic utility to select a transport request, but part
	 *        of the SmartVariant control.
	 * @param jQuery.sap.global} jQuery a reference to the jQuery implementation.
	 * @param {sap.ui.fl.Utils} Utils a reference to the flexibility utilities implementation.
	 * @param {sap.ui.fl.transport.Transports} Transports a reference to the transport service implementation.
	 * @param {sap.ui.fl.transport.TransportDialog} TransportDialog a reference to the transport dialog implementation.
	 * @param {sap.ui.fl.registry.Settings} FlexSettings a reference to the settings implementation
	 * @returns {sap.ui.fl.transport.TransportSelection} a new instance of <code>sap.ui.fl.transport.TransportSelection</code>.
	 */
	var TransportSelection = function() {
		this.oTransports = new sap.ui.fl.transport.Transports();
	};

	/**
	 * Selects a transport request for a given LREP object.
	 * First checks if the Adaptation Transport Organizer (ATO) is enabled
	 * If ATO is enabled and the layered repository object is in the CUSTOMER layer, the request 'ATO_NOTIFICATION' has to be used.
	 * This request triggers in the back end that the change is added to an ATO collection.
	 * If ATO is not enabled or LREP object not in CUSTOMER layer:
	 * If the LREP object is already assigned to an open transport request or the LREP object is
	 * assigned to a local ABAP package, no dialog to select a transport is started. Instead the success callback is invoked directly. The transport
	 * dialog is shown if a package or a transport request has still to be selected, so if more than one transport request is available for the
	 * current user and the LREP object is not locked in an open transport request.
	 *
	 * @param {object} oObjectInfo the LREP object, which has the attributes name, name space, type, layer and package.
	 * @param {function} fOkay call-back to be invoked when a transport request has successfully been selected.
	 * @param {function} fError call-back to be invoked when an error occurred during selection of a transport request.
	 * @param {boolean} bCompactMode flag indicating whether the transport dialog should be opened in compact mode.
	 * @param {object} oControl Control instance
	 * @public
	 */
	TransportSelection.prototype.selectTransport = function(oObjectInfo, fOkay, fError, bCompactMode, oControl) {
		var that = this;

		if (oObjectInfo) {
			var sLayerType = Utils.getCurrentLayer(false);

			// if object layer are known and layer is CUSTOMER
			// check in settings if the adaptation transport organizer (ATO) is enabled
			if (sLayerType && sLayerType === 'CUSTOMER') {
				// retrieve the settings and check if ATO is enabled
				FlexSettings.getInstance().then(function(oSettings) {
					// ATO is enabled - signal that change is to be added to an ATO collection
					// instead of a transport
					if (oSettings.isAtoEnabled()) {
						var oTransport = { transportId: "ATO_NOTIFICATION" };
						fOkay(that._createEventObject(oObjectInfo, oTransport));
						//ATO is not enabled, use CTS instead
					} else {
						that._selectTransport(oObjectInfo, fOkay, fError, bCompactMode);
					}
				});
			// do not have the required info to check for ATO or not CUSTOMER layer - use CTS
			} else {
				that._selectTransport(oObjectInfo, fOkay, fError, bCompactMode);
			}
		}
	};

	/**
	 * Selects a transport request for a given LREP object. If the LREP object is already assigned to an open transport request or the LREP object is
	 * assigned to a local ABAP package, no dialog to select a transport is started. Instead the success callback is invoked directly. The transport
	 * dialog is shown if a package or a transport request has still to be selected, so if more than one transport request is available for the
	 * current user and the LREP object is not locked in an open transport request.
	 *
	 * @param {object} oObjectInfo the LREP object, which has the attributes name, name space, type, layer and package.
	 * @param {function} fOkay call-back to be invoked when a transport request has successfully been selected.
	 * @param {function} fError call-back to be invoked when an error occurred during selection of a transport request.
	 * @param {boolean} bCompactMode flag indicating whether the transport dialog should be opened in compact mode.
	 * @private
	 */
	TransportSelection.prototype._selectTransport = function(oObjectInfo, fOkay, fError, bCompactMode) {
		var that = this;

		if (oObjectInfo) {
			this.oTransports.getTransports(oObjectInfo).then(function(oGetTransportsResult) {
				var oTransport;

				if (that._checkDialog(oGetTransportsResult)) {
					that._openDialog({
						hidePackage: !Utils.doesSharedVariantRequirePackage(),
						pkg: oObjectInfo.package,
						transports: oGetTransportsResult.transports,
						lrepObject: that._toLREPObject(oObjectInfo)
					}, fOkay, fError, bCompactMode);
				} else {
					oTransport = that._getTransport(oGetTransportsResult);
					fOkay(that._createEventObject(oObjectInfo, oTransport));
				}
			}, function(oResult) {
				fError(oResult);
			});
		}
	};

	/**
	 * Creates an event object similar to the UI5 event object.
	 *
	 * @param {object} oObjectInfo identifies the LREP object.
	 * @param {object} oTransport the transport request that has been selected.
	 * @return {object} event object.
	 * @private
	 */
	TransportSelection.prototype._createEventObject = function(oObjectInfo, oTransport) {
		return {
			mParameters: {
				selectedTransport: oTransport.transportId,
				selectedPackage: oObjectInfo["package"],
				dialog: false
			},
			getParameters: function() {
				return this.mParameters;
			},
			getParameter: function(sName) {
				return this.mParameters[sName];
			}
		};
	};

	/**
	 * Creates an LREP object description for the transport dialog.
	 *
	 * @param {object} oObjectInfo identifies the LREP object.
	 * @return {object} LREP object description for the transport dialog.
	 * @private
	 */
	TransportSelection.prototype._toLREPObject = function(oObjectInfo) {
		var oObject = {};

		if (oObjectInfo.namespace) {
			oObject.namespace = oObjectInfo.namespace;
		}

		if (oObjectInfo.name) {
			oObject.name = oObjectInfo.name;
		}

		if (oObjectInfo.type) {
			oObject.type = oObjectInfo.type;
		}

		return oObject;
	};

	/**
	 * Opens the dialog to select a transport request.
	 *
	 * @param {object} oConfig configuration for the dialog, e.g. package and transports.
	 * @param {function} fOkay call-back to be invoked when a transport request has successfully been selected.
	 * @param {function} fError call-back to be invoked when an error occurred during selection of a transport request.
	 * @param {boolean} bCompactMode flag indicating whether the transport dialog should be opened in compact mode.
	 * @returns {sap.ui.fl.transport.TransportDialog} the dialog.
	 * @private
	 */
	TransportSelection.prototype._openDialog = function(oConfig, fOkay, fError, bCompactMode) {
		var oDialog = new TransportDialog(oConfig);
		oDialog.attachOk(fOkay);
		oDialog.attachCancel(fError);

		// toggle compact style.
		if (bCompactMode) {
			oDialog.addStyleClass("sapUiSizeCompact");
		} else {
			oDialog.removeStyleClass("sapUiSizeCompact");
		}

		oDialog.open();

		return oDialog;
	};

	/**
	 * Returns a transport to assign an LREP object to.
	 *
	 * @param {object} oTransports the available transports.
	 * @returns {object} a transport to assign an LREP object to, can be <code>null</code>.
	 * @private
	 */
	TransportSelection.prototype._getTransport = function(oTransports) {
		var oTransport;

		if (!oTransports.localonly) {
			oTransport = this._hasLock(oTransports.transports);
		} else {
			oTransport = {
				transportId: ""
			};
		}

		return oTransport;
	};

	/**
	 * Returns whether the dialog to select a transport should be started.
	 *
	 * @param {object} oTransports the available transports.
	 * @returns {boolean} <code>true</code>, if the LREP object is already locked in one of the transports, <code>false</code> otherwise.
	 * @private
	 */
	TransportSelection.prototype._checkDialog = function(oTransports) {
		if (oTransports) {
			if (oTransports.localonly || this._hasLock(oTransports.transports)) {
				return false;
			}
		}

		return true;
	};

	/**
	 * Returns whether the LREP object is already locked in one of the transports.
	 *
	 * @param {array} aTransports the available transports.
	 * @returns {object} the transport, if the LREP object is already locked in one of the transports, <code>null</code> otherwise.
	 * @private
	 */
	TransportSelection.prototype._hasLock = function(aTransports) {
		var len = aTransports.length;

		while (len--) {
			var oTransport = aTransports[len];

			if (oTransport.locked) {
				return oTransport;
			}
		}

		return false;
	};

	/**
	 * Sets the transports for all changes.
	 *
	 * @param {array} aChanges array of {sap.ui.fl.Change}
	 * @param {object} oControl object of the root control for the transport
	 * @returns {Promise} promise that resolves without parameters
	 * @public
	 */
	TransportSelection.prototype.setTransports = function(aChanges, oControl) {
		// do a synchronous loop over all changes to fetch transport information per change each after the other
		// this is needed because only one transport popup should be shown to the user and not one per change

		var iChangeIdx = aChanges.length - 1;
		var that = this;
		var fnSetTransports = function(aChanges, iChangeIdx, oControl, sTransport, bFromDialog) {
			if (iChangeIdx >= 0) {
				var oCurrentChange = aChanges[iChangeIdx];

				if (bFromDialog === true) {
					// if the request has been set by the transport dialog already,
					// do not bring up the transport dialog a second time, but use this transport instead
					// if the change is locked on another transport, this will be resolved in the back end when the DELETE request is send
					if (oCurrentChange.getDefinition().packageName !== "$TMP") {
						oCurrentChange.setRequest(sTransport);
					}
					iChangeIdx--;
					// set the transport for the next request
					return fnSetTransports(aChanges, iChangeIdx, oControl, sTransport, bFromDialog);
				} else {
					// bring up the transport dialog to get the transport information for a change
					if (oCurrentChange.getDefinition().packageName !== "$TMP") {
						return that.openTransportSelection(oCurrentChange, oControl).then(function(oTransportInfo) {

							oCurrentChange.setRequest(oTransportInfo.transport);

							if (oTransportInfo.fromDialog === true) {
								sTransport = oTransportInfo.transport;
								bFromDialog = true;
							}

							iChangeIdx--;
							// set the transport for the next request
							return fnSetTransports(aChanges, iChangeIdx, oControl, sTransport, bFromDialog);
						}, function () {
							return null;
						});
					} else {
						iChangeIdx--;
						// set the transport for the next request
						return fnSetTransports(aChanges, iChangeIdx, oControl, sTransport, bFromDialog);
					}
				}
			} else {
				return Promise.resolve(); // last change has been processed, continue with discarding the changes
			}
		};

		return fnSetTransports(aChanges, iChangeIdx, oControl);
	};

	/**
	 * Opens the transport selection dialog
	 *
	 * @param {sap.ui.fl.Change} [oChange] - the change for which the transport information should be retrieved
	 * @param {object} oControl
	 * @returns {Promise} promise that resolves
	 * @public
	 */
	TransportSelection.prototype.openTransportSelection = function(oChange, oControl) {

		var that = this;

		return new Promise(function(resolve, reject) {
			var fnOkay = function(oResult) {
				if (oResult && oResult.getParameters) {
					var sTransport = oResult.getParameters().selectedTransport;
					var sPackage = oResult.getParameters().selectedPackage;
					var bFromDialog = oResult.getParameters().dialog;
					var oTransportInfo = {
						transport: sTransport,
						packageName: sPackage,
						fromDialog: bFromDialog
					};
					resolve(oTransportInfo);
				} else {
					resolve({});
				}
			};
			var fnError = function(oError) {
				if (oError.sId === 'cancel') {
					resolve();
				} else {
					reject(oError);
				}
			};
			var oObject = {}; // no restriction on package, name or name space
			if (oChange) {
				oObject["package"] = oChange.getPackage();
				oObject.namespace = oChange.getNamespace();
				oObject.name = oChange.getId();
				oObject.type = oChange.getDefinition().fileType;
			}

			that.selectTransport(oObject, fnOkay, fnError, false, oControl);
		});
	};

	return TransportSelection;
}, true);
