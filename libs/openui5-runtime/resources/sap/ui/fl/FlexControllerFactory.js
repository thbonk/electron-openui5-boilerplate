/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["jquery.sap.global","sap/ui/fl/FlexController","sap/ui/fl/Utils","sap/ui/fl/ChangePersistenceFactory"],function(q,F,U,C){"use strict";var a={};a._instanceCache={};a.create=function(c){var f=a._instanceCache[c];if(!f){f=new F(c);a._instanceCache[c]=f;}return f;};a.createForControl=function(c){var s=U.getComponentClassName(c);return a.create(s);};a.getChangesAndPropagate=function(c,v){var m=c.getManifestObject();if(U.isApplication(m)){var f=a.createForControl(c);C._getChangesForComponentAfterInstantiation(v,m,c).then(function(g){c.addPropagationListener(f.applyChangesOnControl.bind(f,g,c));});}};return a;},true);
