/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2018 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define([],function(){"use strict";return{actions:{remove:{changeType:"hideControl"},rename:function(b){if(b.getIcon()){return null;}return{changeType:"rename",domRef:function(c){return c.$().find(".sapMBtnContent")[0];}};},reveal:{changeType:"unhideControl"}}};},false);
