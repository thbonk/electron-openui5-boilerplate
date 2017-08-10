/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

//Provides control sap.m.PlanningCalendarView.
sap.ui.define(['jquery.sap.global', 'sap/ui/core/Element', './StandardListItem', './StandardListItemRenderer', 'sap/ui/core/Renderer', './library', 'sap/ui/unified/library'],
		function(jQuery, Element, StandardListItem, StandardListItemRenderer, Renderer, library, unifiedLibrary) {
	"use strict";

	/**
	 * Constructor for a new <code>PlanningCalendarView</code>.
	 *
	 * @param {string} [sId] ID for the new control, generated automatically if no ID is given
	 * @param {object} [mSettings] Initial settings for the new control
	 *
	 * @class
	 * View of the {@link sap.m.PlanningCalendar}.
	 *
	 * The <code>PlanningCalendarView</code> defines the type of the intervals (hours, days, months)
	 * and how many intervals are displayed.
	 * @extends sap.ui.core.Element
	 * @version 1.48.5
	 *
	 * @constructor
	 * @public
	 * @since 1.34.0
	 * @alias sap.m.PlanningCalendarView
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var PlanningCalendarView = Element.extend("sap.m.PlanningCalendarView", /** @lends sap.m.PlanningCalendarView.prototype */ { metadata : {

		library : "sap.m",
		properties : {

			/**
			 * Defines the key of the view. This must be set to identify the used view in the
			 * {@link sap.m.PlanningCalendar}.
			 */
			key : {type : "string", group : "Data", defaultValue : null},

			/**
			 * Determines the type of the intervals of the row.
			 *
			 * <b>Note:</b> Not all predefined interval types are supported for this property. For more information, see the
			 * descriptions in the {@link sap.ui.unified.CalendarIntervalType CalendarIntervalType} enumeration.
			 */
			intervalType : {type : "sap.ui.unified.CalendarIntervalType", group : "Appearance", defaultValue : sap.ui.unified.CalendarIntervalType.Hour},

			/**
			 * Defines the description of the <code>PlanningCalendarView</code>.
			 */
			description : {type : "string", group : "Data"},

			/**
			 * Defines the number of intervals that are displayed for a {@link sap.m.PlanningCalendar} that is less than 600 pixels wide.
			 */
			intervalsS : {type : "int", group : "Appearance", defaultValue : 6},

			/**
			 * Defines the number of intervals that are displayed for a {@link sap.m.PlanningCalendar} that is between 600 and 1024 pixels wide.
			 */
			intervalsM : {type : "int", group : "Appearance", defaultValue : 8},

			/**
			 * Defines the number of intervals that are displayed for a {@link sap.m.PlanningCalendar} that is more than 1024 pixels wide.
			 */
			intervalsL : {type : "int", group : "Appearance", defaultValue : 12},

			/**
			 * If set, subintervals are displayed as lines in the rows.
			 *
			 * <ul>
			 * <li>Quarter hour subintervals for interval type <code>Hour</code>.</li>
			 * <li>Hour subintervals for interval types <code>Day</code>, <code>Week</code> and <code>OneMonth</code>.</li>
			 * <li>Day subintervals for interval type <code>Month</code>.</li>
			 * </ul>
			 */
			showSubIntervals : {type : "boolean", group : "Appearance", defaultValue : false}

		}
	}});

	return PlanningCalendarView;

}, /* bExport= */ true);
