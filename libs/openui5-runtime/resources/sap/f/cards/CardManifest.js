/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2018 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define([],function(){"use strict";var f={"sap.card/title":"sap.app/title","sap.card/subtitle":"sap.app/subtitle","sap.card/info":"sap.app/info","sap.card/i18n":"sap.app/i18n","sap.card/description":"sap.app/description","sap.card/icons":"sap.ui/icons","sap.card/view":"sap.ui5/rootView"};function C(m){this.oJson=m;}C.prototype.registerTranslator=function(t){this.oTranslator=t;};C.prototype.getJson=function(){return this.oJson;};C.prototype.get=function(p){var P=p.split("/"),i=0,s=P[i],n=this.oJson;if(!s){return null;}while(n&&s){n=n[s];if(typeof n==="string"&&this.oTranslator&&n.indexOf("{{")===0&&n.indexOf("}}")===n.length-2){n=this.oTranslator.getText(n.substring(2,n.length-2));}i++;s=P[i];}if(f[p]&&(n===null||n===undefined)){return this.get(f[p]);}return n;};return C;},true);
