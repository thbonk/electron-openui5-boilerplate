/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides object sap.ui.fl.RegistrationDelegator
sap.ui.define([
	"sap/ui/fl/FlexControllerFactory",
	"sap/ui/core/Component",
	"sap/ui/fl/registry/ChangeHandlerRegistration",
	"sap/ui/fl/ChangePersistenceFactory",
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/mvc/XMLView"
], function(FlexControllerFactory, Component, ChangeHandlerRegistration, ChangePersistenceFactory, MvcController, XMLView) {
	"use strict";

	/**
	 * This class takes care of all the registration (hooks) needed to run flex!
	 *
	 * @name sap.ui.fl.RegistrationDelegator
	 * @class
	 * @constructor
	 * @author SAP SE
	 * @version 1.46.12
	 * @experimental Since 1.43.0
	 */
	var RegistrationDelegator = {
	};

	/**
	 * Register the changes in the component
	 *
	 * @public
	 */
	RegistrationDelegator.registerChangesInComponent = function() {
		Component._fnOnInstanceCreated = FlexControllerFactory.getChangesAndPropagate;
	};

	/**
	 * Register change handlers
	 *
	 * @public
	 */
	RegistrationDelegator.registerChangeHandlers = function() {
		ChangeHandlerRegistration.getChangeHandlersOfLoadedLibsAndRegisterOnNewLoadedLibs();
	};

	/**
	 * Register the event handler
	 *
	 * @public
	 */
	RegistrationDelegator.registerLoadComponentEventHandler = function() {
		Component._fnLoadComponentCallback = ChangePersistenceFactory._onLoadComponent.bind(ChangePersistenceFactory);
	};

	/**
	 * Register the extension provider
	 *
	 * @public
	 */
	RegistrationDelegator.registerExtensionProvider = function() {
		MvcController.registerExtensionProvider("sap.ui.fl.PreprocessorImpl");
	};

	/**
	 * Register the xml preprocessor
	 *
	 * @public
	 */
	RegistrationDelegator.registerXMLPreprocessor = function() {
		if (XMLView.registerPreprocessor){
			XMLView.registerPreprocessor("viewxml", "sap.ui.fl.XmlPreprocessorImpl", true);
		}
	};

	/**
	 * Register everything in one call
	 *
	 * @public
	 */
	RegistrationDelegator.registerAll = function() {
		RegistrationDelegator.registerChangeHandlers();
		RegistrationDelegator.registerLoadComponentEventHandler();
		RegistrationDelegator.registerExtensionProvider();
		RegistrationDelegator.registerChangesInComponent();
		RegistrationDelegator.registerXMLPreprocessor();
	};

	return RegistrationDelegator;

}, /* bExport= */true);
