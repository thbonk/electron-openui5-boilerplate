/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["jquery.sap.global","sap/ui/test/_LogCollector","sap/ui/test/_ParameterValidator","sap/ui/test/autowaiter/_autoWaiter","sap/ui/test/autowaiter/_timeoutCounter"],function($,_,a,b,c){"use strict";var l=$.sap.log.getLogger("sap.ui.test.autowaiter._autoWaiterAsync",_.DEFAULT_LEVEL_FOR_OPA_LOGGERS);var C=new a({errorPrefix:"sap.ui.test.autowaiter._autoWaiterAsync#extendConfig"});var w;var d={interval:400,timeout:15};function e(o){v(o);$.extend(d,o);if(o.timeoutCounter){c.extendConfig(o.timeoutCounter);}}function f(g){if(w){n({error:"waitAsync is already running and cannot be called again at this moment"});return;}var p=Date.now();w=true;l.debug("Start polling to check for pending asynchronous work");h();function h(){var i=(Date.now()-p)/1000;if(i<=d.timeout){if(!b.hasToWait()){n({log:"Polling finished successfully. There is no more pending asynchronous work for the moment"});w=false;}else{setTimeout(h,d.interval);}}else{n({error:"Polling stopped because the timeout of "+d.timeout+" seconds has been reached but there is still pending asynchronous work"});w=false;}}function n(r){if(g){g(r.error);}l.debug(r.error||r.log);}}function v(o){C.validate({inputToValidate:o,validationInfo:{interval:"numeric",timeout:"numeric",timeoutCounter:"object"}});if(o.timeout<=0||o.interval<=0){throw new Error("Invalid polling config: Timeout and interval should be greater than 0");}}return{extendConfig:e,waitAsync:f};},true);
