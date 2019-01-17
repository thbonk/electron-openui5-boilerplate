/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2018 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['./InputRenderer','sap/ui/core/Renderer'],function(I,R){"use strict";var M=R.extend(I);M.prependInnerContent=function(r,c){r.renderControl(c._tokenizer);};M.addOuterClasses=function(r,c){I.addOuterClasses.apply(this,arguments);r.addClass("sapMMultiInput");if(c.getTokens().length>0){r.addClass("sapMMultiInputHasTokens");}};M.getAriaDescribedBy=function(c){var a=I.getAriaDescribedBy.apply(this,arguments),i=c.getAggregation("tokenizer")&&c.getAggregation("tokenizer").getTokensInfoId();if(a){a=a+" "+i;}else{a=i;}return a;};return M;},true);
