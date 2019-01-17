/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2018 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["jquery.sap.global","sap/base/Log"],function(q,l){"use strict";var m=["no-cors","same-origin","cors"];var M=["GET","POST"];var d={};d._isValidRequest=function(r){if(m.indexOf(r.mode)===-1){return false;}if(M.indexOf(r.method)===-1){return false;}if(typeof r.url!=="string"){return false;}return true;};d.fetch=function(r){var s="Invalid request";return new Promise(function(a,b){if(!r){l.error(s);b(s);}var R={"mode":r.mode||"cors","url":r.url,"method":(r.method&&r.method.toUpperCase())||"GET","data":r.parameters,"headers":r.headers,"timeout":15000};if(R.method==="GET"){R.dataType="json";}if(this._isValidRequest(R)){q.ajax(R).done(function(D){a(D);}).fail(function(j,t,e){b(e);});}else{l.error(s);b(s);}}.bind(this));};return d;});
