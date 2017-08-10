/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','sap/ui/core/Control','sap/ui/core/delegate/ItemNavigation','sap/ui/model/type/Date','sap/ui/unified/calendar/CalendarUtils','sap/ui/unified/calendar/CalendarDate','sap/ui/core/date/UniversalDate','sap/ui/unified/library'],function(q,C,I,D,a,b,U,l){"use strict";var Y=C.extend("sap.ui.unified.calendar.YearPicker",{metadata:{library:"sap.ui.unified",properties:{year:{type:"int",group:"Data",defaultValue:2000},years:{type:"int",group:"Appearance",defaultValue:20},columns:{type:"int",group:"Appearance",defaultValue:4},date:{type:"object",group:"Data"},primaryCalendarType:{type:"sap.ui.core.CalendarType",group:"Appearance"}},events:{select:{},pageChange:{}}}});Y.prototype.init=function(){var s=sap.ui.getCore().getConfiguration().getCalendarType();this.setProperty("primaryCalendarType",s);this._oYearFormat=sap.ui.core.format.DateFormat.getDateInstance({format:"y",calendarType:s});this._oFormatYyyymmdd=sap.ui.core.format.DateFormat.getInstance({pattern:"yyyyMMdd",calendarType:sap.ui.core.CalendarType.Gregorian});this._oMinDate=a._minDate(this.getPrimaryCalendarType());this._oMaxDate=a._maxDate(this.getPrimaryCalendarType());};Y.prototype.onAfterRendering=function(){_.call(this);};Y.prototype.setYear=function(y){this.setProperty("year",y,true);y=this.getProperty("year");var o=b.fromLocalJSDate(new Date(),this.getPrimaryCalendarType());o.setDate(1);o.setMonth(0);o.setYear(y);this.setDate(o.toLocalJSDate());return this;};Y.prototype.setDate=function(o){var i,y,k,F;o&&a._checkJSDateObject(o);y=o.getFullYear();a._checkYearInValidRange(y);i=b.fromLocalJSDate(o,this.getPrimaryCalendarType());i.setMonth(0);i.setDate(1);this.setProperty("date",o,true);this.setProperty("year",i.getYear(),true);this._oDate=i;if(this.getDomRef()){k=this.getYears();F=new b(this._oDate,this.getPrimaryCalendarType());F.setYear(F.getYear()-Math.floor(k/2));j.call(this,F,Math.floor(k/2));}return this;};Y.prototype._getDate=function(){if(!this._oDate){var y=this.getYear();this._oDate=new b(y,0,1,this.getPrimaryCalendarType());}return this._oDate;};Y.prototype.setPrimaryCalendarType=function(s){this.setProperty("primaryCalendarType",s);this._oYearFormat=sap.ui.core.format.DateFormat.getDateInstance({format:"y",calendarType:s});if(this._oDate){this._oDate=new b(this._oDate,s);this._oDate.setMonth(0);this._oDate.setDate(1);}this._oMinDate=new b(this._oMinDate,s);this._oMaxDate=new b(this._oMaxDate,s);return this;};Y.prototype.nextPage=function(){h.call(this,true,this._oItemNavigation.getFocusedIndex());return this;};Y.prototype.previousPage=function(){h.call(this,false,this._oItemNavigation.getFocusedIndex());return this;};Y.prototype.onsapspace=function(E){E.preventDefault();};Y.prototype.onsapselect=function(E){var i=this._oItemNavigation.getFocusedIndex();var s=g.call(this,i);if(s){this.fireSelect();}};Y.prototype.onmouseup=function(E){if(this._bMousedownChange){this._bMousedownChange=false;this.fireSelect();}};Y.prototype.getFirstRenderedDate=function(){var F;if(this.getDomRef()){var i=this._oItemNavigation.getItemDomRefs();F=this._oFormatYyyymmdd.parse(q(i[0]).attr("data-sap-year-start"),true);}return F;};Y.prototype._checkFirstDate=function(o){var y=this.getYears();var m=new b(this._oMaxDate,this.getPrimaryCalendarType());m.setYear(m.getYear()-y+1);if(o.isAfter(m)&&o.getYear()!=m.getYear()){o=new b(m,this.getPrimaryCalendarType());o.setMonth(0);o.setDate(1);}else if(o.isBefore(this._oMinDate)&&o.getYear()!=this._oMinDate.getYear()){o=new b(this._oMinDate,this.getPrimaryCalendarType());o.setMonth(0);o.setDate(1);}return o;};Y.prototype._checkDateEnabled=function(o){var E=true;if((o.isAfter(this._oMaxDate)&&o.getYear()!=this._oMaxDate.getYear())||(o.isBefore(this._oMinDate)&&o.getYear()!=this._oMinDate.getYear())){E=false;}return E;};function _(){var y=this.getYears();var i=this._getDate().getYear();var m=this._oMinDate.getYear();var M=this._oMaxDate.getYear();var r=this.getDomRef();var k=this.$().find(".sapUiCalItem");var n=Math.floor(y/2);if(i>M-Math.floor(y/2)){n=n+i-M+Math.floor(y/2);}else if(i<=m+Math.floor(y/2)){n=i-m;}if(!this._oItemNavigation){this._oItemNavigation=new I();this._oItemNavigation.attachEvent(I.Events.AfterFocus,c,this);this._oItemNavigation.attachEvent(I.Events.FocusAgain,d,this);this._oItemNavigation.attachEvent(I.Events.BorderReached,f,this);this.addDelegate(this._oItemNavigation);this._oItemNavigation.setHomeEndColumnMode(true,true);this._oItemNavigation.setDisabledModifiers({sapnext:["alt"],sapprevious:["alt"],saphome:["alt"],sapend:["alt"]});}this._oItemNavigation.setRootDomRef(r);this._oItemNavigation.setItemDomRefs(k);this._oItemNavigation.setCycling(false);this._oItemNavigation.setColumns(this.getColumns(),true);this._oItemNavigation.setFocusedIndex(n);this._oItemNavigation.setPageSize(k.length);}function c(o){var i=o.getParameter("index");var E=o.getParameter("event");if(!E){return;}if(E.type=="mousedown"){e.call(this,E,i);}}function d(o){var i=o.getParameter("index");var E=o.getParameter("event");if(!E){return;}if(E.type=="mousedown"){e.call(this,E,i);}}function e(E,i){if(E.button){return;}var s=g.call(this,i);if(s){this._bMousedownChange=true;}E.preventDefault();E.setMark("cancelAutoClose");}function f(o){var E=o.getParameter("event");if(E.type){var y=this.getYears();var i=this.getColumns();if(i==0){i=y;}switch(E.type){case"sapnext":case"sapnextmodifiers":if(E.keyCode==q.sap.KeyCodes.ARROW_DOWN&&i<y){h.call(this,true,this._oItemNavigation.getFocusedIndex()-y+i,true);}else{h.call(this,true,0,true);}break;case"sapprevious":case"sappreviousmodifiers":if(E.keyCode==q.sap.KeyCodes.ARROW_UP&&i<y){h.call(this,false,y-i+this._oItemNavigation.getFocusedIndex(),true);}else{h.call(this,false,y-1,true);}break;case"sappagedown":h.call(this,true,this._oItemNavigation.getFocusedIndex(),true);break;case"sappageup":h.call(this,false,this._oItemNavigation.getFocusedIndex(),true);break;default:break;}}}function g(k){var m=this._oItemNavigation.getItemDomRefs();var $=q(m[k]);if($.hasClass("sapUiCalItemDsbl")){return false;}var y=$.attr("data-sap-year-start");var o=b.fromLocalJSDate(this._oFormatYyyymmdd.parse(y));var s=this.getId()+"-y"+y;for(var i=0;i<m.length;i++){$=q(m[i]);if($.attr("id")==s){$.addClass("sapUiCalItemSel");$.attr("aria-selected","true");}else{$.removeClass("sapUiCalItemSel");$.attr("aria-selected","false");}}this.setProperty("date",o.toLocalJSDate(),true);this.setProperty("year",o.getYear(),true);return true;}function h(F,s,i){var k=this._oItemNavigation.getItemDomRefs();var o=b.fromLocalJSDate(this._oFormatYyyymmdd.parse(q(k[0]).attr("data-sap-year-start")),this.getPrimaryCalendarType());var y=this.getYears();if(F){var m=new b(this._oMaxDate,this.getPrimaryCalendarType());m.setYear(m.getYear()-y+1);if(o.isBefore(m)){o.setYear(o.getYear()+y);if(o.isAfter(m)){s=s+(o.getYear()-m.getYear());if(s>y-1){s=y-1;}o=this._oMaxDate;o.setMonth(0);o.setDate(1);}}else{return;}}else{if(o.isAfter(this._oMinDate)){o.setYear(o.getYear()-y);if(o.isBefore(this._oMinDate)){s=s-(this._oMinDate.getYear()-o.getYear());if(s<0){s=0;}o=new b(this._oMinDate,this.getPrimaryCalendarType());}}else{return;}}j.call(this,o,s);if(i){this.firePageChange();}}function j(F,s){var k=this._oFormatYyyymmdd.format(this._getDate().toUTCJSDate(),true);var E=false;var o=this._checkFirstDate(F);var S;if(!o.isSame(F)){S=new b(F,this.getPrimaryCalendarType());S.setYear(S.getYear()+s);F=o;E=true;}var m=this._oItemNavigation.getItemDomRefs();var n=new b(F,this.getPrimaryCalendarType());for(var i=0;i<m.length;i++){var y=this._oFormatYyyymmdd.format(n.toUTCJSDate(),true);var $=q(m[i]);$.attr("id",this.getId()+"-y"+y);$.text(this._oYearFormat.format(U.getInstance(n.toUTCJSDate(),n.getCalendarType()),true));$.attr("data-sap-year-start",y);if($.hasClass("sapUiCalItemSel")&&y!=k){$.removeClass("sapUiCalItemSel");$.attr("aria-selected","false");}else if(!$.hasClass("sapUiCalItemSel")&&y==k){$.addClass("sapUiCalItemSel");$.attr("aria-selected","true");}var p=true;if(E){p=this._checkDateEnabled(n);if(n.isSame(S)){s=i;}}if(p){$.removeClass("sapUiCalItemDsbl");$.removeAttr("aria-disabled");}else{$.addClass("sapUiCalItemDsbl");$.attr("aria-disabled",true);}n.setYear(n.getYear()+1);}this._oItemNavigation.focusItem(s);}return Y;},true);
