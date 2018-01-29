/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides class sap.ui.rta.plugin.Remove.
sap.ui.define([
	'sap/ui/rta/plugin/Plugin',
	'sap/ui/rta/Utils',
	'sap/ui/rta/command/CompositeCommand',
	'sap/ui/dt/OverlayRegistry'
], function(Plugin, Utils, CompositeCommand, OverlayRegistry) {
	"use strict";

	/**
	 * Constructor for a new Remove Plugin.
	 *
	 * @param {string} [sId] id for the new object, generated automatically if no id is given
	 * @param {object} [mSettings] initial settings for the new object
	 * @class The Remove allows trigger remove operations on the overlay
	 * @extends sap.ui.rta.plugin.Plugin
	 * @author SAP SE
	 * @version 1.50.8
	 * @constructor
	 * @private
	 * @since 1.34
	 * @alias sap.ui.rta.plugin.Remove
	 * @experimental Since 1.34. This class is experimental and provides only limited functionality. Also the API might be changed in future.
	 */
	var Remove = Plugin.extend("sap.ui.rta.plugin.Remove", /** @lends sap.ui.rta.plugin.Remove.prototype */
	{
		metadata: {
			// ---- object ----

			// ---- control specific ----
			library: "sap.ui.rta",
			properties: {},
			associations: {},
			events: {}
		}
	});

	/**
	 * Register browser event for an overlay
	 *
	 * @param {sap.ui.dt.Overlay} oOverlay overlay object
	 * @override
	 */
	Remove.prototype.registerElementOverlay = function(oOverlay) {
		if (this.isRemoveEnabled(oOverlay)) {
			oOverlay.attachBrowserEvent("keydown", this._onKeyDown, this);
		}
		Plugin.prototype.registerElementOverlay.apply(this, arguments);
	};

	/**
	 * @param {sap.ui.dt.ElementOverlay} oOverlay overlay
	 * @returns {boolean} editable or not
	 * @private
	 */
	Remove.prototype._isEditable = function(oOverlay) {
		var bEditable = false;
		var oElement = oOverlay.getElementInstance();

		var oParentDesignTimeMetadata = Utils.getRelevantContainerDesigntimeMetadata(oOverlay);
		if (!oParentDesignTimeMetadata) {
			return false;
		}

		var oRemoveAction = this._getRemoveAction(oOverlay);
		if (oRemoveAction && oRemoveAction.changeType) {
			if (oRemoveAction.changeOnRelevantContainer) {
				oElement = oOverlay.getRelevantContainer();
			}
			bEditable = this.hasChangeHandler(oRemoveAction.changeType, oElement);
		}

		if (bEditable) {
			return this.hasStableId(oOverlay);
		}

		return bEditable;
	};

	/**
	 * @param	{sap.ui.dt.Overlay} oOverlay overlay object
	 * @return {sap.ui.dt.DesignTimeMetadata} oDesignTimeMetadata
	 * @private
	 */
	Remove.prototype._getRemoveAction = function(oOverlay) {
		return oOverlay.getDesignTimeMetadata() ? oOverlay.getDesignTimeMetadata().getAction("remove", oOverlay.getElementInstance()) : null;
	};

	/**
	 * Checks if remove is available for oOverlay
	 *
	 * @param {sap.ui.dt.Overlay} oOverlay overlay object
	 * @return {boolean} true if available
	 * @public
	 */
	Remove.prototype.isRemoveAvailable = function(oOverlay) {
		return this._isEditableByPlugin(oOverlay);
	};

	/**
	 * Checks if remove is enabled for oOverlay
	 *
	 * @param {sap.ui.dt.Overlay} oOverlay overlay object
	 * @return {boolean} true if enabled
	 * @public
	 */
	Remove.prototype.isRemoveEnabled = function(oOverlay) {
		var oAction = this._getRemoveAction(oOverlay);
		if (!oAction) {
			return false;
		}

		if (typeof oAction.isEnabled !== "undefined") {
			if (typeof oAction.isEnabled === "function") {
				return oAction.isEnabled(oOverlay.getElementInstance());
			} else {
				return oAction.isEnabled;
			}
		}
		return true;
	};

	/**
	 * @param  {sap.ui.dt.Overlay} oOverlay overlay object
	 * @return {String}          confirmation text
	 * @private
	 */
	Remove.prototype._getConfirmationText = function(oOverlay) {
		var oAction = this._getRemoveAction(oOverlay);
		if (oAction && oAction.getConfirmationText) {
			return oAction.getConfirmationText(oOverlay.getElementInstance());
		}
	};

	/**
	 * Detaches the browser events
	 *
	 * @param {sap.ui.dt.Overlay} oOverlay overlay object
	 * @override
	 */
	Remove.prototype.deregisterElementOverlay = function(oOverlay) {
		if (this.isRemoveEnabled(oOverlay)) {
			oOverlay.detachBrowserEvent("keydown", this._onKeyDown, this);
		}
		Plugin.prototype.deregisterElementOverlay.apply(this, arguments);
	};

	/**
	 * Handle keydown event
	 *
	 * @param {sap.ui.base.Event} oEvent event object
	 * @private
	 */
	Remove.prototype._onKeyDown = function(oEvent) {
		if (oEvent.keyCode === jQuery.sap.KeyCodes.DELETE) {
			oEvent.stopPropagation();
			this.removeElement();
		}
	};

	/**
	 * The selected (not the focused) element should be hidden!
	 * @param {array} aOverlays overlay array
	 * @private
	 */
	Remove.prototype.removeElement = function(aOverlays) {
		var aSelection;
		if (aOverlays){
			aSelection = aOverlays;
		} else {
			var oDesignTime = this.getDesignTime();
			aSelection = oDesignTime.getSelection();
		}

		aSelection = aSelection.filter(this.isRemoveEnabled, this);

		if (aSelection.length > 0) {
			this._handleRemove(aSelection);
		}
	};

	Remove.prototype._getRemoveCommand = function(oRemovedElement, oDesignTimeMetadata, sVariantManagementKey) {
		return this.getCommandFactory().getCommandFor(oRemovedElement, "Remove", {
			removedElement : oRemovedElement
		}, oDesignTimeMetadata, sVariantManagementKey);
	};

	Remove.prototype._fireElementModified = function(oCompositeCommand) {
		if (oCompositeCommand.getCommands().length) {
			this.fireElementModified({
				"command" : oCompositeCommand
			});
		}
	};

	Remove.prototype._handleRemove = function(aSelectedOverlays) {
		var aPromises = [];
		var oCompositeCommand = new CompositeCommand();
		var fnSetFocus = function (oOverlay) {
			oOverlay.setSelected(true);
			setTimeout(function() {
				oOverlay.focus();
			}, 0);
		};
		var oNextOverlaySelection = Remove._getElementToFocus(aSelectedOverlays);

		aSelectedOverlays.forEach(function(oOverlay) {
			var oCommand;
			var oRemovedElement = oOverlay.getElementInstance();
			var oDesignTimeMetadata = oOverlay.getDesignTimeMetadata();
			var oRemoveAction = this._getRemoveAction(oOverlay);
			var oRelevantElement;
			if (oRemoveAction.changeOnRelevantContainer) {
				oRelevantElement = oOverlay.getRelevantContainer();
			} else {
				oRelevantElement = oRemovedElement;
			}
			var sVariantManagementKey = this.getVariantManagementKey(oOverlay, oRelevantElement, oRemoveAction.changeType);
			var sConfirmationText = this._getConfirmationText(oOverlay);

			if (sConfirmationText) {
				aPromises.push(
					Utils.openRemoveConfirmationDialog(oRemovedElement, sConfirmationText)
					.then(function(bConfirmed) {
						if (bConfirmed) {
							oCommand = this._getRemoveCommand(oRemovedElement, oDesignTimeMetadata, sVariantManagementKey);
							oCompositeCommand.addCommand(oCommand);
						}
					}.bind(this))
				);
			} else {
				oCommand = this._getRemoveCommand(oRemovedElement, oDesignTimeMetadata, sVariantManagementKey);
				oCompositeCommand.addCommand(oCommand);
			}
		}, this);

		// since Promise.all is always asynchronous, we want to call it only if at least one promise exists
		if (aPromises.length) {
			Promise.all(aPromises).then(function() {
				this._fireElementModified(oCompositeCommand);
				fnSetFocus(oNextOverlaySelection);
			}.bind(this));
		} else {
			this._fireElementModified(oCompositeCommand);
			fnSetFocus(oNextOverlaySelection);
		}
	};

	Remove._getElementToFocus = function(aSelectedOverlays) {
		// BCP: 1780366011
		// if one element is selected then we try to get next or previous sibling
		// considering already hidden siblings, if not succeed then select relevant container
		var oNextOverlaySelection;
		if (aSelectedOverlays.length === 1) {
			var oOverlay = aSelectedOverlays[0];
			var aSiblings = oOverlay.getParent().getAggregation(oOverlay.sParentAggregationName);
			if (aSiblings.length > 1) {
				var iOverlayPosition = aSiblings.indexOf(oOverlay);
				var aCandidates = aSiblings.slice(iOverlayPosition + 1);
				if (iOverlayPosition !== 0) {
					aCandidates = aCandidates.concat(
						aSiblings.slice(0, iOverlayPosition).reverse()
					);
				}
				oNextOverlaySelection = aCandidates.filter(function (oSibling) {
					return oSibling.getElementInstance().getVisible();
				}).shift();
			}
		}
		if (!oNextOverlaySelection) {
			oNextOverlaySelection = OverlayRegistry.getOverlay(aSelectedOverlays[0].getRelevantContainer());
		}
		return oNextOverlaySelection;
	};

	return Remove;
}, /* bExport= */true);
