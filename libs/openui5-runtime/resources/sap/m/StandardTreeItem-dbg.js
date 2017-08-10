/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.m.StandardTreeItem.
sap.ui.define(['jquery.sap.global', './TreeItemBase', './library', 'sap/ui/core/EnabledPropagator', 'sap/ui/core/IconPool',  'sap/ui/core/Icon', './StandardListItem'],
	function(jQuery, TreeItemBase, library, EnabledPropagator, IconPool, Icon, StandardListItem) {
	"use strict";

	/**
	 * Constructor for a new StandardTreeItem.
	 *
	 * @param {string} [sId] ID for the new control, generated automatically if no id is given
	 * @param {object} [mSettings] Initial settings for the new control
	 *
	 * @class
	 * The <code>sap.m.StandardTreeItem</code> is a tree item providing a title, image, etc.
	 * @extends sap.m.TreeItemBase
	 *
	 * @author SAP SE
	 * @version 1.48.5
	 *
	 * @constructor
	 * @public
	 * @since 1.42.0
	 * @alias sap.m.StandardTreeItem
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var StandardTreeItem = TreeItemBase.extend("sap.m.StandardTreeItem", /** @lends sap.m.StandardTreeItem.prototype */ { metadata : {

		library : "sap.m",
		properties : {
			/**
			 * Defines the title of the item.
			 */
			title : {type : "string", group : "Misc", defaultValue : ""},

			/**
			 * Defines the tree item icon.
			 */
			icon : {type : "sap.ui.core.URI", group : "Misc", defaultValue : null}
		}
	}});

	/**
	 * Gets the image control to be rendered as Icon.
	 *
	 * @private
	 * @since 1.42.0
	 */
	StandardTreeItem.prototype._getIconControl = function() {
		var sURI = this.getIcon();

		if (this._oIconControl) {
			this._oIconControl.setSrc(sURI);
			return this._oIconControl;
		}

		this._oIconControl = IconPool.createControlByURI({
			id: this.getId() + "-icon",
			src: sURI,
			useIconTooltip: false,
			noTabStop: true
		}, sap.m.Image).setParent(this, null, true).addStyleClass("sapMSTIIcon");

		return this._oIconControl;
	};

	StandardTreeItem.prototype.getContentAnnouncement = function() {
		var sAnnouncement = "",
		oIconInfo = IconPool.getIconInfo(this.getIcon()) || {};

		sAnnouncement += (oIconInfo.text || oIconInfo.name || "") + " ";
		sAnnouncement += this.getTitle() + " ";

		return sAnnouncement;
	};

	StandardTreeItem.prototype.exit = function() {
		TreeItemBase.prototype.exit.apply(this, arguments);
		this.destroyControls(["Icon"]);
	};

	return StandardTreeItem;

}, /* bExport= */ true);
