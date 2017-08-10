/*
 * ! UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides class sap.ui.dt.plugin.CutPaste.
sap.ui.define([
	'sap/ui/dt/Plugin', 'sap/ui/dt/plugin/ElementMover', 'sap/ui/dt/OverlayUtil'
], function(Plugin, ElementMover, OverlayUtil) {
	"use strict";

	/**
	 * Constructor for a new CutPaste.
	 *
	 * @param {string} [sId] id for the new object, generated automatically if no id is given
	 * @param {object} [mSettings] initial settings for the new object
	 * @class The CutPaste enables Cut & Paste functionality for the overlays based on aggregation types
	 * @extends sap.ui.dt.Plugin"
	 * @author SAP SE
	 * @version 1.48.5
	 * @constructor
	 * @private
	 * @since 1.34
	 * @alias sap.ui.dt.plugin.CutPaste
	 * @experimental Since 1.34. This class is experimental and provides only limited functionality. Also the API might be changed in future.
	 */
	var CutPaste = Plugin.extend("sap.ui.dt.plugin.CutPaste", /** @lends sap.ui.dt.plugin.CutPaste.prototype */
	{
		metadata: {
			// ---- object ----

			// ---- control specific ----
			library: "sap.ui.dt",
			properties: {
				movableTypes: {
					type: "string[]",
					defaultValue: [
						"sap.ui.core.Element"
					]
				},
				elementMover: {
					type: "any" // "sap.ui.dt.plugin.ElementMover"
				}
			},
			associations: {}
		}
	});

	CutPaste.prototype.init = function() {
		this.setElementMover(new ElementMover());
	};

	/**
	 * @override
	 */
	CutPaste.prototype.registerElementOverlay = function(oOverlay) {
		var oElement = oOverlay.getElementInstance();
		//Register key down so that ESC is possible on all overlays
		oOverlay.attachBrowserEvent("keydown", this._onKeyDown, this);
		if (this.getElementMover().isMovableType(oElement) && this.getElementMover().checkMovable(oOverlay)) {
			oOverlay.setMovable(true);
		}

		if (this.getElementMover().getMovedOverlay()) {
			this.getElementMover().activateTargetZonesFor(this.getElementMover().getMovedOverlay());
		}
	};

	/**
	 * @override
	 */
	CutPaste.prototype.deregisterElementOverlay = function(oOverlay) {
		oOverlay.setMovable(false);
		oOverlay.detachBrowserEvent("keydown", this._onKeyDown, this);

		if (this.getElementMover().getMovedOverlay()) {
			this.getElementMover().deactivateTargetZonesFor(this.getElementMover().getMovedOverlay());
		}
	};

	CutPaste.prototype.setMovableTypes = function(aMovableTypes) {
		this.getElementMover().setMovableTypes(aMovableTypes);
		return this.setProperty("movableTypes", aMovableTypes);
	};

	CutPaste.prototype.setElementMover = function(oElementMover) {
		oElementMover.setMovableTypes(this.getMovableTypes());
		return this.setProperty("elementMover", oElementMover);
	};

	CutPaste.prototype.getCuttedOverlay = function() {
		return this.getElementMover().getMovedOverlay();
	};

	CutPaste.prototype.isElementPasteable = function(oTargetOverlay) {
		var oTargetZoneAggregation = this._getTargetZoneAggregation(oTargetOverlay);
		if ((oTargetZoneAggregation) || (OverlayUtil.isInTargetZoneAggregation(oTargetOverlay))) {
			return true;
		} else {
			return false;
		}
	};

	CutPaste.prototype._onKeyDown = function(oEvent) {
		var oOverlay = sap.ui.getCore().byId(oEvent.currentTarget.id);

		// on macintosh os cmd-key is used instead of ctrl-key
		var bCtrlKey = sap.ui.Device.os.macintosh ? oEvent.metaKey : oEvent.ctrlKey;

		if ((oEvent.keyCode === jQuery.sap.KeyCodes.X) && (oEvent.shiftKey === false) && (oEvent.altKey === false) && (bCtrlKey === true)) {
			// CTRL+X
			this.cut(oOverlay);
			oEvent.stopPropagation();
		} else if ((oEvent.keyCode === jQuery.sap.KeyCodes.V) && (oEvent.shiftKey === false) && (oEvent.altKey === false) && (bCtrlKey === true)) {
			// CTRL+V
			this.paste(oOverlay);
			oEvent.stopPropagation();
		} else if (oEvent.keyCode === jQuery.sap.KeyCodes.ESCAPE) {
			// ESC
			this.stopCutAndPaste();
			oEvent.stopPropagation();
		}
	};

	CutPaste.prototype.cut = function(oOverlay) {
		this.stopCutAndPaste();

		if (oOverlay.isMovable()) {
			this.getElementMover().setMovedOverlay(oOverlay);
			oOverlay.addStyleClass("sapUiDtOverlayCutted");

			this.getElementMover().activateAllValidTargetZones(this.getDesignTime());
		}
	};

	/**
	 * The actual execution of paste. This method is additionally defined because
	 * there might be steps between the execution and finalization (stopCutAndPaste) of
	 * paste (for example in the RTA plugin that extends this one).
	 * @param  {sap.ui.dt.Overlay} oTargetOverlay The Overlay where the element will be pasted
	 * @return {boolean} Return true if paste was successfully executed
	 */
	CutPaste.prototype._executePaste = function(oTargetOverlay) {
		var oCutOverlay = this.getElementMover().getMovedOverlay();
		if (!oCutOverlay) {
			return false;
		}
		if (!this._isForSameElement(oCutOverlay, oTargetOverlay)) {

			var oTargetZoneAggregation = this._getTargetZoneAggregation(oTargetOverlay);
			if (oTargetZoneAggregation) {
				this.getElementMover().insertInto(oCutOverlay, oTargetZoneAggregation);
				return true;
			} else if (OverlayUtil.isInTargetZoneAggregation(oTargetOverlay)) {
				this.getElementMover().repositionOn(oCutOverlay, oTargetOverlay);
				return true;
			} else {
				return false;
			}
		}

		// focus get invalidated, see BCP 1580061207
		setTimeout(function(){
			oCutOverlay.focus();
		},0);
	};

	/**
	 * Paste the element into the target overlay
	 * @param  {sap.ui.dt.Overlay} oTargetOverlay The Overlay where the element will be pasted
	 */
	CutPaste.prototype.paste = function(oTargetOverlay) {
		var bPasteExecuted = this._executePaste(oTargetOverlay);

		if (bPasteExecuted === true){
			this.stopCutAndPaste();
		}
	};

	/**
	 * Finalize cut&paste operation + cleanup
	 */
	CutPaste.prototype.stopCutAndPaste = function() {
		var oCutOverlay = this.getElementMover().getMovedOverlay();
		if (oCutOverlay) {
			oCutOverlay.removeStyleClass("sapUiDtOverlayCutted");
			this.getElementMover().setMovedOverlay(null);
			this.getElementMover().deactivateAllTargetZones(this.getDesignTime());
		}
	};

	CutPaste.prototype._isForSameElement = function(oCutOverlay, oTargetOverlay) {
		return oTargetOverlay.getElementInstance() === oCutOverlay.getElementInstance();
	};

	CutPaste.prototype._getTargetZoneAggregation = function(oTargetOverlay) {
		var aAggregationOverlays = oTargetOverlay.getAggregationOverlays();
		var aPossibleTargetZones = aAggregationOverlays.filter(function(oAggregationOverlay) {
			return oAggregationOverlay.isTargetZone();
		});
		if (aPossibleTargetZones.length > 0) {
			return aPossibleTargetZones[0];
		} else {
			return null;
		}
	};

	return CutPaste;
}, /* bExport= */true);
