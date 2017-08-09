/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["jquery.sap.global","sap/ui/core/Icon","./Input","./InputRenderer","sap/ui/core/Control","sap/ui/core/IconPool"],function(q,I,a,b,C,c){"use strict";var S=C.extend("sap.m.StepInput",{metadata:{interfaces:["sap.ui.core.IFormContent"],library:"sap.m",properties:{min:{type:"float",group:"Data"},max:{type:"float",group:"Data"},step:{type:"float",group:"Data",defaultValue:1},largerStep:{type:"float",group:"Data",defaultValue:2},value:{type:"float",group:"Data",defaultValue:0},name:{type:"string",group:"Misc",defaultValue:null},placeholder:{type:"string",group:"Misc",defaultValue:null},required:{type:"boolean",group:"Misc",defaultValue:false},width:{type:"sap.ui.core.CSSSize",group:"Dimension"},valueState:{type:"sap.ui.core.ValueState",group:"Data",defaultValue:sap.ui.core.ValueState.None},editable:{type:"boolean",group:"Behavior",defaultValue:true},enabled:{type:"boolean",group:"Behavior",defaultValue:true},displayValuePrecision:{type:"int",group:"Data",defaultValue:0}},aggregations:{_incrementButton:{type:"sap.ui.core.Icon",multiple:false,visibility:"hidden"},_decrementButton:{type:"sap.ui.core.Icon",multiple:false,visibility:"hidden"},_input:{type:"sap.ui.core.Control",multiple:false,visibility:"hidden"}},associations:{ariaLabelledBy:{type:"sap.ui.core.Control",multiple:true,singularName:"ariaLabelledBy"},ariaDescribedBy:{type:"sap.ui.core.Control",multiple:true,singularName:"ariaDescribedBy"}},events:{change:{parameters:{value:{type:"string"}}}}},constructor:function(i,s){C.prototype.constructor.apply(this,arguments);if(this.getEditable()){this._getOrCreateDecrementButton();this._getOrCreateIncrementButton();}if(typeof i!=="string"){s=i;}if(s&&s.value===undefined){this.setValue(this._getDefaultValue(undefined,s.max,s.min));}}});var l=sap.ui.getCore().getLibraryResourceBundle("sap.m");S.STEP_INPUT_INCREASE_BTN_TOOLTIP=l.getText("STEP_INPUT_INCREASE_BTN");S.STEP_INPUT_DECREASE_BTN_TOOLTIP=l.getText("STEP_INPUT_DECREASE_BTN");var n={"min":"aria-valuemin","max":"aria-valuemax","value":"aria-valuenow"};var f=["enabled","editable","name","placeholder","required"];var N=sap.ui.core.Renderer.extend(b);N.getAccessibilityState=function(o){var A=sap.m.InputBaseRenderer.getAccessibilityState(o),s=o.getParent(),m=s.getMin(),M=s.getMax(),g=s.getValue(),L=s.getAriaLabelledBy().join(" "),D=s.getAriaDescribedBy().join(" ");A["role"]="spinbutton";A["valuenow"]=g;if(typeof m==="number"){A["valuemin"]=m;}if(typeof M==="number"){A["valuemax"]=M;}if(D){A["describedby"]=D;}if(L){A["labelledby"]=L;}return A;};N.writeInnerId=function(r,o){r.writeAttribute("id",o.getId()+"-"+N.getInnerSuffix(o));};N.getInnerSuffix=function(){return"inner";};var d=sap.m.Input.extend("NumericInput",{constructor:function(i,s){return a.apply(this,arguments);},renderer:N});S.prototype.init=function(){this._iRealPrecision=0;this._attachChange();this._attachLiveChange();};S.prototype.onBeforeRendering=function(){var m=this.getMin(),M=this.getMax(),v=this.getValue();this._iRealPrecision=this._getRealValuePrecision();this._getInput().setValue(this._getFormatedValue(v));if(this._isNumericLike(m)&&(m>v)){this.setValue(m);}if(this._isNumericLike(M)&&(M<v)){this.setValue(M);}this._disableButtons(v,M,m);};S.prototype.setProperty=function(p,v,s){this._writeAccessibilityState(p,v);if(f.indexOf(p)>-1){this._getInput().setProperty(p,v,s);}return C.prototype.setProperty.call(this,p,v,s);};S.prototype.setMin=function(m){var r,v=this.getValue(),s=(v!==0&&!v);if(m===undefined){return this.setProperty("min",m,true);}if(!this._validateOptionalNumberProperty("min",m)){return this;}r=this.setProperty("min",m,s);this._disableButtons(v,this.getMax(),m);this._verifyValue();return r;};S.prototype.setMax=function(m){var r,v=this.getValue(),s=(v!==0&&!v);if(m===undefined){return this.setProperty("max",m,true);}if(!this._validateOptionalNumberProperty("max",m)){return this;}r=this.setProperty("max",m,s);this._disableButtons(this.getValue(),m,this.getMin());this._verifyValue();return r;};S.prototype._validateOptionalNumberProperty=function(g,v){if(this._isNumericLike(v)){return true;}q.sap.log.error("The value of property '"+g+"' must be a number");return false;};S.prototype.setDisplayValuePrecision=function(g){var v,V=this.getValue(),s=(V!==0&&!V);if(e(g)){v=parseInt(g,10);}else{v=0;q.sap.log.warning(this+": ValuePrecision ("+g+") is not correct. It should be a number between 0 and 20! Setting the default ValuePrecision:0.");}return this.setProperty("displayValuePrecision",v,s);};S.prototype.setTooltip=function(t){this._getInput().setTooltip(t);};S.prototype._getIncrementButton=function(){return this.getAggregation("_incrementButton");};S.prototype._getDecrementButton=function(){return this.getAggregation("_decrementButton");};S.prototype._createIncrementButton=function(){this.setAggregation("_incrementButton",new I({src:c.getIconURI("add"),id:this.getId()+"-incrementBtn",noTabStop:true,press:this._handleButtonPress.bind(this,true),tooltip:S.STEP_INPUT_INCREASE_BTN_TOOLTIP}));return this.getAggregation("_incrementButton");};S.prototype._createDecrementButton=function(){this.setAggregation("_decrementButton",new I({src:c.getIconURI("less"),id:this.getId()+"-decrementBtn",noTabStop:true,press:this._handleButtonPress.bind(this,false),tooltip:S.STEP_INPUT_DECREASE_BTN_TOOLTIP}));return this.getAggregation("_decrementButton");};S.prototype._getInput=function(){if(!this.getAggregation("_input")){var o=new d({id:this.getId()+"-input",textAlign:sap.ui.core.TextAlign.End,type:sap.m.InputType.Number,editable:this.getEditable(),enabled:this.getEnabled(),liveChange:this._inputLiveChangeHandler});this.setAggregation("_input",o);}return this.getAggregation("_input");};S.prototype._handleButtonPress=function(i){var o=this._calculateNewValue(1,i),m=this.getMin(),M=this.getMax();this._disableButtons(o.displayValue,M,m);this.setValue(o.value);this._verifyValue();if(this._iChangeEventTimer){q.sap.clearDelayedCall(this._iChangeEventTimer);}if(this._sOldValue!==this.getValue()){this.fireChange({value:this.getValue()});}this.$().focus();return this;};S.prototype._disableButtons=function(v,m,g){if(!this.getDomRef()||!this._isNumericLike(v)){return;}var M=this._isNumericLike(m),h=this._isNumericLike(g);if(this._getDecrementButton()){if(h&&g<v){this._getDecrementButton().$().removeClass("sapMStepInputIconDisabled");}if(h&&v<=g){this._getDecrementButton().$().addClass("sapMStepInputIconDisabled");}}if(this._getIncrementButton()){if(M&&v<m){this._getIncrementButton().$().removeClass("sapMStepInputIconDisabled");}if(M&&v>=m){this._getIncrementButton().$().addClass("sapMStepInputIconDisabled");}}return this;};S.prototype.onfocusout=function(){this._verifyValue();};S.prototype._verifyValue=function(){var m=this.getMin(),g=this.getMax(),v=parseFloat(this._getInput().getValue());if(!this._isNumericLike(v)){return;}if((this._isNumericLike(g)&&v>g)||(this._isNumericLike(m)&&v<m)){this.setValueState(sap.ui.core.ValueState.Error);}else{this.setValueState(sap.ui.core.ValueState.None);}};S.prototype.setValue=function(v){if(v==undefined){v=0;}this._sOldValue=this.getValue();if(!this._validateOptionalNumberProperty("value",v)){return this;}this._getInput().setValue(this._getFormatedValue(v));this._disableButtons(v,this.getMax(),this.getMin());return this.setProperty("value",parseFloat(v),true);};S.prototype._getFormatedValue=function(v){var p=this.getDisplayValuePrecision(),V,D;if(v==undefined){v=this.getValue();}if(p<=0){return parseFloat(v).toFixed(0);}D=v.toString().split(".");if(D.length===2){V=D[1].length;if(V>p){return parseFloat(v).toFixed(p);}return D[0]+"."+this._padZeroesRight(D[1],p);}else{return v.toString()+"."+this._padZeroesRight("0",p);}};S.prototype._padZeroesRight=function(v,p){var r="",V=v.length;for(var i=V;i<p;i++){r=r+"0";}r=v+r;return r;};S.prototype.onsappageup=function(E){this._applyValue(this._calculateNewValue(this.getLargerStep(),true).displayValue);this._verifyValue();};S.prototype.onsappagedown=function(E){this._applyValue(this._calculateNewValue(this.getLargerStep(),false).displayValue);this._verifyValue();};S.prototype.onsappageupmodifiers=function(E){if(this._isNumericLike(this.getMax())&&!(E.ctrlKey||E.metaKey||E.altKey)&&E.shiftKey){this._applyValue(this.getMax());}};S.prototype.onsappagedownmodifiers=function(E){if(this._isNumericLike(this.getMin())&&!(E.ctrlKey||E.metaKey||E.altKey)&&E.shiftKey){this._applyValue(this.getMin());}};S.prototype.onsapup=function(E){E.preventDefault();this._applyValue(this._calculateNewValue(1,true).displayValue);this._verifyValue();};S.prototype.onsapdown=function(E){E.preventDefault();this._applyValue(this._calculateNewValue(1,false).displayValue);this._verifyValue();};S.prototype.onkeydown=function(E){if(E.which===q.sap.KeyCodes.ARROW_UP&&!E.altKey&&E.shiftKey&&(E.ctrlKey||E.metaKey)){this._applyValue(this.getMax());}if(E.which===q.sap.KeyCodes.ARROW_DOWN&&!E.altKey&&E.shiftKey&&(E.ctrlKey||E.metaKey)){this._applyValue(this.getMin());}if(E.which===q.sap.KeyCodes.ARROW_UP&&!(E.ctrlKey||E.metaKey||E.altKey)&&E.shiftKey){E.preventDefault();this._applyValue(this._calculateNewValue(this.getLargerStep(),true).displayValue);}if(E.which===q.sap.KeyCodes.ARROW_DOWN&&!(E.ctrlKey||E.metaKey||E.altKey)&&E.shiftKey){E.preventDefault();this._applyValue(this._calculateNewValue(this.getLargerStep(),false).displayValue);}this._verifyValue();};S.prototype.onsapescape=function(E){this._getInput().onsapescape(E);};S.prototype._attachLiveChange=function(){this._getInput().attachLiveChange(this._liveChange,this);};S.prototype._attachChange=function(){this._getInput().attachChange(this._change,this);};S.prototype._liveChange=function(){this._verifyValue();this._disableButtons(this._getInput().getValue(),this.getMax(),this.getMin());};S.prototype._change=function(E){this._sOldValue=this.getValue();this._verifyValue();this.setValue(this._getDefaultValue(this._getInput().getValue(),this.getMax(),this.getMin()));if(this._iChangeEventTimer){q.sap.clearDelayedCall(this._iChangeEventTimer);}this._iChangeEventTimer=q.sap.delayedCall(100,this,function(){if(this._sOldValue!==this.getValue()){this.fireChange({value:this.getValue()});}});};S.prototype._applyValue=function(g){if(!this.getEditable()||!this.getEnabled()){return;}this.getAggregation("_input")._$input.val(this._getFormatedValue(g));};S.prototype._calculateNewValue=function(s,i){var g=this.getStep(),m=this.getMax(),M=this.getMin(),h=parseFloat(this._getDefaultValue(this._getInput().getValue(),m,M)),j=i?1:-1,k=h+j*Math.abs(g)*Math.abs(s),D,v,p=this.getDisplayValuePrecision(),o=Math.pow(10,p),r=Math.pow(10,this._iRealPrecision),t=Math.abs(g)*Math.abs(s),R=this.getValue();if(p>0){D=(parseInt((h*o),10)+(j*parseInt((t*o),10)))/o;}else{D=h+j*t;}v=(parseInt((R*r),10)+(j*parseInt((t*r),10)))/r;if(i&&this._isNumericLike(m)){if(k>=m){v=m;D=m;}}if(!i&&this._isNumericLike(M)){if(k<=M){v=M;D=M;}}return{value:v,displayValue:D};};S.prototype._getRealValuePrecision=function(){var D=this.getValue().toString().split("."),s=this.getStep().toString().split("."),i,g;i=(!D[1])?0:D[1].length;g=(!s[1])?0:s[1].length;return(i>g)?i:g;};S.prototype.setValueState=function(v){var E=false,w=false;switch(v){case sap.ui.core.ValueState.Error:E=true;break;case sap.ui.core.ValueState.Warning:w=true;break;case sap.ui.core.ValueState.Success:case sap.ui.core.ValueState.None:break;default:return this;}this._getInput().setValueState(v);q.sap.delayedCall(0,this,function(){this.$().toggleClass("sapMStepInputError",E).toggleClass("sapMStepInputWarning",w);});return this;};S.prototype.setEditable=function(g){var r=S.prototype.setProperty.call(this,"editable",g);g=this.getEditable();if(this.getEditable()){this._getOrCreateDecrementButton().setVisible(true);this._getOrCreateIncrementButton().setVisible(true);}else{this._getDecrementButton()&&this._getDecrementButton().setVisible(false);this._getIncrementButton()&&this._getIncrementButton().setVisible(false);}return r;};S.prototype._getOrCreateDecrementButton=function(){return this.getAggregation("_decrementButton")?this._getDecrementButton():this._createDecrementButton();};S.prototype._getOrCreateIncrementButton=function(){return this.getAggregation("_incrementButton")?this._getIncrementButton():this._createIncrementButton();};S.prototype._inputLiveChangeHandler=function(E){this.setProperty("value",E.getParameter("newValue"),true);};S.prototype._getDefaultValue=function(v,m,g){if(v!==""&&v!==undefined){return this._getInput().getValue();}if(this._isNumericLike(g)&&g>0){return g;}else if(this._isNumericLike(m)&&m<0){return m;}else{return 0;}};S.prototype._isNumericLike=function(v){return!isNaN(v)&&v!==null&&v!=="";};S.prototype._writeAccessibilityState=function(p,v){var $=this._getInput().getDomRef(N.getInnerSuffix());if(!$){return;}if(p&&n[p]){$.setAttribute(n[p],v);}};function e(v){return(typeof(v)==='number')&&!isNaN(v)&&v>=0&&v<=20;}return S;},true);
