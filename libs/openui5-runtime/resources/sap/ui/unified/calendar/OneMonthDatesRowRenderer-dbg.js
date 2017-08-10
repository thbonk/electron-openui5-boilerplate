/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define(['jquery.sap.global', 'sap/ui/core/Renderer', 'sap/ui/unified/calendar/CalendarUtils', './MonthRenderer', './DatesRowRenderer'],
	function(jQuery, Renderer, CalendarUtils, MonthRenderer, DatesRowRenderer) {
		"use strict";

		/**
		 * OneMonthDatesRowRenderer renderer.
		 * @namespace
		 */
		var OneMonthDatesRowRenderer = Renderer.extend(DatesRowRenderer);

		OneMonthDatesRowRenderer.getClass = function(oDatesRow){
			if (oDatesRow.iMode < 2) {
				return MonthRenderer.getClass(oDatesRow);
			} else {
				return DatesRowRenderer.getClass(oDatesRow);
			}
		};

		/**
		 * @param oRm
		 * @param oDatesRow
		 * @param {sap.ui.unified.calendar.CalendarDate} oDate
		 */
		OneMonthDatesRowRenderer.renderDays = function(oRm, oDatesRow, oDate) {
			if (oDatesRow.iMode < 2) {
				MonthRenderer.renderDays(oRm, oDatesRow, oDate);
			} else {
				DatesRowRenderer.renderDays(oRm, oDatesRow, oDate);
			}
		};

		return OneMonthDatesRowRenderer;

	}, /* bExport=  */ true);
