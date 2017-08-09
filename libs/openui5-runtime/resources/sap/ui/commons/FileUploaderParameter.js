/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','./library','sap/ui/unified/FileUploaderParameter'],function(q,l,U){"use strict";var F=U.extend("sap.ui.commons.FileUploaderParameter",{metadata:{deprecated:true,library:"sap.ui.commons"}});try{sap.ui.getCore().loadLibrary("sap.ui.unified");}catch(e){q.sap.log.error("The element 'sap.ui.commons.FileUploaderParameter' needs library 'sap.ui.unified'.");throw(e);}return F;},true);
