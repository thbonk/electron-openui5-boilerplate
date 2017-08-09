/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define(['jquery.sap.global', 'sap/ui/core/Renderer', 'sap/ui/unified/calendar/CalendarUtils', 'sap/ui/core/date/UniversalDate', './MonthRenderer'],
	function(jQuery, Renderer, CalendarUtils, UniversalDate, MonthRenderer) {
	"use strict";


	/**
	 * DatesRow renderer.
	 * @namespace
	 */
	var DatesRowRenderer = Renderer.extend(MonthRenderer);

	DatesRowRenderer.getStartDate = function(oDatesRow){

		return oDatesRow._getStartDate();

	};

	DatesRowRenderer.getClass = function(oDatesRow){

		var sClasses = "sapUiCalDatesRow sapUiCalRow";

		if (!oDatesRow.getShowDayNamesLine()) {
			sClasses = sClasses + " sapUiCalNoNameLine";
		}

		return sClasses;

	};

	DatesRowRenderer.renderHeader = function(oRm, oDatesRow, oDate){

		var oLocaleData = oDatesRow._getLocaleData();
		var sId = oDatesRow.getId();
		var iDays = oDatesRow.getDays();
		var sWidth = "";

		// header
		if (oDatesRow._getShowHeader()) {
			oRm.write("<div id=\"" + sId + "-Head\">");
			this.renderHeaderLine(oRm, oDatesRow, oLocaleData, oDate);
			oRm.write("</div>");
		}

		sWidth = ( 100 / iDays ) + "%";
		if (oDatesRow.getShowDayNamesLine()) {
			oRm.write("<div id=\"" + sId + "-Names\" style=\"display: inline;\">");
			this.renderDayNames(oRm, oDatesRow, oLocaleData, oDate.getUTCDay(), iDays, false, sWidth);
			oRm.write("</div>");
		}

	};

	DatesRowRenderer.renderHeaderLine = function(oRm, oDatesRow, oLocaleData, oDate){

		var sId = oDatesRow.getId();
		var iDays = oDatesRow.getDays();
		var oDay = oDatesRow._newUniversalDate(oDate);
		var sWidth = "";
		var iMonth = 0;
		var aMonthDays = [];
		var i = 0;

		for (i = 0; i < iDays; i++) {
			iMonth = oDay.getUTCMonth();
			if (aMonthDays.length > 0 && aMonthDays[aMonthDays.length - 1].iMonth == iMonth) {
				aMonthDays[aMonthDays.length - 1].iDays++;
			}else {
				aMonthDays.push({iMonth: iMonth, iDays: 1});
			}
			oDay.setUTCDate(oDay.getUTCDate() + 1);
		}

		var aMonthNames = oLocaleData.getMonthsStandAlone("wide");
		for (i = 0; i < aMonthDays.length; i++) {
			var oMonthDays = aMonthDays[i];
			sWidth = ( 100 / iDays * oMonthDays.iDays) + "%";
			oRm.write("<div id=\"" + sId + "-Head" + i + "\"class=\"sapUiCalHeadText\" style=\"width:" + sWidth + "\">");
			oRm.write(aMonthNames[oMonthDays.iMonth]);
			oRm.write("</div>");
		}

	};

	DatesRowRenderer.renderDays = function(oRm, oDatesRow, oDate){

		var iDays = oDatesRow.getDays();
		var sWidth = ( 100 / iDays ) + "%";
		var bShowDayNamesLine = oDatesRow.getShowDayNamesLine();

		if (!oDate) {
			oDate = oDatesRow._getFocusedDate();
		}

		var oHelper = this.getDayHelper(oDatesRow, oDate);

		if (!bShowDayNamesLine) {
			if (oDatesRow._bLongWeekDays || !oDatesRow._bNamesLengthChecked) {
				oHelper.aWeekDays = oHelper.oLocaleData.getDaysStandAlone("abbreviated");
			} else {
				oHelper.aWeekDays = oHelper.oLocaleData.getDaysStandAlone("narrow");
			}
			oHelper.aWeekDaysWide = oHelper.oLocaleData.getDaysStandAlone("wide");
		}

		var oDay = oDatesRow._newUniversalDate(oDate);

		for (var i = 0; i < iDays; i++) {
			this.renderDay(oRm, oDatesRow, oDay, oHelper, false, false, i, sWidth, !bShowDayNamesLine);
			oDay.setUTCDate(oDay.getUTCDate() + 1);
		}

	};

	return DatesRowRenderer;

}, /* bExport= */ true);
