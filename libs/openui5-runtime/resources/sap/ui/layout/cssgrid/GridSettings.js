/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2018 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/base/ManagedObject","sap/ui/layout/library"],function(M){"use strict";var G=M.extend("sap.ui.layout.cssgrid.GridSettings",{metadata:{library:"sap.ui.layout",properties:{gridTemplateColumns:{type:"sap.ui.layout.cssgrid.CSSGridTrack",defaultValue:""},gridTemplateRows:{type:"sap.ui.layout.cssgrid.CSSGridTrack",defaultValue:""},gridRowGap:{type:"sap.ui.core.CSSSize",defaultValue:""},gridColumnGap:{type:"sap.ui.core.CSSSize",defaultValue:""},gridGap:{type:"sap.ui.layout.cssgrid.CSSGridGapShortHand",defaultValue:""},gridAutoRows:{type:"sap.ui.layout.cssgrid.CSSGridTrack",defaultValue:""},gridAutoColumns:{type:"sap.ui.layout.cssgrid.CSSGridTrack",defaultValue:""},gridAutoFlow:{type:"sap.ui.layout.cssgrid.CSSGridAutoFlow",defaultValue:"Row"}}}});return G;});
