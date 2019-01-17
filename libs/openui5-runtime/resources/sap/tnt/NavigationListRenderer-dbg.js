/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2018 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides the default renderer for control sap.tnt.NavigationList
sap.ui.define(['sap/ui/core/Renderer'],
	function(Renderer) {
		"use strict";

		/**
		 * NavigationListRenderer renderer.
		 *
		 * @author SAP SE
		 * @namespace
		 */
		var NavigationListRenderer = {};

		/**
		 * Renders the HTML for the given control, using the provided {@link sap.ui.core.RenderManager}.
		 *
		 * @param {sap.ui.core.RenderManager} rm The RenderManager that can be used for writing to the renderer output buffer
		 * @param {sap.ui.core.Control} control An object representation of the control that should be rendered
		 */
		NavigationListRenderer.render = function (rm, control) {
			var role,
				visibleGroupsCount,
				groups = control.getItems(),
				expanded = control.getExpanded(),
				visibleGroups = [];

			rm.write("<ul");
			rm.writeControlData(control);

			var width = control.getWidth();
			if (width && expanded) {
				rm.addStyle("width", width);
			}
			rm.writeStyles();

			rm.addClass("sapTntNavLI");

			if (!expanded) {
				rm.addClass("sapTntNavLICollapsed");
			}

			rm.writeClasses();

			// ARIA
			role = expanded ? 'tree' : 'toolbar';

			rm.writeAttribute("role", role);

			rm.write(">");

			//Checking which groups should render
			groups.forEach(function(group) {
				if (group.getVisible()) {
					visibleGroups.push(group);
				}
			});

			// Rendering the visible groups
			visibleGroups.forEach(function(group, index) {
				group.render(rm, control, index, visibleGroupsCount);
			});

			rm.write("</ul>");
		};

		return NavigationListRenderer;

	}, /* bExport= */ true);