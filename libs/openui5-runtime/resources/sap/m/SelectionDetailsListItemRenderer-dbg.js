/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["jquery.sap.global", "sap/ui/core/Renderer", "sap/m/ListItemBaseRenderer"],
	function(jQuery, Renderer, ListItemBaseRenderer) {
	"use strict";

	/**
	 * SelectionDetailsItemRenderer renderer.
	 * @namespace
	 */
	var SelectionDetailsListItemRenderer = Renderer.extend(ListItemBaseRenderer);

	SelectionDetailsListItemRenderer.renderLIAttributes = function(oRm, oControl) {
		oRm.addClass("sapMSDItem");
		oRm.writeClasses();
	};

	SelectionDetailsListItemRenderer.renderLIContent = function(oRm, oControl) {
		var aLines = oControl._getParentElement().getLines();

		oRm.write("<div");
		oRm.addClass("sapMSDItemLines");
		oRm.writeClasses();
		oRm.write(">");

		for (var i = 0; i < aLines.length; i++) {
			this.renderLine(oRm, oControl, aLines[i]);
		}

		oRm.write("</div>");

		ListItemBaseRenderer.renderType(oRm, oControl);
	};

	SelectionDetailsListItemRenderer.renderLine = function(oRm, oControl, line) {
		var sUnit = line.getUnit().trim(),
			sValue = line.getValue(),
			sDisplayValue = line.getDisplayValue();

		oRm.write("<div");
		oRm.addClass("sapMSDItemLine");
		oRm.writeClasses();
		oRm.write(">");

		oRm.write("<div");
		oRm.addClass("sapMSDItemLineMarkerContainer");
		oRm.writeClasses();
		oRm.write(">");
		oRm.write("</div>");

		oRm.write("<div");
		oRm.addClass("sapMSDItemLineLabel");
		oRm.writeClasses();
		oRm.write(">");

		oRm.writeEscaped(line.getLabel());

		oRm.write("</div>");

		oRm.write("<div");
		oRm.addClass("sapMSDItemLineValue");
		if (sUnit) {
			oRm.addClass("sapMSDItemLineBold");
		}
		oRm.writeClasses();
		oRm.write(">");

		if (sDisplayValue) {
			oRm.writeEscaped(sDisplayValue);
		} else {
			oRm.writeEscaped(sValue);
		}

		if (sUnit) {
			oRm.write("<span");
			oRm.addClass("sapMSDItemLineUnit");
			oRm.writeClasses();
			oRm.write(">");

			oRm.write("&nbsp;");
			oRm.writeEscaped(sUnit);

			oRm.write("</span>");
		}

		oRm.write("</div>");

		oRm.write("</div>");
	};

	SelectionDetailsListItemRenderer.renderType = function(oRm, oControl) {
		var oToolbar = oControl._getParentElement().getAggregation("_overflowToolbar");
		if (oToolbar) {
			oRm.write("<div");
			oRm.addClass("sapMSDItemActions");
			oRm.writeClasses();
			oRm.write(">");
			oRm.renderControl(oToolbar);
			oRm.write("</div>");
		}
	};

	return SelectionDetailsListItemRenderer;

}, /* bExport= */ true);
