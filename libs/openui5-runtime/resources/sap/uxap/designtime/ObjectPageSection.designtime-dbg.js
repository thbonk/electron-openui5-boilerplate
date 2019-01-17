/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2018 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides the Design Time Metadata for the sap.uxap.ObjectPageSection control
sap.ui.define(["sap/uxap/library"],
	function(library) {
	"use strict";

	return {
		name : {
			singular : function(){
				return sap.ui.getCore().getLibraryResourceBundle("sap.uxap").getText("SECTION_CONTROL_NAME");
			},
			plural : function(){
				return sap.ui.getCore().getLibraryResourceBundle("sap.uxap").getText("SECTION_CONTROL_NAME_PLURAL");
			}
		},
		palette: {
			group: "CONTAINER",
			icons: {
				svg: "sap/uxap/designtime/ObjectPageSection.icon.svg"
			}
		},
		actions : {
			remove : {
				changeType : "stashControl"
			},
			reveal : {
				changeType : "unstashControl"
			},
			rename: function () {
				return {
					changeType: "rename",
					domRef: ".sapUxAPObjectPageSectionTitle",
					isEnabled: function (oElement) {
						return oElement.$("title").get(0) != undefined;
					}
				};
			}
		},
		aggregations: {
			subSections: {
				domRef : ":sap-domref .sapUxAPObjectPageSectionContainer",
				actions : {
					move: {
						changeType: "moveControls"
					}
				}
			}
		}
	};

}, /* bExport= */ false);
