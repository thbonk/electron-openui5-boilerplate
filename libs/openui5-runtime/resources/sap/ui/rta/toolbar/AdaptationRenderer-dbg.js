/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2018 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define([
	'sap/ui/core/Renderer',
	'./BaseRenderer'
],
function(
	Renderer,
	BaseRenderer
) {
	"use strict";

	var AdaptationRenderer = Renderer.extend('sap.ui.rta.toolbar.AdaptationRenderer', BaseRenderer);

	AdaptationRenderer.render = function (oRM, oControl) {
		oRM.addClass('sapUiRtaToolbarAdaptation');

		BaseRenderer.render(oRM, oControl);
	};


	return AdaptationRenderer;
});
