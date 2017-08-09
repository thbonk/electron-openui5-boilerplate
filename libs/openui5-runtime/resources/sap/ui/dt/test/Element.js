/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','sap/ui/dt/ElementUtil','sap/ui/dt/OverlayRegistry'],function(q,E,O){"use strict";var M=5;var a={};a.getInfo=function(e){var m=e.getMetadata();var o=O.getOverlay(e);return{metadata:m,overlay:o};};a.getAggregationInfo=function(e,A){var m={ignored:true,domRefDeclared:false,domRefFound:false,domRefVisible:false,overlayTooSmall:false,overlayGeometryCalculatedByChildren:false,overlayVisible:false};var b=this.getInfo(e);var o=b.overlay.getAggregationOverlay(A);var d=o.getDesignTimeMetadata();if(!d.isIgnored()){m.ignored=false;m.domRefDeclared=!!d.getDomRef();var c=o.getAssociatedDomRef();if(c){m.domRefFound=true;m.domRefVisible=q(c).is(":visible");}var g=o.getGeometry();if(g){var s=g.size;m.overlayTooSmall=(s.width<=M||s.height<=M);m.overlayGeometryCalculatedByChildren=!g.domRef;m.overlayVisible=o.$().is(":visible");}}return m;};a.getAggregationsInfo=function(e){var A={};E.iterateOverAllPublicAggregations(e,function(o){A[o.name]=this.getAggregationInfo(e,o.name);}.bind(this));return A;};return a;},true);
