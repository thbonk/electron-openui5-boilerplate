/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2018 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define([],function(){"use strict";return{name:{singular:"TEXT_NAME",plural:"TEXT_NAME_PLURAL"},palette:{group:"DISPLAY",icons:{svg:"sap/m/designtime/Text.icon.svg"}},actions:{remove:{changeType:"hideControl"},rename:{changeType:"rename",domRef:function(c){return c.$()[0];}},reveal:{changeType:"unhideControl"}},templates:{create:"sap/m/designtime/Text.create.fragment.xml"}};},false);
