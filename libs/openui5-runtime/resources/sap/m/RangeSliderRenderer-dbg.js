/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define(["sap/ui/core/Renderer", "./SliderRenderer"], function (Renderer, SliderRenderer) {
    "use strict";

    /**
     * RangeSlider renderer.
     * @namespace
     */
    var RangeSliderRenderer = Renderer.extend(SliderRenderer);

    RangeSliderRenderer.renderHandles = function (oRM, oControl) {
        this.renderHandle(oRM, oControl, {
            id: oControl.getId() + "-handle1",
            position: "start"
        });
        this.renderHandle(oRM, oControl, {
            id: oControl.getId() + "-handle2",
            position: "end"
        });

        // Render tooltips
        this.renderTooltips(oRM, oControl);

        // Render ARIA labels
        oRM.renderControl(oControl._mHandleTooltip.start.label);
        oRM.renderControl(oControl._mHandleTooltip.end.label);
        oRM.renderControl(oControl._oRangeLabel);
    };

    RangeSliderRenderer.renderTooltips = function (oRM, oControl) {
        // The tooltips container
        oRM.write("<div");
        oRM.writeAttribute("id", oControl.getId() + "-TooltipsContainer");
        oRM.addClass(SliderRenderer.CSS_CLASS + "TooltipContainer");
        oRM.addStyle("left","0%");
        oRM.addStyle("right","0%");
        oRM.addStyle("min-width", "0%");

        oRM.writeClasses();
        oRM.writeStyles();
        oRM.write(">");

        // The first tooltip
        this.renderTooltip(oRM, oControl, oControl.getInputsAsTooltips(), "Left");

        // The second tooltip
        this.renderTooltip(oRM, oControl, oControl.getInputsAsTooltips(), "Right");

        oRM.write("</div>");
    };

    RangeSliderRenderer.renderTooltip = function(oRM, oControl, bInput, sPosition){

        if (bInput) {
            if (sPosition === "Left") {
                oRM.renderControl(oControl._mHandleTooltip.start.tooltip);
            } else {
                oRM.renderControl(oControl._mHandleTooltip.end.tooltip);
            }

        } else {
            oRM.write("<span");
            oRM.addClass(SliderRenderer.CSS_CLASS + "HandleTooltip");
            oRM.addStyle("width", oControl._iLongestRangeTextWidth + "px");
            oRM.writeAttribute("id", oControl.getId() + "-" + sPosition + "Tooltip");

            oRM.writeClasses();
            oRM.writeStyles();
            oRM.write(">");
            oRM.write("</span>");
        }
    };

    /**
     * Used to render each of the handles of the RangeSlider.
     *
     * @param {sap.ui.core.RenderManager} oRM The RenderManager that can be used for writing to the render output buffer.
     * @param {sap.ui.core.Control} oControl An object representation of the slider that should be rendered.
     * @param {object} mOptions Options used for specificity of the handles
     */
    RangeSliderRenderer.renderHandle = function (oRM, oControl, mOptions) {
        var fValue,
            aRange = oControl.getRange(),
            bEnabled = oControl.getEnabled(),
            bRTL = sap.ui.getCore().getConfiguration().getRTL();

        oRM.write("<span");

        if (mOptions && (mOptions.id !== undefined)) {
            oRM.writeAttributeEscaped("id", mOptions.id);
        }
        if (mOptions && (mOptions.position !== undefined)) {
            fValue = aRange[mOptions.position === "start" ? 0 : 1];

            oRM.writeAttribute("data-range-val", mOptions.position);
            oRM.writeAttribute("aria-labelledby", oControl._mHandleTooltip[mOptions.position].label.getId());

            if (oControl.getInputsAsTooltips()) {
                oRM.writeAttribute("aria-controls", oControl._mHandleTooltip[mOptions.position].tooltip.getId());
            }
        }
        if (oControl.getShowHandleTooltip()) {
            this.writeHandleTooltip(oRM, oControl);
        }

        oRM.addClass(SliderRenderer.CSS_CLASS + "Handle");

        if (mOptions && (mOptions.id !== undefined) && mOptions.id === (oControl.getId() + "-handle1")) {
            oRM.addStyle(bRTL ? "right" : "left", aRange[0]);
        }
        if (mOptions && (mOptions.id !== undefined) && mOptions.id === (oControl.getId() + "-handle2")) {
            oRM.addStyle(bRTL ? "right" : "left", aRange[1]);
        }

        this.writeAccessibilityState(oRM, oControl, fValue);
        oRM.writeClasses();
        oRM.writeStyles();

        if (bEnabled) {
            oRM.writeAttribute("tabindex", "0");
        }
        oRM.write("></span>");
    };

    /**
     * Writes the accessibility state to the control.
     * To be overwritten by subclasses.
     *
     * @param {sap.ui.core.RenderManager} oRm The RenderManager that can be used for writing to the render output buffer.
     * @param {sap.ui.core.Control} oSlider An object representation of the control that should be rendered.
     */
    RangeSliderRenderer.writeAccessibilityState = function(oRm, oSlider, fValue) {
        oRm.writeAccessibilityState(oSlider, {
            role: "slider",
            orientation: "horizontal",
            valuemin: oSlider.toFixed(oSlider.getMin()),
            valuemax: oSlider.toFixed(oSlider.getMax()),
            valuenow: fValue
        });
    };

    /**
     * Renders the lower range label under the left part of the RangeSlider control.
     *
     * @param {sap.ui.core.RenderManager} oRM The RenderManager that can be used for writing to the render output buffer.
     * @param {sap.ui.core.Control} oControl An object representation of the slider that should be rendered.
     */
    RangeSliderRenderer.renderStartLabel = function (oRM, oControl) {
        oRM.write("<div");
        oRM.addClass(SliderRenderer.CSS_CLASS + "RangeLabel");
        oRM.writeClasses();
        oRM.write(">");

        oRM.write(oControl.getMin());

        oRM.write("</div>");
    };

    /**
     * Renders the higher range label under the right part of the RangeSlider control.
     *
     * @param {sap.ui.core.RenderManager} oRM The RenderManager that can be used for writing to the render output buffer.
     * @param {sap.ui.core.Control} oControl An object representation of the slider that should be rendered.
     */
    RangeSliderRenderer.renderEndLabel = function (oRM, oControl) {
        oRM.write("<div");
        oRM.addClass(SliderRenderer.CSS_CLASS + "RangeLabel");
        oRM.writeClasses();
        oRM.write(">");

        oRM.write(oControl.getMax());

        oRM.write("</div>");
    };

    /**
     * Renders the label under the RangeSlider control.
     *
     * @param {sap.ui.core.RenderManager} oRM The RenderManager that can be used for writing to the render output buffer.
     * @param {sap.ui.core.Control} oControl An object representation of the slider that should be rendered.
     */
    RangeSliderRenderer.renderLabels = function (oRM, oControl) {
        oRM.write("<div");
        oRM.addClass();
        oRM.addClass(SliderRenderer.CSS_CLASS + "Labels");
        oRM.writeClasses();
        oRM.write(">");

        this.renderStartLabel(oRM, oControl);
        this.renderEndLabel(oRM, oControl);

        oRM.write("</div>");
    };

    RangeSliderRenderer.renderProgressIndicator = function(oRm, oSlider) {
        var aRange = oSlider.getRange();

        oRm.write("<div");
        oRm.writeAttribute("id", oSlider.getId() + "-progress");
        if (oSlider.getEnabled()) {
            oRm.writeAttribute("tabindex", "0");
        }
        this.addProgressIndicatorClass(oRm, oSlider);
        oRm.addStyle("width", oSlider._sProgressValue);
        oRm.writeClasses();
        oRm.writeStyles();

        oRm.writeAccessibilityState(oSlider, {
            role: "slider",
            orientation: "horizontal",
            valuemin: oSlider.toFixed(oSlider.getMin()),
            valuemax: oSlider.toFixed(oSlider.getMax()),
            valuenow: aRange.join("-"),
            valuetext: oSlider._oResourceBundle.getText('RANGE_SLIDER_RANGE_ANNOUNCEMENT', aRange),
            labelledby: oSlider._oRangeLabel.getId()
        });

        oRm.write('></div>');
    };

    return RangeSliderRenderer;
}, /* bExport= */ true);