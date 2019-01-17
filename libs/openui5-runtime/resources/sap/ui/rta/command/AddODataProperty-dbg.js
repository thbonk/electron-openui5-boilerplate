/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2018 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define([
	'sap/ui/rta/command/FlexCommand'
], function (FlexCommand) {
	"use strict";

	/**
	 * Add new OData property to a control
	 *
	 * @class
	 * @extends sap.ui.rta.command.FlexCommand
	 * @author SAP SE
	 * @version 1.61.2
	 * @constructor
	 * @private
	 * @since 1.44
	 * @alias sap.ui.rta.command.AddODataProperty
	 * @experimental Since 1.44. This class is experimental and provides only limited functionality. Also the API might be
	 *               changed in future.
	 */
	var AddODataProperty = FlexCommand.extend("sap.ui.rta.command.AddODataProperty", {
		metadata : {
			library : "sap.ui.rta",
			properties : {
				index : {
					type : "int"
				},
				newControlId : {
					type : "string"
				},
				//the name "bindingPath" conflicts with getBindingPath() method from ManagedObject
				bindingString : {
					type : "string"
				},
				entityType : {
					type : "string"
				},
				parentId : {
					type : "string"
				},
				oDataServiceVersion : {
					type : "string"
				},
				oDataServiceUri: {
					type: "string"
				},
				propertyName: {
					type: "string"
				}
			}
		}
	});

	AddODataProperty.prototype._getChangeSpecificData = function() {
		// general format
		return {
			changeType: this.getChangeType(),
			index: this.getIndex(),
			newControlId: this.getNewControlId(),
			bindingPath: this.getBindingString(),
			parentId: this.getParentId(),
			oDataServiceVersion: this.getODataServiceVersion(),
			oDataInformation: {
				oDataServiceUri: this.getODataServiceUri(),
				propertyName: this.getPropertyName(),
				entityType: this.getEntityType()
			}
		};
	};

	return AddODataProperty;

}, /* bExport= */true);
