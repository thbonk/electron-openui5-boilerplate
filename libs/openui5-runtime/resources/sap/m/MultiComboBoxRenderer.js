/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2018 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['./ComboBoxBaseRenderer','sap/ui/core/Renderer'],function(C,R){"use strict";var M=R.extend(C);M.CSS_CLASS_MULTICOMBOBOX="sapMMultiComboBox";M.addOuterClasses=function(r,c){C.addOuterClasses.apply(this,arguments);r.addClass(M.CSS_CLASS_MULTICOMBOBOX);if(c._hasTokens()){r.addClass("sapMMultiComboBoxHasToken");}};M.writeInnerAttributes=function(r,c){if(sap.ui.getCore().getConfiguration().getAccessibility()){var i=c._oTokenizer&&c._oTokenizer.getTokensInfoId();r.writeAttribute("aria-describedby",i);}C.writeInnerAttributes.apply(this,arguments);};M.prependInnerContent=function(r,c){r.renderControl(c._oTokenizer);};return M;},true);
