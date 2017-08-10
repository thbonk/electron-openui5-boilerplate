/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides the Design Time Metadata for the sap.ui.layout.form.FormElement
sap.ui.define(['sap/ui/layout/form/Form', 'sap/ui/layout/form/FormContainer', 'sap/ui/layout/form/ResponsiveGridLayout'],
	function(Form, FormContainer, ResponsiveGridLayout) {
	"use strict";

	return {
		domRef : function(oFormElement) {
			var oParent = oFormElement.getParent();
			if (oParent instanceof FormContainer) {
				oParent = oParent.getParent();
				if (oParent instanceof Form) {
					var oLayout = oParent.getLayout();
					// formLayout, responsiveLayout and GridLayout are implementing getRenderedDomFor
					// method thus don't need design-time dom ref definition
					if (oLayout instanceof ResponsiveGridLayout) {
						var aFields = oFormElement.getFields();
						var oLabel = oFormElement.getLabelControl();
						if (oLabel) {
							aFields.unshift(oLabel);
						}

						return aFields.filter(function(oElement) {
							return oElement.getDomRef && oElement.getDomRef();
						}).map(function(oElement) {
							var oDomRef = oElement.getDomRef();
							return oDomRef.parentNode;
						});
					}
				}
			}
		},
		actions: {
			remove: {
				changeType: "hideControl"
			},
			rename: {
				changeType: "renameField",
				domRef: function (oControl) {
					return oControl.getLabelControl().getDomRef();
				}
			},
			reveal: {
				changeType: "unhideControl"
			}
		},
		name: {
			singular: "FIELD_CONTROL_NAME",
			plural: "FIELD_CONTROL_NAME_PLURAL"
		}
	};

}, /* bExport= */ false);
