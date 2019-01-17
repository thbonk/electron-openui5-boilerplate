/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2018 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['./TreeItemBaseRenderer','sap/ui/core/Renderer'],function(T,R){"use strict";var S=R.extend(T);S.renderLIContent=function(r,l){if(l.getIcon()){r.renderControl(l._getIconControl());}r.writeEscaped(l.getTitle());};S.renderLIAttributes=function(r,l){T.renderLIAttributes.apply(this,arguments);r.addClass("sapMSTI");};S.getAriaLabelledBy=function(l){return l.getId()+"-content";};return S;},true);
