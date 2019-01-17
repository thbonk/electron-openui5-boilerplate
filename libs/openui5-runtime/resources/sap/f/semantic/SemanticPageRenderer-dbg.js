/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2018 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define([], function() {
	"use strict";

	/**
	* <code>sap.f.semantic.SemanticPage</code> renderer.
	*/
	var SemanticPageRenderer = {};

	/**
	* Renders the HTML for the given control, using the provided {@link sap.ui.core.RenderManager}.
	*
	* @param {sap.ui.core.RenderManager} oRenderManager The RenderManager that can be used for writing to the Render-Output-Buffer
	* @param {sap.ui.core.Control} oSemanticPage An object representation of the control that should be rendered
	*/
	SemanticPageRenderer.render = function(oRenderManager, oSemanticPage) {
		oRenderManager.write("<div");
		oRenderManager.writeControlData(oSemanticPage);
		oRenderManager.addClass("sapFSemanticPage");
		oRenderManager.writeClasses();
		oRenderManager.write(">");
		oRenderManager.renderControl(oSemanticPage._getPage());
		oRenderManager.write("</div>");
	};

	return SemanticPageRenderer;
}, /* bExport= */ true);