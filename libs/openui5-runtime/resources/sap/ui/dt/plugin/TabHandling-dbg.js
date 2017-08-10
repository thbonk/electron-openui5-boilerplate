/*
 * ! UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define([
	'jquery.sap.global', 'sap/ui/dt/Plugin', 'sap/ui/dt/Overlay'
], function(jQuery, Plugin, Overlay) {
	"use strict";

	/**
	 * Constructor for a new TabHandling.
	 *
	 * @param {string} [sId] id for the new object, generated automatically if no id is given
	 * @param {object} [mSettings] initial settings for the new object
	 * @class The TabHandling plugin adjusts the tabindex for the elements.
	 * @extends sap.ui.dt.Plugin
	 * @author SAP SE
	 * @version 1.48.5
	 * @constructor
	 * @private
	 * @since 1.38
	 * @alias sap.ui.dt.plugin.TabHandling
	 * @experimental Since 1.38. This class is experimental and provides only limited functionality. Also the API might be changed in future.
	 */
	var TabHandling = Plugin.extend("sap.ui.dt.plugin.TabHandling", /** @lends sap.ui.dt.plugin.TabHandling.prototype */
	{
		metadata: {
			// ---- object ----

			// ---- control specific ----
			library: "sap.ui.dt",
			properties: {},
			associations: {},
			events: {}
		}
	});


	TabHandling.prototype.registerElementOverlay = function(oOverlay) {
		if (oOverlay.isRoot()) {
			this._removeTabIndex();
		}
	};

	/**
	 * Deregister an overlay
	 *
	 * @param {sap.ui.dt.Overlay} oOverlay overlay object
	 * @override
	 */
	TabHandling.prototype.deregisterElementOverlay = function(oOverlay) {
		if (oOverlay.isRoot()) {
			this._restoreTabIndex();
		}
	};

	TabHandling.prototype.setDesignTime = function(oDesignTime) {
		Plugin.prototype.setDesignTime.apply(this, arguments);
		if (oDesignTime) {
			if (!this._oMutationObserver) {
				this._oMutationObserver = Overlay.getMutationObserver();
				this._oMutationObserver.attachDomChanged(this._onDomChanged, this);
			}
		} else {
			this._oMutationObserver.detachDomChanged(this._onDomChanged, this);
			delete this._oMutationObserver;
			this._restoreTabIndex();
		}
	};

	/**
	 * Traverse the whole DOM tree and set tab indices to -1 for all elements
	 *
	 * @param {sap.ui.core.Element} oRootDom object of the root DOM element
	 * @private
	 */
	TabHandling.prototype._removeTabIndex = function() {
		var oDesignTime = this.getDesignTime();
		var aRootElements = oDesignTime.getRootElements();
		aRootElements.forEach(function(sRootElement) {
			var oRootDom = sap.ui.getCore().byId(sRootElement).getDomRef();
			jQuery(oRootDom).find(":focusable:not([tabIndex=-1], #overlay-container *)").each(function(iIndex, oNode) {
				oNode.setAttribute("data-sap-ui-dt-tabindex", oNode.tabIndex);
				oNode.setAttribute("tabIndex", -1);
			});
		});
	};

	/**
	 * Restore the tab indices of all elements of the DOM tree
	 *
	 * @private
	 */
	TabHandling.prototype._restoreTabIndex = function() {
		jQuery("[data-sap-ui-dt-tabindex]").each(function(iIndex, oNode) {
			oNode.setAttribute("tabIndex", oNode.getAttribute("data-sap-ui-dt-tabindex"));
			oNode.removeAttribute("data-sap-ui-dt-tabindex");
		});
	};

	/**
	 * @private
	 */
	TabHandling.prototype._onDomChanged = function() {
		if (this.getDesignTime().getEnabled()) {
			this._removeTabIndex();
		}
	};

	return TabHandling;
}, /* bExport= */true);
