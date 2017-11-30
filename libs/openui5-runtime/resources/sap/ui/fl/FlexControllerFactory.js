/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["jquery.sap.global","sap/ui/fl/FlexController","sap/ui/fl/Utils","sap/ui/fl/ChangePersistenceFactory","sap/ui/fl/variants/VariantModel"],function(q,F,U,C,V){"use strict";var a={};a._instanceCache={};a.create=function(c,A){var A=A||U.DEFAULT_APP_VERSION;if(!a._instanceCache[c]){a._instanceCache[c]={};}var f=a._instanceCache[c][A];if(!f){f=new F(c,A);a._instanceCache[c][A]=f;}return f;};a.createForControl=function(c,m){var s=U.getComponentClassName(c);var l=m||U.getAppComponentForControl(c).getManifest();var A=U.getAppVersionFromManifest(l);return a.create(s,A);};a.getChangesAndPropagate=function(c,v){var m=c.getManifestObject();if(U.isApplication(m)){var f=a.createForControl(c,m);C._getChangesForComponentAfterInstantiation(v,m,c).then(function(g){c.addPropagationListener(f.getBoundApplyChangesOnControl(g,c));var d=f.getVariantModelData()||{};c.setModel(new V(d,f,c),"$FlexVariants");});}};return a;},true);
