/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','sap/ui/rta/command/FlexCommand'],function(q,F){"use strict";var R=F.extend("sap.ui.rta.command.Rename",{metadata:{library:"sap.ui.rta",properties:{renamedElement:{type:"object"},newValue:{type:"string",defaultValue:"new text"}},associations:{},events:{}}});R.prototype._getChangeSpecificData=function(){var s={changeType:this.getChangeType(),selector:{id:this.getElement().getId()},renamedElement:{id:this.getRenamedElement().getId()},value:this.getNewValue()};return s;};return R;},true);
