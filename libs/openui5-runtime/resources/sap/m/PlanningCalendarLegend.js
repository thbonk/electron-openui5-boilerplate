/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2018 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['sap/ui/unified/CalendarLegend','./PlanningCalendarLegendRenderer'],function(C,P){"use strict";var a=C.extend("sap.m.PlanningCalendarLegend",{metadata:{library:"sap.m",properties:{itemsHeader:{type:"string",group:"Appearance",defaultValue:"Calendar"},appointmentItemsHeader:{type:"string",group:"Appearance",defaultValue:"Appointments"}},aggregations:{appointmentItems:{type:"sap.ui.unified.CalendarLegendItem",multiple:true,singularName:"appointmentItem"}},designtime:"sap/m/designtime/PlanningCalendarLegend.designtime"}});a._COLUMN_WIDTH_DEFAULT="auto";a.prototype.init=function(){C.prototype.init.call(this);this.setProperty("columnWidth",a._COLUMN_WIDTH_DEFAULT);this.addStyleClass("sapMPlanCalLegend");};a.prototype.setColumnWidth=function(w){if(w==undefined){w=a._COLUMN_WIDTH_DEFAULT;}return this.setProperty("columnWidth",w);};return a;});
