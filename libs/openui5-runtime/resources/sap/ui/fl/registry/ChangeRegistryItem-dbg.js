/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define([
	"sap/ui/fl/Utils", "jquery.sap.global"
], function(Utils, jQuery) {
	"use strict";

	/**
	 * Object to define a change on a specific control type with it's permissions
	 * @constructor
	 * @param {Object} mParam Parameter description below
	 * @param {sap.ui.fl.registry.ChangeTypeMetadata} mParam.changeTypeMetadata Change type metadata this registry item is describing
	 * @param {String} mParam.controlType Control type this registry item is assigned to
	 * @param {Object} [mParam.permittedRoles] Permissions who is allowed to use this kind of change type on the assigned control
	 * @alias sap.ui.fl.registry.ChangeRegistryItem
	 *
	 * @author SAP SE
	 * @version 1.48.5
	 * @experimental Since 1.27.0
	 *
	 */
	var ChangeRegistryItem = function(mParam) {
		if (!mParam.changeTypeMetadata) {
			Utils.log.error("sap.ui.fl.registry.ChangeRegistryItem: ChangeTypeMetadata required");
		}
		if (!mParam.controlType) {
			Utils.log.error("sap.ui.fl.registry.ChangeRegistryItem: ControlType required");
		}

		this._changeTypeMetadata = mParam.changeTypeMetadata;
		this._controlType = mParam.controlType;

		if (mParam.permittedRoles) {
			this._permittedRoles = mParam.permittedRoles;
		}

		if (mParam.dragTargets) {
			this._dragTargets = mParam.dragTargets;
		}
	};

	ChangeRegistryItem.prototype._changeTypeMetadata = undefined;
	ChangeRegistryItem.prototype._controlType = undefined;
	ChangeRegistryItem.prototype._permittedRoles = {};
	ChangeRegistryItem.prototype._dragTargets = [];

	/**
	 * Get the metadata for a change type
	 *
	 * @returns {sap.ui.fl.registry.ChangeTypeMetadata} Returns the change type metadata of the item
	 *
	 * @public
	 */
	ChangeRegistryItem.prototype.getChangeTypeMetadata = function() {
		return this._changeTypeMetadata;
	};

	/**
	 * Get the name of a change type
	 *
	 * @returns {String} Returns the name of the change type of the item
	 *
	 * @public
	 */
	ChangeRegistryItem.prototype.getChangeTypeName = function() {
		return this._changeTypeMetadata.getName();
	};

	/**
	 * Get the control type
	 *
	 * @returns {String} Returns the control type the item is assigned to
	 *
	 * @public
	 */
	ChangeRegistryItem.prototype.getControlType = function() {
		return this._controlType;
	};

	/**
	 * Get the roles the change type for the control is permitted to
	 *
	 * @returns {String} Returns a list of permitted roles
	 *
	 * @public
	 */
	ChangeRegistryItem.prototype.getPermittedRoles = function() {
		return this._permittedRoles;
	};

	/**
	 * Get the targets the control type can be dragged on
	 *
	 * @returns {String} Returns a list of possible drag targets
	 *
	 * @public
	 */
	ChangeRegistryItem.prototype.getDragTargets = function() {
		return this._dragTargets;
	};

	return ChangeRegistryItem;
}, true);
