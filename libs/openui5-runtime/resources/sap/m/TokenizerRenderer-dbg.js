/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2018 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['sap/ui/Device', 'sap/ui/core/InvisibleText'],
	function(Device, InvisibleText) {
	"use strict";


	/**
	 * Tokenizer renderer.
	 * @namespace
	 */
	var TokenizerRenderer = {
	};


	/**
	 * Renders the HTML for the given control, using the provided {@link sap.ui.core.RenderManager}.
	 *
	 * @param {sap.ui.core.RenderManager} oRm the RenderManager that can be used for writing to the render output buffer
	 * @param {sap.ui.core.Control} oControl an object representation of the control that should be rendered
	 */
	TokenizerRenderer.render = function(oRm, oControl){
		//write the HTML into the render manager
		if (oControl.getParent() && (oControl.getParent() instanceof sap.m.MultiInput || oControl.getParent() instanceof sap.m.MultiComboBox)) {
			oRm.write("<div ");
		} else {
			oRm.write("<div tabindex=\"0\"");
		}

		oRm.writeControlData(oControl);
		oRm.addClass("sapMTokenizer");

		if (!oControl.getEditable()) {
			oRm.addClass("sapMTokenizerReadonly");
		}

		var aTokens = oControl.getTokens();
		if (!aTokens.length) {
			oRm.addClass("sapMTokenizerEmpty");
		}

		oRm.addStyle("max-width", oControl.getMaxWidth());
		var sPixelWdth = oControl.getWidth();
		if (sPixelWdth) {
			oRm.addStyle("width", sPixelWdth);
		}
		oRm.writeStyles();

		oRm.writeClasses();

		oRm.writeAttribute("role", "list");

		var oAccAttributes = {}; // additional accessibility attributes

		//ARIA attributes
		oAccAttributes.labelledby = {
			value: InvisibleText.getStaticId("sap.m", "TOKENIZER_ARIA_LABEL"),
			append: true
		};

		oRm.writeAccessibilityState(oControl, oAccAttributes);

		oRm.write(">"); // div element
		oRm.renderControl(oControl.getAggregation("_tokensInfo"));

		oControl._bCopyToClipboardSupport = false;

		if ((Device.system.desktop || Device.system.combi) && aTokens.length) {
			oRm.write("<div id='" + oControl.getId() + "-clip' class='sapMTokenizerClip'");
			if (window.clipboardData) { //IE
				/* TODO remove after 1.62 version */
				oRm.writeAttribute("contenteditable", "true");
				oRm.writeAttribute("tabindex", "-1");
			}
			oRm.write(">&nbsp;</div>");
			oControl._bCopyToClipboardSupport = true;
		}

		var sClass = "class=\"sapMTokenizerScrollContainer\">";
		var sSpace = " ";

		var sIdScrollContainer = "id=" + oControl.getId() + "-scrollContainer";
		oRm.write("<div" + sSpace + sIdScrollContainer + sSpace + sClass);

		TokenizerRenderer._renderTokens(oRm, oControl);

		oRm.write("</div>");
		TokenizerRenderer._renderIndicator(oRm, oControl);
		oRm.write("</div>");
	};

	/**
	 * renders the tokens
	 *
	 * @param {sap.ui.core.RenderManager} oRm the RenderManager that can be used for writing to the render output buffer
	 * @param {sap.ui.core.Control} oControl an object representation of the control that should be rendered
	 */
	TokenizerRenderer._renderTokens = function(oRm, oControl){
		var i = 0,
			tokens = oControl.getTokens(),
			length = tokens.length;

		if (oControl.getReverseTokens()) {
			for (i = length - 1; i > -1; i--) {
				oRm.renderControl(tokens[i]);
			}
		} else {
			for (i = 0; i < length; i++) {
				oRm.renderControl(tokens[i]);
			}
		}
	};

	/**
	 * Renders the N-more indicator
	 *
	 * @param {sap.ui.core.RenderManager} oRm the RenderManager that can be used for writing to the render output buffer
	 * @param {sap.ui.core.Control} oControl an object representation of the control that should be rendered
	 */
	TokenizerRenderer._renderIndicator = function(oRm, oControl){
		oRm.write("<span");
		oRm.addClass("sapMTokenizerIndicator");
		oRm.addClass("sapUiHidden");
		oRm.writeClasses();
		oRm.write(">");
		oRm.write("</span>");
	};

	return TokenizerRenderer;

}, /* bExport= */ true);
