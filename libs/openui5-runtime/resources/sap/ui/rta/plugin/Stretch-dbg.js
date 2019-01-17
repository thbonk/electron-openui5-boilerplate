/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2018 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides class sap.ui.rta.plugin.Stretch.
sap.ui.define([
	"sap/ui/rta/plugin/Plugin",
	"sap/ui/dt/OverlayRegistry",
	"sap/ui/dt/OverlayUtil",
	"sap/ui/dt/Util",
	"sap/ui/core/Control",
	"sap/base/util/includes"
],
function (
	Plugin,
	OverlayRegistry,
	OverlayUtil,
	DtUtil,
	Control,
	includes
) {
	"use strict";

	/**
	 * Constructor for a new Stretch plugin.
	 *
	 * @param {string} [sId] id for the new object, generated automatically if no id is given
	 * @param {object} [mSettings] initial settings for the new object
	 *
	 * @class
	 * The Stretch plugin adds functionality/styling required for RTA.
	 * @extends sap.ui.rta.plugin.Stretch
	 *
	 * @author SAP SE
	 * @version 1.61.2
	 *
	 * @constructor
	 * @private
	 * @since 1.60
	 * @alias sap.ui.rta.plugin.Stretch
	 * @experimental Since 1.60. This class is experimental and provides only limited functionality. Also the API might be changed in future.
	 */
	var Stretch = Plugin.extend("sap.ui.rta.plugin.Stretch", /** @lends sap.ui.rta.plugin.Stretch.prototype */ {
		metadata: {
			// ---- object ----

			// ---- control specific ----
			library: "sap.ui.rta",
			properties: {},
			associations: {
				/**
				 * Stores all candidates for stretching
				 */
				stretchCandidates: {
					type: "sap.ui.core.Control",
					multiple: true
				}
			},
			events: {}
		}
	});

	Stretch.STRETCHSTYLECLASS = "sapUiRtaStretchPaddingTop";

	/**
	 * Override for DesignTime setter to attach to synced event
	 *
	 * @param {sap.ui.dt.DesignTime} oDesignTime DesignTime object
	 * @override
	 */
	Stretch.prototype.setDesignTime = function (oDesignTime) {
		Plugin.prototype.setDesignTime.apply(this, arguments);

		if (oDesignTime) {
			oDesignTime.attachEventOnce("synced", this._onDTSynced, this);
		}
	};

	Stretch.prototype.exit = function () {
		if (this.getDesignTime()) {
			this.getDesignTime().detachEvent("elementOverlayAdded", this._onElementOverlayChanged);
			this.getDesignTime().detachEvent("elementOverlayMoved", this._onElementOverlayChanged);
			this.getDesignTime().detachEvent("elementPropertyChanged", this._onElementPropertyChanged);
			this.getDesignTime().detachEvent("elementOverlayEditableChanged", this._onElementOverlayEditableChanged);
			this.getDesignTime().detachEvent("elementOverlayDestroyed", this._onElementOverlayDestroyed);
		}
	};

	Stretch.prototype.addStretchCandidate = function (oElement) {
		if (!includes(this.getStretchCandidates(), oElement.getId())) {
			this.addAssociation("stretchCandidates", oElement);
		}
	};

	Stretch.prototype.removeStretchCandidate = function (oElement) {
		this.removeAssociation("stretchCandidates", oElement);
		this._toggleStyleClass(oElement, false);
	};

	/**
	 * @override
	 */
	Stretch.prototype.registerElementOverlay = function (oOverlay) {
		this._checkParentAndAddToStretchCandidates(oOverlay);

		Plugin.prototype.registerElementOverlay.apply(this, arguments);
	};

	/**
	 * Additionally to super->deregisterOverlay this method removes the Style-class
	 * @param  {sap.ui.dt.ElementOverlay} oOverlay overlay object
	 * @override
	 */
	Stretch.prototype.deregisterElementOverlay = function (oOverlay) {
		this._toggleStyleClass(oOverlay.getElement(), false);
	};

	/**
	 * This plugin does not make any overlay editable
	 * @override
	 */
	Stretch.prototype._isEditable = function () {
		return false;
	};

	Stretch.prototype._onDTSynced = function () {
		this._setStyleClassForAllStretchCandidates();

		this.getDesignTime().attachEvent("elementOverlayAdded", this._onElementOverlayChanged, this);
		this.getDesignTime().attachEvent("elementOverlayMoved", this._onElementOverlayChanged, this);
		this.getDesignTime().attachEvent("elementPropertyChanged", this._onElementPropertyChanged, this);
		this.getDesignTime().attachEvent("elementOverlayEditableChanged", this._onElementOverlayEditableChanged, this);
		this.getDesignTime().attachEvent("elementOverlayDestroyed", this._onElementOverlayDestroyed, this);
	};

	Stretch.prototype._onElementOverlayDestroyed = function (oEvent) {
		if (this.getDesignTime().getBusyPlugins().length) {
			return;
		}

		var aNewStretchCandidates = [];
		var oParentOverlay = oEvent.getParameters().elementOverlay.getParentElementOverlay();
		if (oParentOverlay && !oParentOverlay._bIsBeingDestroyed) {
			var aRelevantElements = this._getRelevantOverlays(oParentOverlay)
			.filter(function (oOverlay) {
				return oOverlay.getElement();
			});
			aNewStretchCandidates = this._getNewStretchCandidates(aRelevantElements);
		}

		this._setStyleClassForAllStretchCandidates(aNewStretchCandidates);
	};

	/**
	 * When editable changes on an overlay, all parent-overlays and the overlay itself, who are already stretch candidates, have to be reevaluated
	 *
	 * @param {sap.ui.base.Event} oEvent event object
	 */
	Stretch.prototype._onElementOverlayEditableChanged = function (oEvent) {
		if (this.getDesignTime().getBusyPlugins().length) {
			return;
		}

		var oOverlay = sap.ui.getCore().byId(oEvent.getParameters().id);
		var aOverlaysToReevaluate = this._getRelevantOverlaysOnEditableChange(oOverlay);
		this._setStyleClassForAllStretchCandidates(aOverlaysToReevaluate);
	};

	Stretch.prototype._onElementPropertyChanged = function (oEvent) {
		if (this.getDesignTime().getBusyPlugins().length) {
			return;
		}

		var oOverlay = OverlayRegistry.getOverlay(oEvent.getParameters().id);
		var aRelevantOverlays = this._getRelevantOverlays(oOverlay);
		var fnDebounced = DtUtil.debounce(function () {
			if (!this.bIsDestroyed && !oOverlay.bIsDestroyed) {
				var aNewStretchCandidates = this._getNewStretchCandidates(aRelevantOverlays).concat(this._getRelevantOverlaysOnEditableChange(oOverlay));
				aNewStretchCandidates = aNewStretchCandidates.filter(function (sId, iPosition, aAllCandidates) {
					return aAllCandidates.indexOf(sId) === iPosition;
				});
				this._setStyleClassForAllStretchCandidates(aNewStretchCandidates);
			}
		}.bind(this));

		aRelevantOverlays.forEach(function (oOverlay) {
			oOverlay.attachEventOnce("geometryChanged", fnDebounced);
		});
	};

	Stretch.prototype._onElementOverlayChanged = function (oEvent) {
		if (this.getDesignTime().getBusyPlugins().length) {
			return;
		}

		var aRelevantOverlays = this._getRelevantOverlays(sap.ui.getCore().byId(oEvent.getParameters().id));
		var aNewStretchCandidates = this._getNewStretchCandidates(aRelevantOverlays);

		this._setStyleClassForAllStretchCandidates(aNewStretchCandidates);
	};

	Stretch.prototype._getRelevantOverlaysOnEditableChange = function (oOverlay) {
		var aRelevantElements = includes(this.getStretchCandidates(), oOverlay.getElement().getId()) ? [oOverlay.getElement().getId()] : [];
		var oParentAggregationOverlay = oOverlay.getParentAggregationOverlay();
		if (!oParentAggregationOverlay) {
			return aRelevantElements;
		}

		// if there are siblings that are editable and visible, the change has no effect on the parents
		var aOnlySiblings = oParentAggregationOverlay.getChildren();
		aOnlySiblings.splice(aOnlySiblings.indexOf(oOverlay), 1);
		var bAnySiblingAlreadyEditable = aOnlySiblings.some(function (oOverlay) {
			return oOverlay.getEditable() && oOverlay.getGeometry();
		});

		if (bAnySiblingAlreadyEditable) {
			return aRelevantElements;
		}

		return aRelevantElements.concat(this._getRelevantParents(oOverlay));
	};

	Stretch.prototype._getRelevantParents = function (oOverlay) {
		var aReturn = [];

		// add all parents who are stretch candidates, but stop after 25 parents
		for (var i = 0; i < 25; i++) {
			oOverlay = oOverlay.getParentElementOverlay();
			if (!oOverlay) {
				return aReturn;
			}

			if (!includes(this.getStretchCandidates(), oOverlay.getElement().getId())) {
				return aReturn;
			}

			aReturn.push(oOverlay.getElement().getId());
		}
	};

	Stretch.prototype._getNewStretchCandidates = function (aOverlays) {
		var aNewStretchCandidates = [];
		aOverlays.forEach(function (oOverlay) {
			if (this._reevaluateStretching(oOverlay)) {
				aNewStretchCandidates.push(oOverlay.getElement().getId());
			}
		}, this);

		return aNewStretchCandidates;
	};

	Stretch.prototype._reevaluateStretching = function (oOverlay) {
		var oElement = oOverlay.getElement();
		if (oElement instanceof Control) {
			var bIsStretched = oElement.hasStyleClass(Stretch.STRETCHSTYLECLASS);
			var bShouldBeStretched = this._childrenAreSameSize(oOverlay, undefined, bIsStretched);
			if (bIsStretched && !bShouldBeStretched) {
				this.removeStretchCandidate(oElement);
			} else if (!bIsStretched && bShouldBeStretched) {
				this.addStretchCandidate(oElement);
				return true;
			}
		}
	};

	Stretch.prototype._checkParentAndAddToStretchCandidates = function (oOverlay) {
		var oParentOverlay = oOverlay.getParentElementOverlay();
		var oParentElement = oParentOverlay && oParentOverlay.getElement();
		if (oParentElement instanceof Control) {
			if (this._startAtSamePosition(oParentOverlay, oOverlay)) {
				if (this._childrenAreSameSize(oParentOverlay)) {
					this.addStretchCandidate(oParentElement);
				}
			}
		}
	};

	Stretch.prototype._startAtSamePosition = function (oParentOverlay, oOverlay) {
		if (oParentOverlay && oParentOverlay.getGeometry() && oOverlay.getGeometry()) {
			if (
				oParentOverlay.getGeometry().position.top === oOverlay.getGeometry().position.top &&
				oParentOverlay.getGeometry().position.left === oOverlay.getGeometry().position.left
			) {
				return true;
			}
		}
	};

	/**
	 * Check if the size of an overlay is the same as an array of overlays.
	 * If no array is passed to the function the children of the reference overlay are used.
	 * If the control is already stretched we need to remove the padding that we add
	 *
	 * @param {sap.ui.dt.ElementOverlay} oReferenceOverlay - overlay object
	 * @param {sap.ui.dt.ElementOverlay[]} [aChildOverlays] - array of overlay objects that should be checked
	 * @param {boolean} [bIsAlreadyStretched] - indicater if the control is already stretched
	 * @returns {boolean} Returns true if the overlay has the same size as all the children
	 * @private
	 */
	Stretch.prototype._childrenAreSameSize = function (oReferenceOverlay, aChildOverlays, bIsAlreadyStretched) {
		var oParentGeometry = oReferenceOverlay.getGeometry();

		if (!oParentGeometry) {
			return false;
		}

		// remove padding if it is already stretched
		var iHeight = oParentGeometry.size.height;
		if (bIsAlreadyStretched) {
			iHeight -= oReferenceOverlay.getElement().$().css("padding-top");
		}
		var iParentSize = oParentGeometry.size.width * iHeight;
		aChildOverlays = aChildOverlays || OverlayUtil.getAllChildOverlays(oReferenceOverlay);

		var aChildrenGeometry = aChildOverlays.map(function (oChildOverlay) {
			return oChildOverlay.getGeometry();
		});

		var oChildrenGeometry = OverlayUtil.getGeometry(aChildrenGeometry);

		if (!oChildrenGeometry) {
			return false;
		}

		var iChildrenSize = oChildrenGeometry.size.width * oChildrenGeometry.size.height;
		return iChildrenSize === iParentSize;
	};

	/**
	 * Checks all the decendants for an editable child. Stops as soon as an editable is found or the children don't have the same size anymore.
	 *
	 * @param {sap.ui.dt.ElementOverlay} oReferenceOverlay - overlay object
	 * @param {sap.ui.dt.ElementOverlay[]} aChildOverlays - array of child overlay objects
	 * @returns {boolean} Returns true if there is an editable descendant
	 * @private
	 */
	Stretch.prototype._atLeastOneDescendantEditable = function (oReferenceOverlay, aChildOverlays) {
		var bAtLeastOneChildEditable = aChildOverlays.some(function (oOverlay) {
			return oOverlay.getEditable() && oOverlay.getGeometry();
		});

		if (bAtLeastOneChildEditable) {
			return true;
		} else {
			var aChildrensChildrenOverlays = [];
			aChildOverlays.forEach(function (oChildOverlay) {
				aChildrensChildrenOverlays = aChildrensChildrenOverlays.concat(OverlayUtil.getAllChildOverlays(oChildOverlay));
			});

			if (!aChildrensChildrenOverlays.length > 0) {
				return false;
			}
			if (this._childrenAreSameSize(oReferenceOverlay, aChildrensChildrenOverlays)) {
				return this._atLeastOneDescendantEditable(oReferenceOverlay, aChildrensChildrenOverlays);
			}
		}
	};

	/**
	 * Check editable and set the Style-class for padding on the given Elements.
	 * When no array is given all the stretch candidates are evaluated
	 *
	 * @param {sap.ui.core.Control[]} [aStretchCandidates] - array of Ids of stretch candidates
	 * @private
	 */
	Stretch.prototype._setStyleClassForAllStretchCandidates = function (aStretchCandidates) {
		if (!Array.isArray(aStretchCandidates)) {
			aStretchCandidates = this.getStretchCandidates();
		}
		aStretchCandidates.forEach(function (sElementId) {
			var oOverlay = OverlayRegistry.getOverlay(sElementId);

			var aChildOverlays = OverlayUtil.getAllChildOverlays(oOverlay);
			var bAtLeastOneChildEditable = this._atLeastOneDescendantEditable(oOverlay, aChildOverlays);
			var bAddClass = oOverlay.getEditable() && bAtLeastOneChildEditable;

			this._toggleStyleClass(oOverlay.getElement(), bAddClass);
		}, this);
	};

	Stretch.prototype._toggleStyleClass = function (oElement, bAddClass) {
		if (bAddClass && oElement.addStyleClass) {
			oElement.addStyleClass(Stretch.STRETCHSTYLECLASS);
		} else if (!bAddClass && oElement.removeStyleClass) {
			oElement.removeStyleClass(Stretch.STRETCHSTYLECLASS);
		}
	};

	return Stretch;
}, /* bExport= */ true);