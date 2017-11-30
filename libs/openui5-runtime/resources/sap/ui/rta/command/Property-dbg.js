/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define([
	'sap/ui/rta/command/FlexCommand',
	"sap/ui/rta/Utils"
], function(
	FlexCommand,
	Utils
) {
	"use strict";

	/**
	 * Basic implementation for the command pattern.
	 *
	 * @class
	 * @extends sap.ui.base.ManagedObject
	 * @author SAP SE
	 * @version 1.50.6
	 * @constructor
	 * @private
	 * @since 1.34
	 * @alias sap.ui.rta.command.BaseCommand
	 * @experimental Since 1.34. This class is experimental and provides only limited functionality. Also the API might be
	 *               changed in future.
	 */
	var Property = FlexCommand.extend("sap.ui.rta.command.Property", {
		metadata : {
			library : "sap.ui.rta",
			properties : {
				propertyName : {
					type : "string"
				},
				newValue : {
					type : "any"
				},
				semanticMeaning : {
					type : "string"
				},
				changeType : {
					type : "string",
					defaultValue : "propertyChange"
				}
			},
			associations : {},
			events : {}
		}
	});

	Property.prototype._getChangeSpecificData = function() {
		var oElement = this.getElement();
		// general format
		return {
			changeType : this.getChangeType(),
			selector : {
				id : oElement.getId(),
				type : oElement.getMetadata().getName()
			},
			content : {
				property : this.getPropertyName(),
				newValue : this.getNewValue(),
				semantic : this.getSemanticMeaning()
			}
		};
	};

	return Property;

}, /* bExport= */true);
