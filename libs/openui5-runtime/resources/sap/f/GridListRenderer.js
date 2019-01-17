/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2018 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/core/Renderer","sap/m/ListBaseRenderer","sap/ui/layout/cssgrid/GridLayoutBase"],function(R,L,G){"use strict";var a=R.extend(L);a.renderContainerAttributes=function(r,c){r.addClass("sapFGridList");L.renderContainerAttributes.apply(this,arguments);};a.renderListStartAttributes=function(r,c){L.renderListStartAttributes.apply(this,arguments);this.renderGrid(r,c);};a.renderGrid=function(r,c){var g=c.getGridLayoutConfiguration();if(g){g.renderSingleGridLayout(r);}else{r.addClass("sapFGridListDefault");}if(c.isGrouped()){r.addClass("sapFGridListGroup");}};return a;});
