/*!
	* UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2018 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
	*/
sap.ui.define(["sap/ui/fl/changeHandler/MoveControls","sap/ui/thirdparty/jquery"],function(M,q){"use strict";var a=q.extend({},M);a.applyChange=function(c,C,p){var j=p.modifier.targets==="jsControlTree";if(j){C._suppressScroll();}var r=M.applyChange.call(this,c,C,p);if(j){C.attachEventOnce("onAfterRenderingDOMReady",function(){C._resumeScroll(false);});}return r;};a.revertChange=function(c,C,p){var j=p.modifier.targets==="jsControlTree";if(j){C._suppressScroll();}var r=M.revertChange.call(this,c,C,p);if(j){C.attachEventOnce("onAfterRenderingDOMReady",function(){C._resumeScroll(false);});}return r;};return a;},true);
