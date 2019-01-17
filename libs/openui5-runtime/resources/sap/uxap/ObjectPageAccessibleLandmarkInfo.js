/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2018 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['sap/ui/core/Element','./library'],function(E,l){"use strict";var O=E.extend("sap.uxap.ObjectPageAccessibleLandmarkInfo",{metadata:{library:"sap.uxap",properties:{rootRole:{type:"sap.ui.core.AccessibleLandmarkRole",defaultValue:"Region"},rootLabel:{type:"string",defaultValue:null},contentRole:{type:"sap.ui.core.AccessibleLandmarkRole",defaultValue:"None"},contentLabel:{type:"string",defaultValue:null},navigationRole:{type:"sap.ui.core.AccessibleLandmarkRole",defaultValue:"Navigation"},navigationLabel:{type:"string",defaultValue:null},headerRole:{type:"sap.ui.core.AccessibleLandmarkRole",defaultValue:"Banner"},headerLabel:{type:"string",defaultValue:null},footerRole:{type:"sap.ui.core.AccessibleLandmarkRole",defaultValue:"None"},footerLabel:{type:"string",defaultValue:null}}}});return O;});
